<template>
    <div class="card-container" >
      <h1>List of Players</h1>
      <div class="cards-wrapper">
        <div class="card" v-for="player in players" :key="player.player_id">
          <div class="card-inner">
            <div class="card-front">
              <h2>{{ player.player_first_name }} {{ player.player_last_name }}</h2>
            </div>
            <div class="card-back">
              <p><strong>Email :</strong> {{ player.player_mail }}</p>
              <p><strong>Age :</strong> {{ player.player_age }}</p>
              <p><strong>Telephone Number :</strong> {{ player.player_phone_number }}</p>
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
        players: [
          { player_id: 'P001', player_last_name: 'Doe', player_first_name: 'John', player_mail: 'john.doe@example.com', player_age: 28, player_phone_number: 1234567890 },
          { player_id: 'P002', player_last_name: 'Smith', player_first_name: 'Jane', player_mail: 'jane.smith@example.com', player_age: 24, player_phone_number: 1234567891 },
          { player_id: 'P003', player_last_name: 'Brown', player_first_name: 'Charlie', player_mail: 'charlie.brown@example.com', player_age: 30, player_phone_number: 1234567892 },
          { player_id: 'P004', player_last_name: 'Taylor', player_first_name: 'Emma', player_mail: 'emma.taylor@example.com', player_age: 26, player_phone_number: 1234567893 },
          { player_id: 'P005', player_last_name: 'Johnson', player_first_name: 'Oliver', player_mail: 'oliver.johnson@example.com', player_age: 29, player_phone_number: 1234567894 },
          { player_id: 'P006', player_last_name: 'Williams', player_first_name: 'Sophia', player_mail: 'sophia.williams@example.com', player_age: 27, player_phone_number: 1234567895 },
          { player_id: 'P007', player_last_name: 'Jones', player_first_name: 'Liam', player_mail: 'liam.jones@example.com', player_age: 25, player_phone_number: 1234567896 },
          { player_id: 'P008', player_last_name: 'Garcia', player_first_name: 'Ava', player_mail: 'ava.garcia@example.com', player_age: 31, player_phone_number: 1234567897 },
          { player_id: 'P009', player_last_name: 'Miller', player_first_name: 'Isabella', player_mail: 'isabella.miller@example.com', player_age: 23, player_phone_number: 1234567898 },
          { player_id: 'P010', player_last_name: 'Davis', player_first_name: 'Mason', player_mail: 'mason.davis@example.com', player_age: 32, player_phone_number: 1234567899 }
        ]
      };
    }
  };
  </script>
  
  <style>
  .cards-wrapper { /* la bande contenant les cartes */
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 50px;
  }
  
  .card-container { /* toute la boîte avec même la liste des joueurs commme titre */
    text-align: center;
    overflow: hidden;
  }
  
  .card {
    width: 200px;
    height: 300px;
    perspective: 1000px; /* permet de mieux voir quand ca tourne comme si c'était loin */ 
  }
  
  .card-inner { /* intérieur de la carte*/ 
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
    backface-visibility: hidden; /* permet de cacher la face arrière lorsqu'on tourne pour les deux sinon on voit à l'envers */
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
  </style>