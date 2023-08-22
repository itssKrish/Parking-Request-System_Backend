const { connectToMongoDB } = require('../../db');

async function AllUsers (req, res) {
    try {
        const db = await connectToMongoDB();
        const users = await db.collection("user-details").find().toArray();
        res.json(users);
      } catch (error) {
        console.error("Error:", error);
        res.status(500).send("An error occurred while processing your request.");
      }
}

module.exports = { AllUsers };
