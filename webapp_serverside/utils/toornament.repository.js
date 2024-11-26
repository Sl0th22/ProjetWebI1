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
      console.error('Erreur lors de la mise à jour du tournoi :', error.message);
      throw error;
    }
  },

  async deleteTournament(id) {
    const connection = await db.getConnection(); // Pour gérer les transactions
    try {
      await connection.beginTransaction();

      // Supprimer les enregistrements liés dans la table Play
      const [deletePlay] = await connection.query('DELETE FROM Play WHERE toornament_id = ?', [id]);
      console.log(`Liens supprimés dans Play : ${deletePlay.affectedRows}`);

      // Supprimer les enregistrements liés dans la table Matchs
      const [deleteMatches] = await connection.query('DELETE FROM Matchs WHERE toornament_id = ?', [id]);
      console.log(`Matchs supprimés : ${deleteMatches.affectedRows}`);

      // Supprimer le tournoi
      const [deleteTournament] = await connection.query('DELETE FROM Toornament WHERE toornament_id = ?', [id]);
      console.log(`Tournois supprimés : ${deleteTournament.affectedRows}`);

      await connection.commit(); // Valider les suppressions
      return deleteTournament.affectedRows;
    } catch (error) {
      await connection.rollback(); // Annuler en cas d'erreur
      console.error('Erreur lors de la suppression du tournoi :', error.message);
      throw error;
    } finally {
      connection.release(); // Libérer la connexion
    }
  }
};