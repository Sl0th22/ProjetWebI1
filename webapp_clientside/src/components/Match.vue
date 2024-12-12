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
          <li><router-link to="/match">Match</router-link></li>
          <li><router-link to="/team">Team</router-link></li>
          <li v-if="!isAuthenticated"><router-link to="/login">Login</router-link></li>
          <li v-if="isAuthenticated"><a @click.prevent="logoutUser" href="#">Logout</a></li>
        </ul>
      </nav>
    </header>
    <div class="card-container">
      <h1>List of your Precedent Matches</h1>
      <div class="cards-wrapper">
        <div class="card" v-for="match in matchesWithScores" :key="match.matchs_id">
          <div class="card-inner">
            <div class="card-front">
              <h2>{{ match.team1_name }} <strong>VS</strong> {{ match.team2_name }}</h2>
              <p> {{ match.toornament_name }}</p>

            </div>
            <div class="card-back">
              <button v-if="userRole === 'ADMIN'" class="delete-btn" @click="deleteMatch(match.matchs_id)">X</button>
              <p><strong>Date :</strong> {{ formatDate(match.matchs_date) }}</p>
              <p><strong>Score {{ match.team1_name }} :</strong> {{ match.matchs_score1 }}</p>
              <p><strong>Score {{ match.team2_name}} :</strong> {{ match.matchs_score2 }}</p>
            </div>
          </div>
        </div>
      </div>
      <h1>List of your Future Matches</h1>
      <div class="cards-wrapper">
        <div class="card" v-for="match in matchesWithoutScores" :key="match.matchs_id">
          <div class="card-inner">
            <div class="card-front">
              <h2>{{ match.team1_name }} <strong>VS</strong> {{ match.team2_name }}</h2>
              <p> {{ match.toornament_name }}</p>

            </div>
            <div class="card-back">
              <button v-if="userRole === 'ADMIN'" class="delete-btn" @click="deleteMatch(match.matchs_id)">X</button>
              <p><strong>Date :</strong> {{ formatDate(match.matchs_date) }}</p>
              <p>Still need to play</p>
            </div>
          </div>
        </div>

        <div v-if="userRole === 'ADMIN'" class="card add-card no-flip">
          <div class="card-inner">
            <div class="card-front">
              <button class="add-match-button" @click="showAddMatchForm">
                <span class="plus">+</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showForm" class="modal">
      <div class="modal-content">
        <h2>Add a Match</h2>
        <form @submit.prevent="submitMatchForm">
          <label for="tournament">Toornament:</label>
          <select id="tournament" v-model="formData.tournamentId" required>
            <option v-for="tournament in tournaments" :key="tournament.id" >
              {{ tournament.toornament_name }}
            </option>

          </select>

          <label for="team1">Team 1:</label>
          <select id="team1" v-model="formData.team1Id" required>
            <option v-for="team in teams" :key="team.id">
              {{ team.team_name }}
            </option>

          </select>

          <label for="team2">Team 2:</label>
          <select id="team2" v-model="formData.team2Id" required>
            <option v-for="team in teams" :key="team.id">
              {{ team.team_name }}
            </option>

          </select>

          <label for="date">Date:</label>
          <input type="date" id="date" v-model="formData.date" required />

          <label for="score1">Score Team 1 (optional):</label>
          <input type="number" id="score1" v-model="formData.score1" />

          <label for="score2">Score Team 2 (optional):</label>
          <input type="number" id="score2" v-model="formData.score2" />

          <button type="submit">Add Match</button>
          <button type="button" @click="closeAddMatchForm">Cancel</button>
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
      matchesWithScores: [],
      matchesWithoutScores: [],
      userRole : localStorage.getItem("userRole"),
      tournaments: [],
      teams: [],
      formData: {
        tournamentId: "",
        team1Id: "",
        team2Id: "",
        date: "",
        score1: "",
        score2: "",
      },
      showForm: false,
    };
  },
  methods: {
    async fetchMatch() {
      try {
        const response = await axios.get("http://localhost:3000/api/matches");
        const { matchesWithScores, matchesWithoutScores } = response.data;
        this.matchesWithScores = matchesWithScores;
        this.matchesWithoutScores = matchesWithoutScores;
        console.log("Matches loaded:", {
          matchesWithScores: this.matchesWithScores,
          matchesWithoutScores: this.matchesWithoutScores,
        });
      } catch (error) {
        console.error("Error loading matches:", error);
      }
    },

    formatDate(dateString) {
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },


    async deleteMatch(matchId) {
      try {
        await axios.delete(`http://localhost:3000/api/matches/${matchId}`);
        await this.fetchMatch();
        alert("Match deleted");
      } catch (error) {
        console.error("Error deleting match:", error);
      }
    },
    logoutUser() {
      localStorage.removeItem("userRole"); 
      this.userRole = null; 
      this.$router.push("/login");
    },

    async fetchTournamentsAndTeams() {
      try {
        const tournamentResponse = await axios.get("http://localhost:3000/api/toornament");
        const teamResponse = await axios.get("http://localhost:3000/api/teams");
        this.tournaments = tournamentResponse.data;
        this.teams = teamResponse.data;
      } catch (error) {
        console.error("Error fetching toornaments or teams:", error);
      }
    },

    showAddMatchForm() {
      this.showForm = true;
      this.fetchTournamentsAndTeams();
    },


    closeAddMatchForm() {
      this.showForm = false;
    },

    async submitMatchForm() {
  try {
    await axios.post("http://localhost:3000/api/matches", this.formData);
    alert("Match added successfully");
    this.closeAddMatchForm();
    this.fetchMatch();

    this.resetForm();

  } catch (error) {
    console.error("Error adding match:", error);
  }
  
},

async resetForm() {
  this.formData = {
    tournamentId: "",
    team1Id: "",
    team2Id: "",
    date: "",
    score1: "",
    score2: "",
  }}


  },
  computed: {
    isAuthenticated() {
      return this.connected !== null;
    },
  },
  async mounted() {
    await this.fetchMatch();
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

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-top: 200px; 
  color: #1f2937;
  padding: 20px;
}

h2 {
  font-size: 2.5rem;
  margin: 0;
  font-weight: bold;
  color: #111827;
  letter-spacing: 1px;
  margin-bottom: 15px;
}

p {
  font-size: 1.2rem;
  color: #374151;
  max-width: 600px;
  line-height: 1.6;
}

.cards-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 50px;
}

.card-container {
  text-align: center;
  overflow: hidden;
}

.card {
  width: 200px;
  height: 300px;
  perspective: 1000px;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 1s;
  transform-style: preserve-3d;
}

.card:hover .card-inner {
  transform: rotateY(180deg);
}

.card-front, .card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border-radius: 10px;
  padding: 10px;
}

.card-front {
  background-color: #85929e ;
  color: white;
}

.card-back {
  background-color: #f2f2f2;
  color: black;
  transform: rotateY(180deg);
  border: 1px solid #ddd;
}

.card h2 {
  font-size: 18px;
  margin: 0;
}

.card-back p {
  margin: 5px 0;
}

/* Carte "ajouter match" */
.add-card {
  width: 200px;
  height: 300px;
  background-color: #85929e;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Empêche la carte d'ajouter un match de se retourner */
.no-flip .card-inner {
  transform: none !important;
  transition: none !important;
}

.add-match-button {
  font-size: 24px;
  background-color: #374151;
  color: white;
  border: none;
  padding: 20px;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.add-match-button:hover {
  background-color: #1f2937;
}

.delete-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: transparent;
  color: #f44336;
  border: none;
  font-size: 24px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.delete-btn:hover {
  color: #d32f2f;
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

label {
  display: block;
  margin-top: 10px;
  font-weight: bold;
  text-align: left;
}

select,
input {
  display: block;
  margin: 5px auto 15px auto;
  padding: 8px;
  width: 90%;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

button {
  padding: 10px 15px;
  font-size: 16px;
  background-color: #2874a6;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin: 5px;
}

button:hover {
  background-color: #1c5980;
}

</style>