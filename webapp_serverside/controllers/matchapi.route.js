const express = require('express');
const router = express.Router();
const matchRepository = require('../utils/match.repository');

router.get('/', async (req, res) => {
    try {
        const { matchesWithScores, matchesWithoutScores } = await matchRepository.getAllMatches();
        console.log({
            matchesWithScores,
            matchesWithoutScores,
        });

        res.json({
            matchesWithScores,
            matchesWithoutScores,
        });
    } catch (error) {
        console.error('Error while loading the matches (matchapi.route.js):', error.message);
        res.status(500).json({ message: 'Server error' });
    }
})

router.delete('/:matchId', async (req, res) => {
    try {
        const { matchId } = req.params;
        const rowsAffected = await matchRepository.deleteMatchById(matchId);

        if (rowsAffected > 0) {
            res.json({ message: 'Match successfully deleted.' });
        } else {
            res.status(404).json({ message: 'Match not found.' });
        }
    } catch (error) {
        console.error('Error while deleting the match (matchapi.route.js):', error.message);
        res.status(500).json({ message: 'Server error.' });
    }
})


router.post('/', async (req, res) => {
    try {
        const match = req.body;
        console.log('New match:', match);
        const newMatch = await matchRepository.addMatch(match);

        res.json(newMatch);
    } catch (error) {
        console.error('Error while adding a new match (matchapi.route.js):', error.message);
        res.status(500).json({ message: 'Server error.' });
    }
})
module.exports = router;