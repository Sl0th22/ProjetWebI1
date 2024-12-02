const express = require('express');
const router = express.Router();
const playerRepository = require('../utils/player.repository');

router.get('/', async (req, res) => {
  try {
    const { firstname, lastname } = req.query;
    if (!firstname || !lastname) {
      return res.status(400).json({ message: "Name required" });
    }

    const playerExists = await playerRepository.checkPlayerExists(firstname, lastname);

    res.json({ exists: playerExists });
  } catch (error) {
    console.error("Error while verifying the player (playerapi.route.js):", error.message);
    res.status(500).json({ message: "server error" });
  }
});

router.post('/', async (req, res) => {
    try {
      const { first_name, last_name, email, age, phone_number } = req.body;
      const newPlayerId = await playerRepository.addPlayer({
        first_name,
        last_name,
        email,
        age,
        phone_number
      });
  
      res.status(201).json({
        message: 'Player added successfully',
        player_id: newPlayerId
      });
    } catch (error) {
      console.error('Error while adding the player (playerapi.route.js) :', error.message);
      res.status(500).json({ message: 'Server error.' });
    }
  });
  
  router.get('/team/:team_id', async (req, res) => {
    try {
      const { team_id } = req.params;
      console.log("team_id", team_id);
      if (!team_id) {
        return res.status(400).json({ message: "team_id is required" });
      }
        const players = await playerRepository.getPlayersByTeam(team_id);
      if (!players || players.length === 0) {
        return res.status(404).json({ message: "No players found for this team" });
      }
  
      res.json(players); 
    } catch (error) {
      console.error("Error while fetching players (playerapi.route.js):", error.message);
      res.status(500).json({ message: "Server error" });
    }
  });

  router.put('/:player_id', async (req, res) => {
    const playerId = req.params.player_id;
    const { player_mail, player_age, player_phone_number } = req.body;
  
    try {
      const updatedPlayer = await playerRepository.updatePlayer(playerId, { player_mail, player_age, player_phone_number });
      console.log("updatedPlayer", updatedPlayer);
      if (updatedPlayer) {
        res.status(200).json({ message: 'Player updated successfully' });
      } else {
        res.status(404).json({ message: 'Player not found apiroute' });
      }
    } catch (error) {
      console.error("Error updating player:(apiroute.js) : ", error.message);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  module.exports = router;