const { connectToMongoDB } = require('../../db');
const { generateToken, jwtSecret } = require('../../auth/token');

async function AdminSignUp (req, res) {
    try {
        const data = req.body;
    
        // Validate the admin key
        const providedKey = data.key;
        const adminKey = process.env.ADMIN_KEY;
    
        if (providedKey !== adminKey) {
          return res.status(401).send("Unauthorized, wrong key entered !");
        }
    
        // Proceed with creating the admin user
        const user = {
          email: data.email,
          password: data.password,
        };
    
        const db = await connectToMongoDB();
        const collection = db.collection("admin-credentials");
    
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

module.exports = { AdminSignUp };
