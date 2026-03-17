<script setup lang="ts">
import ParkingItem from './ParkingItem.vue';
import { useUserStore } from '@/stores/datos';

const userStore = useUserStore()

</script>

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

        </template>
    
        <template #final>


        </template>
    </ReservasItem>

</template>