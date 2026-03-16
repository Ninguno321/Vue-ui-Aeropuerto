<script setup lang="ts">    //Ponemos setup para poder usar la composition API, es decir, ref, computed, etc. y lang="ts" para usar TypeScript.
import ReservasItem from './ReservasItem.vue';  //Importamos el componente ReservasItem, que es el que se va a encargar de mostrar cada reserva individualmente.
import Fieldset from 'primevue/fieldset';
import Card from 'primevue/card';
import { useUserStore } from '@/stores/datos';
import {onMounted,watch, computed, ref, type Ref } from 'vue';                                            //Me llega la funcion para volver a la pantalla anterior.
import Button from 'primevue/button';
import BotonVolver from './BotonVolver.vue';
import BotonLibre from './BotonLibre.vue';
import Rating from 'primevue/rating';


import ConfirmarReservaItem from '@/components/ConfirmarReservaItem.vue';
const open = ref(false);

const muestraMasInfo = ref(false);
const confirmaReserva = () => {
    open.value=false
    muestraMasInfo.value = true
}

const confirma = () => {
    open.value=true
    muestraMasInfo.value = false
}

const valoracion:Ref<number> = ref(0)

const userStore = useUserStore();


const props = defineProps<{         //Me llega la url donde estaba antes
  idVuelo: string
}>()



</script>


//En este componente, lo que vamos a hacer es mostrar una lista de reservas, cada una de ellas 
representada por un componente ReservasItem. Para ello, vamos a usar un v-for para iterar sobre un
 array de reservas y mostrar cada una de ellas en un ReservasItem. Además, vamos a usar slots para 
 personalizar el contenido de cada ReservasItem, como el icono y el heading.
<template>
    <ReservasItem>
        <template #icon>
            
            <Fieldset legend="Header">
                <p class="m-0">
                    Hola, {{ userStore.usuario?.nombrePasajero }}:
                    ¡Gracias por unirte a nuestra comunidad de viajeros! Estamos muy felices de tenerte a bordo.
                    Para que puedas empezar a buscar las mejores rutas y asegurar tu próximo asiento frente a la ventana, solo necesitamos que confirmes tu datos haciendo clic en el botón de abajo:
                </p>
            </Fieldset>
        </template>
        <template #heading>

            <Button v-if="!open" @click="confirma" class="boton" label="Mostrar Información" raised icon="pi pi-check-circle" iconPos="left"/>
            


            <div v-if="muestraMasInfo" class="masinfo">
                <BotonVolver  :msg="'/buscar/vuelos'" />
                <BotonLibre   :ruta="'/profile'" :label="'Ir a mi perfil'" :icono="'pi pi-user'"/>
                <BotonLibre   :ruta="'/reservaParking'" :label="'Reservar parking'" :icono="'pi pi-search-plus'" />
            </div>
        <Teleport to="body">
        <div v-if="open" class="modal">
            <ConfirmarReservaItem @Yalotengo="confirmaReserva" :idVuelo="props.idVuelo" />
        </div>
        </Teleport>
        
        </template>
    
        <template #final>
            <Rating v-model="valoracion">
                <template #onicon>
                    <img src="https://primefaces.org/cdn/primevue/images/rating/custom-onicon.png" height="24" width="24" />
                </template>
                <template #officon>
                    <img src="https://primefaces.org/cdn/primevue/images/rating/custom-officon.png" height="24" width="24" />
                </template>
            </Rating>

        </template>
    </ReservasItem>

</template>

<style scoped>
.modal {
  position: fixed;
  z-index: 999;
  top: 25%;
  left: 65%;
  width: 300px;
  margin-left: -150px;
}
.boton{
    margin-top: 1rem;
}

.masinfo{
    display: flex;
    text-align: center;
}


</style>

