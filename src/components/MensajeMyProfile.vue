<script setup lang="ts">
import InputText from 'primevue/inputtext';
import {onMounted,watch,  onUpdated, ref, type Ref, computed} from 'vue'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import IftaLabel from 'primevue/iftalabel';
import AutoComplete, { type AutoCompleteCompleteEvent } from 'primevue/autocomplete';
import BotonVolver from './BotonVolver.vue';
import { useUserStore } from '@/stores/datos'; //Importamos el store de pinia 
import { useReservaStore } from '@/stores/datos'; //Importamos el store de pinia 
import { useParkingStore } from '@/stores/datos'; //Importamos el store de pinia 
import ConfirmarReservaItem from './ConfirmarReservaItem.vue';
import EditarReserva from './EditarReserva.vue';



const API_URL = import.meta.env.VITE_API_URL;

const userStore = useUserStore() // Instancia el store

const reservasStore = useReservaStore() // Instancia el store

const parkingStore = useParkingStore() // Instancia el store

const size = ref({value: 'small'});

/*
    { label: 'Small', value: 'small' },
    { label: 'Normal', value: 'null' },
    { label: 'Large', value: 'large' }
*/
const variable:Ref<string> = ref('')
const loadingFromDB:Ref<boolean> = ref(false)
const quiereRegistrar:Ref<boolean> = ref(false)
const errorRegPas:Ref<boolean> = ref(false)
const tieneReservas:Ref<boolean> = ref(false)
const tieneReservasParking:Ref<boolean> = ref(false)

const tengoDatos:Ref<boolean> = ref(false)

onMounted(async () => {
  if (userStore.tieneDatos() && userStore.usuario) {
    
    //Cargamos directmaente desde la variable global
    fromDBPasajero.value = userStore.usuario;
    tengoDatos.value = true;
    variable.value = userStore.usuario.dni;

    if (reservasStore.tieneDatos()) {
      fromDBReservas.value = reservasStore.reserva;
      tieneReservas.value = true;
    }

    if (parkingStore.tieneDatos()) {
      fromDBParkings.value = parkingStore.parkings;
      tieneReservasParking.value = true;
    }

    //refrescamos desde la api por su hay nuevos datos.
    try {
      const resDatos = await fetch(API_URL + 'umu/aeropuerto/public/vuelo/pasajero?id=' + variable.value);
      if (resDatos.ok) {
        const datos = await resDatos.json();
        fromDBPasajero.value = datos as datosPasajero;
      }

      // Refresca reservas y parkings
      pageR.value = 0;
      pageP.value = 0;
      await buscaR();
      await buscaP();

      // Actualiza el store con los datos frescos
      asignarGlobal();
    } catch (e) {
      console.error('Error refrescando datos:', e);
    }
  }
});

interface datosPasajero {
  nombrePasajero: string,
  apellidos: string,
  dni: string,
  email: string,
  nacionalidad: string
}



const regresarDatos = () => {
  variable.value = '';
  fromDBPasajero.value = undefined;
  fromDBReservas.value = [];
  fromDBParkings.value = [];
  tieneReservas.value = false;
  tieneReservasParking.value = false;
  userStore.clearUsuario(); // Limpiamos el store 
  tengoDatos.value = false;
}

const pasajeroRegistro: Ref<datosPasajero> = ref({
  nombrePasajero: '',
  apellidos: '',
  dni: '',
  email: '',
  nacionalidad: ''
})

interface datosReservas {
  fechaReserva: string,
  id: string,
  vueloSeleccionado: string,
  pasajeroID: string,
  claseAsiento: string,
  cancelada: boolean
}

interface datosParkings {
  fecha: {
        fechaInicio: string,
        fechaFin: string,
  },
  id: string,
  tipoParking: string,
  pasajeroID: string,
  precio: number,
  fechaFin: string,
  fechaInicio: string
}

const fromDBPasajero:Ref<datosPasajero|undefined> = ref(undefined)
const fromDBReservas:Ref<datosReservas[]> = ref([])
const fromDBParkings:Ref<datosParkings[]> = ref([])

//Esto es para la paginacion de los las tablas Reservas y Parking
const pageR = ref(0)
const sizeR = 3
const sortFieldR = ref("id")
const sortOrderR = ref(1)
const loadingR = ref(false)
const totalRecordsR = ref(0)


const pageP = ref(0)
const sizeP = 3
const sortFieldP = ref("id")
const sortOrderP = ref(1)
const loadinP = ref(false)
const totalRecordP = ref(0)

const reservaParkingSeleccionada:Ref<datosParkings|undefined> = ref(undefined)

const reservaSeleccionada:Ref<datosReservas|undefined> = ref(undefined)
const muestraInfo = ref(false)

watch(reservaSeleccionada, (reserva) => {
  console.log("Seleccionamos reserva")
  if(reserva){
    muestraInfo.value = true;
  }
})


watch(reservaParkingSeleccionada, (reserva) => {
  console.log("Seleccionamos reserva Parking")
  if(reserva){
    //muestraInfo.value = true;
  }
})


const onPageR = (event: any) => {
  pageR.value = event.page
  buscaR()
}

const onSortR = (event: any) => {
  sortFieldR.value = event.sortField
  sortOrderR.value = event.sortOrder
  pageR.value = 0
  buscaR()
}

const onPageP = (event: any) => {
  pageP.value = event.page
  buscaP()
}

const onSortP = (event: any) => {
  sortFieldP.value = event.sortField
  sortOrderP.value = event.sortOrder
  pageP.value = 0
  buscaP()
}

const buscaR = async () => {
  loadingR.value = true
  try {
    const order = sortOrderR.value === 1 ? 'asc' : 'desc'
    const url = `${API_URL}umu/aeropuerto/public/vuelo/reservas/pasajero?ps=${variable.value}&page=${pageR.value}&size=${sizeR}&sort=${sortFieldR.value},${order}`
    const res = await fetch(url)
    const data = await res.json()

    fromDBReservas.value = data.content ?? []
    totalRecordsR.value = data.totalElements ?? 0
    tieneReservas.value = fromDBReservas.value.length > 0
  } catch (e) {
    console.error('Error al cargar reservas', e)
  } finally {
    loadingR.value = false
  }
}

const selectedReserva: Ref<datosReservas | undefined> = ref(undefined)

const buscaP = async () => {
  loadinP.value = true
  try {
    const order = sortOrderP.value === 1 ? 'asc' : 'desc'
    const url = `${API_URL}umu/aeropuerto/public/parking/pasajero?idPasajero=${variable.value}&page=${pageP.value}&size=${sizeP}&sort=${sortFieldP.value},${order}`
    const res = await fetch(url)
    const data = await res.json()

    fromDBParkings.value = (data.content ?? []).map((v: any) => ({
      ...v,
      fechaSalidaFormat: formatFecha(v.fechaInicio),
      fechaLlegadaFormat: formatFecha(v.fechaFin)
    })) 

    totalRecordP.value = data.totalElements ?? 0
    console.log(totalRecordP.value)
    tieneReservasParking.value = fromDBParkings.value.length > 0
  } catch (e) {
    console.error('Error al cargar parkings', e)
  } finally {
    loadinP.value = false
  }
}


const quieroBuscar = async () => {
  if (variable.value.length >= 8) {
    loadingFromDB.value = true;
    
    try {
        let resDatos = await fetch(API_URL+'umu/aeropuerto/public/vuelo/pasajero?id='+variable.value);
        
        if (!resDatos.ok) {
          throw new Error('Pasajero no encontrado');
        }
        
        let datos = await resDatos.json();
        console.log('Datos del pasajero:', datos);

        fromDBPasajero.value = datos as datosPasajero;
        tengoDatos.value = true;

          pageR.value = 0
          pageP.value = 0
          await buscaR()
          await buscaP()
        asignarGlobal();
    } catch (_e) {
      console.error('Error cargando datos:', _e);
      fromDBPasajero.value = undefined;
      fromDBReservas.value = []
      fromDBParkings.value = []
      tengoDatos.value = false; 
    } finally {
      loadingFromDB.value = false;
    }
  }
}

const editadaReserva = async () => {
  console.log('Editada reserva')
          pageR.value = 0
          await buscaR()
          asignarGlobal();
}

const editadoParking = async () => {
  console.log('Editado parking')
          pageP.value = 0
          await buscaP()
          asignarGlobal();
}



const quieroRegistrar = async () => {
  try {
    const body = {
      dni: pasajeroRegistro.value.dni,
      nombre: pasajeroRegistro.value.nombrePasajero,
      apellidos: pasajeroRegistro.value.apellidos,
      email: pasajeroRegistro.value.email,
      nacionalidad: pasajeroRegistro.value.nacionalidad
    };

    const response = await fetch(API_URL+'umu/aeropuerto/public/vuelo/registrar/pasajero', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error backend:', errorText);
      throw new Error('Error en el registro');
    }

    const data = await response.json();
    console.log('Registro exitoso:', data);
    errorRegPas.value = false;


    fromDBPasajero.value = data as datosPasajero;
    variable.value = pasajeroRegistro.value.dni; 
    tengoDatos.value = true;   
    quiereRegistrar.value = false; 

    await quieroBuscar();

  } catch(_e) {
    errorRegPas.value = true;
    console.log("Error registrando pasajero", _e);
  }
};

const registrar = () => {
  pasajeroRegistro.value.dni = variable.value
  quiereRegistrar.value = true
  muestraForm();
}

//Se puede desglosar para que no actualice todas las variables sino solo la que cambia.
const asignarGlobal = () => {
  if (fromDBPasajero.value) {
    console.log("Asignamos valores a Pinia");
    
    //forma manual 
    userStore.setUsuario({
      nombrePasajero: fromDBPasajero.value.nombrePasajero,
      apellidos: fromDBPasajero.value.apellidos,
      dni: fromDBPasajero.value.dni,
      email: fromDBPasajero.value.email,
      nacionalidad: fromDBPasajero.value.nacionalidad
    });


    //Forma automatica, usamos [...] para crear una copia.
    if(fromDBReservas.value){
      reservasStore.setReservas([...fromDBReservas.value])
    }

    if(fromDBParkings.value){
      parkingStore.setParkings([...fromDBParkings.value])
    }

  }
}


const form1:Ref<boolean> = ref(false);
const muestraForm = () => {
  form1.value = true;
}


// El valor seleccionado puede ser el objeto del país o el texto manual
const selectedCountry = ref(); 
const countries = ref([
    { name: 'Australia', code: 'AU' },
    { name: 'Brazil', code: 'BR' },
    { name: 'China', code: 'CN' },
    { name: 'Egypt', code: 'EG' },
    { name: 'France', code: 'FR' },
    { name: 'Germany', code: 'DE' },
    { name: 'India', code: 'IN' },
    { name: 'Japan', code: 'JP' },
    { name: 'Spain', code: 'ES' },
    { name: 'United States', code: 'US' }
]);
const filteredCountries = ref();

const search = (event: AutoCompleteCompleteEvent) => {
    if (!event.query.trim().length) {
        filteredCountries.value = [...countries.value];
    } else {
        filteredCountries.value = countries.value.filter((country) => {
            return country.name.toLowerCase().includes(event.query.toLowerCase());
        });
    }
};

// Sincronización: Si es objeto, guarda el nombre; si es texto (manual), guarda el texto.
watch(selectedCountry, (val) => {
    if (val && typeof val === 'object') {
        pasajeroRegistro.value.nacionalidad = val.code;
    } else {
        pasajeroRegistro.value.nacionalidad = val || '';
    }
});


const formatFecha = (fecha: string) => {
  const d = new Date(fecha)

  return d.toLocaleString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}




</script>

<template>
    <div>
          <Transition name="fade">
          <h2 v-if="!fromDBPasajero && !quiereRegistrar && !tengoDatos">
            Para ver tu información introduce tu DNI.
          </h2>
          </Transition >

        <Transition name="fade">
          <h1 v-if="tengoDatos || fromDBPasajero" class="green" id="titulo1">
          Bienvenid@ {{ fromDBPasajero?.nombrePasajero }}
          </h1>
        </Transition>

        <Transition name="fade">
        <div v-if="!fromDBPasajero && !quiereRegistrar && !tengoDatos" class="div1">
          <InputText 
            class="texto" 
            v-model="variable" 
            :invalid="variable.length < 8" 
            placeholder="DNI" 
            type="text" 
            variant="filled" 
          />
        </div>
        </Transition>

        <Transition name="fade">
          <div class="divTabla" v-if="tengoDatos || fromDBPasajero">
          <DataTable :size="size.value" :value="[fromDBPasajero]" tableStyle="min-width: 50rem">
              <Column field="nombrePasajero" header="Nombre"></Column>
              <Column field="apellidos" header="Apellidos"></Column>
              <Column field="dni" header="DNI"></Column>
              <Column field="email" header="Email"></Column>
              <Column field="nacionalidad" header="Nacionalidad"></Column>
          </DataTable>
          </div>
        </Transition>

       <Transition name="fade">
          <div v-if="tieneReservas">    
              <h2>Historial de reservas</h2>
              <div class="divTabla" v-if="fromDBReservas.length">
              <DataTable :size="size.value" :value="fromDBReservas"
              paginator
              lazy
              :rows="3"
              :totalRecords="totalRecordsR"
              :loading="loadingR"
              selectionMode="single"
              v-model:selection="reservaSeleccionada"
              @page="onPageR" 
              @sort="onSortR" 
              dataKey="id" 
              tableStyle="min-width: 50rem">
                      <Column field="fechaReserva" header="Fecha" sortable></Column>
                      <Column field="vueloSeleccionado" header="Vuelo" ></Column>
                      <Column field="claseAsiento" header="Clase" sortable ></Column>
                  </DataTable>
              </div>
          </div>
        </Transition> 

        <Teleport  to="body">
          <EditarReserva v-if="muestraInfo && reservaSeleccionada?.claseAsiento && 
          reservaSeleccionada.id" class="modal" @Yalotengo="muestraInfo = false, editadaReserva()" 
          @HuboError="muestraInfo = false" :idReserva="reservaSeleccionada?.vueloSeleccionado"
          :asiento="reservaSeleccionada.claseAsiento" :idReservaRes="reservaSeleccionada.id" :dniPasajero="reservaSeleccionada.pasajeroID"/>
        </Teleport>


        <Transition name="fade">
          <div v-if="tieneReservasParking">
              <h2>Historial de parkings</h2>
              <div class="divTabla" v-if="fromDBParkings.length">
            <DataTable 
              :size="size.value"
              :value="fromDBParkings"
              paginator
              lazy
              :rows="3"
              :totalRecords="totalRecordP"
              :loading="loadinP"
              selectionMode="single"
              v-model:selection="reservaParkingSeleccionada"
              @page="onPageP" 
              @sort="onSortP" 
              dataKey="id" 
              tableStyle="min-width: 50rem">
              <Column field="tipoParking" header="Tipo" sortable></Column>
              <Column field="precio" header="Precio" sortable></Column>
              <Column field="fechaSalidaFormat" header="Inicio" sortable></Column>
              <Column field="fechaLlegadaFormat" header="Fin" sortable></Column>       
              <Column field="pasajeroID" header="Pasajero"></Column>
            </DataTable>
              </div>
          </div>
        </Transition>
        <Transition name="fade">
          <div v-if="errorRegPas" class="divError">
              <h1 class="mensajeError">Datos incorrectos 🚨</h1>
          </div>
        </Transition>

        <Transition name="fade">
        <div class="divFrom" v-if="quiereRegistrar && !fromDBPasajero">       
            <IftaLabel v-if="form1" >
                <InputText class="texto2" v-model="pasajeroRegistro.nombrePasajero" :invalid="!pasajeroRegistro.nombrePasajero" />
                <label for="nombre">Nombre</label>
            </IftaLabel>

            <IftaLabel>
                <InputText class="texto2" v-model="pasajeroRegistro.apellidos" :invalid="!pasajeroRegistro.apellidos" />
                <label for="apellidos">Apellidos</label>
            </IftaLabel>
            <IftaLabel>
                <InputText class="texto2" v-model="pasajeroRegistro.dni" :invalid="!pasajeroRegistro.dni" />
                <label for="dni">DNI</label>
            </IftaLabel>
            <IftaLabel>
                <InputText class="texto2" v-model="pasajeroRegistro.email" :invalid="!pasajeroRegistro.email" />
                <label for="email">Email</label>
            </IftaLabel>

            <IftaLabel>
                <AutoComplete 
                    v-model="selectedCountry" 
                    optionLabel="name" 
                    :suggestions="filteredCountries" 
                    @complete="search" 
                    dropdown 
                    class="w-full"
                        :pt="{
                    input: { class: 'texto2' }}">
                    <template #option="slotProps">
                        <div class="flex items-center">
                            <img 
                                :alt="slotProps.option.name" 
                                src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png" 
                                :class="`flag flag-${slotProps.option.code.toLowerCase()} mr-2`" 
                                style="width: 18px; margin-right: 8px;" 
                            />
                            <div>{{ slotProps.option.name }}</div>
                        </div>
                    </template>
                </AutoComplete>
                <label for="nacio">Nacionalidad (Selecciona o escribe)</label>
            </IftaLabel>
        </div>
        </Transition>

        <div class="div2">
          <Transition name="fade">  
            <Button 
              v-if="!fromDBPasajero && !quiereRegistrar" 
              @click="quieroBuscar"  
              label="Buscar" 
              icon="pi pi-search" iconPos="left"
              raised 
            />
          </Transition>
            <Transition name="fade">  

          <Button 
              v-if="!fromDBPasajero && !quiereRegistrar" 
              @click="registrar"
              label="Registro" 
              icon="pi pi-user-plus" iconPos="left"
              severity="secondary" 
              raised 
            />
          </Transition>
          <Transition name="fade">  

            <Button 
              v-if="quiereRegistrar && !fromDBPasajero" 
              @click="quieroRegistrar"  
              label="Registrar" 
              icon="pi pi-user-plus" iconPos="left"
              severity="secondary" 
              raised 
            />
          </Transition>

        </div>
    </div>

    <div v-if="tengoDatos" class="botonVolver">
    <BotonVolver @click="regresarDatos" :msg="'/profile'" />
  </div>
</template>


<style scoped>

.modal {
  position: fixed;
  z-index: 999;
  top: 12%;
  left: 50%;
  width: 300px;
  margin-left: -150px;
}

h1 {
    font-size: 40px;
    text-align: center;
    font-weight: 500;
}


/*Esto para las tablas cuando ya teregistras*/
/* Entra lento (0.8s) */
.fade-enter-active {
  transition: opacity 0.8s ease-out;
}

/* Sale rápido (0s) */
.fade-leave-active {
  content-visibility: hidden;
  transition: opacity 0s ease-in;
  position: absolute; /* Evita que empuje a los demás al salir */
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}


#titulo1 {
    margin-bottom: 50px;
}

.mensajeError{
    text-align: left;
    margin-bottom: 20px;
}
.divFrom {
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-width: 400px;
    margin: 0 auto;
}

h2 {
    text-align: left;
    margin-bottom: 0.2rem;
}

.div1 {
    display: block;
    text-align: left;
}
.texto {
    margin: 15px;
    border-color: brown;
    background-color: #fff !important;
    color: #222 !important;
}
.texto2 {
    background-color: #ffffff !important;
    color: #222 !important;
}

.divTabla{
  display: flex;
  justify-content: center;
  margin-top: 0rem;
  margin-bottom: 1.5rem;
}

.tabla{
    margin-bottom: 25px;
    display: flex;
    justify-content: flex-end;
    background-color: #fff;
}


.div2 {
    display: flex;
    text-align: right;
    justify-content: flex-end;
    gap:16px
}
</style>