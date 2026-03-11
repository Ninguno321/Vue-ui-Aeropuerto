<script setup lang="ts">    
import {onMounted, ref, type Ref } from 'vue';                                            //Me llega la funcion para volver a la pantalla anterior.
import { useRoute, RouterView, RouterLink } from 'vue-router';
import BotonVolver from '@/components/BotonVolver.vue';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import LasReservas from '@/components/LasReservas.vue';
import Listbox from 'primevue/listbox';

const route = useRoute();

const API_URL = import.meta.env.VITE_API_URL;

const idVuelo:Ref<string> = ref(route.params.idVuelo as string)
const DniPasajero:Ref<string | undefined> = ref(undefined);
const claseAsiento: Ref<string | undefined> = ref(undefined);
const errorReservando:Ref<boolean> = ref(false);


const propss = defineProps<{         //Me llega la url donde estaba antes
  msg2: string
}>()

const hacerReserva = async () => {
    errorReservando.value = false;
    try {
        const body = {
            vueloSeleccionado: idVuelo.value,
            pasajeroID: DniPasajero.value,
            claseAsiento: claseAsiento.value,
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


const rellenaInfo = () => {

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
        <LasReservas /> 
    </div>
    <div>
        <BotonVolver :msg="'/buscar/vuelos'" />
        Hola {{ idVuelo }}

        <Button :disabled=" !DniPasajero|| !claseAsiento" @click="hacerReserva" label="Reservar" raised icon="pi pi-calendar-plus" iconPos="left"/>
        <InputText v-model="DniPasajero" :invalid="!DniPasajero" placeholder="Name" />
        {{ DniPasajero }}
        <Listbox v-model="claseAsiento" :options="asientos" optionLabel="name" optionValue="name" checkmark :highlightOnSelect="false" class="w-full md:w-56" />

        <button @click="open = true">Open Modal</button>

        <Teleport to="body">
        <div v-if="open" class="modal">
            <p>Hello from the modal!</p>
            <button @click="open = false">Close</button>
        </div>
        </Teleport>
    </div>
</template>

<style scoped>


.modal {
  position: fixed;
  z-index: 999;
  top: 20%;
  left: 50%;
  width: 300px;
  margin-left: -150px;
}
</style>