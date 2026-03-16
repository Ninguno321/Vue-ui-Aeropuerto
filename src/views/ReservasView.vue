<script setup lang="ts">    
import {onMounted,watch, computed, ref, type Ref } from 'vue';                                            //Me llega la funcion para volver a la pantalla anterior.
import { useRoute, RouterView, RouterLink } from 'vue-router';
import BotonVolver from '@/components/BotonVolver.vue';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import LasReservas from '@/components/LasReservas.vue';
import Select from 'primevue/select';
import ConfirmarReservaItem from '@/components/ConfirmarReservaItem.vue';
import { useUserStore } from '@/stores/datos';  




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


    <div>
        <BotonVolver :msg="'/buscar/vuelos'" />
        Hola {{ idVuelo }}

        <p>
            Vas a reservar este vuelo, con un asiento: {{ claseAsiento?.name }} y el DNI del pasajero es {{ DniPasajero }} 
            con fecha tal tal, quieres confirmar?   
        </p>

        <Button :disabled=" !DniPasajero|| !claseAsiento" @click="hacerReserva" label="Reservar" raised icon="pi pi-calendar-plus" iconPos="left"/>
        <InputText v-model="DniPasajero" :invalid="!DniPasajero" placeholder="Name" />
        {{ DniPasajero }}
        <Select v-model="claseAsiento" :options="asientos" optionLabel="name" placeholder="Clase" :invalid="!claseAsiento" class="w-full md:w-56" />

            <button @click="open = true">Open Modal</button>

        <Teleport to="body">
        <div v-if="open" class="modal">
            <ConfirmarReservaItem @Yalotengo="confirmaReserva" :idVuelo="idVuelo"/>
        </div>
        </Teleport>
    </div>
</template>


<style scoped>
.fade2-enter-active {
  transition: opacity 0.8s ease-out;
}

/* Sale rápido (0s) */
.fade2-leave-active {
  content-visibility: hidden;
  transition: opacity 0s ease-in;
  position: absolute; /* Evita que empuje a los demás al salir */
}

.fade2-enter-from,
.fade2-leave-to {
  opacity: 0;
}

.modal {
  position: fixed;
  z-index: 999;
  top: 20%;
  left: 50%;
  width: 300px;
  margin-left: -150px;
}
</style>