const express = require('express');
const router = express.Router();
const belongRepository = require('../utils/belong.repository');


router.post('/', async (req, res) => {
    try {
      const { team_name,
        team_captain_firstname,
        team_captain_lastname } = req.body;
  
      if (!team_name || !team_captain_firstname || !team_captain_lastname) {
        return res.status(400).json({ message: 'team name, captain name are required.' });
      }
  
      await belongRepository.addBelongRelation(team_name,team_captain_firstname,team_captain_lastname);
  
      res.status(201).json({ message: 'Relation added successfully.' });
    } catch (error) {
      console.error('Error while adding relation to Belong (belongapi.route.js):', error.message);
      res.status(500).json({ message: 'Server error.' });
    }
  });
  
router.delete('/', async (req, res) => {
    try{
        const {team_name} = req.body;
        console.log('Name of the team to delete (belongapi.route.js) :', team_name);
        if(!team_name){
            return res.status(400).json({message: 'team name is required.'});
        }

        await belongRepository.deleteBelongRelation(team_name);
        res.status(201).json({message: 'Relation deleted successfully.'});
    }
    
    catch(error){
        console.error('Error while deleting relation to Belong (belongapi.route.js):', error.message);
        res.status(500).json({message: 'Server error.'});
    }
    });

    router.delete('/:team_name/:player_id', async (req, res) => {
      try {
          const { team_name, player_id } = req.params;
          console.log('-----------------------------------------');
          console.log('Deleting player from team:', team_name, player_id);
  
          if (!team_name || !player_id) {
              return res.status(400).json({ message: 'Team name and player ID are required.' });
          }
            await belongRepository.deletePlayerFromTeam(team_name, player_id);
  
          res.status(200).json({ message: 'Player removed from the team successfully.' });
      } catch (error) {
          console.error('Error while removing player from team (API):', error.message);
          res.status(500).json({ message: 'Server error.' });
      }
  });

  router.post('/add-players:', async (req, res) => {
    try {
      const { team_id, player_id } = req.body;
  
      if (!team_id || !player_id) {
        return res.status(400).json({ message: 'Team ID and Player ID are required.' });
      }
  
      await belongRepository.addBelongRelation(team_id, player_id);
  
      res.status(201).json({ message: 'Player successfully registered to the team.' });
    } catch (error) {
      console.error('Error while adding player to team (belongapi.route.js):', error.message);
      res.status(500).json({ message: 'Server error.' });
    }
  });

  module.exports = router;