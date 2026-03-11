<script setup lang="ts">
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import 'primeicons/primeicons.css'

const props = defineProps<{         //Me llega la url donde estaba antes
  msg: string
}>()

const route = useRouter();


const volver = () => {
    route.push(props.msg);
}

</script>


<template>
<Button @click="volver" label="Volver" raised icon="pi pi-arrow-left" iconPos="left" />
</template>
