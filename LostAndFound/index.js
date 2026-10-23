require('dotenv').config();
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
const Student = require('./models/Student');
const LostItem = require('./models/LostItem');
const FoundItem = require('./models/FoundItem');
const Claim = require('./models/Claim');

const app = express();
const PORT = process.env.PORT || 3000;
if (!process.env.SESSION_SECRET) throw new Error('Set SESSION_SECRET in your .env file before starting the application.');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 1000 * 60 * 60 * 8 }
}));

app.use(async (req, res, next) => {
  res.locals.currentStudent = req.session.studentId || null;
  res.locals.flash = req.session.flash || null;
  delete req.session.flash;
  res.locals.path = req.path;
  try {
    res.locals.activeStudent = req.session.studentId ? await Student.findById(req.session.studentId).select('fullName').lean() : null;
    next();
  } catch (error) { next(error); }
});

function flash(req, type, message) { req.session.flash = { type, message }; }
function validId(id) { return mongoose.isValidObjectId(id); }
function requireStudent(req, res, next) {
  if (!req.session.studentId) {
    req.session.returnTo = req.originalUrl;
    flash(req, 'error', 'Choose or create your student profile before reporting or claiming an item.');
    return res.redirect('/students/new');
  }
  Student.findById(req.session.studentId).then((student) => {
    if (!student) {
      req.session.studentId = null;
      flash(req, 'error', 'That student profile no longer exists. Please choose another profile.');
      return res.redirect('/students/new');
    }
    next();
  }).catch(next);
}
function clean(value) { return typeof value === 'string' ? value.trim() : ''; }
function dateInput(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value ? date : null;
}
function futureDate(date) { return date && date.toISOString().slice(0, 10) > new Date().toISOString().slice(0, 10); }
function establishStudentSession(req, studentId) {
  const returnTo = req.session.returnTo;
  return new Promise((resolve, reject) => {
    req.session.regenerate((error) => {
      if (error) return reject(error);
      req.session.studentId = String(studentId);
      if (returnTo) req.session.returnTo = returnTo;
      req.session.save((saveError) => saveError ? reject(saveError) : resolve());
    });
  });
}
function asyncRoute(handler) { return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next); }

app.get('/', asyncRoute(async (req, res) => {
  const [lostCount, foundCount, returnedCount, recentFound] = await Promise.all([
    LostItem.countDocuments({ status: 'Missing' }),
    FoundItem.countDocuments({ status: 'Available' }),
    FoundItem.countDocuments({ status: 'Returned' }),
    FoundItem.find().sort({ createdAt: -1 }).limit(3).populate('reportedBy', 'fullName')
  ]);
  res.render('home', { title: 'Find what matters', stats: { lostCount, foundCount, returnedCount }, recentFound });
}));
app.get('/report', (req, res) => res.render('report-choice', { title: 'Report an item' }));

app.get('/students/new', (req, res) => res.render('student-form', { title: 'Create your profile', errors: [], form: {}, loginError: '' }));
app.post('/students', asyncRoute(async (req, res) => {
  const form = { fullName: clean(req.body.fullName), email: clean(req.body.email).toLowerCase(), department: clean(req.body.department), contactNumber: clean(req.body.contactNumber), password: typeof req.body.password === 'string' ? req.body.password : '' };
  const errors = [];
  if (!form.fullName || !form.department || !form.contactNumber) errors.push('Please complete every field.');
  if (form.fullName.length > 100 || form.department.length > 100 || form.email.length > 254) errors.push('Keep your name and department under 100 characters and your email under 255.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.push('Enter a valid college email address.');
  if (!/^[+()\d\s.-]{7,20}$/.test(form.contactNumber)) errors.push('Enter a valid contact number.');
  if (form.password.length < 8 || Buffer.byteLength(form.password, 'utf8') > 72) errors.push('Choose a password of at least 8 characters and no more than 72 bytes.');
  if (await Student.exists({ email: form.email })) errors.push('That email already has a student profile.');
  if (errors.length) return res.status(422).render('student-form', { title: 'Create your profile', errors, form: { ...form, password: '' }, loginError: '' });
  const passwordHash = await bcrypt.hash(form.password, 12);
  const student = await Student.create({ fullName: form.fullName, email: form.email, department: form.department, contactNumber: form.contactNumber, passwordHash });
  await establishStudentSession(req, student.id);
  flash(req, 'success', `Welcome, ${student.fullName}. Your profile is ready.`);
  const destination = req.session.returnTo || `/students/${student.id}`;
  delete req.session.returnTo;
  res.redirect(destination);
}));
app.post('/session/login', asyncRoute(async (req, res) => {
  const email = clean(req.body.email).toLowerCase();
  const password = typeof req.body.password === 'string' ? req.body.password : '';
  const student = await Student.findOne({ email }).select('+passwordHash');
  if (!student || !password || !await bcrypt.compare(password, student.passwordHash)) {
    return res.status(401).render('student-form', { title: 'Sign in', errors: [], form: {}, loginError: 'We could not match that email and password. Please try again.' });
  }
  await establishStudentSession(req, student.id);
  flash(req, 'success', `Welcome back, ${student.fullName}.`);
  const destination = req.session.returnTo || '/';
  delete req.session.returnTo;
  res.redirect(destination);
}));
app.post('/session/logout', (req, res, next) => {
  req.session.regenerate((error) => {
    if (error) return next(error);
    req.session.flash = { type: 'success', message: 'You have signed out.' };
    req.session.save((saveError) => saveError ? next(saveError) : res.redirect('/'));
  });
});
app.get('/students/:id', asyncRoute(async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).render('error', { title: 'Invalid profile link', message: 'This student profile link is not valid.' });
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).render('error', { title: 'Profile not found', message: 'We could not find that student profile.' });
  const [lostItems, foundItems] = await Promise.all([
    LostItem.find({ reportedBy: student.id }).sort({ createdAt: -1 }),
    FoundItem.find({ reportedBy: student.id }).sort({ createdAt: -1 })
  ]);
  res.render('student-detail', { title: student.fullName, student, lostItems, foundItems });
}));

app.get('/lost-items', asyncRoute(async (req, res) => {
  const filter = {};
  const query = clean(req.query.q);
  const category = clean(req.query.category);
  if (query) filter.$or = [{ itemName: new RegExp(escapeRegex(query), 'i') }, { lastSeenLocation: new RegExp(escapeRegex(query), 'i') }, { description: new RegExp(escapeRegex(query), 'i') }];
  if (category) filter.category = category;
  const [items, categories] = await Promise.all([LostItem.find(filter).sort({ createdAt: -1 }).populate('reportedBy', 'fullName'), LostItem.distinct('category')]);
  res.render('item-list', { title: 'Lost items', type: 'lost', items, categories, filters: { q: query, category } });
}));
app.get('/lost-items/new', requireStudent, (req, res) => res.render('item-form', { title: 'Report a lost item', type: 'lost', errors: [], form: {} }));
app.post('/lost-items', requireStudent, asyncRoute(async (req, res) => {
  const form = { itemName: clean(req.body.itemName), category: clean(req.body.category), description: clean(req.body.description), lastSeenLocation: clean(req.body.location), dateLost: clean(req.body.date) };
  const errors = validateItemForm(form);
  const dateLost = dateInput(form.dateLost);
  if (!dateLost) errors.push('Choose a valid date.');
  else if (futureDate(dateLost)) errors.push('The lost date cannot be in the future.');
  if (errors.length) return res.status(422).render('item-form', { title: 'Report a lost item', type: 'lost', errors, form });
  const item = await LostItem.create({ ...form, lastSeenLocation: form.lastSeenLocation, dateLost, reportedBy: req.session.studentId });
  flash(req, 'success', 'Your lost item report is now live.'); res.redirect(`/lost-items/${item.id}`);
}));
app.get('/lost-items/:id', asyncRoute(async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).render('error', { title: 'Invalid report link', message: 'This lost item link is not valid.' });
  const item = await LostItem.findById(req.params.id).populate('reportedBy', 'fullName department');
  if (!item) return res.status(404).render('error', { title: 'Report not found', message: 'We could not find that lost item report.' });
  res.render('item-detail', { title: item.itemName, type: 'lost', item, claims: [] });
}));

app.get('/found-items', asyncRoute(async (req, res) => {
  const filter = {};
  const query = clean(req.query.q);
  const category = clean(req.query.category);
  const status = ['Available', 'Returned'].includes(req.query.status) ? req.query.status : '';
  if (query) filter.$or = [{ itemName: new RegExp(escapeRegex(query), 'i') }, { foundLocation: new RegExp(escapeRegex(query), 'i') }, { description: new RegExp(escapeRegex(query), 'i') }];
  if (category) filter.category = category;
  if (status) filter.status = status;
  const [items, categories] = await Promise.all([FoundItem.find(filter).sort({ createdAt: -1 }).populate('reportedBy', 'fullName'), FoundItem.distinct('category')]);
  res.render('item-list', { title: 'Found items', type: 'found', items, categories, filters: { q: query, category, status } });
}));
app.get('/found-items/new', requireStudent, (req, res) => res.render('item-form', { title: 'Report a found item', type: 'found', errors: [], form: {} }));
app.post('/found-items', requireStudent, asyncRoute(async (req, res) => {
  const form = { itemName: clean(req.body.itemName), category: clean(req.body.category), description: clean(req.body.description), foundLocation: clean(req.body.location), dateFound: clean(req.body.date) };
  const errors = validateItemForm(form);
  const dateFound = dateInput(form.dateFound);
  if (!dateFound) errors.push('Choose a valid date.');
  else if (futureDate(dateFound)) errors.push('The found date cannot be in the future.');
  if (errors.length) return res.status(422).render('item-form', { title: 'Report a found item', type: 'found', errors, form });
  const item = await FoundItem.create({ ...form, foundLocation: form.foundLocation, dateFound, reportedBy: req.session.studentId });
  flash(req, 'success', 'Thanks for helping reunite this item with its owner.'); res.redirect(`/found-items/${item.id}`);
}));
app.get('/found-items/:id', asyncRoute(async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).render('error', { title: 'Invalid item link', message: 'This found item link is not valid.' });
  const item = await FoundItem.findById(req.params.id).populate('reportedBy', 'fullName department');
  if (!item) return res.status(404).render('error', { title: 'Item not found', message: 'We could not find that found item.' });
  const claims = await Claim.find({ foundItemId: item.id }).sort({ createdAt: -1 }).populate('claimedBy', 'fullName department');
  res.render('item-detail', { title: item.itemName, type: 'found', item, claims });
}));

app.post('/found-items/:id/claims', requireStudent, asyncRoute(async (req, res) => {
  const id = req.params.id;
  if (!validId(id)) { flash(req, 'error', 'That found item link is not valid.'); return res.redirect('/found-items'); }
  const item = await FoundItem.findById(id);
  if (!item) return res.status(404).render('error', { title: 'Item not found', message: 'We could not find that found item.' });
  const reason = clean(req.body.reason);
  if (reason.length < 12 || reason.length > 1000) {
    flash(req, 'error', 'Add a little more detail (12–1,000 characters) so the finder can verify your claim.');
    return res.redirect(`/found-items/${id}`);
  }
  if (item.status === 'Returned') { flash(req, 'error', 'This item has already been returned and can no longer be claimed.'); return res.redirect(`/found-items/${id}`); }
  if (String(item.reportedBy) === String(req.session.studentId)) { flash(req, 'error', 'You cannot claim an item you reported finding.'); return res.redirect(`/found-items/${id}`); }
  if (await Claim.exists({ foundItemId: id, claimedBy: req.session.studentId })) { flash(req, 'error', 'You have already submitted a claim for this item.'); return res.redirect(`/found-items/${id}`); }
  await Claim.create({ foundItemId: id, claimedBy: req.session.studentId, reason });
  flash(req, 'success', 'Your claim is with the finder for review.'); res.redirect(`/found-items/${id}`);
}));

async function updateClaimStatus(req, res) {
  const { id } = req.params;
  const nextStatus = clean(req.body.status);
  const back = req.get('referer') || '/found-items';
  if (!validId(id)) { flash(req, 'error', 'That claim link is not valid.'); return res.redirect(back); }
  if (!['Approved', 'Rejected'].includes(nextStatus)) { flash(req, 'error', 'Choose an allowed claim decision.'); return res.redirect(back); }
  const claim = await Claim.findById(id);
  if (!claim) { flash(req, 'error', 'That claim could not be found.'); return res.redirect(back); }
  const item = await FoundItem.findById(claim.foundItemId);
  if (!item) { flash(req, 'error', 'The found item linked to this claim no longer exists.'); return res.redirect(back); }
  if (String(item.reportedBy) !== String(req.session.studentId)) return res.status(403).render('error', { title: 'You cannot review this claim', message: 'Only the student who reported finding this item can review its claims.' });
  if (claim.status !== 'Pending' || item.status === 'Returned') { flash(req, 'error', 'This claim or item has already been resolved.'); return res.redirect(`/found-items/${item.id}`); }
  if (nextStatus === 'Approved') {
    const updatedItem = await FoundItem.findOneAndUpdate({ _id: item.id, status: 'Available' }, { $set: { status: 'Returned' } }, { new: true });
    if (!updatedItem) { flash(req, 'error', 'Another claim has already completed the return for this item.'); return res.redirect(`/found-items/${item.id}`); }
    let approved;
    try {
      approved = await Claim.findOneAndUpdate({ _id: claim.id, status: 'Pending' }, { $set: { status: 'Approved' } }, { new: true });
    } catch (error) {
      await FoundItem.updateOne({ _id: item.id, status: 'Returned' }, { $set: { status: 'Available' } });
      throw error;
    }
    if (!approved) { await FoundItem.updateOne({ _id: item.id, status: 'Returned' }, { $set: { status: 'Available' } }); flash(req, 'error', 'This claim was already reviewed. Please reload and try again.'); return res.redirect(`/found-items/${item.id}`); }
    await Claim.updateMany({ foundItemId: item.id, _id: { $ne: claim.id }, status: 'Pending' }, { $set: { status: 'Rejected' } });
    flash(req, 'success', 'Claim approved. The item is now marked as returned.');
  } else {
    const rejected = await Claim.findOneAndUpdate({ _id: claim.id, status: 'Pending' }, { $set: { status: 'Rejected' } });
    if (!rejected) { flash(req, 'error', 'This claim was already reviewed. Please reload and try again.'); return res.redirect(`/found-items/${item.id}`); }
    flash(req, 'success', 'Claim rejected.');
  }
  res.redirect(`/found-items/${item.id}`);
}
app.post('/claims/:id/status', requireStudent, asyncRoute(updateClaimStatus));
app.patch('/claims/:id/status', requireStudent, asyncRoute(updateClaimStatus));

function validateItemForm(form) {
  const errors = [];
  if (!form.itemName || !form.category || !form.description || !(form.lastSeenLocation || form.foundLocation)) errors.push('Complete every field before submitting.');
  if (form.category && !['Accessories', 'Bags', 'Books & stationery', 'Clothing', 'Electronics', 'ID & cards', 'Keys', 'Other'].includes(form.category)) errors.push('Choose a category from the list.');
  const location = form.lastSeenLocation || form.foundLocation || '';
  if (form.itemName.length > 100 || form.description.length > 1200 || location.length > 160) errors.push('Keep the item name under 100 characters, location under 160, and description under 1,200.');
  return errors;
}
function escapeRegex(value) { return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

app.use((req, res) => res.status(404).render('error', { title: 'Page not found', message: 'That page may have moved, or the link may be incomplete.' }));
app.use((err, req, res, next) => {
  console.error(err);
  if (err && err.code === 11000) { flash(req, 'error', 'That student profile or claim already exists.'); return res.redirect(req.get('referer') || '/'); }
  res.status(500).render('error', { title: 'Something went wrong', message: 'We could not complete that request. Please try again in a moment.' });
});

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campus-lost-and-found')
  .then(() => app.listen(PORT, () => console.log(`Campus Lost & Found running at http://localhost:${PORT}`)))
  .catch((error) => { console.error('MongoDB connection failed:', error.message); process.exit(1); });
