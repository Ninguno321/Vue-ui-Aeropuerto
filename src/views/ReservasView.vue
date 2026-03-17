<script setup lang="ts">    
import {onMounted,watch, computed, ref, type Ref } from 'vue';                                            //Me llega la funcion para volver a la pantalla anterior.
import { useRoute, useRouter, RouterView, RouterLink } from 'vue-router';
import BotonVolver from '@/components/BotonVolver.vue';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import LasReservas from '@/components/LasReservas.vue';
import Select from 'primevue/select';
import ConfirmarReservaItem from '@/components/ConfirmarReservaItem.vue';
import { useUserStore } from '@/stores/datos';  

const routeRuta = useRouter();
const route = useRoute();

const userStore = useUserStore() // Instancia el store

const API_URL = import.meta.env.VITE_API_URL;

const idVuelo:Ref<string> = ref(route.params.idVuelo as string)
const DniPasajero:Ref<string | undefined> = ref(undefined);


interface ClaseAsiento {
    name: string;
    code: string;
}

const claseAsiento: Ref<ClaseAsiento | undefined> = ref(undefined);

const claseAsientoName = ref('')

watch(claseAsiento, (val) => {
    claseAsientoName.value = val?.name ?? '';
});





const errorReservando:Ref<boolean> = ref(false);

onMounted(() => {

    if(userStore.tieneDatos()){
        DniPasajero.value = userStore.usuario?.dni
    }else{
        routeRuta.push('/profile')      //me manda al perfil si no hay nadie registrado.
                                        //al recargar la pagina se podia acceder a reserva y daba error.
    }
})

const propss = defineProps<{         //Me llega la url donde estaba antes
  msg2: string
}>()

const hacerReserva = async () => {
    errorReservando.value = false;
    try {
        const body = {
            vueloSeleccionado: idVuelo.value,
            pasajeroID: DniPasajero.value,
            claseAsiento: claseAsientoName.value ,
            cancelada: false
        }

        const response = await fetch(API_URL+'umu/aeropuerto/public/vuelo/reservar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
        });

        if (!response.ok) {
        const errorText = await response.text();
        console.log('Error backend:', errorText);
        errorReservando.value = true;
        throw new Error('Error en el registro');
        }

        const data = await response.json();
        console.log('Registro exitoso:', data);
    }catch(_e){
        console.log('Error en la reserva:', _e);
        errorReservando.value = true;
    }
}

const muestrapie:Ref<boolean> = ref(false);

const confirmaReserva = () => {
    open.value=false
    muestrapie.value = true;

}

const asientos = ref([
    { name: 'ECONOMICO', code: 'ECO' },
    { name: 'PRIMERA', code: 'PR' },
    { name: 'BUSINESS', code: 'BS' }
]);


const open = ref(false);

</script>


<template>
    

        <div>
            <LasReservas :idVuelo="idVuelo" /> 
        </div>


</template>


<style scoped>


</style>