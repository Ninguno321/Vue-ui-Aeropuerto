<script setup lang="ts">
import { ref, type Ref, computed} from "vue";
import ParkingItem from './ParkingItem.vue';
import { useUserStore } from '@/stores/datos';
import { Fieldset } from 'primevue';
import DatePicker from 'primevue/datepicker';
import BotonLibre from "./BotonLibre.vue";
import Button from 'primevue/button';
import FormUsuario from "./FormUsuario.vue";
import ScrollPanel from 'primevue/scrollpanel';
import { TermCond } from "@/data/terminosParking";

const userStore = useUserStore()
const API_URL = import.meta.env.VITE_API_URL 

let today = new Date();
let month = today.getMonth();
let year = today.getFullYear();
let prevMonth = (month === 0) ? 11 : month -1;
let prevYear = (prevMonth === 11) ? year - 1 : year;
let nextMonth = (month === 11) ? 0 : month + 1;
let nextYear = (nextMonth === 0) ? year + 1 : year;

const date = ref();
const minDate = ref(new Date());
const maxDate = ref(null);

//minDate.value.setMonth(prevMonth);
//minDate.value.setFullYear(prevYear);
//maxDate.value.setMonth(nextMonth);
//maxDate.value.setFullYear(nextYear);

const datetime24h = ref();


const tipoParking = computed(() => {
  if (!date.value || !date.value[0] || !date.value[1]) return 'CORTO';

  const inicio = date.value[0];
  const fin = date.value[1];

  // Diferencia en milisegundos
  const diffMs = fin.getTime() - inicio.getTime();

  // Convertir a días completos
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  return diffDays <= 2 ? 'CORTO' : 'LARGO';
});


const mostrarRegistro:Ref<boolean> = ref(false)

const errorReservando:Ref<boolean> = ref(false)

    
const muestraMasInfo:Ref<boolean> = ref(false)



const reservarParking = async () => {
    errorReservando.value = false;
    try {
        const body = {
            fecha: {
                fechaInicio: date.value[0],
                fechaFin: date.value[1]
            },
            tipoParking: tipoParking.value,
            pasajeroId: userStore.usuario?.dni
        }
        const response = await fetch(API_URL+'umu/aeropuerto/public/parking/reservar', {
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
        muestraMasInfo.value=true
        showConfetti()
    }catch(_e){
        console.log('Error en la reserva:', _e);
        errorReservando.value = true;
    }
}


const reservar = () => {
    console.log(userStore.usuario)
    
    if(userStore.tieneDatos()){
        reservarParking()
    }else{
        mostrarRegistro.value = true;
        console.log("Primero tienes que registrarte")
        //Primero tiene que registrarse, mostramos un Teleport con el registro y actualizamos la global.
    }
}

const registradoPasajero = () => {
    mostrarRegistro.value = false;
    reservar()
}

const confetti = new JSConfetti()
import JSConfetti from 'js-confetti'

function showConfetti() {
  confetti.addConfetti()
}


</script>

<template>
    <ParkingItem>
        <template #icon>

            <Fieldset legend="UMUFly">
                <p class="m-0">
                    Hola, {{ userStore.usuario?.nombrePasajero ?? 'Usuario' }}
                    ¡Gracias por conocer nuestra comunidad de viajeros! Estamos muy felices de poder tenerte a bordo.
                    Para que puedas empezar a buscar las mejores rutas y asegurar tu próximo asiento frente a la ventana, solo necesitamos que confirmes tu datos para completar la reserva.
                </p>
            </Fieldset>

        </template>
        <template #heading>

                <Transition name="fade2">
                        <Teleport to="body">
                            <FormUsuario v-if=mostrarRegistro @cancelado="mostrarRegistro=false" @registrado="registradoPasajero()" class="modal"/>
                        </Teleport>
                </Transition>


                <div v-if="!muestraMasInfo" class="card flex-col flex justify-center ">
                     <label for="datepicker-24h" class="font-bold block mb-2"> {{userStore.usuario?.nombrePasajero ?? 'Usuario, '}} seleccione el periodo de parking a reservar</label>
                    <DatePicker v-model="date" :invalid="!date" :minDate="minDate" selectionMode="range" showTime  hourFormat="24" :manualInput="false" />
                </div>    
                              <div v-else>

                    <ScrollPanel class="item" style="width: 100%; height: 200px">
                        <p style="margin-bottom: 1rem;"> 
                            Muchas gracias por completar la reserva de parking con nosotros, {{ userStore.usuario?.nombrePasajero }}, puedes revisarla en tu perfil o ir a reservar un vuelo. 😊
                        </p>
                        <p style="margin-bottom: 0.5rem;">- Términos y condiciones 😨</p>
                        <p style="padding-left: 1.5rem;"> 
                            {{TermCond}}
                        </p>
                    </ScrollPanel>  

                </div>



            </template>
    
        <template #final>
            <div v-if="muestraMasInfo" class="masinfo">
                <BotonLibre   :ruta="'/profile'" :label="'Ir a mi perfil'" :icono="'pi pi-user'"/>
                <BotonLibre   :ruta="'/buscar/vuelos'" :label="'Reservar Vuelo'" :icono="'pi pi-search-plus'" />
            </div>
                
        </template>

        <template #finalMas class="finalMas">
            <Button v-if="!muestraMasInfo" :disabled="!date  || date[0] === date[1]" @click="reservar" label="Reservar" raised icon="pi pi-calendar-plus" iconPos="left"/>
            <BotonLibre :icono="'pi pi-arrow-left'" :label="'Volver'" :ruta="'/aeropuerto'"/>
        </template>


    </ParkingItem>

</template>

<style scoped>

.flex-col {
  display: flex;
  flex-direction: column;
  align-items: left; 
  gap: 0.5rem;  
}

.modal {
  position: fixed;
  z-index: 999;
  top: 20%;
  left: 50%;
  width: 300px;
  margin-left: -150px;
}
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

.finalMas {
    display: flex;
    gap: 1rem;
}
.masinfo{
    display: flex;
    gap: 1rem;
}
</style>