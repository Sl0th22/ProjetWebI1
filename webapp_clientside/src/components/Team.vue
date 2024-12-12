<template>
  <div>
    <!-- Navbar -->
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
    <div><br></div>

    <!-- Action Buttons -->
    <div class="edit-buttons">
      <button @click="showAddModal = true">Add New Team</button>
      <button @click="showDeleteModal = true">Delete Team</button>
    </div>

    <!-- Team List -->
    <div class="team-card-container">
      <h1>List of your Teams</h1>
      <div class="team-cards-wrapper">
        <router-link
          class="team-card"
          v-for="team in teams"
          :key="team.team_id"
          :to="{ name: 'Players', params: { team_id: team.team_id } }">
          <div class="team-card-inner">
            <div class="team-card-front">
              <h2>{{ team.team_name }}</h2>
              <p><strong>Coach :</strong> {{ team.team_coach }}</p>
            </div>
            <div class="team-card-back">
              <p><strong>Captain :</strong>{{ team.team_captain_firstname }} {{ team.team_captain_lastname }}</p>
              <p><strong>Date of creation :</strong> {{ formatDate(team.team_creation_date) }}</p>
              <p><strong>Localisation :</strong> {{ team.team_location }}</p>
              <p><strong>Number of players :</strong> {{ team.team_number }}</p>
    </div>
  </div>
</router-link>
      </div>
    </div>

<!-- Add Team Modal -->
<div v-if="showAddModal" class="modal">
  <div class="modal-content">
    <h3>Add New Team</h3>
    <form @submit.prevent="addTeam">
      <input v-model="newTeam.team_name" type="text" placeholder="Team Name" required />
      <input v-model="newTeam.team_coach" type="text" placeholder="Coach" required />
      <input v-model="newTeam.team_captain_firstname" type="text" placeholder="Captain First Name" required />
      <input v-model="newTeam.team_captain_lastname" type="text" placeholder="Captain Last Name" required />
      <input v-model="newTeam.team_location" type="text" placeholder="Location" required />
      <input v-model="newTeam.team_number" type="number" placeholder="Number of Players" required />
      <input v-model="newTeam.team_creation_date" type="date" required />
      <button type="submit">Add Team</button>
      <button @click="showAddModal = false">Cancel</button>
    </form>

    <!-- Add Player Captain form if not exist-->
    <div v-if="showCaptainForm">
      <h4>New Captain Information</h4>
      <input v-model="newCaptain.player_mail" type="email" placeholder="Captain Email" required />
      <input v-model="newCaptain.player_age" type="number" placeholder="Captain Age" required />
      <input v-model="newCaptain.player_phone_number" type="text" placeholder="Captain Phone Number" required />
      <button @click="saveCaptain">Save Captain</button>
    </div>
  </div>
</div>

<!-- Delete Team-->
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
import axios from "axios";

export default {
  data() {
    return {
      userRole : localStorage.getItem("userRole"),
      showAddModal: false,
      showDeleteModal: false,

      // We use  newTeam to store the data of the new team to be added
      newTeam: {
        team_name: "",
        team_coach: "",
        team_captain_firstname: "",
        team_captain_lastname: "",
        team_location: "",
        team_number: 1,
        team_creation_date: ""
      },

      // We use newCaptain to store the data of the new captain to be added
      newCaptain: {
        player_mail: "",
        player_age: "",
        player_phone_number: ""
      },

      // We store the variable we need to delete, show the form, and the list of teams
      teamNameToDelete: "",
      teams: [], // we put there the list of the teams with the fetchTeams function
      captainExists: true, // we suppose that the captain exists by default and we'll check for it after
      showCaptainForm: false 
    };
  },
  methods: {
    async fetchTeams() {
      try {
        const response = await axios.get("http://localhost:3000/api/teams"); // we go to the route of route.get from the teamapi.route.js
        this.teams = response.data;
      } catch (error) {
        console.error("Error when we load the teams : ", error);
      }
    },


    async checkCaptainExistence() {
      try {
        const { team_captain_firstname, team_captain_lastname } = this.newTeam;  // For this function, we only needs the name of the captain so we take it from the newTeam
        const response = await axios.get(
          `http://localhost:3000/api/players?firstname=${team_captain_firstname}&lastname=${team_captain_lastname}`
        ); // We use the route.get from the playerapi.route.js
        this.captainExists = response.data.exists;
        this.showCaptainForm = !this.captainExists;
      } catch (error) {
        console.error("Error while verfiying the captain : ", error);
      }
    },

    async addTeam() {
  try {
    await this.checkCaptainExistence(); // Verify if our captain exists

    //------------------------- Case where the captain doesn't exist -------------------------
    if (!this.captainExists) {
      alert("Your captain doestn't exist in the database. Please add it first.");
      this.showCaptainForm = true; 
      return; // we need to put this return to stop the function if the captain doesn't exist
    }

    //------------------------- Case where the captain exists -------------------------
    const response = await axios.post("http://localhost:3000/api/teams", this.newTeam); // we go to the route.post from the teamapi.route.js

    //------------------------- We add the team to the belong table -------------------------
    await axios.post("http://localhost:3000/api/belong", {
      team_name: this.newTeam.team_name,
      team_captain_firstname: this.newTeam.team_captain_firstname,
      team_captain_lastname: this.newTeam.team_captain_lastname,
    });


    //------------------------- We reset the form and show a success message -------------------------
    alert("Team successfully added !");
    this.fetchTeams(); 
    this.resetNewTeam();
    this.showAddModal = false;
  } catch (error) {
    console.error("Error while adding team : ", error);
    alert("An error occured while adding your team. Retry.");
  }

  },
  async saveCaptain() {
  try {
    //------------------------- Check if the fields are filled -------------------------
    if (!this.newTeam.team_captain_firstname || !this.newTeam.team_captain_lastname) {
      alert("The first name and the last name of the captain are required.");
      return;
    }
    if (!this.newCaptain.player_mail || !this.newCaptain.player_age || !this.newCaptain.player_phone_number) {
      alert("The email, the age and the phone number of the captain are required.");
      return;
    }

    //------------------------- Add the captain -------------------------
    const response = await axios.post("http://localhost:3000/api/players", {
      first_name: this.newTeam.team_captain_firstname,
      last_name: this.newTeam.team_captain_lastname,
      email: this.newCaptain.player_mail,
      age: parseInt(this.newCaptain.player_age),
      phone_number: parseInt(this.newCaptain.player_phone_number),
    });


    alert("Successfully added the captain!");
    this.captainExists = true;
    this.showCaptainForm = false;
  } catch (error) {
    console.error("Error while adding the captain: ", error.response || error.message);
    alert("Please retry to add the captain.");
  }
},


async deleteTeam() {
  try {
    // -------------------------------------- Delete the team from the belong table --------------------------------------

    const response1 = await axios.delete(`http://localhost:3000/api/belong`,{
      data: { team_name: this.teamNameToDelete }
    });

    console.log(response1);


    // -------------------------------------- Delete the team from the team table --------------------------------------
    const response = await axios.delete(`http://localhost:3000/api/teams/${this.teamNameToDelete}`); 


    alert("Successfully deleted the team !");
    this.fetchTeams(); // Refresh our list of teams
    this.teamNameToDelete = ""; 
    this.showDeleteModal = false; 
  } catch (error) {
    console.error("Error while deleting the team : ", error);

    if (error.response && error.response.status === 404) {
      alert("The team doesn't exists.");
    } else {
      alert("You have a match, you can't delete the team or contact an admin.");
    }
  }
},

resetNewTeam() {
  this.newTeam = {
    team_name: "",
    team_coach: "",
    team_captain_firstname: "",
    team_captain_lastname: "",
    team_location: "",
    team_number: 1,
    team_creation_date: ""
  };
  this.newCaptain = {
    player_mail: "",
    player_age: "",
    player_phone_number: ""
  };
  this.captainExists = true;
  this.showCaptainForm = false;
},

formatDate(dateString) { // Function to format the date to cut the time
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return new Date(dateString).toLocaleDateString(undefined, options);
},
logoutUser() {
      localStorage.removeItem("userRole");
      this.userRole = null;
      this.$router.push("/login");
    },
},
computed : {
  isAuthenticated() {
    return this.userRole !== null;
  },
},

async mounted() {
  await this.fetchTeams();
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