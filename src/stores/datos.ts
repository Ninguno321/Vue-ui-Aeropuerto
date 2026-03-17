import { defineStore } from 'pinia'
import { ref } from 'vue'

interface DatosPasajero {
  nombrePasajero: string,
  apellidos: string,
  dni: string,
  email: string,
  nacionalidad: string
}


interface datosReservas {
  fechaReserva: string,
  id: string,
  vueloSeleccionado: string,
  pasajeroID: string,
  claseAsiento: string,
  cancelada: boolean
}

interface datosParkings {
  fecha: {
        fechaInicio: string,
        fechaFin: string,
  },
  id: string,
  tipoParking: string,
  pasajeroID: string,
  precio: number,
  fechaFin: string,
  fechaInicio: string
}




export const useUserStore = defineStore('user', () => {
  // Estado reactivo
  const usuario = ref<DatosPasajero | undefined>(undefined)

  // Acción para guardar los datos
  function setUsuario(datos: DatosPasajero) {
    usuario.value = datos
  }

  // Acción para limpiar (útil para logout o reset)
  function clearUsuario() {
    usuario.value = undefined
  }

  function tieneDatos(): boolean{
    return usuario.value !== undefined && usuario.value !== null;
  }

  return { usuario, setUsuario, clearUsuario, tieneDatos }
})


export const useReservaStore = defineStore('reserva', () => {
    //Estado reactivo
    const reserva = ref<datosReservas[]>([])

    const idReservaAux = ref('')

    //para guardar datos 
    function setReservas(datos : datosReservas[]){
        reserva.value = datos;
    }

    // Acción para limpiar (útil para logout o reset)
    function clearReserva() {
        reserva.value = []
    }

    function tieneDatos(): boolean{
        return reserva.value !== undefined && reserva.value !== null;
    }

    function setIdRes(res: string) {
        idReservaAux.value = res;
    }

    function getIDRes(): String{
        return idReservaAux.value
    }



    return{reserva, setReservas, clearReserva, tieneDatos, setIdRes, getIDRes}
})


export const useParkingStore = defineStore('parking', () => {
  // Estado reactivo: Empezamos con un array vacío
  const parkings = ref<datosParkings[]>([])

  function setParkings(datos: datosParkings[]) {
    parkings.value = datos
  }

  
  function clearParkings() {
    parkings.value = []
  }

  //para comprobar si hay registros
  function tieneDatos(): boolean {
    return parkings.value.length > 0
  }

  return { parkings, setParkings, clearParkings, tieneDatos }
})




interface Vuelo {
  id: string
  fechaSalida: string
  fechaLlegada: string
  tipoVuelo: string
  origen: string
  destino: string
  estadoVuelo: string
}
export const useVueloStore = defineStore('vuelo', () => {
  // Estado reactivo: Empezamos con un array vacío
  const vuelo = ref<Vuelo | undefined>(undefined)

  function setVuelo(vueloP: Vuelo) {
    vuelo.value = vueloP
  }

  
  function clearVuelo() {
    vuelo.value = undefined
  }

  //para comprobar si hay registros
  function tieneDatos(): boolean {
    return vuelo.value != undefined
  }

  return { vuelo, setVuelo, clearVuelo, tieneDatos }
})


