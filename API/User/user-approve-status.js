const { connectToMongoDB } = require('../../db');

async function UserStatus (req, res) {
    try {
        const userEmail = req.auth.email; // Retrieve email from the token
        const db = await connectToMongoDB();
        const collection = db.collection("approve-reject");
        
        // Find documents that match the email ID
        const documents = await collection.find({ id: userEmail }).toArray();
    
        // Return the documents in JSON format
        res.json(documents);
      } catch (error) {
        console.error("Error:", error);
        res.status(500).send("An error occurred while processing your request.");
      }
}

module.exports = { UserStatus };
