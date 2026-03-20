<script setup lang="ts">
import {onMounted,watch, ref, type Ref} from 'vue'
import Card from 'primevue/card';
import Button from 'primevue/button';
import { useUserStore } from '@/stores/datos';
import IftaLabel from 'primevue/iftalabel';
import AutoComplete, { type AutoCompleteCompleteEvent } from 'primevue/autocomplete';
import InputText from 'primevue/inputtext';

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
const countries = ref([
    { name: 'Afghanistan', code: 'AF' },
  { name: 'Albania', code: 'AL' },
  { name: 'Algeria', code: 'DZ' },
  { name: 'Andorra', code: 'AD' },
  { name: 'Angola', code: 'AO' },
  { name: 'Antigua and Barbuda', code: 'AG' },
  { name: 'Argentina', code: 'AR' },
  { name: 'Armenia', code: 'AM' },
  { name: 'Australia', code: 'AU' },
  { name: 'Austria', code: 'AT' },
  { name: 'Azerbaijan', code: 'AZ' },
  { name: 'Bahamas', code: 'BS' },
  { name: 'Bahrain', code: 'BH' },
  { name: 'Bangladesh', code: 'BD' },
  { name: 'Barbados', code: 'BB' },
  { name: 'Belarus', code: 'BY' },
  { name: 'Belgium', code: 'BE' },
  { name: 'Belize', code: 'BZ' },
  { name: 'Benin', code: 'BJ' },
  { name: 'Bhutan', code: 'BT' },
  { name: 'Bolivia', code: 'BO' },
  { name: 'Bosnia and Herzegovina', code: 'BA' },
  { name: 'Botswana', code: 'BW' },
  { name: 'Brazil', code: 'BR' },
  { name: 'Brunei', code: 'BN' },
  { name: 'Bulgaria', code: 'BG' },
  { name: 'Burkina Faso', code: 'BF' },
  { name: 'Burundi', code: 'BI' },
  { name: 'Cabo Verde', code: 'CV' },
  { name: 'Cambodia', code: 'KH' },
  { name: 'Cameroon', code: 'CM' },
  { name: 'Canada', code: 'CA' },
  { name: 'Central African Republic', code: 'CF' },
  { name: 'Chad', code: 'TD' },
  { name: 'Chile', code: 'CL' },
  { name: 'China', code: 'CN' },
  { name: 'Colombia', code: 'CO' },
  { name: 'Comoros', code: 'KM' },
  { name: 'Congo (Congo-Brazzaville)', code: 'CG' },
  { name: 'Costa Rica', code: 'CR' },
  { name: 'Croatia', code: 'HR' },
  { name: 'Cuba', code: 'CU' },
  { name: 'Cyprus', code: 'CY' },
  { name: 'Czechia (Czech Republic)', code: 'CZ' },
  { name: 'Democratic Republic of the Congo', code: 'CD' },
  { name: 'Denmark', code: 'DK' },
  { name: 'Djibouti', code: 'DJ' },
  { name: 'Dominica', code: 'DM' },
  { name: 'Dominican Republic', code: 'DO' },
  { name: 'Ecuador', code: 'EC' },
  { name: 'Egypt', code: 'EG' },
  { name: 'El Salvador', code: 'SV' },
  { name: 'Equatorial Guinea', code: 'GQ' },
  { name: 'Eritrea', code: 'ER' },
  { name: 'Estonia', code: 'EE' },
  { name: 'Eswatini', code: 'SZ' },
  { name: 'Ethiopia', code: 'ET' },
  { name: 'Fiji', code: 'FJ' },
  { name: 'Finland', code: 'FI' },
  { name: 'France', code: 'FR' },
  { name: 'Gabon', code: 'GA' },
  { name: 'Gambia', code: 'GM' },
  { name: 'Georgia', code: 'GE' },
  { name: 'Germany', code: 'DE' },
  { name: 'Ghana', code: 'GH' },
  { name: 'Greece', code: 'GR' },
  { name: 'Grenada', code: 'GD' },
  { name: 'Guatemala', code: 'GT' },
  { name: 'Guinea', code: 'GN' },
  { name: 'Guinea-Bissau', code: 'GW' },
  { name: 'Guyana', code: 'GY' },
  { name: 'Haiti', code: 'HT' },
  { name: 'Honduras', code: 'HN' },
  { name: 'Hungary', code: 'HU' },
  { name: 'Iceland', code: 'IS' },
  { name: 'India', code: 'IN' },
  { name: 'Indonesia', code: 'ID' },
  { name: 'Iran', code: 'IR' },
  { name: 'Iraq', code: 'IQ' },
  { name: 'Ireland', code: 'IE' },
  { name: 'Israel', code: 'IL' },
  { name: 'Italy', code: 'IT' },
  { name: 'Jamaica', code: 'JM' },
  { name: 'Japan', code: 'JP' },
  { name: 'Jordan', code: 'JO' },
  { name: 'Kazakhstan', code: 'KZ' },
  { name: 'Kenya', code: 'KE' },
  { name: 'Kiribati', code: 'KI' },
  { name: 'Kuwait', code: 'KW' },
  { name: 'Kyrgyzstan', code: 'KG' },
  { name: 'Laos', code: 'LA' },
  { name: 'Latvia', code: 'LV' },
  { name: 'Lebanon', code: 'LB' },
  { name: 'Lesotho', code: 'LS' },
  { name: 'Liberia', code: 'LR' },
  { name: 'Libya', code: 'LY' },
  { name: 'Liechtenstein', code: 'LI' },
  { name: 'Lithuania', code: 'LT' },
  { name: 'Luxembourg', code: 'LU' },
  { name: 'Madagascar', code: 'MG' },
  { name: 'Malawi', code: 'MW' },
  { name: 'Malaysia', code: 'MY' },
  { name: 'Maldives', code: 'MV' },
  { name: 'Mali', code: 'ML' },
  { name: 'Malta', code: 'MT' },
  { name: 'Marshall Islands', code: 'MH' },
  { name: 'Mauritania', code: 'MR' },
  { name: 'Mauritius', code: 'MU' },
  { name: 'Mexico', code: 'MX' },
  { name: 'Micronesia', code: 'FM' },
  { name: 'Moldova', code: 'MD' },
  { name: 'Monaco', code: 'MC' },
  { name: 'Mongolia', code: 'MN' },
  { name: 'Montenegro', code: 'ME' },
  { name: 'Morocco', code: 'MA' },
  { name: 'Mozambique', code: 'MZ' },
  { name: 'Myanmar', code: 'MM' },
  { name: 'Namibia', code: 'NA' },
  { name: 'Nauru', code: 'NR' },
  { name: 'Nepal', code: 'NP' },
  { name: 'Netherlands', code: 'NL' },
  { name: 'New Zealand', code: 'NZ' },
  { name: 'Nicaragua', code: 'NI' },
  { name: 'Niger', code: 'NE' },
  { name: 'Nigeria', code: 'NG' },
  { name: 'North Korea', code: 'KP' },
  { name: 'North Macedonia', code: 'MK' },
  { name: 'Norway', code: 'NO' },
  { name: 'Oman', code: 'OM' },
  { name: 'Pakistan', code: 'PK' },
  { name: 'Palau', code: 'PW' },
  { name: 'Palestine', code: 'PS' },
  { name: 'Panama', code: 'PA' },
  { name: 'Papua New Guinea', code: 'PG' },
  { name: 'Paraguay', code: 'PY' },
  { name: 'Peru', code: 'PE' },
  { name: 'Philippines', code: 'PH' },
  { name: 'Poland', code: 'PL' },
  { name: 'Portugal', code: 'PT' },
  { name: 'Qatar', code: 'QA' },
  { name: 'Romania', code: 'RO' },
  { name: 'Russia', code: 'RU' },
  { name: 'Rwanda', code: 'RW' },
  { name: 'Saint Kitts and Nevis', code: 'KN' },
  { name: 'Saint Lucia', code: 'LC' },
  { name: 'Saint Vincent and the Grenadines', code: 'VC' },
  { name: 'Samoa', code: 'WS' },
  { name: 'San Marino', code: 'SM' },
  { name: 'Sao Tome and Principe', code: 'ST' },
  { name: 'Saudi Arabia', code: 'SA' },
  { name: 'Senegal', code: 'SN' },
  { name: 'Serbia', code: 'RS' },
  { name: 'Seychelles', code: 'SC' },
  { name: 'Sierra Leone', code: 'SL' },
  { name: 'Singapore', code: 'SG' },
  { name: 'Slovakia', code: 'SK' },
  { name: 'Slovenia', code: 'SI' },
  { name: 'Solomon Islands', code: 'SB' },
  { name: 'Somalia', code: 'SO' },
  { name: 'South Africa', code: 'ZA' },
  { name: 'South Korea', code: 'KR' },
  { name: 'South Sudan', code: 'SS' },
  { name: 'España', code: 'ES' },
  { name: 'Spain', code: 'ES' },
  { name: 'Sri Lanka', code: 'LK' },
  { name: 'Sudan', code: 'SD' },
  { name: 'Suriname', code: 'SR' },
  { name: 'Sweden', code: 'SE' },
  { name: 'Switzerland', code: 'CH' },
  { name: 'Syria', code: 'SY' },
  { name: 'Taiwan', code: 'TW' },
  { name: 'Tajikistan', code: 'TJ' },
  { name: 'Tanzania', code: 'TZ' },
  { name: 'Thailand', code: 'TH' },
  { name: 'Timor-Leste', code: 'TL' },
  { name: 'Togo', code: 'TG' },
  { name: 'Tonga', code: 'TO' },
  { name: 'Trinidad and Tobago', code: 'TT' },
  { name: 'Tunisia', code: 'TN' },
  { name: 'Turkey', code: 'TR' },
  { name: 'Turkmenistan', code: 'TM' },
  { name: 'Tuvalu', code: 'TV' },
  { name: 'Uganda', code: 'UG' },
  { name: 'Ukraine', code: 'UA' },
  { name: 'United Arab Emirates', code: 'AE' },
  { name: 'United Kingdom', code: 'GB' },
  { name: 'United States', code: 'US' },
  { name: 'Uruguay', code: 'UY' },
  { name: 'Uzbekistan', code: 'UZ' },
  { name: 'Vanuatu', code: 'VU' },
  { name: 'Vatican City', code: 'VA' },
  { name: 'Venezuela', code: 'VE' },
  { name: 'Vietnam', code: 'VN' },
  { name: 'Yemen', code: 'YE' },
  { name: 'Zambia', code: 'ZM' },
  { name: 'Zimbabwe', code: 'ZW' }
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
    <Card style="width: 25rem; overflow: hidden" class="sombra">
        <template #title>Registro de pasajero</template>
        <template #subtitle> <p>  Bienvenid@, para realizar una reserva es necesario que complete 
            el registro, muchas gracias. 😊
        </p>
        </template>
        <template #content>

            <Transition name="fade">
                <div class="divFrom" >       
                    
                    <IftaLabel>
                        <InputText size="small" class="texto2" v-model="nombrePasajero" :invalid="!nombrePasajero" />
                        <label for="nombre">Nombre</label>
                    </IftaLabel>

                    <IftaLabel>
                        <InputText size="small" class="texto2" v-model="apellidoPasajero" :invalid="!apellidoPasajero" />
                        <label for="apellidos">Apellidos</label>
                    </IftaLabel>
                    <IftaLabel>
                        <InputText size="small"  class="texto2" v-model="dniPasajero" :invalid="!dniPasajero" />
                        <label for="dni">DNI</label>
                    </IftaLabel>
                    <IftaLabel>
                        <InputText size="small"class="texto2" v-model="emailPasajero" :invalid="!emailPasajero" />
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
                <Button v-if="!userStore.tieneDatos()"  @click="$emit('cancelado')" label="Cancel" severity="secondary" variant="outlined" class="w-full" />
                <Button @click="registro()" :disabled="userStore.tieneDatos()" label="Confirmar" raised icon="pi pi-user-plus" iconPos="left"/>
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