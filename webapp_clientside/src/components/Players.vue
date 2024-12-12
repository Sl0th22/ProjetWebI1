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
      <h1>List of Players</h1>

      <!-- Buttons for edit, delete, and add player -->
      <div class="Edit">
        <button @click="dlt">Delete</button>
        <button @click="Edit">{{ isEditing ? 'Save' : 'Edit' }}</button>
        <button @click="toggleAddPlayer">{{ isAdding ? 'Cancel' : 'Add' }}</button>
      </div>

      <!-- Modal for deleting a player -->
      <div v-if="isDeleting" class="modal">
  <div class="modal-content">
    <h3>Delete Player from Team</h3>
    <select v-model="selectedPlayerId">
      <option v-for="player in players" :value="player.player_id" :key="player.player_id">
        {{ player.player_first_name }} {{ player.player_last_name }}
      </option>
    </select>
    <button @click="deletePlayer">Confirm Delete</button>
    <button @click="isDeleting = false">Cancel</button>
  </div>
</div>

      <!-- Modal for adding a new player -->
      <div v-if="isAdding" class="modal">
        <div class="modal-content">
          <h3>Add New Player</h3>
          <form @submit.prevent="addPlayer">
            <input v-model="newPlayer.player_first_name" type="text" placeholder="First Name" required />
            <input v-model="newPlayer.player_last_name" type="text" placeholder="Last Name" required />
            <input v-model="newPlayer.player_mail" type="email" placeholder="Email" required />
            <input v-model="newPlayer.player_age" type="number" placeholder="Age" required />
            <input v-model="newPlayer.player_phone_number" type="text" placeholder="Phone Number" required />
            <button type="submit">Add</button>
            <button @click="isAdding = false">Cancel</button>
          </form>
          <div v-if="addPlayerError" class="error">{{ addPlayerError }}</div>
        </div>
      </div>

      <!-- Notifications for success or error messages -->
      <div class="notification">
        <div v-if="notification.length > 0">
          <div v-for="msg in notification" :key="msg.id" :class="msg.type === 'error' ? 'error' : 'success'">{{ msg.text }}</div>
        </div>
      </div>

      <!-- Cards to display player information -->
      <div class="cards-wrapper">
        <div class="card" v-for="player in players" :key="player.player_id">
          <div class="card-inner">
            <div class="card-front">
              <h2>{{ player.player_first_name }} {{ player.player_last_name }}</h2>
            </div>
            <div class="card-back">
              <p><strong>ID:</strong> {{ player.player_id }}</p>
              <p><strong>Email:</strong>
                <span v-if="isEditing">
                  <input type="text" v-model="player.player_mail" />
                  <span v-if="emailErrors[player.player_id]" class="error">{{ emailErrors[player.player_id] }}</span>
                </span>
                <span v-else>{{ player.player_mail }}</span>
              </p>
              <p><strong>Age:</strong>
                <span v-if="isEditing">
                  <input type="number" v-model="player.player_age" min="1" />
                  <span v-if="ageErrors[player.player_id]" class="error">{{ ageErrors[player.player_id] }}</span>
                </span>
                <span v-else>{{ player.player_age }}</span>
              </p>
              <p><strong>Phone Number:</strong>
                <span v-if="isEditing">
                  <input type="text" v-model="player.player_phone_number" />
                  <span v-if="phoneErrors[player.player_id]" class="error">{{ phoneErrors[player.player_id] }}</span>
                </span>
                <span v-else>{{ player.player_phone_number }}</span>
              </p>
            </div>
          </div>
        </div>
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
      selectedPlayerId: null,
      id: '',
      team_id: null,
      isDeleting: false,
      isEditing: false,
      isAdding: false,
      notification: [],
      addPlayerError: '',
      newPlayer: {
        player_first_name: '',
        player_last_name: '',
        player_mail: '',
        player_age: null,
        player_phone_number: ''
      },
      players: [],
      emailErrors: {},
      ageErrors: {},
      phoneErrors: {}
    };
  },
  methods: {
    // Fetch player data from the API
    async fetchPlayers() {
      try {
        const response = await axios.get(`http://localhost:3000/api/players/team/${this.team_id}`); // we go to the route of route.get from the playerapi.route.js
        this.players = response.data;
      } catch (error) {
        console.error("Error when we load the teams : ", error);
      }
    },

    async updatePlayer(player) {
  try {
    const response = await axios.put(`http://localhost:3000/api/players/${player.player_id}`, {
      player_mail: player.player_mail,
      player_age: player.player_age,
      player_phone_number: player.player_phone_number
    });
    if (response.status === 200) {
      this.notification.push({ id: Date.now(), text: 'Player updated successfully!', type: 'success' });
      this.autoDismissNotification();
      this.isEditing = false;
    }
  } catch (error) {
    console.error("Error updating player:", error);
    this.notification.push({ id: Date.now(), text: 'Error updating player.', type: 'error' });
    this.autoDismissNotification();
  }
},


    // Toggle edit mode for player information
Edit() {
  if (this.isEditing) {
    let hasErrors = false;
    this.players.forEach(player => {
      if (player.player_age < 1) {
        this.ageErrors[player.player_id] = 'Age must be at least 1.';
        hasErrors = true;
      }
      if (!this.validateEmail(player.player_mail)) {
        this.emailErrors[player.player_id] = 'Invalid email format.';
        hasErrors = true;
      }
      if (player.player_phone_number.length < 10) {
        this.phoneErrors[player.player_id] = 'Phone number must be at least 10 digits.';
        hasErrors = true;
      }
    });
    if (!hasErrors) {
      this.players.forEach(player => {
        this.updatePlayer(player);
      });
    } else {
      this.notification.push({ id: Date.now(), text: 'Please correct the errors before saving.', type: 'error' });
      this.autoDismissNotification();
    }
  } else {
    this.isEditing = true;
  }
},

    // Toggle add player modal
    toggleAddPlayer() {
      this.isAdding = !this.isAdding;
      this.resetNewPlayer();
      this.addPlayerError = '';
    },

    // Reset new player fields
    resetNewPlayer() {
      this.newPlayer = {
        player_first_name: '',
        player_last_name: '',
        player_mail: '',
        player_age: null,
        player_phone_number: ''
      };
    },

    async fetchTeamName(team_id) {
    try {
  
      const response = await axios.get(`http://localhost:3000/api/teams/${team_id}`);
      if (response.status === 200 && response.data) {
        return response.data.team_name; 
      } else {
        console.error("No team found with this ID.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching team name:", error);
      return null;
    }
  },

    // Add a new player to the list
    async addPlayer() {
  try {
    const playerResponse = await axios.post("http://localhost:3000/api/players", {
      first_name: this.newPlayer.player_first_name,
      last_name: this.newPlayer.player_last_name,
      email: this.newPlayer.player_mail,
      age: this.newPlayer.player_age,
      phone_number: this.newPlayer.player_phone_number
    });

    if (playerResponse.status === 201) {
      const player = playerResponse.data;
      console.log("Player added:", player);
      const teamName = await this.fetchTeamName(this.team_id);
      console.log("Team name:", teamName);

      if (teamName) {
        const belongResponse = await axios.post("http://localhost:3000/api/belong", {
          team_name: teamName,
          team_captain_firstname: this.newPlayer.player_first_name,
          team_captain_lastname: this.newPlayer.player_last_name
        })


        if (belongResponse.status === 201) {
          this.notification.push({ id: Date.now(), text: 'Player and relation added successfully!', type: 'success' });
        }
      } else {
        throw new Error("Team name not found.");
      }
    }
  } catch (error) {
    console.error("Error adding player or relation:", error);
    this.notification.push({ id: Date.now(), text: 'Error adding player or relation.', type: 'error' });
  } finally {
    this.autoDismissNotification();
    this.isAdding = false;
    this.fetchPlayers();
  }
},
    
    // Delete player by ID
    async deletePlayer() {
      try {
        const teamName = await this.fetchTeamName(this.team_id);

        if (!teamName || !this.selectedPlayerId) {
          throw new Error("Team name or player ID is missing.");
        }
        console.log("Deleting player from team:", teamName, this.selectedPlayerId);
        const belongResponse = await axios.delete(`http://localhost:3000/api/belong/${teamName}/${this.selectedPlayerId}`, {});

        if (belongResponse.status === 200) {
          this.notification.push({
            id: Date.now(),
            text: "Player removed from team successfully!",
            type: "success",
          });
        }
        this.fetchPlayers(); 
        this.isDeleting = false;
      } catch (error) {
        console.error("Error removing player from team:", error);
        this.notification.push({
          id: Date.now(),
          text: "Error removing player from team.",
          type: "error",
        });
      } finally {
        this.autoDismissNotification();
      }
    },

    // Show delete modal
    dlt() {
      this.isDeleting = true;
    },

    // Auto dismiss notification after a few seconds
    autoDismissNotification() {
      setTimeout(() => {
        this.notification = [];
      }, 5000);
    },

    // Validate email format
    validateEmail(email) {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailPattern.test(email);
    },
    logoutUser() {
      localStorage.removeItem("userRole"); // Remove the role from storage
      this.userRole = null;
      this.$router.push("/login");
    },
  },
  computed: {
    // Check if the user is authenticated
    isAuthenticated() {
      return this.userRole !== null;
    },
  },

  mounted() {
    this.team_id = this.$route.params.team_id;
    this.fetchPlayers();
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


.card-container {
  text-align: center;
  overflow: hidden;
}

.cards-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 50px;
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

.card-front,
.card-back {
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
  background-color: #85929e;
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

.Edit {
  margin: 20px 0;
}

.Edit button,
.submit-button, button {
  padding: 10px 15px;
  font-size: 16px;
  background-color: #85929e;
  color: white; 
  border: none; 
  border-radius: 5px; 
  cursor: pointer; 
  transition: background-color 0.3s; 
}

.Edit button:hover,
.submit-button:hover,button:hover {
  background-color: #6e7780; 
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  text-align: center;
}

.modal-content input {
  width: 80%;
  padding: 10px;
  margin: 5px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.modal-content button {
  margin-top: 10px;
  padding: 10px 15px;
  background-color: #85929e;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.modal-content button:hover {
  background-color: #6e7780;
}

.notification {
  margin: 10px;
}

.success {
  color: green;
  font-weight: bold;
}

.error {
  color: red; 
  font-weight: bold;
}

</style>
