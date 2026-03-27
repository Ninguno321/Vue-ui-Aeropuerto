<script setup lang="ts">
import {onMounted,watch, ref, type Ref} from 'vue'
import Card from 'primevue/card';
import Button from 'primevue/button';
import { useUserStore } from '@/stores/datos';
import IftaLabel from 'primevue/iftalabel';
import AutoComplete, { type AutoCompleteCompleteEvent } from 'primevue/autocomplete';
import InputText from 'primevue/inputtext';
import { NACION } from '@/data/nacionalidades';

const userStore = useUserStore()
const dniPasajero:Ref<string | undefined> = ref(undefined);
const nombrePasajero:Ref<string | undefined> = ref(undefined);
const apellidoPasajero:Ref<string | undefined> = ref(undefined);
const emailPasajero:Ref<string | undefined> = ref(undefined);
const nacionalidadPasajero:Ref<string | undefined> = ref(undefined);

const emit = defineEmits(['cancelado', 'registrado'])

onMounted(() => {
    dniPasajero.value = userStore.usuario?.dni
    nombrePasajero.value = userStore.usuario?.nombrePasajero
    apellidoPasajero.value = userStore.usuario?.apellidos
    emailPasajero.value = userStore.usuario?.email
})


const selectedCountry = ref(); 
const countries = NACION
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
         nacionalidadPasajero.value = val.code;
    } else {
        nacionalidadPasajero.value= val || '';
    }
});


interface DatosPasajero {
  nombrePasajero: string,
  apellidos: string,
  dni: string,
  email: string,
  nacionalidad: string
}
const muestraMsgError=ref(false)

const API_URL = import.meta.env.VITE_API_URL

const registro = async () => {

    if(nombrePasajero.value && apellidoPasajero.value && dniPasajero.value && emailPasajero.value && nacionalidadPasajero.value) {
        let pasajeroRegistro: Ref<DatosPasajero> = ref({
            nombrePasajero: nombrePasajero.value,
            apellidos: apellidoPasajero.value,
            dni: dniPasajero.value,
            email: emailPasajero.value,
            nacionalidad: nacionalidadPasajero.value
        })


        let siono=ref(false)

        try {
            console.log('Primero hacemos un GET del pasajero', dniPasajero.value);
            let resDatos = await fetch(API_URL+'umu/aeropuerto/public/vuelo/pasajero?id='+dniPasajero.value);
            
            if (!resDatos.ok) {            
                throw new Error('Pasajero no encontrado');
            }
            

            console.log('Hemos encontrado el pasajero en el get');

            let datos = await resDatos.json();
            console.log('Lo hemos encontrado con estos datos: ', dniPasajero.value);

            pasajeroRegistro.value = datos as DatosPasajero;
            siono.value=true

            userStore.setUsuario({
                nombrePasajero: pasajeroRegistro.value.nombrePasajero,
                apellidos: pasajeroRegistro.value.apellidos,
                dni: pasajeroRegistro.value.dni,
                email: pasajeroRegistro.value.email,
                nacionalidad: pasajeroRegistro.value.nacionalidad
                });

            console.log('El valor actual de la variable global es: ', userStore.usuario);

        }catch(e){
            console.error("error buscando el pasajero", e)
        } 

        if(!siono.value){
            console.log('No hemos encontrado que este registrado asi que lo registramos', pasajeroRegistro.value);

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
            muestraMsgError.value =true
            throw new Error('Error en el registro');
            }
            console.log('No salta exception en el POST', response);
            const data = await response.json();
            console.log('Registro exitoso:', data);
            muestraMsgError.value=false
            //Esto esta mal, data es un OK, no me devuelve los datos correctos.
            console.log('Asignamos el siguiente valor a la global', pasajeroRegistro.value);

            userStore.setUsuario({
                nombrePasajero: pasajeroRegistro.value.nombrePasajero,
                apellidos: pasajeroRegistro.value.apellidos,
                dni: pasajeroRegistro.value.dni,
                email: pasajeroRegistro.value.email,
                nacionalidad: pasajeroRegistro.value.nacionalidad
                });

            console.log('Esto es el valor actual de la global', userStore.usuario);


            siono.value = true
        }
        if(siono.value){
            emit('registrado')
        }else{
            emit('cancelado')
        }
    }

}

</script>


<template>
    <Card data-cy="card-from-usu" style="width: 25rem; overflow: hidden" class="sombra">
        <template #title>Registro de pasajero</template>
        <template #subtitle> <p data-cy="sub-card-usu">  Bienvenid@, para realizar una reserva es necesario que complete 
            el registro, muchas gracias. 😊
        </p>
        </template>
        <template #content>

            <Transition name="fade">
                <div class="divFrom" >       
                    
                    <IftaLabel data-cy="form-card-n">
                        <InputText size="small" class="texto2" v-model="nombrePasajero" :invalid="!nombrePasajero" />
                        <label for="nombre">Nombre</label>
                    </IftaLabel>

                    <IftaLabel data-cy="form-card-a">
                        <InputText size="small" class="texto2" v-model="apellidoPasajero" :invalid="!apellidoPasajero" />
                        <label for="apellidos">Apellidos</label>
                    </IftaLabel>
                    <IftaLabel data-cy="form-card-d">
                        <InputText size="small"  class="texto2" v-model="dniPasajero" :invalid="!dniPasajero" />
                        <label for="dni">DNI</label>
                    </IftaLabel>
                    <IftaLabel data-cy="form-card-e">
                        <InputText size="small"class="texto2" v-model="emailPasajero" :invalid="!emailPasajero" />
                        <label for="email">Email</label>
                    </IftaLabel>

                    <IftaLabel data-cy="form-card-na">
                        <AutoComplete 
                            :invalid="!selectedCountry"
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
    
            
        <Transition name="fade2">
            <div v-if="muestraMsgError" class="divTabla alineacion">
            <i class="pi pi-exclamation-circle" />
            <p>Hubo un error</p>
            </div>
        </Transition>



        </template>
        <template #footer>
            <div class="flex gap-4 mt-1 separa">
                <Button v-if="userStore.tieneDatos()" @click="$emit('cancelado')" label="Cerrar" severity="secondary" variant="outlined" class="w-full" />
                <Button data-cy="boton-cancel-card-usu" v-if="!userStore.tieneDatos()"  @click="$emit('cancelado')" label="Cancel" severity="secondary" variant="outlined" class="w-full" />
                <Button data-cy="boton-conf-card-usu" @click="registro()" :disabled="userStore.tieneDatos() || !nombrePasajero
                        || !apellidoPasajero || !dniPasajero || !nacionalidadPasajero || ! emailPasajero" label="Confirmar" raised icon="pi pi-user-plus" iconPos="left"/>
            </div>
        </template>
    </Card>
</template>


<style scoped>

.separa{
    display: flex;
    gap: 1rem;
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

.divTabla {
  display: flex;
  justify-content: left;
  margin-top: 1rem;
  margin-bottom: 1rem;
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

.divFrom {
    display: flex;
    flex-direction: column;
    align-items: left;
    gap: 1rem;
    margin-left: 1rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
}
.sombra{
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); 
    padding: 0.6rem; 
}

</style>