const { connectToMongoDB } = require('../../db');

async function ResetPass (req, res) {
    try {
        const data = req.body;
    
        if (data.newPassword !== data.confirmPassword) {
          return res.status(400).send("Passwords do not match");
        }
    
        // Validate the user's identity and reset the password
        const db = await connectToMongoDB();
        const collection = db.collection("user-credentials");
    
        // Check if the user with the provided email exists in the database
        const existingUser = await collection.findOne({ email: data.email });
        if (!existingUser) {
          return res.status(404).send("User not found");
        }
    
        // Update the user's password
        await collection.updateOne(
          { email: data.email },
          { $set: { password: data.newPassword } }
        );
    
        res.status(200).send("Password reset successfully");
      } catch (error) {
        console.error("Error:", error);
        res.status(500).send("An error occurred while processing your request.");
      }
}

module.exports = { ResetPass };
