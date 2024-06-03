const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String }, 
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 0 }, // Default to 0
  });
  
  const ProductModel = mongoose.model('Product', productSchema);

  module.exports = ProductModel;
