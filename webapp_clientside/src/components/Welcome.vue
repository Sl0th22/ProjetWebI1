<template>
  <div class="welcome-page">
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
      <h2>Welcome to the Ultimate Sports Experience</h2>
      <p>Join us for an unforgettable journey through thrilling matches and competition.</p>
    </main>
  </div>
</template>

<script>
export default {
  name: 'Welcome'
};
</script>

<style scoped>
/* Structure générale */
.welcome-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Arial', sans-serif;
  background: linear-gradient(135deg, #e0eafc, #cfdef3); /* Dégradé doux et moderne */
  color: #333;
  min-height: 100vh;
  background-image: url("../assets/bg.png");
  background-repeat: no-repeat;
  background-position: center;

}

/* Barre de navigation */
.navbar {
  width: 1450px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 30px;
  background-color: #1f2937; /* Couleur sombre élégante */
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

/* Liens de navigation */
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

/* Contenu principal */
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-top: 200px; /* Compense la hauteur de la barre de navigation */
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
  color: black;
  max-width: 600px;
  line-height: 1.6;
}
</style>