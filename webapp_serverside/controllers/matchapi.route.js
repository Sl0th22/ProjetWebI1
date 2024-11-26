const express = require('express');
const router = express.Router();
const matchRepository = require('../utils/match.repository');

router.get('/', async (req, res) => {
    try {
        const matches = await matchRepository.getAllMatches();
        console.log(matches);
        res.json(matches);
    } catch (error) {
        console.error('Error while loading the matches (matchapi.route.js):', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});
module.exports = router;