<script setup lang="ts">
import {ref, type Ref, onMounted} from 'vue';


const loadingFromDB:Ref<boolean> = ref(false)
const fromDB:Ref<string> = ref('')



const text:Ref<string> = ref('')
onMounted(async () =>{
  loadingFromDB.value = true;
  try {
    const response = await fetch('http://localhost:8080/umu/aeropuerto/public/holaMundo');
    fromDB.value = await response.text()      //.json()
    text.value = fromDB.value
  } catch(_e) {
  }
  loadingFromDB.value = false;
})

</script>




<template>
  <div class="primerDiv">
    <Button> Hola </Button>
    <text> {{fromDB}} </text>
  </div>  


</template>

<style scoped>

.primerDiv{
  font-size: 90px;
  display: flow-root;
}

button{
  align-content: last baseline;
}


</style>



