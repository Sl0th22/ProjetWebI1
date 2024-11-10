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

        <div v-if="connected === 'user'">
          <button v-if="tournoi.place >= tournoi.maxEquipes" disabled>Complete</button>
          <button v-else @click="openTeamSelection(tournoi)">Register</button>
        </div>

        <button @click="toggleMatchesVisibility(tournoi.tournament_id)" class="btn-toggle-matches">
          {{ matchesVisibility[tournoi.tournament_id] ? 'Hide Matches' : 'Show Matches' }}
        </button>

        <div class="matches-section" v-if="matchesVisibility[tournoi.tournament_id]">
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

    <div v-if="showTeamModal" class="modal">
      <div class="modal-content">
        <h3>Select a Team</h3>
        <form @submit.prevent="register(selectedTournament)">
          <select v-model="selectedTeam" required class="team-select">
            <option value="" disabled>Select your team</option>
            <option v-for="team in teams" :key="team.team_id" :value="team.team_id">
              {{ team.name }}
            </option>
          </select>
          <button type="submit">Confirm Registration</button>
          <button type="button" @click="closeTeamModal">Cancel</button>
        </form>
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
          <input list="sportsList" v-model="newTournament.type" placeholder="Enter or select a sport" required />
          <datalist id="sportsList">
            <option v-for="sport in sportsTypes" :key="sport" :value="sport">
              {{ sport }}
            </option>
          </datalist>
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
          team1: 'Le Tigre dormant',
          team2: 'La Tortue mangeuse de chats',
          match_date: '2024-05-05',
          score_team1: 1,
          score_team2: 0,
          tournament_id: 'T001'
        },
        {
          match_id: 'M005',
          team1: 'Le Tigre dormant',
          team2: 'La Tortue mangeuse de chats',
          match_date: '2024-05-05',
          score_team1: 1,
          score_team2: 0,
          tournament_id: 'T001'
        },
        {
          match_id: 'M006',
          team1: 'Le Tigre dormant',
          team2: 'La Tortue mangeuse de chats',
          match_date: '2024-05-05',
          score_team1: 1,
          score_team2: 0,
          tournament_id: 'T004'
        },
        {
          match_id: 'M007',
          team1: 'Le Tigre dormant',
          team2: 'La Tortue mangeuse de chats',
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
      },
      matchesVisibility: {},
      teams: [
        { team_id: 'Team001', name: 'Les Lions' },
        { team_id: 'Team002', name: 'Les Tigres' },
        { team_id: 'Team003', name: 'Les Aigles' },
        { team_id: 'Team004', name: 'Les Dragons' },
        { team_id: 'Team005', name: 'Les Phoenix' },
      ],
      showTeamModal: false,
      selectedTeam: '',
      selectedTournament: null,
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
    },
    toggleMatchesVisibility(tournament_id) {
      this.$set(this.matchesVisibility, tournament_id, !this.matchesVisibility[tournament_id]);
    },
    openTeamSelection(tournoi) {
      this.selectedTournament = tournoi;
      this.showTeamModal = true;
    },
    closeTeamModal() {
      this.showTeamModal = false;
      this.selectedTeam = '';
      this.selectedTournament = null;
    },
    register(tournoi) {
      if (!this.selectedTeam) {
        alert('Please select a team.');
        return;
      }
      if (tournoi.place < tournoi.maxEquipes) {
        tournoi.place++;
        alert(`You have registered for the ${tournoi.nom} tournament with the team ${this.getTeamName(this.selectedTeam)}!`);
        this.closeTeamModal();
      } else {
        alert("This tournament is full.");
      }
    },
    getTeamName(team_id) {
      const team = this.teams.find(team => team.team_id === team_id);
      return team ? team.name : '';
    },
  }
};
</script>

<style scoped>
.navbar {
  width: 1450px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 30px;
  background-color: #1f2937; 
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
  margin-left: 20px; 
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

.btn-toggle-matches {
  padding: 8px 16px;
  font-size: 14px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s;
}

.btn-toggle-matches:hover {
  background-color: #2980b9;
}

.team-select {
  padding: 8px;
  font-size: 16px;
  width: 100%;
  margin-bottom: 15px;
  border-radius: 4px;
}

.modal-content form button {
  margin: 5px;
}
</style>
