const express = require('express');
const router = express.Router();
const playRepository = require('../utils/play.repository');

router.post('/join', async (req, res) => {
    try {
        const { team_name, tournament_name } = req.body;

        if (!team_name || !tournament_name) {
            return res.status(400).json({ message: 'Team name and tournament name are required.' });
        }

        await playRepository.joinTeamToTournament(team_name, tournament_name);
        res.status(201).json({ message: 'Team successfully linked to tournament.' });
    } catch (error) {
        console.error('Error linking team to tournament:', error.message);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
