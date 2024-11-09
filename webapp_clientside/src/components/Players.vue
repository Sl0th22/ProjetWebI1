<template>
  <div class="card-container">
    <h1>List of Players</h1>

    <div class="Edit">
      <button v-on:click="dlt">Delete</button>
      <button v-on:click="Edit">{{ isEditing ? 'Save' : 'Edit' }}</button>
      <button v-on:click="toggleAddPlayer">{{ isAdding ? 'Cancel' : 'Add' }}</button>
    </div>

    <div v-if="isDeleting" class="modal">
      <div class="modal-content">
        <h3>Delete Player</h3>
        <input type="text" v-model="id" placeholder="ID of your player"/>
        <button @click="deletePlayer">Confirm Delete</button>
        <button @click="isDeleting = false">Cancel</button>
      </div>
    </div>

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

    <!-- Notification messages -->
    <div class="notification">
      <div v-if="notification.length > 0">
        <div v-for="msg in notification" :key="msg.id" :class="msg.type === 'error' ? 'error' : 'success'">{{ msg.text }}</div>
      </div>
    </div>

    <!-- Player Cards -->
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
</template>


<script>
export default {
  data() {
    return {
      isDeleting: false,
      isEditing: false, 
      isAdding: false,
      notification: [],
      addPlayerError: '',
      newPlayer: { 
        player_id: '',
        player_first_name: '',
        player_last_name: '',
        player_mail: '',
        player_age: null,
        player_phone_number: ''
      },
      players: [
        { player_id: 'P001', player_last_name: 'Doe', player_first_name: 'John', player_mail: 'john.doe@example.com', player_age: 28, player_phone_number: '1234567890' },
        { player_id: 'P002', player_last_name: 'Smith', player_first_name: 'Jane', player_mail: 'jane.smith@example.com', player_age: 24, player_phone_number: '1234567891' },
        { player_id: 'P003', player_last_name: 'Brown', player_first_name: 'Charlie', player_mail: 'charlie.brown@example.com', player_age: 30, player_phone_number: '1234567892' },
        { player_id: 'P004', player_last_name: 'Taylor', player_first_name: 'Emma', player_mail: 'emma.taylor@example.com', player_age: 26, player_phone_number: '1234567893' },
        { player_id: 'P005', player_last_name: 'Johnson', player_first_name: 'Oliver', player_mail: 'oliver.johnson@example.com', player_age: 29, player_phone_number: '1234567894' },
        { player_id: 'P006', player_last_name: 'Williams', player_first_name: 'Sophia', player_mail: 'sophia.williams@example.com', player_age: 27, player_phone_number: '1234567895' },
        { player_id: 'P007', player_last_name: 'Jones', player_first_name: 'Liam', player_mail: 'liam.jones@example.com', player_age: 25, player_phone_number: '1234567896' },
        { player_id: 'P008', player_last_name: 'Garcia', player_first_name: 'Ava', player_mail: 'ava.garcia@example.com', player_age: 31, player_phone_number: '1234567897' },
        { player_id: 'P009', player_last_name: 'Miller', player_first_name: 'Isabella', player_mail: 'isabella.miller@example.com', player_age: 23, player_phone_number: '1234567898' },
        { player_id: 'P010', player_last_name: 'Davis', player_first_name: 'Mason', player_mail: 'mason.davis@example.com', player_age: 32, player_phone_number: '1234567899' }
      ],
      emailErrors: {}, 
      ageErrors: {},
      phoneErrors: {}
    };
  },
  methods: {
    Edit() {
      if (this.isEditing) {
        this.notification = [];
        this.emailErrors = {}; 
        this.ageErrors = {}; 
        this.phoneErrors = {};

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
          this.notification.push({ id: Date.now(), text: 'Changes saved successfully!', type: 'success' });
          this.isEditing = false;
          this.autoDismissNotification();
        } else {
          this.notification.push({ id: Date.now(), text: 'Please correct the errors before saving.', type: 'error' });
          this.autoDismissNotification();
        }
      } else {
        this.isEditing = true;
      }
    },

    toggleAddPlayer() {
      this.isAdding = !this.isAdding; 
      this.resetNewPlayer(); 
      this.addPlayerError = '';
    },

    resetNewPlayer() {
      this.newPlayer = {
        player_id: '',
        player_first_name: '',
        player_last_name: '',
        player_mail: '',
        player_age: null,
        player_phone_number: ''
      };
    },

    addPlayer() {
  this.addPlayerError = '';
  if (!this.newPlayer.player_first_name || !this.newPlayer.player_last_name) {
    this.addPlayerError = 'First and last names are required.';
    return;
  }
  if (!this.validateEmail(this.newPlayer.player_mail)) {
    this.addPlayerError = 'Invalid email format.';
    return;
  }
  if (this.newPlayer.player_age < 1) {
    this.addPlayerError = 'Age must be at least 1.';
    return;
  }
  if (this.newPlayer.player_phone_number.length < 10) {
    this.addPlayerError = 'Phone number must be at least 10 digits.';
    return;
  }

  const lastPlayer = this.players[this.players.length - 1];
  const lastId = lastPlayer ? parseInt(lastPlayer.player_id.slice(1), 10) : 0;
  this.newPlayer.player_id = `P0${lastId + 1}`; 

  this.players.push({ ...this.newPlayer });

  this.resetNewPlayer();
  this.isAdding = false;
  this.notification.push({ id: Date.now(), text: 'Player added successfully!', type: 'success' });
  this.autoDismissNotification();
},


    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(String(email).toLowerCase());
    },

    autoDismissNotification() {
      setTimeout(() => {
        this.notification.pop(); 
      }, 2000); 
    },

    dlt(){
      this.isDeleting = !this.isDeleting;

    },

    deletePlayer() {
      const playerIndex = this.players.findIndex(player => player.player_id === this.id);
      if (playerIndex !== -1) {
        this.players.splice(playerIndex, 1);
        this.notification.push({ id: Date.now(), text: 'Player deleted successfully!', type: 'success' });
      } else {
        this.notification.push({ id: Date.now(), text: 'Player ID not found!', type: 'error' });
      }
      this.id = '';
      this.isDeleting = false; 
      this.autoDismissNotification(); 
    }
  }
};
</script>

<style scoped>
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

/* Modal Styles */
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
