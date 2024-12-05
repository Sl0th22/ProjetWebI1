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
  },

  async getPlayersByTeam(team_id) {
    try {
      const query = `
        SELECT p.* FROM Player p
        JOIN Belong b ON p.player_id = b.player_id
        WHERE b.team_id = ?`;
      
      const [players] = await db.execute(query, [team_id]);
      console.log("players", players);
      return players;
    } catch (error) {
      console.error('Error while fetching players by team (player.repository.js):', error.message);
      throw error;
    }
  },

  async updatePlayer(playerId, playerData) {
    const { player_mail, player_age, player_phone_number } = playerData;
    try {
      const [rows, fields] = await db.query(
        'UPDATE Player SET player_mail = ?, player_age = ?, player_phone_number = ? WHERE player_id = ?',
        [player_mail, player_age, player_phone_number, playerId]
      );
      console.log('rows', rows);
      console.log('affectedRows',rows.affectedRows);
      if (rows.affectedRows > 0) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating player (repository.js):', error);
      throw error;
    }
  },
};