import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    type: { type: String, enum: ['Men', 'Women'], required: true },
    parlourName: { type: String, required: true },
    serviceName: { type: String, required: true },
    provider: { type: String, required: true },
    paymentMethod: { type: String, enum: ['UPI', 'Cash', 'CreditCard'], required: true },
    price: { type: Number, required: true },
    finalPrice: { type: Number, required: true }
  },
  { timestamps: true }
);

export default mongoose.model('Booking', BookingSchema);
