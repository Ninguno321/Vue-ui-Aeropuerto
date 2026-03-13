<script setup lang="ts">
import {onMounted, onUpdated, ref, type Ref, computed} from 'vue'
import JSConfetti from 'js-confetti'

const clicked:Ref<boolean> = ref(false)

const cambiaValor = ()=> {
    clicked.value = true
    console.log("Se cambia el valor");
    
    showConfetti();

}

const confetti = new JSConfetti()

function showConfetti() {
  confetti.addConfetti()
}
</script>


<template>
    <div class="div1">
        <h1>En UMUFly, nuestro público objetivo son los usuarios que dispongan de una 
            credencial activa en la Universidad de Murcia. </h1> 
        <div class="div2">
        <a @click="cambiaValor()" href="https://www.um.es/" target="_blank" rel="noopener">
            <i class="pi pi-sign-in" style="font-size: 1.5rem"></i> 
        </a>
        <p v-if="clicked">Ya te has registrado</p> <p v-if="clicked" class="confeti">🎊</p>
        </div>
    </div>
</template>


<style scoped>
i {
    padding-top: 15px;
    text-align: right;
    color: hsla(160, 100%, 37%, 1);
}
h1 {
    font-size: 20px;          
}

.div1 a:hover{
    border-radius: 0.85rem;
}

.confeti{
    font-size: 1.5rem;
}
p{
    margin-top: 7px;
    text-align: center;
}

.div2 {
    display: flex;
    align-items:  center;    
    gap: 8px;
}
</style>