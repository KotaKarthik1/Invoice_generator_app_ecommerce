const User = require('./models/UserModel');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function seedAdmin() {
  const adminExists = await User.findOne({ role: 'admin' });
  console.log(" im in seed");
  if (!adminExists) {
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
