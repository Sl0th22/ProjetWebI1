require('dotenv').config();

// Import the moduls
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); 
const bodyParser = require('body-parser');
const session = require('express-session');

// Initiate the app
const app = express();
const port = process.env.PORT || 3000;

//Middleware : Configure CORS
app.use(cors({
  origin: 'http://localhost:8080', // Frontend Vue.js
  credentials: true,
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH']
}));

//Middleware : Configure the session session (needed for Passport)
app.use(session({
  secret: 'SecretRandomString',
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: false, secure: false },
  resave: false
}));

//Middleware : Initiate password
const auth = require('./utils/users.auth');
auth.initializeAuthentications(app);
app.use('/auth', require('./controllers/auth.route')); // Import the auth.route.js

//Middleware : Parsing JSON requests
app.use(express.json());

//Middleware : Configure bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Connexion to the database
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '123456789',
  database: process.env.DB_NAME || 'sport1',
};
const db = mysql.createConnection(dbConfig);
db.connect((err) => {
  if (err) {
    console.error('Error while connecting the databse:', err.message);
    process.exit(1);
  } else {
    console.log('Connexion to the databse is ok.');
  }
});

// Routers API
const toornamentRoutes = require('./controllers/toornamentapi.route');
const teamRoutes = require('./controllers/teamapi.route');
const playerRoutes = require('./controllers/playerapi.route');
const belongRoutes = require('./controllers/belongapi.route');
const matchRoutes = require('./controllers/matchapi.route');
const playRoutes = require('./controllers/playapi.route');


// Define the routers
app.use('/api/toornament', toornamentRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/belong', belongRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/play', playRoutes);


// Verify the connection to the database
app.get('/test', (req, res) => {
  db.query('SELECT 1', (err, results) => {
    if (err) {
      console.error('Error while connecting to the databse:', err.message);
      return res.status(500).json({ message: 'Error database connexion' });
    }
    res.json({ message: 'Connexion MySQL OK !', results });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`The server is on the port : ${port}`);
});
