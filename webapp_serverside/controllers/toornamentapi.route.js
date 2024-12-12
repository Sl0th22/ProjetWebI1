const express = require('express');
const router = express.Router();
const toornamentRepository = require('../utils/toornament.repository');


router.get('/matchesCount', async (req, res) => {
    try {
        const matchesCount = await toornamentRepository.getMatchesCountByTournament();
        res.json(matchesCount);
    } catch (error) {
        console.error('Error retrieving matches count:', error.message);
        res.status(500).json({ message: 'Error server' });
    }
});

router.get('/', async (req, res) => {
    try {
        const tournaments = await toornamentRepository.getAllTournaments();
        res.json(tournaments);
    } catch (error) {
        console.error('Error retrieving tournaments:', error.message);
        res.status(500).json({ message: 'Erreur servor' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const tournament = await toornamentRepository.getTournamentById(req.params.id);
        if (tournament) {
            res.json(tournament);
        } else {
            res.status(404).json({ message: 'Tournoi no find' });
        }
    } catch (error) {
        console.error('Error retrieving tournament:', error.message);
        res.status(500).json({ message: 'Error serveur' });
    }
});

router.post('/', async (req, res) => {
    try {
        const newTournamentId = await toornamentRepository.addTournament(req.body);
        res.status(201).json({ message: 'tournament added', id: newTournamentId });
    } catch (error) {
        console.error('Error during adding tournament:', error.message);
        res.status(500).json({ message: 'Error server' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedRows = await toornamentRepository.deleteTournament(req.params.id);
        if (deletedRows > 0) {
            res.json({ message: 'Tournament deleted' });
        } else {
            res.status(404).json({ message: 'Tournoi not find' });
        }
    } catch (error) {
        console.error('Error during deleting tournament:', error.message);
        res.status(500).json({ message: 'Error server' });
    }
});
  




module.exports = router;