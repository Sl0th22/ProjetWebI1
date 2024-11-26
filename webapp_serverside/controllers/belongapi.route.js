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


  module.exports = router;