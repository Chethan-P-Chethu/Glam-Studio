import { Router } from 'express';
import Booking from '../models/Booking.js';
import { requireAuth } from '../middleware/auth.js';
import ExcelJS from 'exceljs';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const booking = await Booking.create(data);
    return res.status(201).json(booking);
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
            { customerName: { $regex: q, $options: 'i' } },
            { parlourName: { $regex: q, $options: 'i' } },
            { serviceName: { $regex: q, $options: 'i' } },
            { provider: { $regex: q, $options: 'i' } }
          ]
        }
      : {};
    const bookings = await Booking.find(filter).sort({ createdAt: -1 }).limit(500);
    return res.json(bookings);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

router.get('/export', requireAuth, async (req, res) => {
  try {
    const { q } = req.query;
    const filter = q
      ? {
          $or: [
            { customerName: { $regex: q, $options: 'i' } },
            { parlourName: { $regex: q, $options: 'i' } },
            { serviceName: { $regex: q, $options: 'i' } },
            { provider: { $regex: q, $options: 'i' } }
          ]
        }
      : {};

    const rows = await Booking.find(filter).sort({ createdAt: -1 });

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Bookings');
    ws.columns = [
      { header: 'Customer', key: 'customerName', width: 20 },
      { header: 'Type', key: 'type', width: 10 },
      { header: 'Parlour', key: 'parlourName', width: 20 },
      { header: 'Service', key: 'serviceName', width: 22 },
      { header: 'Provider', key: 'provider', width: 16 },
      { header: 'Payment', key: 'paymentMethod', width: 14 },
      { header: 'Price', key: 'price', width: 10 },
      { header: 'Final Price', key: 'finalPrice', width: 12 },
      { header: 'Created At', key: 'createdAt', width: 22 }
    ];

    rows.forEach((r) => {
      ws.addRow({
        customerName: r.customerName,
        type: r.type,
        parlourName: r.parlourName,
        serviceName: r.serviceName,
        provider: r.provider,
        paymentMethod: r.paymentMethod,
        price: r.price,
        finalPrice: r.finalPrice,
        createdAt: new Date(r.createdAt).toLocaleString()
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="bookings.xlsx"');

    await wb.xlsx.write(res);
    res.end();
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// Delete a booking
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Booking.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Booking not found' });
    return res.json({ ok: true });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

export default router;
