export function formatearTiempo(minutos) {
    if (!minutos && minutos !== 0) return "-"
    if (minutos < 60) return `${minutos} min`
    const horas = Math.floor(minutos / 60)
    const resto = minutos % 60
    return resto === 0 ? `${horas} h` : `${horas} h ${resto} min`
}

export const ETIQUETA_DIFICULTAD = {
    facil: "Fácil",
    media: "Media",
    dificil: "Difícil"
}

export const CLASE_DIFICULTAD = {
    facil: "bg-oliva-claro text-oliva",
    media: "bg-amber-100 text-amber-700",
    dificil: "bg-terracota/10 text-terracota-oscuro"
}

export function formatearFecha(fecha) {
    if (!fecha) return ""
    return new Date(fecha).toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    })
}
