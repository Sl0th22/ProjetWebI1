const db = require('./db.include');

module.exports = {
  async getAllTournaments() {
    const [rows] = await db.query('SELECT toornament_id, toornament_name, toornament_location, toornament_start_date, toornament_end_date FROM Toornament');
    return rows;
  },

  async getTournamentById(id) {
    const [rows] = await db.query('SELECT toornament_id, toornament_name, toornament_location, toornament_start_date, toornament_end_date FROM Toornament WHERE toornament_id = ?', [id]);
    return rows[0];
  },

  async addTournament(tournament) {
    const { toornament_name, toornament_location, toornament_start_date, toornament_end_date, toornament_mail } = tournament;
    const [result] = await db.query(
      'INSERT INTO Toornament (toornament_name, toornament_location, toornament_start_date, toornament_end_date, toornament_mail) VALUES (?, ?, ?, ?, ?)',
      [toornament_name, toornament_location, toornament_start_date, toornament_end_date, toornament_mail]
    );
    return result.insertId;
  },

  async updateTournament(id, tournament) {
    const { toornament_name, toornament_location, toornament_start_date, toornament_end_date, toornament_mail } = tournament;
    try {
      const [result] = await db.query(
        'UPDATE Toornament SET toornament_name = ?, toornament_location = ?, toornament_start_date = ?, toornament_end_date = ?, toornament_mail = ? WHERE toornament_id = ?',
        [toornament_name, toornament_location, toornament_start_date, toornament_end_date, toornament_mail, id]
      );
      return result.affectedRows; // Retourne le nombre de lignes affectées
    } catch (error) {
      console.error('Error during updating tournament :', error.message);
      throw error;
    }
  },

  async deleteTournament(id) {
    const connection = await db.getConnection(); // Pour gérer les transactions
    try {
      await connection.beginTransaction();

      // Supprimer les enregistrements liés dans la table Play
      const [deletePlay] = await connection.query('DELETE FROM Play WHERE toornament_id = ?', [id]);
      console.log(`Links removed in Play : ${deletePlay.affectedRows}`);

      // Supprimer les enregistrements liés dans la table Matchs
      const [deleteMatches] = await connection.query('DELETE FROM Matchs WHERE toornament_id = ?', [id]);
      console.log(`Matchs deleted : ${deleteMatches.affectedRows}`);

      // Supprimer le tournoi
      const [deleteTournament] = await connection.query('DELETE FROM Toornament WHERE toornament_id = ?', [id]);
      console.log(`Tournament deleted : ${deleteTournament.affectedRows}`);

      await connection.commit(); // Valider les suppressions
      return deleteTournament.affectedRows;
    } catch (error) {
      await connection.rollback(); // Annuler en cas d'erreur
      console.error('Error during deleting tournament :', error.message);
      throw error;
    } finally {
      connection.release(); // Libérer la connexion
    }
  },

  async getMatchesCountByTournament() {
    const query = `
      SELECT 
        T.toornament_id,
        T.toornament_name,
        COUNT(M.matchs_id) AS match_count
      FROM 
        Toornament T
      LEFT JOIN 
        Matchs M 
      ON 
        T.toornament_id = M.toornament_id
      GROUP BY 
        T.toornament_id, 
        T.toornament_name;
        
    `;
    const [results] = await db.query(query);
    console.log(results);
    return results;
  }
  
  
};