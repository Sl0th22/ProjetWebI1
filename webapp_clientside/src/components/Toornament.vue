<template>
  <div>
    <header class="navbar">
      <div class="navbar-left">
        <img src="@/assets/Sport_tournament.png" alt="Sport Tournament Logo" class="logo" />
        <h1 class="site-title">The Sport Toornament</h1>
      </div>
      <nav class="nav-links">
        <ul>
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/toornament">Toornament</router-link></li>
          <li v-if="userRole" ><router-link to="/match">Match</router-link></li>
          <li v-if="userRole"><router-link to="/team">Team</router-link></li>
          <li v-if="!isAuthenticated"><router-link to="/login">Login</router-link></li>
          <li v-if="isAuthenticated"><a @click.prevent="logoutUser" href="#">Logout</a></li>
        </ul>
      </nav>
    </header>
    <br />

    <div>
      <nav>
        <ul>
          <li v-if="userRole === 'ADMIN'">
            <button class="add" @click="showAddModal = true">Add Tournament</button>
          </li>
        </ul>
      </nav>
    </div>

    <div class="filter-container">
      <select id="select1" v-model="selectedSport" @change="filter(selectedSport)">
        <option value="">All the location</option>
        <option v-for="sport in sportsTypes" :key="sport" :value="sport">
          {{ sport }}
        </option>
      </select>
    </div>
    <br />
    <div class="tournament-list">
      <hr />
      <div v-for="tournament in filteredTournaments" :key="tournament.toornament_id" class="tournament-item">
        <div class="title-container">
          <h2>{{ tournament.toornament_name }}</h2>
          <button v-if="userRole === 'ADMIN'" class="delT" @click="deleteTournament(tournament.toornament_id)">X</button>
        </div>

        <p>Start date: {{ formatDate(tournament.toornament_start_date) }}</p>
        <p>End date: {{ formatDate(tournament.toornament_end_date) }}</p>
        <p>Location: {{ tournament.toornament_location }}</p>
        <p>Number of matches: {{ (matchesCount[tournament.toornament_id - 1 ].match_count)/2 || 0}}</p>


        <div v-if="userRole === 'USER'">
          <button @click="openTeamSelection(tournament)">Register your team</button>
        </div>
        <hr />
      </div>
    </div>

    <div v-if="showTeamModal" class="modal">
      <div class="modal-content">
        <h3>Select a Team</h3>
        <form @submit.prevent="registerToTeam(selectedTournament)">
          <select v-model="selectedTeam" required class="team-select">
            <option value="" disabled>Select your team</option>
            <option v-for="team in teams" :key="team.team_id" :value="team.team_id">
              {{ team.team_name }}
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
          <input v-model="newTournament.toornament_name" placeholder="Tournament Name" required />
          <input v-model="newTournament.toornament_location" placeholder="Location" required />
          <input v-model="newTournament.toornament_start_date" type="date" required />
          <input v-model="newTournament.toornament_end_date" type="date" required />
          <input type="email" v-model="newTournament.toornament_mail" placeholder="Email" required />
          <button type="submit">Add</button>
          <button @click="showAddModal = false">Cancel</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      userRole : localStorage.getItem("userRole"),
      tournaments: [],
      matchesCount: {},
      newTournament: {
        toornament_name: "",
        toornament_location: "",
        toornament_start_date: "",
        toornament_end_date: "",
        toornament_mail: "",
      },
      selectedSport: "",
      connected: "visitor",
      showAddModal: false,
      showTeamModal: false,
      teams: [], // Chargement des équipes via API
      selectedTeam: "",
      selectedTournament: null,
    };
  },
  computed: {
    sportsTypes() {
      return [...new Set(this.tournaments.map((t) => t.toornament_location))];
    },
    filteredTournaments() {
      if (!this.selectedSport) {
        return this.tournaments;
      }
      return this.tournaments.filter((t) => t.toornament_location === this.selectedSport);
    },
    isAuthenticated() {
    return this.userRole !== null;
  },
  },
  methods: {

    async fetchMatchesCount() {
    try {
      const response = await axios.get("http://localhost:3000/api/toornament/matchesCount");
      this.matchesCount = response.data;
      console.log(this.matchesCount);
    } catch (error) {
      console.error("Error fetching matches count:", error.message);
    }
  },

    async fetchTournaments() {
      try {
        const response = await axios.get("http://localhost:3000/api/toornament");
        this.tournaments = response.data;
      } catch (error) {
        console.error("Error during the recuparation of the data:", error.message);
      }
    },
    async fetchTeams() {
  try {
    const response = await axios.get("http://localhost:3000/api/teams");
    this.teams = response.data;
    console.log("Teams fetched:", this.teams);
  } catch (error) {
    console.error("Error fetching teams:", error.message);
  }
},
    async addTournament() {
      try {
        await axios.post("http://localhost:3000/api/toornament", this.newTournament);
        this.fetchTournaments(); // Rafraîchir la liste
        this.showAddModal = false;
      } catch (error) {
        console.error("Error during adding tournament:", error.message);
      }
    },
    async deleteTournament(id) {
      try {
        await axios.delete(`http://localhost:3000/api/toornament/${id}`);
        this.fetchTournaments(); // Rafraîchir la liste
      } catch (error) {
        console.error("Error during deleting tournament:", error.message);
      }
    },
    async registerToTeam(tournament) {
  try {
    if (!this.selectedTeam) {
      alert("Please select a team.");
      return;
    }

    // Make API request to join the team to the tournament
    await axios.post("http://localhost:3000/api/play/join", {
      team_name: this.teams.find((team) => team.team_id === this.selectedTeam).team_name,
      tournament_name: tournament.toornament_name,
    });

    alert("Successfully registered the team to the tournament!");
    this.closeTeamModal(); // Close the modal after successful registration
  } catch (error) {
    console.error("Error while registering to the team:", error.message);
    alert("Failed to register the team. Please try again.");
  }
},
    openTeamSelection(tournament) {
      this.selectedTournament = tournament;
      this.fetchTeams(); // Charger les équipes disponibles
      this.showTeamModal = true;
    },
    closeTeamModal() {
      this.showTeamModal = false;
      this.selectedTeam = "";
      this.selectedTournament = null;
    },
    filter(sport) {
      this.selectedSport = sport;
    },
    formatDate(dateString) {
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    logoutUser() {
      localStorage.removeItem("userRole");
      this.userRole = null;
      this.$router.push("/login");
    },
  },
  mounted() {
    this.fetchTournaments();
    this.fetchMatchesCount();
  },
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