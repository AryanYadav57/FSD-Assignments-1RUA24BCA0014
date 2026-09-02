import React, { useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import Card from '../components/Card';
import Button from '../components/Button';
import InputField from '../components/InputField';
import SelectField from '../components/SelectField';
import TextAreaField from '../components/TextAreaField';
import EvidencePanel from '../sections/EvidencePanel';

const JavaScriptLab = () => {
  // Initial Form State
  const initialFormState = {
    fullName: '',
    email: '',
    phone: '',
    university: '',
    course: '',
    domain: '',
    skills: [],
    message: ''
  };

  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [lastAction, setLastAction] = useState('Initialize State');

  // Input lists
  const courses = [
    { value: 'BCA', label: 'BCA (Bachelor of Computer Applications)' },
    { value: 'MCA', label: 'MCA (Master of Computer Applications)' },
    { value: 'BTech', label: 'B.Tech (Computer Science / IT)' },
    { value: 'BSc', label: 'B.Sc (Computer Science)' }
  ];

  const domains = [
    { value: 'Web Development', label: 'Web Development (React & Node)' },
    { value: 'Mobile App Development', label: 'Mobile App Development (Flutter/Android)' },
    { value: 'Data Science', label: 'Data Science & Machine Learning' },
    { value: 'UI/UX Design', label: 'UI/UX Interface Design' }
  ];

  const availableSkills = ['React', 'JavaScript', 'HTML/CSS', 'Python', 'Node.js', 'SQL'];

  // Input change handler (Event: change & input)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
    setLastAction(`Input changed: [${name}] to "${value}"`);
    
    // Clear field-specific error as user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Skill Checkbox Toggle handler (Event: click / change)
  const handleSkillToggle = (skill) => {
    const updatedSkills = form.skills.includes(skill)
      ? form.skills.filter(s => s !== skill)
      : [...form.skills, skill];
    
    setForm(prev => ({
      ...prev,
      skills: updatedSkills
    }));
    setLastAction(`Skill checkbox toggled: [${skill}]`);
  };

  // Field Validation helper (Event: blur)
  const validateField = (name, value) => {
    let errorMsg = '';
    
    if (name === 'fullName') {
      if (!value.trim()) errorMsg = 'Full name is required.';
      else if (value.trim().length < 3) errorMsg = 'Full name must be at least 3 characters.';
    }
    
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) errorMsg = 'Email address is required.';
      else if (!emailRegex.test(value)) errorMsg = 'Email address is invalid.';
    }

    if (name === 'phone') {
      const phoneRegex = /^\d{10}$/;
      if (!value) errorMsg = 'Phone number is required.';
      else if (!phoneRegex.test(value)) errorMsg = 'Phone number must be exactly 10 digits.';
    }

    if (name === 'university' && !value.trim()) {
      errorMsg = 'University name is required.';
    }

    if (name === 'course' && !value) {
      errorMsg = 'Please select a course.';
    }

    if (name === 'domain' && !value) {
      errorMsg = 'Please select an internship domain.';
    }

    if (name === 'message') {
      if (!value.trim()) errorMsg = 'Message/statement is required.';
      else if (value.trim().length < 10) errorMsg = 'Statement must be at least 10 characters.';
    }

    setErrors(prev => ({ ...prev, [name]: errorMsg || null }));
    return !errorMsg;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
    setLastAction(`Focus lost (blur) on field: [${name}]`);
  };

  // Form Submit Handler (Event: submit)
  const handleSubmit = (e) => {
    e.preventDefault();
    setLastAction('Form submitted');

    // Run global validations
    let isValid = true;

    Object.keys(form).forEach(key => {
      if (key !== 'skills') {
        const isFieldValid = validateField(key, form[key]);
        if (!isFieldValid) {
          isValid = false;
        }
      }
    });

    if (isValid) {
      setSubmitted(true);
      setErrors({});
      setLastAction('Application submitted successfully!');
    } else {
      setSubmitted(false);
      // Map existing errors to scroll view or notify
      setLastAction('Submission blocked: Validation errors detected');
    }
  };

  // Form Reset Handler (Event: reset)
  const handleReset = () => {
    setForm(initialFormState);
    setErrors({});
    setSubmitted(false);
    setLastAction('Form state reset');
  };

  // Styles
  const splitLayout = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '1.5rem',
    alignItems: 'start'
  };

  const previewPaperStyle = {
    background: '#ffffff',
    color: '#1e293b',
    padding: '2rem',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-lg)',
    minHeight: '400px',
    border: '1px solid var(--border-color)',
    position: 'relative'
  };

  const previewWatermarkStyle = {
    position: 'absolute',
    bottom: '1rem',
    right: '1.5rem',
    fontSize: '0.8rem',
    fontWeight: '700',
    color: 'rgba(59, 130, 246, 0.15)',
    letterSpacing: '0.1em'
  };

  return (
    <div className="fade-in">
      <SectionHeader 
        badge="Tutorial 03" 
        title="JavaScript Lab — Internship Form" 
        subtitle="Test dynamic JavaScript events, input states, real-time client validation, and DOM updates."
      />

      {/* Success banner */}
      {submitted && (
        <div style={{
          backgroundColor: 'var(--success-glow)',
          border: '1px solid var(--success)',
          color: 'var(--success)',
          padding: '1rem 1.5rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div>
            <strong style={{ fontSize: '1rem' }}>✓ Application Submitted Successfully!</strong>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Your application has passed all client-side validation rules and the state has been locked.
            </p>
          </div>
          <Button variant="secondary" onClick={() => setSubmitted(false)} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
            Dismiss
          </Button>
        </div>
      )}

      {/* Dynamic event tracker logger */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem 1rem',
        background: 'rgba(59, 130, 246, 0.05)',
        border: '1px dashed rgba(59, 130, 246, 0.25)',
        borderRadius: 'var(--radius-sm)',
        marginBottom: '1.5rem',
        fontSize: '0.85rem'
      }}>
        <span style={{ color: 'var(--primary)', fontWeight: '700' }}>⚡ JS Event Log:</span>
        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{lastAction}</span>
      </div>

      <div style={splitLayout}>
        
        {/* INTERNSHIP FORM */}
        <Card title="Internship Form" subtitle="Fill standard details to test validations">
          <form onSubmit={handleSubmit} onReset={handleReset} noValidate>
            
            <InputField 
              label="Full Name *" 
              name="fullName" 
              value={form.fullName}
              placeholder="e.g. John Doe"
              error={errors.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <InputField 
              label="Email Address *" 
              type="email" 
              name="email" 
              value={form.email}
              placeholder="e.g. john@example.com"
              error={errors.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <InputField 
              label="Phone Number *" 
              name="phone" 
              value={form.phone}
              placeholder="e.g. 9876543210"
              error={errors.phone}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <InputField 
              label="University *" 
              name="university" 
              value={form.university}
              placeholder=""
              error={errors.university}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <SelectField 
              label="Select Course *" 
              name="course" 
              value={form.course}
              options={courses}
              error={errors.course}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <SelectField 
              label="Select Internship Domain *" 
              name="domain" 
              value={form.domain}
              options={domains}
              error={errors.domain}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            {/* Checkbox Skills */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-primary)', display: 'block', marginBottom: '0.5rem' }}>
                Select Core Skills
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                {availableSkills.map((skill) => (
                  <label key={skill} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={form.skills.includes(skill)} 
                      onChange={() => handleSkillToggle(skill)}
                      style={{ cursor: 'pointer' }}
                    />
                    {skill}
                  </label>
                ))}
              </div>
            </div>

            <TextAreaField 
              label="Statement of Purpose *" 
              name="message" 
              value={form.message}
              placeholder="Briefly state why you want this internship position..."
              error={errors.message}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            {/* Submit / Reset Actions */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <Button type="submit" variant="success" style={{ flex: 2 }}>
                Submit Application
              </Button>
              <Button type="reset" variant="secondary" style={{ flex: 1 }}>
                Reset Form
              </Button>
            </div>

          </form>
        </Card>

        {/* APPLICATION PREVIEW */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>
            Live Application Preview
          </h3>

          <div style={previewPaperStyle}>
            <div style={previewWatermarkStyle}>OFFICIAL APPLICATION</div>
            
            <div style={{ borderBottom: '2px solid #1e293b', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', color: '#0f172a' }}>
                {form.fullName || 'YOUR NAME HERE'}
              </h2>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#475569', fontWeight: '500' }}>
                {form.email ? `📧 ${form.email}` : '📧 applicant@email.com'}
                {form.phone ? `  •  📞 ${form.phone}` : '  •  📞 0000000000'}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
              
              <div>
                <strong style={{ color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>UNIVERSITY EDUCATION</strong>
                <p style={{ margin: '0.15rem 0 0 0', fontWeight: '600', color: '#1e293b' }}>
                  {form.university || 'Not specified'}
                </p>
                <p style={{ margin: 0, color: '#475569' }}>
                  Course: {form.course || 'Not selected'}
                </p>
              </div>

              <div>
                <strong style={{ color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>DESIRED INTERNSHIP DOMAIN</strong>
                <p style={{ margin: '0.15rem 0 0 0', fontWeight: '600', color: '#1e293b' }}>
                  {form.domain || 'Not selected'}
                </p>
              </div>

              <div>
                <strong style={{ color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TECHNICAL SKILLSET</strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.25rem' }}>
                  {form.skills.length === 0 ? (
                    <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>No skills selected.</span>
                  ) : (
                    form.skills.map((skill) => (
                      <span 
                        key={skill}
                        style={{
                          backgroundColor: '#e2e8f0',
                          color: '#0f172a',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          border: '1px solid #cbd5e1'
                        }}
                      >
                        {skill}
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div style={{ marginTop: '0.5rem' }}>
                <strong style={{ color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>STATEMENT OF PURPOSE</strong>
                <p style={{ margin: '0.25rem 0 0 0', color: '#334155', fontStyle: 'italic', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
                  {form.message || 'No statement written yet.'}
                </p>
              </div>

            </div>

          </div>

          {/* Academic Concepts list */}
          <Card title="JavaScript Concepts Demonstrated" subtitle="Interactive browser bindings">
            <ul style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', paddingLeft: '1.25rem', lineHeight: '1.6' }}>
              <li><strong>DOM Manipulation:</strong> The Live Preview updates values inside specific text blocks as form elements receive character inputs.</li>
              <li><strong>Event Handling:</strong> Captures <code>onChange</code>/<code>onInput</code> on keys, <code>onBlur</code> for validations, and <code>onSubmit</code> for dispatch checks.</li>
              <li><strong>Dynamic Updates:</strong> Triggers instantaneous state rerenders mapping value vectors straight to UI previews.</li>
              <li><strong>Form Validation:</strong> Applies custom pattern regex checks to verify email formats and phone ranges before locking states.</li>
            </ul>
          </Card>
        </div>

      </div>

      {/* DevTools evidence panel */}
      <EvidencePanel 
        title="How to demonstrate this tutorial to your evaluator" 
        steps={[
          'Attempt to click "Submit Application" immediately with empty inputs. Observe that the form blocks submission and showcases red warning labels.',
          'Start typing in the "Full Name" input. Observe that the "Live Application Preview" updates its text block immediately on every character keypress.',
          'Fill in an invalid email (e.g. "riyan@mail") and click outside the input (or press tab). Check the event log showing a "blur" event, and look at the validation warning.',
          'Complete all fields with valid configurations (10 digit phone number, email with "@" and "." dot, statement > 10 chars). Select skills and watch them map inside the resume preview sheet.',
          'Click "Submit Application" again. The green confirmation banner should render showing successful validation.',
          'Click the "Reset Form" button to verify that the form state, validation tags, and preview clear back to default structures.'
        ]}
      />
    </div>
  );
};

export default JavaScriptLab;
