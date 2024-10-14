<template>
    <div class="card-container" >
      <h1>Liste des Matchs</h1>
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
        }
      ]
    };
  }
};
</script>

<style scoped>

.cards-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
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
  transition: transform 0.6s;
  transform-style: preserve-3d;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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