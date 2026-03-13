<script setup lang="ts">
import {onMounted, ref, type Ref} from 'vue'
import Card from 'primevue/card';
import Button from 'primevue/button';
import type { formatDiagnostic } from 'typescript';
import { useUserStore } from '@/stores/datos';

const userStore = useUserStore()

const dniPasajero:Ref<string | undefined> = ref(undefined);
const nombrePasajero:Ref<string | undefined> = ref(undefined);
const apellidoPasajero:Ref<string | undefined> = ref(undefined);
const emailPasajero:Ref<string | undefined> = ref(undefined);

defineEmits(['Yalotengo'])

onMounted(() => {
    dniPasajero.value = userStore.usuario?.dni
    nombrePasajero.value = userStore.usuario?.nombrePasajero
    apellidoPasajero.value = userStore.usuario?.apellidos
    emailPasajero.value = userStore.usuario?.email
})

</script>

<template>
    <Card style="width: 25rem; overflow: hidden">
        <template #header>
            <img alt="user header" src="/public/fotoChat.png" class="header-image"/>
        </template>
        <template #title>Información del vuelo</template>
        <template #subtitle> <p>DNI: {{ dniPasajero }}</p>
                             <p>Pasajero: {{ nombrePasajero }} {{ apellidoPasajero }} 
                            email: {{ emailPasajero }}</p>
        </template>
        <template #content>
            <p>Vas a reservar el vuelo {{  }}</p>
        </template>
        <template #footer>
            <div class="flex gap-4 mt-1 separa">
                <Button @click="$emit('Yalotengo')" label="Cancel" severity="secondary" variant="outlined" class="w-full" />
                <Button @click="hacerReserva" label="Reservar" raised icon="pi pi-calendar-plus" iconPos="left"/>

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

</style>







