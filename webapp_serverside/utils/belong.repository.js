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
    },

    async deletePlayerFromTeam(team_name, player_id) {
      try {
          // Verify if the team exists
          const [teamResult] = await db.query(
              `SELECT team_id FROM Team WHERE team_name = ?`,
              [team_name]
          );
          if (teamResult.length === 0) {
              throw new Error('Team not found');
          }
          const team_id = teamResult[0].team_id;
  
          // Verify if the player exists
          const [playerResult] = await db.query(
              `SELECT player_id FROM Player WHERE player_id = ?`,
              [player_id]
          );
          if (playerResult.length === 0) {
              throw new Error('Player not found');
          }
  
          // Delete the relation
          const [deleteResult] = await db.query(
              `DELETE FROM Belong WHERE team_id = ? AND player_id = ?`,
              [team_id, player_id]
          );
  
          if (deleteResult.affectedRows === 0) {
              throw new Error('No relation found between the team and the player.');
          }
  
          console.log('Player removed from the team successfully.');
      } catch (error) {
          console.error("Error while deleting player from team (Repository):", error.message);
          throw error;
      }
  }
  

  /*async joinTeamToTournament(team_name, tournament_name) {
    try {
      // Récupérer l'ID de l'équipe et du capitaine
      const [teamResult] = await db.query(
        `SELECT team_id, team_captain FROM Team WHERE team_name = ?`,
        [team_name]
      );
      if (teamResult.length === 0) {
        throw new Error('Team not found');
      }
      const team_id = teamResult[0].team_id;
      const player_id = teamResult[0].team_captain; // ID du capitaine
  
      // Récupérer l'ID du tournoi
      const [tournamentResult] = await db.query(
        `SELECT toornament_id FROM Toornament WHERE toornament_name = ?`,
        [tournament_name]
      );
      if (tournamentResult.length === 0) {
        throw new Error('Tournament not found');
      }
      const toornament_id = tournamentResult[0].toornament_id;
  
      // Vérifier si la relation existe déjà
      const [existingEntry] = await db.query(
        `SELECT * FROM Belong WHERE team_id = ? AND player_id = ? AND toornament_id = ?`,
        [team_id, player_id, toornament_id]
      );
  
      if (existingEntry.length > 0) {
        throw new Error('This team is already linked to the tournament for this player.');
      }
  
      // Lier l'équipe, le joueur (capitaine), et le tournoi
      await db.query(
        `INSERT INTO Belong (team_id, player_id, toornament_id) VALUES (?, ?, ?)`,
        [team_id, player_id, toornament_id]
      );
  
      console.log('Team linked to tournament successfully.');
    } catch (error) {
      console.error('Error while linking team to tournament:', error.message);
      throw error;
    }
  }*/
};
