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

    // Check if there's already an entry with the same vehicle number and overlapping date range
    const existingUser = await collection.findOne({
      vehicleNumber: vehicle.vehicleNumber,
      $or: [
        {
          startDate: { $lte: vehicle.startDate },
          endDate: { $gte: vehicle.startDate },
        },
        {
          startDate: { $lte: vehicle.endDate },
          endDate: { $gte: vehicle.endDate },
        },
        {
          startDate: { $gte: vehicle.startDate },
          endDate: { $lte: vehicle.endDate },
        },
      ],
    });

    if (existingUser) {
      return res.status(409).send("Duplicate data found");
    }

    // Insert the vehicle data into the database
    await collection.insertOne(vehicle);

    // Return a success response
    res.status(200).send("Data created successfully");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred while processing your request.");
  }
}

module.exports = { UserDetails };
