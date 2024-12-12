// controllers/auth.route.js
const express = require('express');
const router = express.Router();
const auth = require("../utils/users.auth");
const userRepo = require("../utils/users.repository");

// Middleware to analyse the request body
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Protected routes
router.get("/user", auth.authorizeRequest("USER"), userdataAction); // Onnly for "USER" role
router.get("/admin", auth.authorizeRequest("ADMIN"), userdataAction); // Only for "ADMIN" role

// Routes that everyone can get
router.post("/login", loginPostAction); // Log
router.get("/logout", logoutAction); // Logout

// Functino to get user data
async function userdataAction(request, response) {
  let userJson = JSON.stringify(request.user); 
  response.send(userJson);
}


// Function to connect
async function loginPostAction(request, response) {  
    let areValid = await userRepo.areValidCredentials(request.body.username, request.body.userpass);
  
    if (areValid) {
      const user = await userRepo.getOneUser(request.body.username);
      request.login(user, function (err) {
        if (err) {
          console.log("LOGINERROR", err);
          response.send({
            loginResult: false,
            timestamp: new Date().toLocaleString(),
          });
        } else {
            response.send({
            loginResult: true,
            role: user.user_role, // We send the role to the client side to get the local storage
            username: user.user_name,
            timestamp: new Date().toLocaleString(),
          });
        }
      });
    } else {
      response.send({
        loginResult: false,
        timestamp: new Date().toLocaleString(),
      });
    }
  }
  
  
//Logout function
function logoutAction(request, response) {
  request.logout(function(err) {
    let resultObject = { "logoutResult": true, "timestamp": new Date().toLocaleString() };
    if (err) { 
      console.log("LOGOUT ERROR");
      console.log(err); 
    }
    response.send(JSON.stringify(resultObject)); 
  });
}

// New user registration route
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const result = await userRepo.registerUser(username, password);
  if (result.success) {
    res.send({ message: 'Registration successful' });
  } else {
    res.status(400).send({ error: result.message });
  }
});

// Rest password route
router.post("/reset-password", async (req, res) => {
  const { username, oldPassword, newPassword } = req.body;
  const result = await userRepo.resetPassword(username, oldPassword, newPassword);
  if (result.success) {
    res.send({ message: 'Password reset successful' });
  } else {
    res.status(400).send({ error: result.message });
  }
});

module.exports = router;
