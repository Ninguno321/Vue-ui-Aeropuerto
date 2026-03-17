<script setup lang="ts">
import { ref,watch,  type Ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BotonVolver from '@/components/BotonVolver.vue'
import DataTable from 'primevue/datatable'
import Button from 'primevue/button'
import Column from 'primevue/column'
import 'primeicons/primeicons.css'
import '@/assets/tablas.css'
import { useReservaStore } from '@/stores/datos'; //Importamos el store de pinia 
import { useUserStore } from '@/stores/datos'
import FormUsuario from '@/components/FormUsuario.vue'
import { useVueloStore } from '@/stores/datos'

const reservasStore = useReservaStore() // Instancia el store
const userStore = useUserStore() // Instancia el store
const vueloStore = useVueloStore() // Instancia el store


const route = useRouter()
const API_URL = import.meta.env.VITE_API_URL

const mostrarRegistro:Ref<boolean> = ref(false)


const propss = defineProps<{ msg2: string }>()

const iniciado: Ref<boolean> = ref(false)
const loading = ref(false)
const vuelosFromDB: Ref<Vuelo[]> = ref([])
const totalRecords = ref(0)



const selectedReserva: Ref<Vuelo | undefined> = ref(undefined)
const selectedID = computed(() => selectedReserva.value?.id ?? '')
const esCancelado = computed(() => selectedReserva.value?.estadoVuelo.toUpperCase() === 'CANCELADO')


const page = ref(0)
const size = 7
const sortField = ref("fechaSalida")
const sortOrder = ref(1)

interface Vuelo {
  id: string
  fechaSalida: string
  fechaLlegada: string
  tipoVuelo: string
  origen: string
  destino: string
  estadoVuelo: string
}

watch(selectedReserva, (vuelo) => {
  console.log("Nueva modificacion")
  if(vuelo) {
    vueloStore.setVuelo(vuelo)
    console.log(vueloStore.vuelo)
  }else{
    vueloStore.clearVuelo()
  }
})


const buscaVuelos = async () => {
  loading.value = true
  try {
    const order = sortOrder.value === 1 ? "asc" : "desc"
    const url = `${API_URL}umu/aeropuerto/public/vuelo?page=${page.value}&size=${size}&sort=${sortField.value},${order}`
    const res = await fetch(url)
    const data = await res.json()

    vuelosFromDB.value = (data.content ?? []).map((v: any) => ({
      ...v,
      origen: v.trayecto?.origen ?? v.origen,
      destino: v.trayecto?.destino ?? v.destino
    }))
    totalRecords.value = data.totalElements ?? 0
  } catch (e) {
    console.log("Error al cargar vuelos", e)
  } finally {
    loading.value = false
  }
}

const onPage = (event: any) => {
  page.value = event.page
  buscaVuelos()
}

const onSort = (event: any) => {
  sortField.value = event.sortField
  sortOrder.value = event.sortOrder
  page.value = 0
  buscaVuelos()
}

const reservar = () => {
    console.log(userStore.usuario)
    
    if(userStore.tieneDatos()){
        route.push(`/reservar/${selectedID.value}`)
    }else{
        mostrarRegistro.value = true;
        console.log("Primero tienes que registrarte")
        reservasStore.setIdRes(selectedID.value);
        //Primero tiene que registrarse, mostramos un Teleport con el registro y actualizamos la global.
    }
}

onMounted(async () => {
    await buscaVuelos()
    iniciado.value = true
})

const registradoPasajero = () => {
    mostrarRegistro.value = false;
    reservar()
}




</script>

<template>
  <Transition name="fade2">
    <div class="divTabla" v-if="vuelosFromDB.length">
      <DataTable 
        class="tabla" 
        :value="vuelosFromDB" 
        paginator lazy 
        :rows="7" 
        :totalRecords="totalRecords" 
        :loading="loading" 
        @page="onPage" 
        @sort="onSort" 
        v-model:selection="selectedReserva" selectionMode="single" dataKey="id" tableStyle="min-width: 50rem">
        <Column field="origen" header="Origen" sortable />
        <Column field="destino" header="Destino" sortable />
        <Column field="fechaSalida" header="Fecha Salida" sortable />
        <Column field="fechaLlegada" header="Fecha Llegada" sortable />
        <Column field="tipoVuelo" header="Tipo" sortable />
        <Column field="estadoVuelo" header="Estado" sortable />
      </DataTable>
    </div>
  </Transition>

  <Transition name="fade2">
    <div v-if="!vuelosFromDB.length && iniciado" class="divTabla alineacion">
      <i class="pi pi-exclamation-circle" />
      <p>No hay vuelos disponibles, lamentamos las molestias.</p>
    </div>
  </Transition>

  <Transition name="fade2">
    <div v-if="iniciado" class="div2">
      <BotonVolver :msg="'/aeropuerto'" />
    </div>
  </Transition>

  <Transition name="fade2">
        <Teleport to="body">
            <FormUsuario v-if=mostrarRegistro @cancelado="mostrarRegistro=false" @registrado="registradoPasajero()" class="modal"/>
        </Teleport>
  </Transition>


  <Transition name="fade2">
    <div v-if="iniciado" class="div2 contenedor-botones">
      <Button @click="buscaVuelos" label="Buscar Vuelos" raised icon="pi pi-search" :loading="loading" />
      <Button class="p-button" :disabled="!selectedID || esCancelado || mostrarRegistro" @click="reservar" label="Reservar" severity="secondary" raised icon="pi pi-check" />
    </div>
  </Transition>
</template>
    
<style scoped>
.fade2-enter-active {
  transition: opacity 0.8s ease-out;
}

.fade2-leave-active {
  content-visibility: hidden;
  transition: opacity 0s ease-in;
  position: absolute;
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

.divTabla p {
  font-size: 1.2rem;
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

.div2 {
  margin-top: 2rem;
}

.contenedor-botones {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.contenedor-botones :deep(.p-button:disabled) {
  background-color: #cccccc !important;
  border-color: #999999 !important;
  color: #666666 !important;
  opacity: 0.6;
  cursor: not-allowed;
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