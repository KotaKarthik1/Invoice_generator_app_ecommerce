const router = require("express").Router();
const User = require("../models/UserModel");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const jwtSecretKey = crypto.randomBytes(32).toString("hex");
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      jwtSecretKey,
    });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email },
      user.jwtSecretKey,
      { expiresIn: "1h" }
    );
    if (user.role == "admin") {
      res.json({ role: "admin", token, id: user._id });
    } else {
      res.json({ token, id: user._id });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports =  router ;
