const db = require('./db.include');

module.exports = {
  async checkPlayerExists(firstname, lastname) {
    try {
      const [rows] = await db.query(`
        SELECT COUNT(*) as count 
        FROM Player 
        WHERE player_first_name = ? AND player_last_name = ?
      `, [firstname, lastname]);
      return rows[0].count > 0;
    } catch (error) {
      console.error("Error while verifying the player sql (player.repository.js):", error.message);
      throw error;
    }
  },

  async addPlayer(player) {
    try {
      const { first_name, last_name, email, age, phone_number } = player;
      const [result] = await db.query(`
        INSERT INTO Player (player_first_name, player_last_name, player_mail, player_age, player_phone_number)
        VALUES (?, ?, ?, ?, ?)
      `, [first_name, last_name, email, age, phone_number]);
      return result.insertId;
    } catch (error) {
      console.error("Error while adding the player (player.repository.js) :", error.message);
      throw error;
    }
  }
};