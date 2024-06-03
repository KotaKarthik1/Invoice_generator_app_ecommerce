const express = require('express');
const createError = require('http-errors');
const morgan = require('morgan');
require('dotenv').config();
const mongoose = require("mongoose");
const app = express();
const cors= require('cors');
const User = require('./models/UserModel');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const crypto = require('crypto');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(cors());
mongoose
  .connect(process.env.DATABSE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB:", err));

app.get('/', async (req, res, next) => {
  res.send({ message: 'Awesome it works 🐻' });
});

app.use('/api', require('./routes/api.route'));
app.use('/api',require('./routes/Authentication'));
app.use('/api',require('./routes/AdminRoutes'));
app.use('/api',require('./routes/UserRoutes'))
app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});


//Admin creation

async function seedAdmin() {
  const adminExists = await User.findOne({ role: 'admin' });
  if (adminExists) {
    console.log("Admin Exist");
  }
  else{
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    const admin = new User({
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      role: 'admin',
      jwtSecretKey: crypto.randomBytes(32).toString('hex')
    });
    await admin.save();
    console.log('Admin user created!');
  }
}
seedAdmin();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
