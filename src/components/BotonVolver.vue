<script setup lang="ts">
import {ref, type Ref, onMounted} from 'vue';
import { useRouter } from 'vue-router';
import Vuelos from '@/components/Vuelos.vue'; 
import Parkings from '@/components/Parkings.vue';
import Button from 'primevue/button';
import { RouterView, RouterLink, useRoute } from 'vue-router';
import 'primeicons/primeicons.css'
const props = defineProps<{         //Me llega la url donde estaba antes
  msg: string
}>()

const route = useRouter();


const volver = () => {
    route.push(props.msg);         //Llamo a la funcion que me han pasado para volver a la pagina anterior.
}

</script>


<template>
<Button @click="volver" label="Volver" raised icon="pi pi-arrow-left" iconPos="left" />
</template>
