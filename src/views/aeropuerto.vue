<script setup lang="ts">
import {ref, type Ref, onMounted} from 'vue';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import { RouterView, RouterLink, useRoute } from 'vue-router';
import 'primeicons/primeicons.css'

const route = useRouter();
const show:Ref<boolean> = ref(false)

const buscar = () => {
  route.push('/buscar/vuelos');
}


const reservar = () => {
  route.push('reservar');
}
</script>


<template>
  <main>
    <div >
      <div class="columnas">
        <div class="columna">
          <p>Pulse "Buscar" para ver todos los vuelos disponibles.</p>
            <Button @click="buscar" label="Buscar" icon="pi pi-search" iconPos="left"  raised />
        </div>
        <div class="columna">
          <p>Pulse "Reservar" para reservar un vuelo o un parking.</p>
          <Button @click="reservar" label="Reservar" raised icon="pi pi-calendar-plus" iconPos="left"/>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>

.columnas {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.columna {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  min-width: 300px;
  height: 150px; 
  border: 1px solid #cccccc76;
  padding: 1rem;
  border-radius: 9px;
}

.negrita{
  font-weight: "bold";
}

</style>



