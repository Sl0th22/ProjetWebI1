const db = require('./db.include');

module.exports = {
  async getAllTeams() {
    try {
      const [rows] = await db.query(`
        SELECT 
          Team.team_id, 
          Team.team_name, 
          Team.team_location, 
          Team.team_coach, 
          Team.team_number,
          Team.team_creation_date,
          Player.player_first_name AS team_captain_firstname, 
          Player.player_last_name AS team_captain_lastname
        FROM 
          Team
        JOIN 
          Player ON Team.team_captain = Player.player_id
      `); // We separate the first name and the last name because it is easier to display them in the front-end
      console.log("Data received :", rows); // We print all the informations of the SELECT in our console to check if it works
      return rows;
    } catch (error) {
      console.error("Error when we load the SQL command :", error.message);
      throw error;
    }
  },
  
  async getTeamById(id) {
    try {
      const [rows] = await db.query(`
        SELECT 
          Team.team_id, 
          Team.team_name, 
          Team.team_location, 
          Team.team_coach, 
          Team.team_number,
          Team.team_creation_date,
          Player.player_first_name AS team_captain_firstname, 
          Player.player_last_name AS team_captain_lastname
        FROM 
          Team
        JOIN 
          Player ON Team.team_captain = Player.player_id
        WHERE 
          Team.team_id = ?
      `, [id]); // We separate the first name and the last name because it is easier to display them in the front-end
      return rows[0];
    } catch (error) {
      console.error("Error while loaded the data from the ID :", error.message);
      throw error;
    }
  },
  

  async addTeam(team) {
    try {
      const {
        team_name,
        team_location,
        team_coach,
        team_captain_firstname,
        team_captain_lastname,
        team_number = 1,
        team_creation_date = new Date().toISOString(),
      } = team;
  
      console.log(
        "Data from the request (team.repository.js) :",
        team_name,
        team_location,
        team_coach,
        team_captain_firstname,
        team_captain_lastname,
        team_number,
        team_creation_date
      );
  
      const [captainResult] = await db.query(
        "SELECT player_id FROM Player WHERE player_first_name = ? AND player_last_name = ?",
        [team_captain_firstname, team_captain_lastname]
      ); // We check if the captain exists in the database
  
      if (!captainResult || captainResult.length === 0) {
        throw new Error(
          `The captain named ${team_captain_firstname} ${team_captain_lastname} doesn't exist.`
        );
      }
  
      // We get the ID of the captain we want the first one because when we do a query, we get an array of results
      const team_captain = captainResult[0].player_id;
  
      console.log("ID of the fund captain :", team_captain);
      const [result] = await db.query(
      "INSERT INTO Team (team_name, team_location, team_coach, team_captain, team_number, team_creation_date) VALUES (?, ?, ?, ?, ?, ?)",
      [team_name, team_location, team_coach, team_captain, team_number, team_creation_date]
      );
        return result.insertId;
    } catch (error) {
      console.error("Error while adding the team (team.repository) :", error.message);
      throw error;
    }
  },

  async deleteTeamByName(teamName) {
    try {
      const [result] = await db.query(
        "DELETE FROM Team WHERE team_name = ?",
        [teamName]
      );
      return result.affectedRows;
    } catch (error) {
      console.error("Error in the deleteTeamByName in team.repository.js:", error.message);
      throw error;
    }
  },

  
};