require('dotenv').config();

// Importation des modules nécessaires
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // Pour éviter les problèmes de CORS avec le frontend Vue.js

const app = express();
const port = process.env.PORT || 3000;

// Utiliser CORS pour permettre les requêtes depuis le frontend
app.use(cors());

// Activer le parsing des requêtes JSON
app.use(express.json());

// Configuration de la connexion MySQL via les variables d'environnement
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '123456789',
  database: process.env.DB_NAME || 'sport1',
};

const db = mysql.createConnection(dbConfig);

db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err.message);
    console.log('Vérifiez les informations de connexion (hôte, utilisateur, mot de passe, base).');
    process.exit(1);
  } else {
    console.log('Connexion à la base de données MySQL réussie.');
  }
});

const toornamentRoutes = require('./controllers/toornamentapi.route');
app.use('/api/toornament', toornamentRoutes);

const teamRoutes = require('./controllers/teamapi.route');
app.use('/api/teams', teamRoutes);

const playerRoutes = require('./controllers/playerapi.route');
app.use('/api/players', playerRoutes);

const belongRoutes = require('./controllers/belongapi.route'); 
app.use('/api/belong', belongRoutes);

const matchRoutes = require('./controllers/matchapi.route');
app.use('/api/matches', matchRoutes);

app.get('/test', (req, res) => {
  db.query('SELECT 1', (err, results) => {
    if (err) {
      console.error('Erreur lors de la requête SQL:', err.message);
      return res.status(500).json({ message: 'Erreur lors de la connexion à la base de données' });
    }
    res.json({ message: 'Connexion MySQL réussie!', results });
  });
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Le serveur fonctionne sur le port ${port}`);
});

