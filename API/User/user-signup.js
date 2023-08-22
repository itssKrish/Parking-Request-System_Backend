const { connectToMongoDB } = require('../../db');
const { generateToken, jwtSecret } = require('../../auth/token');

async function UserSignUp (req, res) {
    try {
        const data = req.body;
    
        // Validate the login credentials (data.email and data.password)
        // If valid, proceed with creating a user entry and generating a token
    
        const user = {
          email: data.email,
          password: data.password,
        };
    
        const db = await connectToMongoDB();
        const collection = db.collection("user-credentials");
    
        // Check if there's already an entry with the same email
        const existingUser = await collection.findOne({ email: user.email });
        if (existingUser) {
          return res.status(409).send("User already exists");
        }
        await collection.insertOne(user);
    
        // Generates JWT token
        const token = generateToken(user, '1h'); // Generate JWT with 1 hour expiration
        res.json({ token });
      } catch (error) {
        console.error("Error:", error);
        res.status(500).send("An error occurred while processing your request.");
      }
}

module.exports = { UserSignUp };
