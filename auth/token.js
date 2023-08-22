const jwt = require('jsonwebtoken');

// Define your secret key for JWT
const jwtSecret = process.env.JWTSECRET; // Replace with your actual secret key

// Function to generate JWT
function generateToken(user, expiresIn) {
  const token = jwt.sign(user, jwtSecret, {expiresIn});
  return token;
}

module.exports = { generateToken };