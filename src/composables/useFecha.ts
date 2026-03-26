export function useFecha() {
  const formatFecha = (fecha: string) => {
    const d = new Date(fecha)
    return d.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }
  return { formatFecha }
}