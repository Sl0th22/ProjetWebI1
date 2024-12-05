const express = require('express');
const router = express.Router();
const teamRepository = require('../utils/team.repository'); 

router.get('/', async (req, res) => {
  try {
    const teams = await teamRepository.getAllTeams(); // We get all teams from the function in team.repository.js
    res.json(teams); // Return all teams in JSON format
  } catch (error) {
    console.error('Error while loading the teams :', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const team = await teamRepository.getTeamById(req.params.id);
    if (team) {
      res.json(team); 
    } else {
      res.status(404).json({ message: 'Team not found' });
    }
  } catch (error) {
    console.error('Error when we load the team by id ("teamapi.route.js") : ', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete("/:teamNameToDelete", async (req, res) => {
    try {
      const { teamNameToDelete } = req.params; // Load the team name to delete
      console.log("Name of the team to delete (teamapi.route.js) :", teamNameToDelete);
      const rowsAffected = await teamRepository.deleteTeamByName(teamNameToDelete);
  
      if (rowsAffected > 0) {
        res.json({ message: "Team Succesfully deleted." });
      } else {
        res.status(404).json({ message: "Team not found." });
      }
    } catch (error) {
      console.error("Error while deleting the team (teamapi.route.js) :", error.message);
      res.status(500).json({ message: "Server error." });
    }
  });
  

router.post('/', async (req, res) => {
  try {
    const {
      team_name,
      team_location,
      team_coach,
      team_captain_firstname,
      team_captain_lastname,      
      team_number = 1,
      team_creation_date = new Date().toISOString() 
    } = req.body; // Load the data of the new team

    console.log('Data from teamapi.route.js :', team_name, team_location, team_coach, team_captain_firstname, team_captain_lastname, team_number, team_creation_date);
    const newTeamId = await teamRepository.addTeam({
      team_name,
      team_location,
      team_coach,
      team_captain_firstname,
      team_captain_lastname, 
      team_number,
      team_creation_date
    });
    res.status(201).json({
      message: 'Team succesfully added',
      team_id: newTeamId
    });
  } catch (error) {
    console.error('Error while we add the team (teamapi.route.js) : ', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
