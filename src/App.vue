<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import { RouterView, RouterLink } from 'vue-router';
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/image.png" width="250" height="250" />

    <div class="wrapper">
      <HelloWorld msg="UMUFly" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/profile">Profile</RouterLink>
        <RouterLink to="/aeropuerto">App</RouterLink>
      </nav>
    </div>
  </header>
  <RouterView />
</template>
 

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
