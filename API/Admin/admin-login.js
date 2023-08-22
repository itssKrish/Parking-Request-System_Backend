const { connectToMongoDB } = require('../../db');
const { generateToken, jwtSecret } = require('../../auth/token');

async function AdminLogin (req, res) {
    try {
        const data = req.body;
    
        // Validate the login credentials (data.email and data.password)
        const user = {
          email: data.email,
          password: data.password,
        };
    
        const db = await connectToMongoDB();
        const collection = db.collection("admin-credentials");
    
        // Check if there's an entry with the provided email and password
        const existingUser = await collection.findOne({
          email: user.email,
          password: user.password,
        });
    
        if (existingUser) {
          // Generate a JWT token
          const token = generateToken(existingUser, '1h'); // Generate JWT with 1 hour expiration
          res.json({ token });
        } else {
          // If user doesn't exist, send a "not found" response
          res.status(404).json({ message: "User not found" });
        }
      } catch (error) {
        console.error("Error:", error);
        res.status(500).send("An error occurred while processing your request.");
      }
}

module.exports = { AdminLogin };
