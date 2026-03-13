<script setup lang="ts">
import {onMounted,watch, computed, ref, type Ref } from 'vue';                                            //Me llega la funcion para volver a la pantalla anterior.

import ConfirmarReservaItem from '@/components/ConfirmarReservaItem.vue';
const open = ref(false);
const confirmaReserva = () => {
    open.value=false

}

</script>


<template>
    <div class="main-container">
        <div class="item">
            <i>
                <slot name="icon"></slot>
            </i>
            <div class="details">
                <h3>
                    <slot name="heading"> </slot>
                </h3>
                <slot> </slot>
            </div>
        </div>

        <footer class="finalF">
            <slot name="final"> </slot>
        </footer>
    </div>
</template>

<style scoped>
    .main-container {
        display: flex;
        flex-direction: column;
        min-height: 100vh; 
        margin-top: 2rem;
    }

    .item {
        flex: 1; 
    }

.finalF {
    display: flex;
    justify-content: center; /* Centra el contenido horizontalmente */
    width: 100%;
    padding: 80px;
    /* El margin-top: auto es el "toque mágico" para mandarlo al fondo */
    margin-top: 10rem; 
}


</style>