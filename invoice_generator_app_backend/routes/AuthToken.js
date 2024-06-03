const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

const authenticateToken = async (req, res, next) => {
    // console.log(req.query.id);
    // console.log(req.headers["authorization"]);
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(401); // Unauthorized
    const user = await User.findById(req.query.id); // Assuming you're storing the user's ID in the JWT payload
    jwt.verify(token, user.jwtSecretKey, (err, user) => {
      if (err){ 
        console.log(err);
        return res.sendStatus(403);
      } // Forbidden
      req.user = user;
      console.log("verified successfully");
      next();
    });
  };
  
  module.exports = authenticateToken;