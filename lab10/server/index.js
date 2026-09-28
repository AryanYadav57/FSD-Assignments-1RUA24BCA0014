import cors from 'cors';
import express from 'express';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const products = [
  { id: 1, name: 'Terra Mug', category: 'Home', price: 18, tag: 'Best seller', color: 'Clay', image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=80' },
  { id: 2, name: 'Canvas Daily Tote', category: 'Accessories', price: 42, tag: 'New arrival', color: 'Natural', image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=80' },
  { id: 3, name: 'Soft Grid Journal', category: 'Stationery', price: 16, tag: 'Editor pick', color: 'Sage', image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=900&q=80' },
  { id: 4, name: 'Aura Desk Lamp', category: 'Home', price: 68, tag: 'Limited', color: 'Ivory', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80' },
  { id: 5, name: 'Sculpted Pen Set', category: 'Stationery', price: 24, tag: 'New arrival', color: 'Ink', image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80' },
  { id: 6, name: 'Sunday Throw', category: 'Home', price: 54, tag: 'Warm pick', color: 'Oat', image: 'https://images.unsplash.com/photo-1583845112203-454cbd8f5b57?auto=format&fit=crop&w=900&q=80' }
];

app.get('/api/products', (_req, res) => res.json(products));
app.get('/api/health', (_req, res) => res.json({ status: 'ok', port: PORT }));

app.listen(PORT, () => console.log(`Store API running at http://localhost:${PORT}`));
