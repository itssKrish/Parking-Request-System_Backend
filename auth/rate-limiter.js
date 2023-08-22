const rateLimit = require("express-rate-limit");

// Rate limiter logic
function loginRateLimiter() { 
    return rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 3, // 5 requests per windowMs
    message: "Too many requests from this IP, please try again later.",
  });
}

module.exports = { loginRateLimiter };