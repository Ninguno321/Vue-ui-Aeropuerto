<script setup lang="ts">
import InputText from 'primevue/inputtext';
import {onMounted,watch,  onUpdated, ref, type Ref, computed} from 'vue'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import IftaLabel from 'primevue/iftalabel';
import Paginator from 'primevue/paginator';
import Listbox from 'primevue/listbox';
import AutoComplete, { type AutoCompleteCompleteEvent } from 'primevue/autocomplete';
import BotonVolver from './BotonVolver.vue';


const API_URL = import.meta.env.VITE_API_URL;

const variable:Ref<string> = ref('')
const loadingFromDB:Ref<boolean> = ref(false)
const quiereRegistrar:Ref<boolean> = ref(false)
const errorRegPas:Ref<boolean> = ref(false)
const tieneReservas:Ref<boolean> = ref(false)
const tieneReservasParking:Ref<boolean> = ref(false)

const tengoDatos:Ref<boolean> = ref(false)

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
        
        // Cargar reservas                                                                                  //Esto tengo que cambiarlo 
                                                                                                            //Para que funcione con la paginacion.
        resDatos = await fetch(API_URL+'umu/aeropuerto/public/vuelo/reservas/pasajero?ps='+variable.value+'&page=0&size=10&sort=id');
        datos = await resDatos.json();
        fromDBReservas.value = Array.isArray(datos.content) ? datos.content : (Array.isArray(datos) ? datos : []);
        tieneReservas.value = fromDBReservas.value.length > 0;

        // Cargar parkings
        resDatos = await fetch(API_URL+'umu/aeropuerto/public/parking/pasajero?idPasajero='+variable.value+'&page=0&size=10&sort=id');
        datos = await resDatos.json();
        fromDBParkings.value = Array.isArray(datos.content) ? datos.content : (Array.isArray(datos) ? datos : []);
        tieneReservasParking.value = fromDBParkings.value.length > 0;

        tengoDatos.value = true;
    } catch (_e) {
      console.error('Error cargando datos:', _e);
      fromDBPasajero.value = undefined;
      tengoDatos.value = false; 
    } finally {
      loadingFromDB.value = false;
    }
  }
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
          <DataTable class="tabla" :value="[fromDBPasajero]" tableStyle="min-width: 50rem">
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
              <div class="card">
                  <Paginator :rows="10" :totalRecords="120" :rowsPerPageOptions="[1, 5, 30]"></Paginator>
              </div>
              <div class="divTabla" v-if="fromDBReservas.length">
                  <DataTable class="tabla" :value="fromDBReservas" tableStyle="min-width: 50rem">
                      <Column field="id" header="ID Reserva"></Column>
                      <Column field="fechaReserva" header="Fecha"></Column>
                      <Column field="vueloSeleccionado" header="Vuelo"></Column>
                      <Column field="claseAsiento" header="Clase"></Column>
                      <Column field="pasajeroID" header="Pasajero"></Column>
                      <Column header="Cancelada">
                          <template #body="slotProps">
                              {{ slotProps.data.cancelada ? 'Sí' : 'No' }}
                          </template>
                      </Column>
                  </DataTable>
              </div>
          </div>
        </Transition> 


        <Transition name="fade">
          <div v-if="tieneReservasParking">
              <h2>Historial de parkings</h2>
              <div class="divTabla" v-if="fromDBParkings.length">
                  <DataTable class="tabla" :value="fromDBParkings" tableStyle="min-width: 50rem">
                      <Column field="id" header="ID"></Column>
                      <Column field="tipoParking" header="Tipo"></Column>
                      <Column field="precio" header="Precio"></Column>
                      <Column field="fechaInicio" header="Inicio"></Column>
                      <Column field="fechaFin" header="Fin"></Column>
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
/*
:deep(.p-autocomplete-input) {
    width: 100%;
    background-color: #ffffff !important;
    color: #222 !important;
}

:deep(.p-autocomplete-dropdown) {
    background-color: #ffffff !important;
    color: #222 !important;
}
:deep(.p-autocomplete-list-container) {
    background-color: #ffffff !important;
    color: #222 !important;
}
*/

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
    max-width: max-content;
    display: flex;
    justify-content: flex-end;
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