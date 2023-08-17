const express = require("express");
const path = require('path');
const cors = require('cors');
const nodemailer = require("nodemailer");
const rateLimit = require("express-rate-limit");
require('dotenv').config()
const app = express();
app.use(express.json());
app.use(cors());

const { connectToMongoDB } = require('./db');
const { MongoClient } = require("mongodb");
const { generateToken, jwtSecret } = require('./auth');
const { expressjwt: jwt } = require("express-jwt");

// Middleware to validate tokens
const authenticateToken = jwt({ secret: process.env.JWTSECRET, algorithms: ["HS256"] }).unless({ path: ["/login"] });
app.use(authenticateToken);

// Rate limiter logic
const loginRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 3, // 5 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});


//Employee_Login-API/Form
app.post("/login", loginRateLimiter, async (req, res) => {
  try {
    // Assuming you have user authentication logic here
    const data = req.body;

    // Validate the login credentials (data.username and data.password)
    // If valid, proceed with creating a user entry and generating a token

    const user = {
      email: data.email,
      name: data.name,
      vehicleType: data.vehicleType,
      vehicleNumber: data.vehicleNumber,
      startDate: data.startDate,
      endDate: data.endDate,
    };

    const db = await connectToMongoDB();
    const collection = db.collection("user-details");

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
});


//EmployeeDetails-Fetching-API
app.get("/users", async (req, res) => {
  try {
    const db = await connectToMongoDB();
    const users = await db.collection("user-details").find().toArray();
    res.json(users);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred while processing your request.");
  }
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