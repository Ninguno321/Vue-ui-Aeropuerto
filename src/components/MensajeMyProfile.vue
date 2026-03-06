<script setup lang="ts">
import InputText from 'primevue/inputtext';
import {onMounted, onUpdated, ref, type Ref, computed} from 'vue'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import IftaLabel from 'primevue/iftalabel';
import { v } from 'vue-router/dist/router-CWoNjPRp.mjs';
import Paginator from 'primevue/paginator';

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
}

</script>

<template>
    <div>
        <h2 v-if="!fromDBPasajero && !quiereRegistrar && !tengoDatos">
          Para ver tu información introduce tu DNI.
        </h2>
        

        <h1 v-if="tengoDatos || fromDBPasajero" class="green" id="titulo1">
        Bienvenid@ {{ fromDBPasajero?.nombrePasajero }}
        </h1>

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
        



        <div class="divTabla" v-if="tengoDatos || fromDBPasajero">
        <DataTable class="tabla" :value="[fromDBPasajero]" tableStyle="min-width: 50rem">
            <Column field="nombrePasajero" header="Nombre"></Column>
            <Column field="apellidos" header="Apellidos"></Column>
            <Column field="dni" header="DNI"></Column>
            <Column field="email" header="Email"></Column>
            <Column field="nacionalidad" header="Nacionalidad"></Column>
        </DataTable>
        </div>

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

        <div v-if="errorRegPas" class="divError">
            <h1 class="mensajeError">Datos incorrectos 🚨</h1>
        </div>

        <div class="divFrom" v-if="quiereRegistrar && !fromDBPasajero">
            <IftaLabel>
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
                <InputText class="texto2" v-model="pasajeroRegistro.nacionalidad" :invalid="!pasajeroRegistro.nacionalidad" />
                <label for="nacio">Nacionalidad</label>
            </IftaLabel>
        </div>
        
        <div class="div2">
            <Button 
              v-if="!fromDBPasajero && !quiereRegistrar" 
              @click="quieroBuscar"  
              label="Buscar" 
              raised 
            />
            <Button 
              v-if="!fromDBPasajero && !quiereRegistrar" 
              @click="registrar"  
              label="Registro" 
              severity="secondary" 
              raised 
            />
            <Button 
              v-if="quiereRegistrar && !fromDBPasajero" 
              @click="quieroRegistrar"  
              label="Registrar" 
              severity="secondary" 
              raised 
            />
        </div>
    </div>
</template>

<style scoped>
h1 {
    font-size: 40px;
    text-align: center;
    font-weight: 500;
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