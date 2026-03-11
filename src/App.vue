<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import { RouterView, RouterLink } from 'vue-router';
</script>

<template>
  <div class="app-brand">
    <RouterLink class="app-brand__link" to="/">UMUFly</RouterLink>
  </div>

  <header class = "app-header">
    <img alt="Vue logo" class="logo" src="@/assets/image.png" width="250" height="250" />

    <div class="wrapper">
      <HelloWorld msg="UMUFly" />

      <nav class="nav">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/profile">Profile</RouterLink>
        <RouterLink to="/aeropuerto">App</RouterLink>
      </nav>
      
    </div>
  </header>

    <Transition name="fade" mode="out-in">
      <RouterView/>
    </Transition>
</template>
 

<style>
.fade-enter-active {
  transition: opacity 0.8s ease-out;
}

/* Sale rápido (0s) */
.fade-leave-active {
  content-visibility: hidden;
  transition: opacity 0s ease-in;
  position: absolute; /* Evita que empuje a los demás al salir */
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<style scoped>


.app-brand {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 3000;
}


.app-brand__link {
  display: inline-block;
  padding: 0.4rem 0.65rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.85);
  color: var(--vt-c-indigo);
  text-decoration: none;
  font-weight: 700;
  letter-spacing: 0.02em;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(0, 0, 0, 0.06);
}

/* Avoid duplicate title; keep layout unchanged. */
header :deep(.greetings) {
  visibility: hidden;
}

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
