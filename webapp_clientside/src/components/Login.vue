<template>
  <div class="auth-page">
    <header class="navbar">
      <div class="navbar-left">
        <img src="@/assets/Sport_tournament.png" alt="Sport Tournament Logo" class="logo" />
        <h1 class="site-title">The Sport Toornament</h1>
      </div>
      <nav class="nav-links">
        <ul>
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/toornament">Toornament</router-link></li>
          <li v-if="isUserOrAdmin"><router-link to="/match">Match</router-link></li>
          <li v-if="isUserOrAdmin"><router-link to="/team">Team</router-link></li>
          <li v-if="!isAuthenticated"><router-link to="/login">Login</router-link></li>
          <li v-if="isAuthenticated"><button @click="logoutUser">Logout</button></li>
        </ul>
      </nav>
    </header>

    <main class="content">
      <h2>{{ currentFormTitle }}</h2>
      <div class="form-switcher">
        <button @click="switchForm('login')" :class="{ active: currentForm === 'login' }">Login</button>
        <button @click="switchForm('register')" :class="{ active: currentForm === 'register' }">Register</button>
        <button @click="switchForm('resetPassword')" :class="{ active: currentForm === 'resetPassword' }">Reset Password</button>
      </div>

      <!-- Login Form -->
      <form v-if="currentForm === 'login'" @submit.prevent="loginUser">
        <input type="text" v-model="log" placeholder="Username" required />
        <input type="password" v-model="pssw" placeholder="Password" required />
        <button type="submit">Login</button>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      </form>

      <!-- Register Form -->
      <form v-if="currentForm === 'register'" @submit.prevent="registerUser">
        <input type="text" v-model="newUsername" placeholder="Username" required />
        <input type="password" v-model="newPassword" placeholder="Password" required />
        <input type="password" v-model="confirmPassword" placeholder="Confirm Password" required />
        <button type="submit">Register</button>
        <p v-if="registerError" class="error-message">{{ registerError }}</p>
        <p v-if="registerSuccess" class="success-message">{{ registerSuccess }}</p>
      </form>

      <!-- Reset Password Form -->
      <form v-if="currentForm === 'resetPassword'" @submit.prevent="resetPassword">
        <input type="text" v-model="resetLog" placeholder="Username" required />
        <input type="password" v-model="oldPssw" placeholder="Old Password" required />
        <input type="password" v-model="newPssw" placeholder="New Password" required />
        <button type="submit">Reset Password</button>
        <button type="button" @click="CancelReset">Cancel</button>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      </form>
    </main>
  </div>
</template>

<script>
export default {
  name: 'AuthenticationDemo',
  data() {
    return {
      currentForm: 'login', 
      log: '',
      pssw: '',
      errorMessage: '',
      successMessage: '',

      newUsername: '',
      newPassword: '',
      confirmPassword: '',
      registerError: '',
      registerSuccess: '',

      resetLog: '',
      oldPssw: '',
      newPssw: '',
    };
  },
  computed: {
    isAuthenticated() {
      return localStorage.getItem('userRole') !== null;
    },

    isUserOrAdmin() {
      const role = localStorage.getItem('userRole');
      return role === 'user' || role === 'admin';
    },
    currentFormTitle() {
      if (this.currentForm === 'login') return 'Login';
      if (this.currentForm === 'register') return 'Register';
      if (this.currentForm === 'resetPassword') return 'Reset Password';
    },
  },
  methods: {
    async loginUser() {
  try {
    const response = await this.$http.post('http://localhost:3000/auth/login', {
      username: this.log,
      userpass: this.pssw,
    });

    if (response.data.loginResult) {
      localStorage.setItem('userRole', response.data.role); // store the role in local storage (most important part)
      localStorage.setItem('username', response.data.username);
      this.successMessage = 'Connexion established !';

      setTimeout(() => {
        this.$router.push('/');
      }, 1000);
    } else {
      this.errorMessage = 'Username or password is incorrect.';
    }
  } catch (error) {
    console.error(error);
    this.errorMessage = 'An error occurred. Please try again.';
  }
},


    async registerUser() {
      const { newUsername, newPassword, confirmPassword } = this;
      if (newPassword !== confirmPassword) {
        this.registerError = 'The passwords do not match.';
      } else {
        try {
          const response = await this.$http.post('http://localhost:3000/auth/register', {
            username: newUsername,
            password: newPassword,
          });
          this.registerSuccess = response.data.message;
          this.registerError = '';
          this.newUsername = '';
          this.newPassword = '';
          this.confirmPassword = '';
        } catch (error) {
          this.registerError = error.response.data.error;
          this.registerSuccess = '';
        }
      }
    },

    async resetPassword() {
      const { resetLog, oldPssw, newPssw } = this;
      try {
        const response = await this.$http.post('http://localhost:3000/auth/reset-password', {
          username: resetLog,
          oldPassword: oldPssw,
          newPassword: newPssw,
        });
        this.successMessage = response.data.message;
        this.errorMessage = '';
        this.resetLog = '';
        this.oldPssw = '';
        this.newPssw = '';
      } catch (error) {
        this.errorMessage = error.response.data.error;
        this.successMessage = '';
      }
    },

    CancelReset() {
      this.switchForm('login');
    },

    switchForm(form) {
      this.currentForm = form;
      this.errorMessage = '';
      this.successMessage = '';
      this.registerError = '';
      this.registerSuccess = '';

      this.log = '';
      this.pssw = '';
      this.newUsername = '';
      this.newPassword = '';
      this.confirmPassword = '';
      this.resetLog = '';
      this.oldPssw = '';
      this.newPssw = '';
    },

    logoutUser() {
      localStorage.removeItem('userRole'); 
      this.$router.push('/login'); 
    },
  },
  mounted() {
  if (localStorage.getItem('userRole')) {
    this.$router.push('/'); 
  }
},
};
</script>

<style scoped>
.auth-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Arial', sans-serif;
  background: linear-gradient(135deg, #e0eafc, #cfdef3);
  color: #333;
  min-height: 100vh;
}

.navbar {
  width: 100%;
  max-width: 1450px;
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

li:hover {
  transform: scale(1.1);
}

a {
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
  margin-top: 150px;
  color: #1f2937;
  padding: 20px;
}

h2 {
  font-size: 3.5rem;
  margin: 0;
  font-weight: bold;
  color: black;
  letter-spacing: 1px;
  margin-bottom: 15px;
}

.form-switcher {
  display: flex;
  margin-bottom: 20px;
}

.form-switcher button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #ccc;
  color: #333;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.form-switcher button.active {
  background-color: #2874a6;
  color: white;
}

.form-switcher button:not(:last-child) {
  margin-right: 10px;
}

.form-switcher button:hover {
  background-color: #a0a0a0;
}

form {
  display: flex;
  flex-direction: column;
  width: 300px;
}

input {
  padding: 12px;
  margin-bottom: 15px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button[type='submit'],
button[type='button'] {
  padding: 12px;
  font-size: 16px;
  background-color: #2874a6;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-bottom: 10px;
}

button[type='submit']:hover,
button[type='button']:hover {
  background-color: #1a5276;
}

.error-message {
  color: red;
  font-size: 14px;
  margin-top: 10px;
}

.success-message {
  color: green;
  font-size: 14px;
  margin-top: 10px;
}
</style>
