<template>
  <div>
    <header class="navbar">
      <div class="navbar-left">
        <img src="@/assets/Sport_tournament.png" alt="Sport Tournament Logo" class="logo" />
        <h1 class="site-title">The Sport Tournament</h1>
      </div>
      <nav class="nav-links">
        <ul>
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/toornament">Toornament</router-link></li>
          <li><router-link to="/match">Match</router-link></li>
          <li><router-link to="/team">Team</router-link></li>
          <li><router-link to="/Players">Player</router-link></li>
          <li><router-link to="/login">Login</router-link></li>
        </ul>
      </nav>
    </header>
    <div>
<br>
    </div>

    <div class="edit-buttons">
      <button @click="showAddModal = true">Add New Team</button>
      <button @click="showDeleteModal = true">Delete Team</button>
    </div>

    <div class="team-card-container">
      <h1>List of your Teams</h1>
      <div class="team-cards-wrapper">
        <router-link
          class="team-card"
          v-for="team in teams" :key="team.team_id"
          :to="{ name: 'Players', params: { id: team.team_id } }">
          <div class="team-card-inner">
            <div class="team-card-front">
              <h2>{{ team.team_name }}</h2>
              <p><strong>Coach :</strong> {{ team.team_coach }}</p>
            </div>
            <div class="team-card-back">
              <p><strong>Captain :</strong> {{ team.team_captain }}</p>
              <p><strong>Date of creation :</strong> {{ team.team_creation_date }}</p>
              <p><strong>Localisation :</strong> {{ team.team_location }}</p>
              <p><strong>Number of players :</strong> {{ team.team_number }}</p>
            </div>
          </div>
        </router-link>
      </div>
    </div>

    <div v-if="showAddModal" class="modal">
      <div class="modal-content">
        <h3>Add New Team</h3>
        <form @submit.prevent="addTeam">
          <input v-model="newTeam.team_name" type="text" placeholder="Team Name" required />
          <input v-model="newTeam.team_coach" type="text" placeholder="Coach" required />
          <input v-model="newTeam.team_captain" type="text" placeholder="Captain" required />
          <input v-model="newTeam.team_location" type="text" placeholder="Location" required />
          <input v-model="newTeam.team_number" type="number" placeholder="Number of Players" required />
          <input v-model="newTeam.team_creation_date" type="date" required />
          <button type="submit">Add</button>
          <button @click="showAddModal = false">Cancel</button>
        </form>
      </div>
    </div>

    <div v-if="showDeleteModal" class="modal">
      <div class="modal-content">
        <h3>Delete Team</h3>
        <input v-model="teamNameToDelete" type="text" placeholder="Team Name to Delete" required />
        <button @click="deleteTeam">Delete</button>
        <button @click="showDeleteModal = false">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showAddModal: false,
      showDeleteModal: false,
      newTeam: {
        team_name: '',
        team_coach: '',
        team_captain: '',
        team_location: '',
        team_number: '',
        team_creation_date: ''
      },
      teamNameToDelete: '',
      teams: [
        { team_id: 1, team_name: 'Lions', team_number: 11, team_creation_date: '2020-06-01', team_location: 'Paris', team_coach: 'Coach A', team_captain: 'John Doe' },
        { team_id: 2, team_name: 'Tigers', team_number: 11, team_creation_date: '2021-07-10', team_location: 'Berlin', team_coach: 'Coach A', team_captain: 'Jane Smith' },
        { team_id: 3, team_name: 'Bears', team_number: 11, team_creation_date: '2019-05-15', team_location: 'London', team_coach: 'Coach C', team_captain: 'Charlie Brown' },
        { team_id: 4, team_name: 'Wolves', team_number: 11, team_creation_date: '2022-09-01', team_location: 'New York', team_coach: 'Coach D', team_captain: 'Emma Taylor' },
        { team_id: 5, team_name: 'Eagles', team_number: 11, team_creation_date: '2020-08-25', team_location: 'Tokyo', team_coach: 'Coach E', team_captain: 'Oliver Johnson' },
        { team_id: 6, team_name: 'Panthers', team_number: 11, team_creation_date: '2021-11-12', team_location: 'Madrid', team_coach: 'Coach F', team_captain: 'Sophia Williams' },
        { team_id: 7, team_name: 'Sharks', team_number: 11, team_creation_date: '2021-05-30', team_location: 'Sydney', team_coach: 'Coach G', team_captain: 'Liam Jones' },
        { team_id: 8, team_name: 'Hawks', team_number: 11, team_creation_date: '2022-03-22', team_location: 'Rome', team_coach: 'Coach H', team_captain: 'Ava Garcia' },
        { team_id: 9, team_name: 'Dragons', team_number: 11, team_creation_date: '2018-10-19', team_location: 'Beijing', team_coach: 'Coach I', team_captain: 'Isabella Miller' },
        { team_id: 10, team_name: 'Cobras', team_number: 11, team_creation_date: '2020-12-05', team_location: 'Dubai', team_coach: 'Coach J', team_captain: 'Mason Davis' }
      ]
    };
  },
  methods: {
    addTeam() {
      if (!this.newTeam.team_name || !this.newTeam.team_coach || !this.newTeam.team_captain) {
        alert("All fields are required!");
        return;
      }

      const newTeamId = this.teams.length ? this.teams[this.teams.length - 1].team_id + 1 : 1;
      const teamToAdd = { ...this.newTeam, team_id: newTeamId };

      this.teams.push(teamToAdd);
      this.showAddModal = false;
      this.resetNewTeam();
    },
    deleteTeam() {
      const teamIndex = this.teams.findIndex(team => team.team_name === this.teamNameToDelete);
      if (teamIndex === -1) {
        alert("Team not found");
        return;
      }

      this.teams.splice(teamIndex, 1);
      this.showDeleteModal = false;
      this.teamNameToDelete = '';
    },
    resetNewTeam() {
      this.newTeam = {
        team_name: '',
        team_coach: '',
        team_captain: '',
        team_location: '',
        team_number: 1,
        team_creation_date: ''
      };
    }
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

ul {
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



.team-cards-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 50px;
}

.team-card-container {
  text-align: center;
  overflow: hidden;
}

.team-card {
  width: 250px;
  height: 350px;
  perspective: 1000px;
  text-decoration: none;
  color: inherit;
}

.team-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 1s;
  transform-style: preserve-3d;
}

.team-card:hover .team-card-inner {
  transform: rotateY(180deg);
}

.team-card-front, .team-card-back {
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

.team-card-front {
  background-color: #2874a6;
  color: white;
}

.team-card-back {
  background-color: #f2f2f2;
  transform: rotateY(180deg);
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

button {
  padding: 10px 15px;
  font-size: 16px;
  background-color: #2874a6;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #1c5980;
}
</style>