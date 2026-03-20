<script setup lang="ts">
import {onMounted,computed, watch, ref, type Ref} from 'vue'
import Card from 'primevue/card';
import Button from 'primevue/button';
import { useUserStore, useVueloStore } from '@/stores/datos';
import { Select } from 'primevue';
import { useReservaStore } from '@/stores/datos';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from 'primevue';
import { useToast } from "primevue/usetoast";

const confirm = useConfirm();
const toast = useToast();
const userStore = useUserStore()
const reservaStore = useReservaStore()

const dniPasajero:Ref<string | undefined> = ref(undefined);
const nombrePasajero:Ref<string | undefined> = ref(undefined);
const apellidoPasajero:Ref<string | undefined> = ref(undefined);
const emailPasajero:Ref<string | undefined> = ref(undefined);

const emit = defineEmits(['Yalotengo', 'HuboError'])


const props = defineProps<{         //Me llega la url donde estaba antes
  idReserva: string | undefined
  asiento: string | undefined
  idReservaRes: string | undefined
  dniPasajero: string | undefined
}>()



onMounted(async () => {
    dniPasajero.value = userStore.usuario?.dni
    nombrePasajero.value = userStore.usuario?.nombrePasajero
    apellidoPasajero.value = userStore.usuario?.apellidos
    emailPasajero.value = userStore.usuario?.email
    await buscaVuelo();
})

const API_URL = import.meta.env.VITE_API_URL


const errorReservando:Ref<boolean> = ref(false)
const editarReserva = async () => {
    errorReservando.value = false;
    try {
        const body = {
            reservaSeleccionada: props.idReservaRes,
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


interface Vuelo {
  id: string;
  tipoVuelo: string;
  estadoVuelo: string;
  capacidad: number;
  fechaSalida: string;  
  fechaLlegada: string;
  aeropuertoSalida: string;
  aeropuertoLlegada: string;
  
  fechaVuelo: {
    fechaInicio: string;
    fechaFin: string;
  };
  
  trayecto: {
    origen: string;
    destino: string;
  };
  
  avion: {
    capacidadTotal: number;
  };
}


const vuelo:Ref<Vuelo|undefined> = ref(undefined)


const buscaVuelo = async () => {
    errorReservando.value = false;
    try {
        let response = await fetch(API_URL+'umu/aeropuerto/public/avion?vueloId='+props.idReserva);

        if (!response.ok) {
          throw new Error('Fallo con el vuelo no encontrado');
        }
        let datos = await response.json();
        console.log('Datos del pasajero:', datos);

        vuelo.value = datos as Vuelo;
        console.log('Registro exitoso:', datos);

    }catch(_e){
        console.log('Error en la reserva:', _e);
        errorReservando.value = true;
    }
}

const cancelaReserva = async () => {
    console.log("cancelando reserva")
    errorReservando.value = false;
    try {
        console.log(props.idReservaRes, props.dniPasajero)
        let response = await fetch(API_URL+'umu/aeropuerto/public/vuelo/reservas/cancelar?reservaId='+props.idReservaRes+'&pasajeroId=' + props.dniPasajero);
        console.log(response)

        if (!response.ok) {
          throw new Error('Fallo Reserva no cancelada');
        }
        console.log("Hemos cancelado la reserva")
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

const vueloNoMod = () => {
    return vuelo.value?.estadoVuelo == 'CANCELADO' || vuelo.value?.estadoVuelo == 'COMPLETADO'
}

const formatFecha = (fecha: string) => {
  const d = new Date(fecha)

  const opciones: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }

  return d.toLocaleString('es-ES', opciones)
}

const vueloFormateado = computed(() => {
  if (!vuelo.value) return null

  return {
    ...vuelo.value,
    fechaSalidaFormateada: formatFecha(vuelo.value.fechaSalida),
    fechaLlegadaFormateada: formatFecha(vuelo.value.fechaLlegada)
  }
})


const confirm2 = () => {
    confirm.require({
        message: '¿Estás seguro de que quieres eliminar esta reserva? Eliminará la reserva por completo y NO podrá recuperarla.',
        header: 'Alerta',
        icon: 'pi pi-info-circle',
        acceptLabel: 'Eliminar',
        rejectLabel: 'Cancelar',
        acceptClass: 'p-button-danger', 
        rejectClass: 'p-button-secondary',
        accept: async () => {
            await cancelaReserva(); 
            toast.add({ severity: 'success', summary: 'Reserva eliminada', detail: 'La reserva fue cancelada', life: 3000 });
            emit('HuboError'); 
        },
        reject: () => {
            toast.add({ severity: 'warn', summary: 'Cancelado', detail: 'No se eliminó la reserva', life: 3000 });
            emit('HuboError'); 
        }
    });
};

</script>

<template>
    <Card style="width: 25rem; overflow: hidden">

        <template #title>Información del vuelo</template>
        <template #subtitle> <p>DNI: {{ dniPasajero }}</p>
                             <p>Pasajero: {{ nombrePasajero }} {{ apellidoPasajero }} 
                            email: {{ emailPasajero }}</p>
        </template>
        <template #content>

            <p v-if="!vueloNoMod()"> Solo puedes editar el asiento o cancelar la reserva. </p>
            <div v-if="vueloNoMod()" class="divTabla alineacion">
                <i class="pi pi-exclamation-circle" />
                <p>Este vuelo no se puede modificar.</p>
            </div>
            <DataTable size="small" :value="vueloFormateado ? [vueloFormateado] : []" tableStyle="min-width: 10rem; margin-top: 0.5rem">
                <Column field="aeropuertoLlegada" header="To"></Column>
                <Column field="aeropuertoSalida" header="From"></Column>
                <Column field="fechaLlegadaFormateada" header="End"></Column>
                <Column field="fechaSalidaFormateada" header="Start"></Column>
            </DataTable>


            <DataTable size="small" :value="vueloFormateado ? [vueloFormateado] : []" tableStyle="min-width: 10rem; margin-top: 1rem">
                <Column field="tipoVuelo" header="Tipo"></Column>
                <Column field="estadoVuelo" header="Estado"></Column>
                <Column field="capacidad" header="Capacidad"></Column>

            </DataTable>

            <div class="espacio">
                <Select class="w-full md:w-56" size="small" v-model="claseAsiento" :disabled="vueloNoMod()" :options="asientos" optionLabel="name" placeholder="Clase" :invalid="!claseAsiento"  />
            </div>  
        </template>
        <template #footer>
            <div class="flex gap-4 mt-1 separa">
                <Button @click="$emit('HuboError')" label="Cerrar" severity="secondary" variant="outlined" class="w-full" />
                <Button :disabled="claseAsientoName === '' || errorReservando || vueloNoMod() " @click="editarReserva" label="Editar" raised icon="pi pi-file-edit" iconPos="left"/>
                <Transition name="fade2">
                    <div v-if="errorReservando" class="divTabla alineacion">
                    <i class="pi pi-exclamation-circle" />
                    <p>Ya está reservado</p>
                    </div>
                </Transition>
                <div v-if="!errorReservando" style="display: flex; align-items: flex-end; margin-left: auto;">                
                    <div class="card flex flex-wrap gap-2 justify-center">
                        <Button :disabled="vueloNoMod()" @click="confirm2()" label="Cancelar" severity="danger" variant="outlined" raised icon="pi pi-times" iconPos="left"></Button>
                    </div>
                </div>



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







