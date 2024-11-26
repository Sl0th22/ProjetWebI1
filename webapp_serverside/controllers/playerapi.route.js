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
  
  module.exports = router;