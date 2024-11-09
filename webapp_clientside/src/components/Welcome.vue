<template>
  <div id="app">
    <h1>Welcome to </h1>
    <h1>The Sport Tournament </h1>

    <nav>
      <ul>
        <li><router-link to="/login">Login</router-link></li>
        <li><router-link to="/toornament"> Toornament </router-link> </li>
      </ul>
    </nav>

    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
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
  transform: scale(1.1); /* Effet de zoom au survol */
}

a {
  text-decoration: none;
  color: black;
}


</style>
