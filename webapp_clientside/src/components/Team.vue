<template>
  <div>
    <div>
      <nav>
      <ul>
        <li><router-link to="/">Accueil</router-link></li>
        <li><router-link to="/match"> List of your matchs </router-link></li>
      </ul>
    </nav>
  </div>
  <div class="team-card-container">
    <h1>List of your Teams</h1>
    <div class="team-cards-wrapper">
      <router-link
        class="team-card"
        v-for="team in teams" :key="team in teams":to="{ name: 'Players', params: { id: team.team_id } }">
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
</div>
</template>

<script>
export default {
  data() {
    return {
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
  }
};
</script>

<style scoped>
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
  color: black;
  transform: rotateY(180deg);
  border: 1px solid #ddd;
}

.team-card h2 {
  font-size: 20px;
  margin: 0;
}

.team-card p {
  margin: 5px 0;
}
</style>
