import { z } from "zod"

export const DIFICULTADES = [
    { valor: "facil", etiqueta: "Fácil" },
    { valor: "media", etiqueta: "Media" },
    { valor: "dificil", etiqueta: "Difícil" }
]

const ingredienteSchema = z.object({
    cantidad: z.string().max(40, "Máximo 40 caracteres").optional().default(""),
    nombre: z.string("El ingrediente es obligatorio").min(2, "Mínimo 2 caracteres").max(80, "Máximo 80 caracteres")
})

const pasoSchema = z.object({
    texto: z.string("El paso es obligatorio").min(5, "Mínimo 5 caracteres").max(600, "Máximo 600 caracteres")
})

export const recetasSchema = z.object({
    titulo: z.string("El título es obligatorio").min(3, "Mínimo 3 caracteres").max(80, "Máximo 80 caracteres"),
    descripcion: z.string("La descripción es obligatoria").min(10, "Mínimo 10 caracteres").max(600, "Máximo 600 caracteres"),
    categoria: z.string("Elegí una categoría").min(3, "Elegí una categoría"),
    ingredientes: z.array(ingredienteSchema).min(1, "Agregá al menos un ingrediente"),
    pasos: z.array(pasoSchema).min(1, "Agregá al menos un paso"),
    tiempoMinutos: z.number("El tiempo es obligatorio").int("Debe ser un número entero").positive("Tiene que ser mayor a 0").max(1440, "Máximo 1440 minutos"),
    porciones: z.number("Las porciones son obligatorias").int("Debe ser un número entero").positive("Tiene que ser mayor a 0").max(50, "Máximo 50 porciones"),
    dificultad: z.enum(["facil", "media", "dificil"]).default("facil"),
    imagen: z.string().max(300, "Máximo 300 caracteres").optional().default("")
})
