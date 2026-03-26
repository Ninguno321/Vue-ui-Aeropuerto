const BASE = import.meta.env.VITE_API_URL

export const vueloService = {
  getVuelos: async (page = 0) => {
    const r = await fetch(
      `${BASE}umu/aeropuerto/public/vuelo
        ?page=${page}&size=7`)
    return r.json()
  }
}