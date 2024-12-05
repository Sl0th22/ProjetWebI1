const db = require('./db.include');

module.exports = {
    async getAllMatches() {
        try {
            const [matchesWithScores] = await db.query(`
                SELECT 
                    m.matchs_id,
                    m.matchs_date,
                    t.toornament_name,
                    team1.team_name AS team1_name,
                    team2.team_name AS team2_name,
                    m.matchs_score1,
                    m.matchs_score2
                FROM 
                    Matchs m
                JOIN 
                    Toornament t ON m.toornament_id = t.toornament_id
                JOIN 
                    Team team1 ON m.team1_id = team1.team_id
                JOIN 
                    Team team2 ON m.team2_id = team2.team_id
                WHERE 
                    m.team1_id < m.team2_id
                    AND (m.matchs_score1 != "/" AND m.matchs_score2 != "/" );
            `);

            const [matchesWithoutScores] = await db.query(`
                SELECT 
                    m.matchs_id,
                    m.matchs_date,
                    t.toornament_name,
                    team1.team_name AS team1_name,
                    team2.team_name AS team2_name,
                    m.matchs_score1,
                    m.matchs_score2
                FROM 
                    Matchs m
                JOIN 
                    Toornament t ON m.toornament_id = t.toornament_id
                JOIN 
                    Team team1 ON m.team1_id = team1.team_id
                JOIN 
                    Team team2 ON m.team2_id = team2.team_id
                WHERE 
                    m.team1_id < m.team2_id
                    AND (m.matchs_score1 = "/" OR m.matchs_score2 = "/");
            `);

            return { matchesWithScores, matchesWithoutScores };
        } catch (error) {
            console.error('Error while loading the matches sql (match.repository.js):', error.message);
            throw error;
        }
    },

    async deleteMatchById(id) {
        try {
            const [match] = await db.query(`
                SELECT team1_id, team2_id
                FROM Matchs
                WHERE matchs_id = ?
            `, [id]);

            if (match.length === 0) {
                console.log('No match found with the given ID.');
                return 0;
            }

            const { team1_id, team2_id } = match[0];
            const [rows] = await db.query(`
                DELETE FROM Matchs
                WHERE matchs_id = ?
            `, [id]);

            const [duplicateMatches] = await db.query(`
                DELETE FROM Matchs
                WHERE (team1_id = ? AND team2_id = ?)
                   OR (team1_id = ? AND team2_id = ?)
            `, [team2_id, team1_id, team1_id, team2_id]);

                
            return rows.affectedRows + duplicateMatches.affectedRows;

        } catch (error) {
            console.error('Error while deleting the match and its duplicates (match.repository.js):', error.message);
            throw error;
        }
    },
};

