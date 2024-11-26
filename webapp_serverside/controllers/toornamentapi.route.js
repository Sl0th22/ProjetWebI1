const express = require('express');
const router = express.Router();
const toornamentRepository = require('../utils/toornament.repository');

router.get('/', async (req, res) => {
    try {
        const tournaments = await toornamentRepository.getAllTournaments();
        res.json(tournaments);
    } catch (error) {
        console.error('Erreur lors de la récupération des tournois:', error.message);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const tournament = await toornamentRepository.getTournamentById(req.params.id);
        if (tournament) {
            res.json(tournament);
        } else {
            res.status(404).json({ message: 'Tournoi non trouvé' });
        }
    } catch (error) {
        console.error('Erreur lors de la récupération du tournoi:', error.message);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

router.post('/', async (req, res) => {
    try {
        const newTournamentId = await toornamentRepository.addTournament(req.body);
        res.status(201).json({ message: 'Tournoi ajouté', id: newTournamentId });
    } catch (error) {
        console.error('Erreur lors de l\'ajout du tournoi:', error.message);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedRows = await toornamentRepository.deleteTournament(req.params.id);
        if (deletedRows > 0) {
            res.json({ message: 'Tournoi supprimé' });
        } else {
            res.status(404).json({ message: 'Tournoi non trouvé' });
        }
    } catch (error) {
        console.error('Erreur lors de la suppression du tournoi:', error.message);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

module.exports = router;