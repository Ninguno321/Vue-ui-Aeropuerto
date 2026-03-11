<script setup lang="ts">
import Card from 'primevue/card';
import Button from 'primevue/button';




defineEmits(['Yalotengo'])
</script>

<template>
    <Card style="width: 25rem; overflow: hidden">
        <template #header>
            <img alt="user header" src="/public/fotoChat.png" class="header-image"/>
        </template>
        <template #title>Información del vuelo</template>
        <template #subtitle>Pasajero: dni</template>
        <template #content>

            Aqui puedo poner lo que me de la gana, pondre la tabla con los datos 
            del vuelo.

            ss

            s

            s

            s

            Lo que voy a hacer es pasarme el ID del vuelo, y pedir que se registre.

        </template>
        <template #footer>
            <div class="flex gap-4 mt-1 separa">
                <Button @click="$emit('Yalotengo')" label="Cancel" severity="secondary" variant="outlined" class="w-full" />
                <Button  label="Save" class="w-full" />
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







