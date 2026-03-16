<script setup lang="ts">
import {onMounted,watch, ref, type Ref} from 'vue'
import Card from 'primevue/card';
import Button from 'primevue/button';
import { useUserStore } from '@/stores/datos';
import { Select } from 'primevue';
import { useReservaStore } from '@/stores/datos';

const userStore = useUserStore()
const reservaStore = useReservaStore()

const dniPasajero:Ref<string | undefined> = ref(undefined);
const nombrePasajero:Ref<string | undefined> = ref(undefined);
const apellidoPasajero:Ref<string | undefined> = ref(undefined);
const emailPasajero:Ref<string | undefined> = ref(undefined);

defineEmits(['Yalotengo'])


const props = defineProps<{         //Me llega la url donde estaba antes
  idVuelo: string
}>()


onMounted(() => {
    dniPasajero.value = userStore.usuario?.dni
    nombrePasajero.value = userStore.usuario?.nombrePasajero
    apellidoPasajero.value = userStore.usuario?.apellidos
    emailPasajero.value = userStore.usuario?.email

    buscaInfoVuelo()

})

const API_URL = import.meta.env.VITE_API_URL

const buscaInfoVuelo = async() => {

    let res = await fetch(API_URL+'')           //ME QUEDO AQUI, NO TENGO UN METODO PARA ESTO, TENGO QUE CREARLO EN EL BACK

}

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

interface ClaseAsiento {
    name: string;
    code: string;
}

const claseAsiento: Ref<ClaseAsiento | undefined> = ref(undefined);

const claseAsientoName = ref('')

watch(claseAsiento, (val) => {
    claseAsientoName.value = val?.name ?? '';
});


const asientos = ref([
    { name: 'ECONOMICO', code: 'ECO' },
    { name: 'PRIMERA', code: 'PR' },
    { name: 'BUSINESS', code: 'BS' }
]);


</script>

<template>
    <Card style="width: 25rem; overflow: hidden">
        <template #header>
            <img alt="user header" src="/public/fotoChat.png" class="header-image"/>
        </template>
        <template #title>Información del vuelo</template>
        <template #subtitle> <p>DNI: {{ dniPasajero }}</p>
                             <p>Pasajero: {{ nombrePasajero }} {{ apellidoPasajero }} 
                            email: {{ emailPasajero }}</p>
        </template>
        <template #content>
            <p>Vas a reservar el vuelo {{ props.idVuelo }}</p>
            <div>
                <Select size="small" v-model="claseAsiento" :options="asientos" optionLabel="name" placeholder="Clase" :invalid="!claseAsiento" class="w-full md:w-56" />
            </div>  
        </template>
        <template #footer>
            <div class="flex gap-4 mt-1 separa">
                <Button @click="$emit('Yalotengo')" label="Cancel" severity="secondary" variant="outlined" class="w-full" />
                <Button @click="hacerReserva" label="Reservar" raised icon="pi pi-calendar-plus" iconPos="left"/>

            </div>
        </template>
    </Card>
</template>


<style scoped>

.separa {
    display: flex;
    gap: 1rem;
}

.header-image {
    width: 100%;
    max-height: 250px; /* Limita la altura máxima */
    object-position: center; /* Centra la foto si se recorta */
}

</style>







