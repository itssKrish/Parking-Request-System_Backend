const express = require("express");
const path = require('path');
const cors = require('cors');
require('dotenv').config()
const app = express();
app.use(express.json());
app.use(cors());

const { expressjwt: jwt } = require("express-jwt");

//API-Call
const {UserForm} = require('./API/Admin/user-approve-form');
const {UserStatus} = require('./API/User/user-approve-status');
const {AllUsers} = require('./API/Admin/all-users');
const {ApproveEmail} = require('./API/Admin/email-approval');
const {UserDetails} = require('./API/User/user-details-form');
const {UserSignUp} = require('./API/User/user-signup');
const {ResetPass} = require('./API/User/user-pass-reset');
const {UserLogin} = require('./API/User/user-login');
const {AdminSignUp} = require('./API/Admin/admin-signup');
const {AdminLogin} = require('./API/Admin/admin-login');

// Middleware 
const {loginRateLimiter} = require('./auth/rate-limiter')

// Home Page
app.get('/', (req, res)=>{
  res.status(200);
  res.send("I'm Alive !!!");
});


// Route for resetting password
app.post("/reset-password", loginRateLimiter(), ResetPass)


//user login
app.post("/login", loginRateLimiter(), UserLogin)


//Admin_signup-API
app.post("/admin-signup", loginRateLimiter(), AdminSignUp)


//admin login
app.post("/admin-login", loginRateLimiter(), AdminLogin)

// Middleware to validate tokens
const authenticateToken = jwt({ secret: process.env.JWTSECRET, algorithms: ["HS256"] }).unless({ path: ["/signup"] });
app.use(authenticateToken);

//Employee_signup-API/Form
app.post("/signup", loginRateLimiter(), UserSignUp)


//UserDetails_Form-API
app.post("/form", loginRateLimiter(), UserDetails)


//EmployeeDetails-Fetching-API
app.get("/users", AllUsers)


//Approve-Reject Form API
app.post("/req", UserForm) 


//Approve-Reject Form Data Fetching API
app.get("/status", loginRateLimiter(), UserStatus);


//EmailAPI
app.get("/send-emails", ApproveEmail)


app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});