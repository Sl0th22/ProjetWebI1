<template>
  <div>
    <header class="navbar">
      <div class="navbar-left">
        <img src="@/assets/Sport_tournament.png" alt="Sport Tournament Logo" class="logo" />
        <h1 class="site-title">The Sport Tournament</h1>
      </div>
      <nav class="nav-links">
        <ul>
          <li><router-link to="/">Accueil</router-link></li>
          <li><router-link to="/toornament">Toornament</router-link></li>
          <li><router-link to="/match">Match</router-link></li>
          <li><router-link to="/team">Team</router-link></li>
          <li><router-link to="/Players">Player</router-link></li>
          <li><router-link to="/login">Login</router-link></li>
        </ul>
      </nav>
    </header>
    <div>
      <nav>
        <ul><br>
          <li v-if="connected === 'admin'">
            <button class="add" @click="showAddModal = true">Add Tournament</button>
          </li>
        </ul>
      </nav>
    </div>

    <div class="filter-container">
      <select id="select1" v-model="selectedSport" @change="filter(selectedSport)">
        <option value="">All the sports</option>
        <option v-for="sport in sportsTypes" :key="sport" :value="sport">
          {{ sport }}
        </option>
      </select>
    </div>
<br>
    <div class="tournament-list">
      <button @click="switchconnect">Connected: {{ connected }}</button>
      <hr />
      <div v-for="tournoi in filteredTournaments" :key="tournoi.tournament_id + connected" class="tournament-item">
        <div class="title-container">
          <h2>{{ tournoi.nom }}</h2>
          <button v-if="connected === 'admin'" class="delT" @click="deleteT(tournoi)">X</button>
        </div>

        <p>Start date: {{ tournoi.dateS }}</p>
        <p>End date: {{ tournoi.dateE }}</p>
        <p>Number of places: {{ tournoi.place }} / {{ tournoi.maxEquipes }}</p>
        <p>Type: {{ tournoi.type }}</p>

        <div v-if=" connected === 'user'">
          <button v-if="tournoi.place >= tournoi.maxEquipes" disabled>Complete</button>
          <button v-else @click="register(tournoi)">Register</button>
        </div>

        <!-- Section pour afficher les matchs associés au tournoi -->
        <div class="matches-section">
          <h3>Matchs pour {{ tournoi.nom }}</h3>
          <div v-for="match in getMatchesForTournament(tournoi.tournament_id)" :key="match.match_id" class="match-item">
            <p>
              <strong>{{ match.team1 }}</strong> vs <strong>{{ match.team2 }}</strong> le {{ match.match_date }}
            </p>
            <p>
              Score: {{ match.score_team1 }} - {{ match.score_team2 }}
            </p>
          </div>
        </div>

        <hr />
      </div>
    </div>

    <div v-if="showAddModal" class="modal">
      <div class="modal-content">
        <h3>Add a Tournament</h3>
        <form @submit.prevent="addTournament" class="form-container">
          <input v-model="newTournament.nom" placeholder="Tournament Name" required />
          <input v-model="newTournament.dateS" type="date" required />
          <input v-model="newTournament.dateE" type="date" required />
          <input v-model.number="newTournament.place" type="number" min="0" placeholder="Current Teams" required />
          <input v-model.number="newTournament.maxEquipes" type="number" min="1" placeholder="Max Teams" required />

          <!-- Select aligné avec les autres champs input -->
          <select id="select2" v-model="newTournament.type" required>
            <option value="" disabled>Select Sport Type</option>
            <option v-for="sport in sportsTypes" :key="sport" :value="sport">
              {{ sport }}
            </option>
          </select>

          <button type="submit">Add</button>
          <button @click="showAddModal = false">Cancel</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      Toornament: [
        {
          tournament_id: 'T001',
          nom: "Championnat des Étoiles",
          dateS: "2024-11-01",
          dateE: "2024-11-10",
          place: 16,
          maxEquipes: 32,
          type: "Volley-ball"
        },
        {
          tournament_id: 'T002',
          nom: "Coupe d'Hiver",
          dateS: "2024-12-05",
          dateE: "2024-12-20",
          place: 8,
          maxEquipes: 16,
          type: "Football"
        },
        {
          tournament_id: 'T003',
          nom: "Tournoi des Champions",
          dateS: "2025-01-15",
          dateE: "2025-01-30",
          place: 10,
          maxEquipes: 10,
          type: "Basket-ball"
        },
        {
          tournament_id: 'T004',
          nom: "Compétition Printanière",
          dateS: "2025-03-10",
          dateE: "2025-03-15",
          place: 20,
          maxEquipes: 24,
          type: "Tennis de table"
        },
        {
          tournament_id: 'T005',
          nom: "Open International",
          dateS: "2025-04-05",
          dateE: "2025-04-20",
          place: 40,
          maxEquipes: 64,
          type: "Football"
        }
      ],
      matches: [
        {
          match_id: 'M001',
          team1: 'Le 129',
          team2: 'Papaya Eater',
          match_date: '2024-10-20',
          score_team1: 2,
          score_team2: 3,
          tournament_id: 'T001'
        },
        {
          match_id: 'M002',
          team1: 'Burito FC',
          team2: 'Datebayo',
          match_date: '2024-11-15',
          score_team1: 1,
          score_team2: 1,
          tournament_id: 'T002'
        },
        {
          match_id: 'M003',
          team1: 'Cygogne des îles',
          team2: 'Oeil de pigeon',
          match_date: '2024-12-05',
          score_team1: 4,
          score_team2: 2,
          tournament_id: 'T003'
        },
        {
          match_id: 'M004',
          team1: 'Le Tigre dormbvcbcvant',
          team2: 'La Tortue mangeuse de chats',
          match_date: '2024-05-05',
          score_team1: 1,
          score_team2: 0,
          tournament_id: 'T001'
        },
        {
            match_id: 'M005',
            team1 : 'Le Tigre dormqsqant',
            team2 : 'La Tortue mangeusewxc de chats',
            match_date: '2024-05-05',
            score_team1: 1,
            score_team2: 0,
            tournament_id: 'T001'
        },
        {
            match_id: 'M006',
            team1 : 'Le Tigre dorqsdmant',
            team2 : 'La Tortue mangeuseqv de chats',
            match_date: '2024-05-05',
            score_team1: 1,
            score_team2: 0,
            tournament_id: 'T004'
        },
        {
            match_id: 'M007',
            team1 : 'Le Tigre dovxcvrmant',
            team2 : 'La Tortue mangeuse de chats',
            match_date: '2024-05-05',
            score_team1: 1,
            score_team2: 0,
            tournament_id: 'T005'
        },
      ],
      selectedSport: "",
      connected: "visitor",
      showAddModal: false,
      newTournament: {
        tournament_id: "",
        nom: "",
        dateS: "",
        dateE: "",
        place: 0,
        maxEquipes: 1,
        type: ""
      }
    };
  },
  computed: {
    sportsTypes() {
      return [...new Set(this.Toornament.map(tournoi => tournoi.type))];
    },
    filteredTournaments() {
      if (!this.selectedSport) {
        return this.Toornament;
      }
      return this.Toornament.filter(
        tournoi => tournoi.type === this.selectedSport
      );
    }
  },
  methods: {
    filter(sport) {
      this.selectedSport = sport;
    },
    register(tournoi) {
      if (tournoi.place < tournoi.maxEquipes) {
        tournoi.place++;
        alert(`You have registered for the ${tournoi.nom} tournament!`);
      } else {
        alert("This tournament is full.");
      }
    },
    switchconnect() {
      const connectionLevels = ["visitor", "user", "admin"];
      const currentIndex = connectionLevels.indexOf(this.connected);
      this.connected = connectionLevels[(currentIndex + 1) % connectionLevels.length];
    },
    deleteT(tournoi) {
      this.Toornament = this.Toornament.filter(t => t !== tournoi);
    },
    addTournament() {
      this.Toornament.push({ ...this.newTournament });
      this.resetNewTournament();
      this.showAddModal = false;
    },
    resetNewTournament() {
      this.newTournament = {
        tournament_id: "",
        nom: "",
        dateS: "",
        dateE: "",
        place: 0,
        maxEquipes: 1,
        type: ""
      };
    },
    getMatchesForTournament(tournament_id) {
      return this.matches.filter(
        match => match.tournament_id === tournament_id
      );
    }
  }
};
</script>

<style scoped>
/* Barre de navigation */
.navbar {
  width: 1450px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 30px;
  background-color: #1f2937; /* Couleur sombre élégante */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}

.navbar-left {
  display: flex;
  align-items: center;
}

.logo {
  width: 50px;
  height: auto;
  margin-right: 10px;
  transition: transform 0.3s ease;
  cursor: pointer;
}

.logo:hover {
  transform: scale(1.1);
}

.site-title {
  color: #f3f4f6;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
}

/* Liens de navigation */
.nav-links ul {
  list-style-type: none;
  display: flex;
  gap: 5px;
  margin: 0;
  padding: 0;
}

.nav-links li {
  display: inline-block;
}

.nav-links a {
  text-decoration: none;
  color: #f3f4f6;
  font-size: 1rem;
  font-weight: 500;
  padding: 8px 15px;
  border-radius: 5px;
  transition: background-color 0.3s, transform 0.2s;
}

.nav-links a:hover {
  background-color: #374151;
  transform: translateY(-2px);
}

/* Styles de base pour le layout */
ul  {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 15px;
}

li:hover {
  transform: scale(1.1);
}

a {
  text-decoration: none;
  color: black;
}


/* Alignement du formulaire d'ajout de tournoi */
.form-container {
  
  display: flex;
  flex-direction: column;
  gap: 10px;
}

input {
  padding: 8px;
  font-size: 16px;
  width: 100%;
  box-sizing: border-box;
}

#select1{
  padding: 10px 15px;
  font-size: 16px;
  background-color: #85929e;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

#select2{

  margin-left: 20px; /* Déplace le texte de 20 pixels vers la droite */
  padding: 8px;
  font-size: 16px;
  width: 360px;
  box-sizing: border-box;
}


button {
  padding: 10px 15px;
  font-size: 16px;
  background-color: #85929e;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:not(.add):hover {
  background-color: #5d6d7e;
}

.tournament-item {
  margin-bottom: 20px;
}

.title-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

h2 {
  margin: 0;
  font-size: 24px;
  text-align: center;
  flex-grow: 1;
}

.delT {
  position: absolute;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.delT:hover {
  background-color: #c0392b;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  text-align: center;
}

input {
  display: block;
  margin: 10px auto;
  padding: 8px;
  width: 90%;
}

.add {
  padding: 10px 15px;
  font-size: 16px;
  background-color: #2874a6;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

/* Styles pour la section des matchs */
.matches-section {
  margin-top: 20px;
}

.match-item {
  background-color: #f9f9f9;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
}

.match-item p {
  margin: 5px 0;
}
</style>
