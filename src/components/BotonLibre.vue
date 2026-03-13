<script setup lang="ts">
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import 'primeicons/primeicons.css'

const props = defineProps<{         //Me llega la url donde estaba antes
  ruta: string,
  label: string,
  icono: string
}>()

const route = useRouter();


const volver = () => {
    route.push(props.ruta);
}

//pi pi-arrow-left
</script>


<template>
<Button @click="volver" :label="props.label" raised :icon="props.icono" iconPos="left" />
</template>
