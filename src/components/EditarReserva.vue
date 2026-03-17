<script setup lang="ts">
import {onMounted,watch, ref, type Ref} from 'vue'
import Card from 'primevue/card';
import Button from 'primevue/button';
import { useUserStore, useVueloStore } from '@/stores/datos';
import { Select } from 'primevue';
import { useReservaStore } from '@/stores/datos';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';



const userStore = useUserStore()
const reservaStore = useReservaStore()
const vueloStore = useVueloStore()


const dniPasajero:Ref<string | undefined> = ref(undefined);
const nombrePasajero:Ref<string | undefined> = ref(undefined);
const apellidoPasajero:Ref<string | undefined> = ref(undefined);
const emailPasajero:Ref<string | undefined> = ref(undefined);

const emit = defineEmits(['Yalotengo', 'HuboError'])


const props = defineProps<{         //Me llega la url donde estaba antes
  idReserva: string | undefined
  asiento: string | undefined
}>()



onMounted(() => {
    dniPasajero.value = userStore.usuario?.dni
    nombrePasajero.value = userStore.usuario?.nombrePasajero
    apellidoPasajero.value = userStore.usuario?.apellidos
    emailPasajero.value = userStore.usuario?.email
})

const API_URL = import.meta.env.VITE_API_URL


const errorReservando:Ref<boolean> = ref(false)
const editarReserva = async () => {
    errorReservando.value = false;
    try {
        const body = {
            reservaSeleccionada: props.idReserva,
            claseAsiento: claseAsientoName.value

        }
        const response = await fetch(API_URL+'umu/aeropuerto/public/vuelo/reservas/editar', {
        method: 'PUT',
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
        emit('Yalotengo')
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

        <template #title>Información del vuelo</template>
        <template #subtitle> <p>DNI: {{ dniPasajero }}</p>
                             <p>Pasajero: {{ nombrePasajero }} {{ apellidoPasajero }} 
                            email: {{ emailPasajero }}</p>
            {{ props.idReserva }}     
            {{ props.asiento }}
            {{ claseAsientoName }}
        </template>
        <template #content>

            Solo puedes editar el asiento o cancelar 

            <DataTable size="small" :value="vueloStore.vuelo ? [vueloStore.vuelo] : []" tableStyle="min-width: 10rem">
                <Column field="destino" header="To"></Column>
                <Column field="origen" header="From"></Column>
                <Column field="fechaLlegada" header="End"></Column>
                <Column field="fechaSalida" header="Start"></Column>
            </DataTable>


            <DataTable size="small" :value="vueloStore.vuelo ? [vueloStore.vuelo] : []" tableStyle="min-width: 10rem">
                <Column field="tipoVuelo" header="Vuelo"></Column>
                <Column field="estadoVuelo" header="Estado"></Column>
                <Column header="Clase">
                        <template #body>
                            {{ claseAsientoName || 'No seleccionada' }}
                        </template>
                </Column>
            </DataTable>
            <div class="espacio">
                <Select class="w-full md:w-56" size="small" v-model="claseAsiento" :options="asientos" optionLabel="name" placeholder="Clase" :invalid="!claseAsiento"  />
            </div>  
        </template>
        <template #footer>
            <div class="flex gap-4 mt-1 separa">
                <Button @click="$emit('HuboError')" label="Cancel" severity="secondary" variant="outlined" class="w-full" />
                <Button :disabled="claseAsientoName === '' || errorReservando" @click="editarReserva" label="Reservar" raised icon="pi pi-calendar-plus" iconPos="left"/>
                <Transition name="fade2">
                    <div v-if="errorReservando" class="divTabla alineacion">
                    <i class="pi pi-exclamation-circle" />
                    <p>Ya está reservado</p>
                    </div>
                </Transition>
                        
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
.espacio{
    margin-top: 1rem;
    margin-bottom: 0,8rem;
}


.divTabla {
  display: flex;
  justify-content: center;
}

.divTabla p {
  color: var(--colorVerde);
}

.alineacion {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
}

.alineacion i {
  color: var(--vt-colorROJO);
}



</style>







