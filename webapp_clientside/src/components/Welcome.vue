<template>
  <div id="app">
    <h1>Welcome to </h1>
    <h1>The Sport Tournament </h1>

    <!-- Navigation Links -->
    <nav>
      <ul>
        <li><router-link to="/Players">Players</router-link></li>
        <li><router-link to="/team">Team</router-link></li>
        <li><router-link to="/match">Match</router-link></li>
      </ul>
    </nav>

    <!-- Where the routed components will be rendered -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
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
  transform: scale(1.1); /* Effet de zoom au survol */
}

a {
  text-decoration: none;
  color: black;
}


</style>
