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
    }
};
