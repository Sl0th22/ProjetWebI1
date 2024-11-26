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
});
module.exports = router;