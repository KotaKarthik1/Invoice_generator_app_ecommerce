const router = require("express").Router();
const ProductModel = require("../models/ProductModel");
const authenticateToken = require("./AuthToken");
const Invoice=require('../models/InvoiceModel');
const mongoose = require('mongoose');
const puppeteer = require('puppeteer');
const User = require('../models/UserModel');
router.get("/getProductsUser", authenticateToken, async (req, res) => {
    try {
      const products = await ProductModel.find();
      const productsToSend = [];
      for (const product of products) {
        if (product.quantity === 0) {
          await ProductModel.deleteOne({ _id: product._id });
        } else {
          productsToSend.push(product);
        }
      }
      res.status(200).json(productsToSend);
    } catch (err) {
      console.error("Error getting products:", err);
      res.status(500).json({ error: "Server error" });
    }
  });

  //invoicegenerator
  const generateInvoiceHTML = (invoice) => {
    // Implement the HTML structure here using the invoice data
    return `
    <!DOCTYPE html>
    <html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Invoice Generator App</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      background: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .invoice-container {
      max-width: 800px;
      margin: 40px auto;
      padding: 20px;
      background: #fff;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
      border-radius: 10px;
    }
    .header, .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .header img {
      max-width: 150px;
    }
    .header div, .footer div {
      text-align: right;
    }
    h1 {
      text-align: center;
      color: #333;
      margin: 0;
    }
    .invoice-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    .invoice-info div {
      width: 48%;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    th, td {
      padding: 12px;
      text-align: left;
    }
    th {
      background: #f2f2f2;
      border-bottom: 2px solid #ddd;
    }
    td {
      border-bottom: 1px solid #eee;
    }
    .total-section {
      text-align: right;
      margin-bottom: 20px;
    }
    .total-section p {
      margin: 5px 0;
    }
    .terms {
      background: #333;
      color: #fff;
      padding: 20px;
      border-radius: 5px;
      text-align: center;
    }
    .terms p {
      margin: 5px 0;
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="header">
      <h1>Invoice Generator App</h1>
      <div>
        <p>User: ${invoice.user.name}</p>
        <p>Date: ${new Date(invoice.date).toLocaleDateString()}</p>
      </div>
    </div>
    <div class="invoice-info">
      <div>
        <h2>Billing To:</h2>
        <p>${invoice.user.name}</p>
        <p>${invoice.user.email}</p>
      </div>
      <div>
        <h2>Invoice Details:</h2>
        <p>Invoice #: ${invoice._id}</p>
        <p>Date: ${new Date(invoice.date).toLocaleDateString()}</p>
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th>Qty</th>
          <th>Rate</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${invoice.products.map(product => `
          <tr>
            <td>${product.name}</td>
            <td>${product.quantity}</td>
            <td>INR ${product.rate.toFixed(2)}</td>
            <td>INR ${product.total.toFixed(2)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <div class="total-section">
      <p>Total Amount: INR ${invoice.totalAmount.toFixed(2)}</p>
      <p>GST: 18%</p>
      <p>Grand Total: INR ${(invoice.totalAmount + invoice.totalGST).toFixed(2)}</p>
    </div>
    <div class="terms">
      <p>Terms and Conditions</p>
      <p>We are happy to supply any further information you may need and trust that you call on us to fill your order, which will receive our prompt and careful attention.</p>
    </div>
  </div>
</body>
</html>
    
    `;
  };
  
  router.post('/generateInvoice', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const cart = req.body.cart; // cart is expected to be an object with productId and quantity
    
    try {
      // Fetch products from the cart
      const products = await ProductModel.find({ _id: { $in: Object.keys(cart) } });
  
      // Calculate the total amount and GST
      let totalAmount = 0;
      let totalGST = 0;
      const invoiceProducts = products.map(product => {
        const quantity = cart[product._id];
        const rate = product.price;
        const total = rate * quantity;
        const gst = total * 0.18; // Assuming 18% GST
        totalAmount += total;
        totalGST += gst;
  
        return {
          name: product.name,
          quantity,
          rate,
          total,
          gst
        };
      });
  
      // Create the invoice
      const invoice = new Invoice({
        user: new mongoose.Types.ObjectId(userId),
        products: invoiceProducts,
        totalAmount,
        totalGST
      });
     
      await invoice.save();

      const user = User.findOne(userId);
      const invoiceDetails = {
        name:user.name,
        email:user.email,
        products:invoiceProducts,
        totalAmount,
        totalGST
      }
      // Update the product quantities
      await Promise.all(products.map(product => {
        const quantity = cart[product._id];
        product.quantity -= quantity;
        return product.save();
      }));
  
      // Save the order information to the user's collection (assuming user collection has orders array)
      await User.updateOne(
        { _id: userId },
        { $push: { orders: invoice._id } }
      );
  
      // Generate PDF using Puppeteer
      const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
      const page = await browser.newPage();
      const content = generateInvoiceHTML(invoiceDetails); // Implement generateInvoiceHTML to return the HTML content for the invoice
      await page.setContent(content, { waitUntil: 'networkidle0' });
      const pdfBuffer = await page.pdf({ format: 'A4', timeout: 60000 }); // Increased timeout to 60 seconds
      await browser.close();
  
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');
      res.send(pdfBuffer);
  
    } catch (error) {
      console.error('Error generating invoice:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.get('/orders', authenticateToken,async (req, res) => {
    const userId = req.query.id;
    console.log(req.query)
  
    try {
      // Find all invoices for the user ID
      const orders = await Invoice.find({ user: userId }).sort({ date: 'desc' });
      console.log(orders);
      res.status(200).json(orders); // Return the orders
    } catch (error) {
      res.status(500).json({ message: `Error getting user orders: ${error.message}` });
    }
  });

module.exports = router;