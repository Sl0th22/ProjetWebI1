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

    <div class="card-container" >
      <h1>List of the Matchs</h1>
      <div class="cards-wrapper">
        <div class="card" v-for="match in matches" :key="match.match_id">
          <div class="card-inner">
            <div class="card-front">
              <h2>{{ match.team1 }} <strong>VS</strong> {{ match.team2 }}</h2>
            </div>
            <div class="card-back">
              <p><strong>Date :</strong> {{ match.match_date }}</p>
              <p><strong>Tournament ID :</strong> {{ match.tournament_id }}</p>
              <p><strong>Score {{ match.team1 }} :</strong> {{ match.score_team1 }}</p>
              <p><strong>Score {{ match.team2 }} :</strong> {{ match.score_team2 }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
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
            team1 : 'Le Tigre dormant',
            team2 : 'La Tortue mangeuse de chats',
            match_date: '2024-05-05',
            score_team1: 1,
            score_team2: 0,
            tournament_id: 'T001'
        },
        
      ]
    };
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
</style>