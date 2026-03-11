<script setup lang="ts">  
import {ref, type Ref, computed} from 'vue';                                              //Me llega la funcion para volver a la pantalla anterior.
import { RouterView, RouterLink, useRouter} from 'vue-router';
import BotonVolver from '@/components/BotonVolver.vue';
import DataTable from 'primevue/datatable';
import Button from 'primevue/button';
import Column from 'primevue/column';
import { onMounted } from 'vue';

import 'primeicons/primeicons.css'


import '@/assets/tablas.css';

const route = useRouter();

onMounted(() => {   
    buscaVuelos();
});
const API_URL = import.meta.env.VITE_API_URL;

const propss = defineProps<{         //Me llega la url donde estaba antes
  msg2: string
}>()
interface FechaVuelo {
  fechaInicio: string;
  fechaFin: string;
}

interface Trayecto {
  origen: string;
  destino: string;
}

interface AsientosDisponibles {
  [key: string]: number;
}

interface Avion {
  capacidadTotal: number;
  asientosDisponibles: AsientosDisponibles;
}

interface Vuelo {
  id: string;
  fechaVuelo: FechaVuelo;
  tipoVuelo: string;
  trayecto: Trayecto;
  estadoVuelo: string;
  avion: Avion;
  capacidad: number;
  fechaLlegada: string;
  fechaSalida: string;
  aeropuertoLlegada: string;
  aeropuertoSalida: string;
}



const vuelosFromDB:Ref<Vuelo[]> = ref([]);
const selectedReserva:Ref<Vuelo | undefined> = ref(undefined);
const selectedID = computed(() => selectedReserva.value?.id ?? '');
const esCancelado = computed(() => {
    return selectedReserva.value?.estadoVuelo.toUpperCase() === 'CANCELADO';
});
const buscaVuelos = async () => { 
    try {

        let datos = await fetch(API_URL + 'umu/aeropuerto/public/vuelo?page=0&size=10&sort=fechaSalida')
        let djson = await datos.json()
        vuelosFromDB.value = Array.isArray(djson.content) ? djson.content : (Array.isArray(datos) ? datos : [])
        console.log(vuelosFromDB.value)

    }catch (_e){
        console.log("Error al cargar los vuelos")
        console.log(_e)
    }

}

const reservar = () => {
    route.push(`/reservar/${selectedID.value}`);
}

</script>


<template>

    <div class="divTabla" v-if="vuelosFromDB.length">
        <DataTable class="tabla" :value="vuelosFromDB" tableStyle="min-width: 50rem" v-model:selection="selectedReserva" selectionMode="single" dataKey="id">
            <Column field="trayecto.origen" header="Origen"></Column>
            <Column field="trayecto.destino" header="Destino"></Column>
            <Column field="fechaVuelo.fechaInicio" header="Fecha Salida"></Column>
            <Column field="fechaVuelo.fechaFin" header="Fecha Llegada"></Column>
            <Column field="tipoVuelo" header="Tipo"></Column>
            <Column field="estadoVuelo" header="Estado"></Column>
            <Column field="capacidad" header="Capacidad"></Column>
        </DataTable>
    </div>


        <div v-if="!vuelosFromDB.length" class="divTabla alineacion">
            <i class="pi pi-exclamation-circle"pos="left" />
            <p> No hay vuelos disponibles, lamentamos las molestias. </p>
        </div>


    <div class="div2">
        <BotonVolver :msg="'/aeropuerto'" />
    </div>

    <div class="div2 contenedor-botones">
        <Button @click="buscaVuelos" label="Buscar Vuelos" raised icon="pi pi-search" />
        <Button class="p-button" :disabled="!selectedID || esCancelado" @click="reservar" label="Reservar" severity="secondary" raised icon="pi pi-check" />
    </div>

 
</template>

<style scoped>

.fade2-enter-active,
.fade2-leave-active {
  transition: opacity 0.5s ease;
}

.fade2-enter-from,
.fade2-leave-to {
  opacity: 0;
}

.divTabla {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
}

.divTabla p{
    font-size: 1.2rem;
    color: var(--colorVerde);
}


.alineacion {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
}


.alineacion i{
    color: var(--vt-colorROJO);
}


.div2 {
    margin-top: 2rem;
}

.contenedor-botones {
    display: flex;
    align-items: center; /* Alineación vertical */
    justify-content: center; /* Los centra en la pantalla */
    gap: 1rem; /* Espacio entre botones sin usar márgenes manuales */
}


.contenedor-botones :deep(.p-button:disabled) {
    background-color: #cccccc !important; /* Gris claro */
    border-color: #999999 !important;     /* Borde más oscuro */
    color: #666666 !important;            /* Texto gris */
    opacity: 0.6;                           /* Un poco transparente */
    cursor: not-allowed;                    /* Cambia el cursor a un círculo tachado */
}

</style> 
