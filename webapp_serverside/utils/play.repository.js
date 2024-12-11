const db = require('./db.include');

module.exports = {
    async joinTeamToTournament(team_name, tournament_name) {
        try {
            // Récupérer l'ID de l'équipe
            const [teamResult] = await db.query(
                `SELECT team_id FROM Team WHERE team_name = ?`,
                [team_name]
            );
            if (teamResult.length === 0) {
                throw new Error('Team not found');
            }
            const team_id = teamResult[0].team_id;

            // Récupérer l'ID du tournoi
            const [tournamentResult] = await db.query(
                `SELECT toornament_id FROM Toornament WHERE toornament_name = ?`,
                [tournament_name]
            );
            if (tournamentResult.length === 0) {
                throw new Error('Tournament not found');
            }
            const toornament_id = tournamentResult[0].toornament_id;

            // Vérifier si la relation existe déjà
            const [existingEntry] = await db.query(
                `SELECT * FROM Play WHERE team_id = ? AND toornament_id = ?`,
                [team_id, toornament_id]
            );

            if (existingEntry.length > 0) {
                throw new Error('This team is already linked to the tournament.');
            }

            // Lier l'équipe au tournoi
            await db.query(
                `INSERT INTO Play (team_id, toornament_id) VALUES (?, ?)`,
                [team_id, toornament_id]
            );

            console.log('Team linked to tournament successfully.');
        } catch (error) {
            console.error('Error while linking team to tournament:', error.message);
            throw error;
        }
    }
};
