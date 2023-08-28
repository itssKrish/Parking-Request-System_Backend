const { connectToMongoDB } = require("../../db");

async function UserDetails(req, res) {
  try {
    // Get the data from the request body
    const data = req.body;

    // Create a new data
    const vehicle = {
      name: data.name,
      email: data.email,
      vehicleType: data.vehicleType,
      vehicleNumber: data.vehicleNumber,
      startDate: data.startDate,
      endDate: data.endDate,
    };

    const db = await connectToMongoDB();
    const collection = db.collection("user-details");
    // Check if there's already an entry with the same email
    const existingUser = await collection.findOne({
      startDate: vehicle.startDate,
      endDate: vehicle.endDate,
    });

    if (existingUser) {
      return res.status(409).send("same dates have been entered");
    }
    await collection.insertOne(vehicle);

    // Return a success response
    res.status(200).send("Successful");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred while processing your request.");
  }
}

module.exports = { UserDetails };
