import { Router } from 'express';
import Feedback from '../models/Feedback.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body || {};
    if (!name || !email || !message) return res.status(400).json({ error: 'Missing fields' });
    const fb = await Feedback.create({ name, email, message });
    return res.status(201).json(fb);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

router.get('/', requireAuth, async (req, res) => {
  try {
    const { q } = req.query;
    const filter = q
      ? {
          $or: [
            { name: { $regex: q, $options: 'i' } },
            { email: { $regex: q, $options: 'i' } },
            { message: { $regex: q, $options: 'i' } }
          ]
        }
      : {};
    const list = await Feedback.find(filter).sort({ createdAt: -1 }).limit(500);
    return res.json(list);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

export default router;
