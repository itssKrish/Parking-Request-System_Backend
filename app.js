const express = require("express");
const { MongoClient } = require("mongodb");
const path = require('path');
const cors = require('cors');
const { connectToMongoDB } = require('./db');
require('dotenv').config()
const app = express();
app.use(express.json());
app.use(cors());

const nodemailer = require("nodemailer");

//Employee_Form-API
app.post("/form", async (req, res) => {
    //res.send("Test");
    try {
        // Get the data from the request body
        const data = req.body;

    // Create a new data
    const vehicle = {
        name: data.name,
        id: data.id,
        vehicleType: data.vehicleType,
        vehicleNumber: data.vehicleNumber,
        startDate: data.startDate,
        endDate: data.endDate,
      };

    const db = await connectToMongoDB();
    const collection = db.collection("user-details");
    await collection.insertOne(vehicle);

    // Return a success response
    res.status(200).send("Successful");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred while processing your request.");
  }
});


//EmployeeDetails-Fetching-API
app.get("/users", async (req, res) => {
    const db = await connectToMongoDB();
    const users = await db.collection("user-details").find().toArray();
    res.json(users);
});


//Approve-Reject Form API
app.post("/req", async (req, res) => {
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
});


//Approve-Reject Form Data Fetching API
app.get("/status", async (req, res) => {
    try {
      const db = await connectToMongoDB();
      const collection = db.collection("approve-reject");
      const documents = await collection.find({}).toArray();
  
      // Return the documents in JSON format
      res.json(documents);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("An error occurred while processing your request.");
    }
});


//EmailAPI
app.get("/send-emails", async (req, res) => {
    try {

      const db = await connectToMongoDB();
      const collection = db.collection("approve-reject");
      const documents = await collection.find({}).toArray();
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT, 
        secure: false, //ssl
        auth: {
          user: process.env.EMAIL_USER, 
          pass: process.env.EMAIL_PASS, 
        },
      });
  
      // Loop through the details and send emails for approved entries
      for (const entry of documents) {
        if
(entry.status === "approve") {
          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: entry.id,
            subject: "Your parking request has been approved!",
            text: 
            `Hi,
            We are pleased to inform you that your parking request has been approved.
            
            To view your parking pass, please visit the Parking Request Portal at You will need to enter your email address and password to log in.
            
            Once you have logged in, you will be able to view your parking pass and other details.
            
            Thank you for using the Parking Request Portal. We appreciate your patience and understanding.
            
            Sincerely,
            BugSlayers`,
          };
  
          await transporter.sendMail(mailOptions);
        }
      }
  
      res.status(200).send("Emails sent successfully");
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("An error occurred while processing your request.");
    }
  });

app.listen(3000, () => {
  console.log("Server started on port 3000");
});