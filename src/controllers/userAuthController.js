const { sendResponse } = require('../middleware/middleware');
 const bcrypt = require("bcrypt");
 const {generateTokens} = require('../utility/tokenUtil')
 const {sendMail} = require('../utility/nodeMailer')
 let users = [];
 let refreshTokens = [];
 let userOtps = [];
 const allowedRoles = ["user", "admin", "moderator"];
  
  
 exports.register = async (req, res) => {
   const { name, email, password, age, role = "user" } = req.body;
  
   if (!allowedRoles.includes(role)) {
     return sendResponse(res, 400, `Invalid role. Allowed roles: ${allowedRoles.join(", ")}`);
   }
  
   const existing = users.find((u) => u.email === email);
   if (existing) return sendResponse(res, 400, "Email already exists");
  
   const hashedPassword = await bcrypt.hash(password, 10);
   const newUser = {
     id: users.length + 1,
     name,
     email,
     password: hashedPassword,
     age,
     role,
   };
  
   users.push(newUser);
   const tokens = generateTokens(newUser);
   refreshTokens.push(tokens.refreshToken);
  
   return sendResponse(res, 201, "User registered", {
     user: { id: newUser.id, email, age, role },
     ...tokens,
   });
 };
  
 exports.login = async (req, res) => {
   const { email, password } = req.body;
  
   const user = users.find((u) => u.email === email);
   if (!user) return sendResponse(res, 401, "Invalid credentials");
  
   const isMatch = await bcrypt.compare(password, user.password);
   if (!isMatch) return sendResponse(res, 401, "Invalid credentials");
  
   const tokens = generateTokens(user);
   refreshTokens.push(tokens.refreshToken);
  
   return sendResponse(res, 200, "Login successful", {
     user: { id: user.id, email, role: user.role },
     ...tokens,
   });
   
 };
 
 exports.sendEmailOtp = async (req, res) => {
     const { email } = req.body;
 
     const user = users.find((u) => u.email === email);
     if (!user) return sendResponse(res, 404, "User not found");
 
     try {
       const otp = Math.floor(100000 + Math.random() * 900000);
       const expireAt = Date.now() + 60 * 1000; // expires in 1 minute
 
       const existingOtpEntry = userOtps.find((entry) => entry.email === email);
 
       if (existingOtpEntry) {
         existingOtpEntry.otp = otp;
         existingOtpEntry.expireAt = expireAt;
       } else {
         userOtps.push({ email, otp, expireAt });
       }
 
       const message = `
             <p>Dear User,</p>
             <p>Your One-Time Password (OTP) is: <strong>${otp}</strong></p>
             <p>Please use it within 1 minute to verify your email and complete the password reset process.</p>
             <p>If you have any questions, feel free to contact our support team.</p>
             <br />
             <p>Best regards,<br />Batch$ Team<br /><a href="https://example.com">https://example.com</a></p>
         `;
 
       // Mock or real email sending function
       await sendMail(email, "OTP Verification Code - Batch4", message);
 
       return sendResponse(res, 200, "OTP created. Please check your email.", {
         otp,
       });
     } catch (error) {
       return sendResponse(res, 500, error.message);
     }
   }
 
 exports.verifyOtp = async (req,res) =>{
     const { email, otp } = req.body;
 
       if (!email || !otp) {
         return sendResponse(res, 400, "Email and OTP are required");
       }
     
       const otpEntry = userOtps.find((entry) => entry.email === email);
     
       if (!otpEntry) {
         return sendResponse(res, 404, "OTP not found. Please request a new one.");
       }
     
       const isExpired = Date.now() > otpEntry.expireAt;
     
       if (isExpired) {
         // Optionally remove expired OTPs
         userOtps = userOtps.filter((entry) => entry.email !== email);
         return sendResponse(res, 410, "OTP has expired. Please request a new one.");
       }
     
       if (otpEntry.otp.toString() !== otp.toString()) {
         return sendResponse(res, 401, "Invalid OTP");
       }
     
       // OTP is valid – remove from store
       userOtps = userOtps.filter((entry) => entry.email !== email);
     
       return sendResponse(res, 200, "OTP verified successfully");
     }