const pool = require(__dirname + "\\db.include.js");
const crypto = require('crypto'); // for SHA224 hashing

module.exports = {
    async getOneUser(userName) {
        try {
          const sql = `
            SELECT user_name, 
                   user_pass, 
                   user_role, 
                   user_created
            FROM users 
            WHERE user_name = ?`;
          const [rows] = await pool.execute(sql, [userName]);
      
          if (rows.length === 1) {
            console.log("User founded :", rows[0]); // Debug
            return rows[0];
          } else {
            console.log("User not founded :", userName); // Debug
            return false;
          }
        } catch (err) {
          console.error("Error in getOneUser :", err);
          throw err;
        }
      },      

  async areValidCredentials(username, password) {
    try {
      //Search for the user in the database
      let sql = "SELECT * FROM USERS WHERE user_name = ?";
      const [rows, fields] = await pool.execute(sql, [username]);
  
      if (rows.length === 1) {
        const user = rows[0]; //Return if the user is found
  
        // Hash the password before comparing it with the database
        const hashedPassword = crypto.createHash('sha224').update(password + username).digest('hex'); 
  
        if (hashedPassword === user.user_pass) {
          return true;
        } else {
          console.log("Password is incorrect for the user  :", username);
          return false;
        }
      } else {
        console.log("The username doesn't exist :", username);
        return false;
      }
    } catch (err) {
      console.error("Error in the validation Login program :", err);
      throw err;
    }
  },  

  async registerUser(username, password) {
    try {
      //Verify is the username already exists
      let sql = "SELECT * FROM USERS WHERE user_name = ?";
      const [rows, fields] = await pool.execute(sql, [username]);
  
      if (rows.length > 0) {
        throw new Error('Username already exists');
      }
  
      // Hash the password before storing it in the database
      const hashedPassword = crypto.createHash('sha224').update(password + username).digest('hex'); // Use the username as a salt
  
      sql = "INSERT INTO USERS (user_name, user_pass, user_role, user_created) VALUES (?, ?, 'USER', NOW())";
      await pool.execute(sql, [username, hashedPassword]);
  
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, message: err.message };
    }
  },  

  async resetPassword(username, oldPassword, newPassword) {
    try {
      let sql = "SELECT * FROM USERS WHERE user_name = ?";
      const [rows, fields] = await pool.execute(sql, [username]);

      if (rows.length === 0) {
        throw new Error('User not found');
      }

      // Verify the old password
      const oldHashedPassword = crypto.createHash('sha224').update(oldPassword + username).digest('hex');
      if (oldHashedPassword !== rows[0].user_pass) {
        throw new Error('Old password is incorrect');
      }

      // Hash the new one
      const newHashedPassword = crypto.createHash('sha224').update(newPassword + username).digest('hex');

      // Maj
      sql = "UPDATE USERS SET user_pass = ? WHERE user_name = ?";
      await pool.execute(sql, [newHashedPassword, username]);

      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, message: err.message };
    }
  }
};
