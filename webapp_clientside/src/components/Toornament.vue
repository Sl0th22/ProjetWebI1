<template>
  <div>
    <div>
      <nav>
        <ul>
          <li><router-link to="/">Accueil</router-link></li>
          <li v-if="connected === 'admin'">
            <button class="add" @click="showAddModal = true">Add Tournament</button>
          </li>
        </ul>
      </nav>
    </div>

    <div class="filter-container">
      <select v-model="selectedSport" @change="filter(selectedSport)">
        <option value="">All the sports</option>
        <option v-for="sport in sportsTypes" :key="sport" :value="sport">
          {{ sport }}
        </option>
      </select>
    </div>

    <div class="tournament-list">
      <button @click="switchconnect">Connected: {{ connected }}</button>
      <hr />
      <div v-for="tournoi in filteredTournaments" :key="tournoi.nom + connected" class="tournament-item">
        <div class="title-container">
          <h2>{{ tournoi.nom }}</h2>
          <button v-if="connected === 'admin'" class="delT" @click="deleteT(tournoi)">X</button>
        </div>

        <p>Start date: {{ tournoi.dateS }}</p>
        <p>End date: {{ tournoi.dateE }}</p>
        <p>Number of places: {{ tournoi.place }} / {{ tournoi.maxEquipes }}</p>
        <p>Type: {{ tournoi.type }}</p>

        <div v-if="connected === 'admin' || connected === 'user'">
          <button v-if="tournoi.place >= tournoi.maxEquipes" disabled>Complete</button>
          <button v-else @click="register(tournoi)">Register</button>
        </div>
        <hr />
      </div>
    </div>

    <div v-if="showAddModal" class="modal">
      <div class="modal-content">
        <h3>Add a Tournament</h3>
        <form @submit.prevent="addTournament">
          <input v-model="newTournament.nom" placeholder="Tournament Name" required />
          <input v-model="newTournament.dateS" type="date" required />
          <input v-model="newTournament.dateE" type="date" required />
          <input v-model.number="newTournament.place" type="number" min="0" placeholder="Current Teams" required />
          <input v-model.number="newTournament.maxEquipes" type="number" placeholder="Max Teams" required />
          <input v-model="newTournament.type" placeholder="Sport Type" required />
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
          nom: "Championnat des Étoiles",
          dateS: "2024-11-01",
          dateE: "2024-11-10",
          place: 16,
          maxEquipes: 32,
          type: "Volley-ball"
        },
        {
          nom: "Coupe d'Hiver",
          dateS: "2024-12-05",
          dateE: "2024-12-20",
          place: 8,
          maxEquipes: 16,
          type: "Football"
        },
        {
          nom: "Tournoi des Champions",
          dateS: "2025-01-15",
          dateE: "2025-01-30",
          place: 10,
          maxEquipes: 10,
          type: "Basket-ball"
        },
        {
          nom: "Compétition Printanière",
          dateS: "2025-03-10",
          dateE: "2025-03-15",
          place: 20,
          maxEquipes: 24,
          type: "Table tennis"
        },
        {
          nom: "Open International",
          dateS: "2025-04-05",
          dateE: "2025-04-20",
          place: 40,
          maxEquipes: 64,
          type: "Football"
        }
      ],
      selectedSport: "",
      connected: "visitor",
      showAddModal: false,
      newTournament: {
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
      const types = this.Toornament.map(tournoi => tournoi.type);
      const distinct = [];
      for (let i = 0; i < types.length; i++) {
        let isDuplicate = false;
        for (let j = 0; j < distinct.length; j++) {
          if (types[i] === distinct[j]) {
            isDuplicate = true;
            break;
          }
        }
        if (!isDuplicate) {
          distinct.push(types[i]);
        }
      }
      return distinct;
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
      // Incrémenter le nombre d'équipes inscrites
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
      const newTournaments = [];
      for (let i = 0; i < this.Toornament.length; i++) {
        if (this.Toornament[i] !== tournoi) {
          newTournaments.push(this.Toornament[i]);
        }
      }
      this.Toornament = newTournaments;
    },
    addTournament() {
      this.Toornament.push({ ...this.newTournament });
      this.resetNewTournament();
      this.showAddModal = false;
    },
    resetNewTournament() {
      this.newTournament = {
        nom: "",
        dateS: "",
        dateE: "",
        place: 0,
        maxEquipes: 1,
        type: ""
      };
    }
  }
};
</script>

<style scoped>
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

a {
  text-decoration: none;
  color: black;
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
  padding: 5px 10px;
  font-size: 16px;
  background: none;
  border: none;
  color: black;
  cursor: pointer;

}

</style>
