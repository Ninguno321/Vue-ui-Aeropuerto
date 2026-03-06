<script setup lang="ts">
import InputText from 'primevue/inputtext';
import {onMounted, onUpdated, ref, type Ref, computed} from 'vue'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';

const variable:Ref<string> = ref('')
const loadingFromDB:Ref<boolean> = ref(false)
const tenemosDatos:Ref<boolean> = ref(false)
interface datosPasajero {
  nombrePasajero: string,
  apellidos: string,
  dni: string,
  email: string,
  nacionalidad: string
}

const fromDBPasajero:Ref<datosPasajero|undefined> = ref(undefined)

const quieroBuscar = async () => {
  if (variable.value.length >= 8) {
    loadingFromDB.value = true;
    try {
      const resDatos = await fetch('http://localhost:8080/umu/aeropuerto/public/vuelo/pasajero?id=' + variable.value);
      const datos = await resDatos.json();
      fromDBPasajero.value = datos as datosPasajero;
      console.log(fromDBPasajero.value)
    } catch (_e) {
      // Aqui manejamos los posibles errores
    }
    loadingFromDB.value = false;
  }
}


const quieroRegistrar = ()=> {

}



</script>

<template>
    <div>

        <h2 v-if="!fromDBPasajero">Para ver tu información introduce tu DNI.</h2>
        <h1 v-if="fromDBPasajero" class="green" >Bienvenid@ {{ fromDBPasajero.nombrePasajero}}</h1>
        <div v-if="!fromDBPasajero" class="div1">
          <InputText class="texto" v-model="variable" :invalid="variable.length < 8" placeholder="DNI" type="text" variant="filled" />
        </div>
            <div class="divTabla" v-if="fromDBPasajero">
                <DataTable class="tabla" :value="[fromDBPasajero]" tableStyle="min-width: 50rem">
                    <Column field="nombrePasajero" header="Nombre"></Column>
                    <Column field="apellidos" header="Apellidos"></Column>
                    <Column field="dni" header="DNI"></Column>
                    <Column field="email" header="Email"></Column>
                    <Column field="nacionalidad" header="Nacionalidad"></Column>
                </DataTable>
            </div>
        <div v-if="!fromDBPasajero" class="div2">
            <Button @click="quieroBuscar"  label="Buscar" raised />
            <Button @click="quieroRegistrar"  label="Registrar" severity="secondary" raised />
        </div>
    </div>
</template>




<style scope>
h1 {
    font-size: 40px;
    text-align: center;
    font-weight: 500;
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

.divTabla{
    max-width: max-content;
    display: flex;
    justify-content: flex-end;
} 

.tabla{
    margin-top: 50px;
    display: flex;
    justify-content: flex-end;
}


.p-component {
  background-color: white;
}

.div2 {
    display: flex;
    text-align: right;
    justify-content: flex-end;
    gap:16px
}

</style>
