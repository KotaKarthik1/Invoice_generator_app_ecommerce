const mongoose = require('mongoose');
const invoiceSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    products: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        rate: { type: Number, required: true },
        total: { type: Number, required: true }, // Calculated on the backend
        gst: { type: Number, required: true },    // Calculated on the backend
      },
    ],
    totalAmount: { type: Number, required: true }, // Calculated on the backend
    totalGST: { type: Number, required: true },    // Calculated on the backend
  });
  
  const Invoice = mongoose.model('Invoice', invoiceSchema);
  
  module.exports = Invoice;
  