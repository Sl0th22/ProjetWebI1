<template>
    <div>
        <div>
      <nav>
      <ul>
        <li><router-link to="/">Accueil</router-link></li>
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
        <div v-for="tournoi in filteredTournaments" :key="tournoi.nom">
          <h2>{{ tournoi.nom }}</h2>
          <p>Start date : {{ tournoi.dateS }}</p>
          <p>End date : {{ tournoi.dateE }}</p>
          <p>Number of places : {{ tournoi.place }} / {{ tournoi.maxEquipes }}</p>
          <p>Type : {{ tournoi.type }}</p>
          
          <button v-if="tournoi.place >= tournoi.maxEquipes" disabled>Complet</button>
          <button v-else @click="register(tournoi)">Register</button>
          
          <hr />
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
        selectedSport: ""
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
        alert(`You have registered for the ${tournoi.nom} tournament!`);
      }
    }
  };
  </script>
  
  <style>
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
</style>