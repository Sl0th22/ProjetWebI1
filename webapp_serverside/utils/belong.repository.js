const db = require('./db.include');

module.exports = {

  async addBelongRelation(team_name, team_captain_firstname, team_captain_lastname) {
    try {
      const [captainResult] = await db.query(
        `SELECT player_id FROM Player WHERE player_first_name = ? AND player_last_name = ?`,
        [team_captain_firstname, team_captain_lastname]
      );
      if (captainResult.length === 0) {
        throw new Error('Captain not found');
      }

      const captain_id = captainResult[0].player_id;
      const [teamResult] = await db.query(
        `SELECT team_id FROM Team WHERE team_name = ?`,
        [team_name]
      );
      if (teamResult.length === 0) {
        throw new Error('Team not found');
      }

      const team_id = teamResult[0].team_id;

      await db.query(
        `INSERT INTO Belong (team_id, player_id) VALUES (?, ?)`,
        [team_id, captain_id]
      );

      console.log('Relation added between player and team successfully.');
      
    } catch (error) {
      console.error("Error while adding relation to Belong (belong.repository.js):", error.message);
      throw error;
    }
  },

    async deleteBelongRelation(team_name) {
        try {
        const [teamResult] = await db.query(
            `SELECT team_id FROM Team WHERE team_name = ?`,
            [team_name]
        );
        if (teamResult.length === 0) {
            throw new Error('Team not found');
        }
    
        const team_id = teamResult[0].team_id;
    
        await db.query(
            `DELETE FROM Belong WHERE team_id = ?`,
            [team_id]
        );
    
        console.log('Relation deleted between player and team successfully.');
        
        } catch (error) {
        console.error("Error while deleting relation to Belong (belong.repository.js):", error.message);
        throw error;
        }
    }
};
