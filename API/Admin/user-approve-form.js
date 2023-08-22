const { connectToMongoDB } = require('../../db');

async function UserForm (req, res) {
    try {

        const data = req.body;
        const request = {
          id: data.id,
          reason: data.reason,
          status: data.status, 
        };
    
        const db = await connectToMongoDB();
        const collection = db.collection("approve-reject");
        await collection.insertOne(request);
    
        // Return a success response
        res.status(200).send("Successful");
      } catch (error) {
        console.error("Error:", error);
        res.status(500).send("An error occurred while processing your request.");
      }
}

module.exports = { UserForm };
