const { connectToMongoDB } = require('../../db');
const nodemailer = require("nodemailer");

async function ApproveEmail (req, res) {
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
            html: `<p>Hi,</p>
            <p>We are pleased to inform you that your parking request has been approved.</p>
            <p>To view your parking pass, please visit at <a href="https://parking-request-frontend-hackathon.vercel.app">Parking Request Portal</a>.</p>
            <p>You will need to enter your email address and password to log in. Once you have logged in, you will be able to view your parking pass and other details.</p>
            <p>Thank you for using the Parking Request Portal. We appreciate your patience and understanding.</p>
            <p>Sincerely,<br>BugSlayers</p>`,
          };
          await transporter.sendMail(mailOptions);
        }
      }
    
        res.status(200).send("Emails sent successfully");
      } catch (error) {
        console.error("Error:", error);
        res.status(500).send("An error occurred while processing your request.");
      }
}

module.exports = { ApproveEmail };
