<template>
  <div class="auth-page">
    <header class="navbar">
      <div class="navbar-left">
        <img src="@/assets/Sport_tournament.png" alt="Sport Tournament Logo" class="logo" />
        <h1 class="site-title">The Sport Tournament</h1>
      </div>
      <nav class="nav-links">
        <ul>
          <li><router-link to="/">Accueil</router-link></li>
          <li><router-link to="/toornament">Toornament</router-link></li>
          <li><router-link to="/match">Match</router-link></li>
          <li><router-link to="/team">Team</router-link></li>
          <li><router-link to="/Players">Player</router-link></li>
          <li><router-link to="/login">Login</router-link></li>
        </ul>
      </nav>
    </header>

    <main class="content">
      <h2>{{ currentFormTitle }}</h2>

      <!-- Boutons pour basculer entre les formulaires -->
      <div class="form-switcher">
        <button @click="switchForm('login')" :class="{ active: currentForm === 'login' }">Login</button>
        <button @click="switchForm('register')" :class="{ active: currentForm === 'register' }">Register</button>
        <button @click="switchForm('resetPassword')" :class="{ active: currentForm === 'resetPassword' }">Reset Password</button>
      </div>

      <!-- Formulaire de Login -->
      <form v-if="currentForm === 'login'" @submit.prevent="loginUser">
        <input type="email" v-model="loginEmail" placeholder="Email" required />
        <input type="password" v-model="loginPassword" placeholder="Password" required />
        <button type="submit">Login</button>
        <p v-if="loginError" class="error-message">{{ loginError }}</p>
      </form>

      <!-- Formulaire d'inscription -->
      <form v-if="currentForm === 'register'" @submit.prevent="registerUser">
        <input type="text" v-model="username" placeholder="Username" required />
        <input type="email" v-model="email" placeholder="Email" required />
        <input type="password" v-model="password" placeholder="Password" required />
        <input type="password" v-model="confirmPassword" placeholder="Confirm Password" required />
        <button type="submit">Register</button>
        <p v-if="registerError" class="error-message">{{ registerError }}</p>
      </form>

      <!-- Formulaire de réinitialisation du mot de passe -->
      <form v-if="currentForm === 'resetPassword'" @submit.prevent="resetPassword">
        <input type="email" v-model="resetEmail" placeholder="Enter your email" required />
        <button type="submit">Reset Password</button>
        <p v-if="resetError" class="error-message">{{ resetError }}</p>
        <p v-if="resetSuccess" class="success-message">{{ resetSuccess }}</p>
      </form>
    </main>
  </div>
</template>

<script>
export default {
  name: 'AuthPage',
  data() {
    return {
      currentForm: 'login', // Formulaire courant: 'login', 'register' ou 'resetPassword'

      // Données pour le formulaire de login
      loginEmail: '',
      loginPassword: '',
      loginError: '',

      // Données pour le formulaire d'inscription
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      registerError: '',

      // Données pour le formulaire de réinitialisation
      resetEmail: '',
      resetError: '',
      resetSuccess: '',
    };
  },
  computed: {
    currentFormTitle() {
      if (this.currentForm === 'login') return 'Login';
      if (this.currentForm === 'register') return 'Register';
      if (this.currentForm === 'resetPassword') return 'Reset Password';
    },
  },
  methods: {
    switchForm(form) {
      this.currentForm = form;
      // Réinitialiser les messages d'erreur et de succès lors du changement de formulaire
      this.loginError = '';
      this.registerError = '';
      this.resetError = '';
      this.resetSuccess = '';
    },
    loginUser() {
      // Logique de connexion (à implémenter)
      if (!this.loginEmail || !this.loginPassword) {
        this.loginError = 'Veuillez entrer votre email et mot de passe.';
      } else {
        this.loginError = '';
        alert('Connexion réussie !');
        // Réinitialiser les champs du formulaire de login
        this.loginEmail = '';
        this.loginPassword = '';
      }
    },
    registerUser() {
      if (this.password !== this.confirmPassword) {
        this.registerError = 'Les mots de passe ne correspondent pas.';
      } else {
        // Logique d'inscription (à implémenter)
        this.registerError = '';
        alert('Inscription réussie !');
        // Réinitialiser les champs du formulaire d'inscription
        this.username = '';
        this.email = '';
        this.password = '';
        this.confirmPassword = '';
      }
    },
    resetPassword() {
      // Logique de réinitialisation du mot de passe (à implémenter)
      if (!this.resetEmail) {
        this.resetError = 'Veuillez entrer votre email.';
      } else {
        this.resetError = '';
        this.resetSuccess = 'Un email a été envoyé pour réinitialiser votre mot de passe.';
        // Réinitialiser le champ du formulaire de réinitialisation
        this.resetEmail = '';
      }
    },
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

/* Styles pour les boutons de changement de formulaire */
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

button[type="submit"] {
  padding: 12px;
  font-size: 16px;
  background-color: #2874a6;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button[type="submit"]:hover {
  background-color: #1a5276;
}

/* Styles pour les messages d'erreur et de succès */
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
