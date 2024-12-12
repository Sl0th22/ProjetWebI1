const passport = require("passport");
const usersRepo = require(__dirname + "\\users.repository.js"); // use same folder as the current file

// const localStrategy = require('passport-local');
// passport.use(new LocalStrategy(xxx));
// check https://www.passportjs.org/howtos/password/ for full localStrategy implementation
// instead, we will call request.login on our own, much cleaner...

// session+passport docs:
// https://www.passportjs.org/howtos/session/
// https://www.passportjs.org/concepts/authentication/sessions/

module.exports = {
  initializeAuthentications(app) {
    app.use(passport.initialize());
    app.use(passport.authenticate('session'));
    // app.use(passport.session()); // old syntax

    // Serialization will be called during request.login(userFromDb) 
    // Result will be saved into session
    passport.serializeUser(function (userFromDb, doneFunction) { 
      console.log("SERIALIZING...");
      console.log(userFromDb);
      const userObj = { "id": userFromDb.user_id, "name": userFromDb.user_name, "role": userFromDb.user_role }; // only the ID would be enough...
      console.log(userObj);
      doneFunction(null, userObj);
    });

    // This will be login when serialized user is in the session
    // Result will be saved into request.user
    passport.deserializeUser(async function (userObj, doneFunction) { 
      console.log("DE - SERIALIZING... ");
      console.log(userObj);
      let userFromDb = await usersRepo.getOneUser(userObj.name);
      console.log(userFromDb);
      doneFunction(null, userFromDb);
    });
  },

  authorizeRequest(requiredRole) {
    return function (request, response, next) {
      if (request.isAuthenticated()) { // Do we have an authenticated user?
        if (requiredRole) { // No special role needed for page -> check if current user has the SAME role (todo: hierarchy?)
          if (requiredRole === request.user.user_role) { 
            return next();
          } else {
            return response.end("401 Unautorized (bad user level)"); 
          }
        } else { // No special role needed for page -> next middleware
          return next();
        }
      } else { // not authenticated at all
        return response.end("401 Unautorized (not authenticated)");
        // OR: response.redirect("/auth"); 
      }
    }
  }
};