<script setup lang="ts">    //Ponemos setup para poder usar la composition API, es decir, ref, computed, etc. y lang="ts" para usar TypeScript.
import ReservasItem from './ReservasItem.vue';  //Importamos el componente ReservasItem, que es el que se va a encargar de mostrar cada reserva individualmente.

</script>

//En este componente, lo que vamos a hacer es mostrar una lista de reservas, cada una de ellas 
representada por un componente ReservasItem. Para ello, vamos a usar un v-for para iterar sobre un
 array de reservas y mostrar cada una de ellas en un ReservasItem. Además, vamos a usar slots para 
 personalizar el contenido de cada ReservasItem, como el icono y el heading.
<template>
    <ReservasItem>
        <template #icon>
            <DocumentationIcon />
        </template>
        <template #heading>Documentation</template>
    
        Hola's
        sdsadasodijioqwdjwqd
        saodjsadjasdsadjaso
    </ReservasItem>

</template>

