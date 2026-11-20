import { z } from "zod"

const Dificultad = z.enum(["facil", "media", "dificil"])

const ingredienteSchema = z.object({
    cantidad: z.string("La cantidad debe ser una cadena").max(40, "La cantidad no puede superar los 40 caracteres").optional().default(""),
    nombre: z.string("El ingrediente debe ser una cadena y es obligatorio").min(2, "El ingrediente debe tener al menos 2 caracteres").max(80, "El ingrediente no puede superar los 80 caracteres")
}, "Cada ingrediente debe tener cantidad y nombre")

const pasoSchema = z.object({
    texto: z.string("El paso debe ser una cadena y es obligatorio").min(5, "Cada paso debe tener al menos 5 caracteres").max(600, "Cada paso no puede superar los 600 caracteres")
}, "Cada paso debe tener un texto")

export const recetasSchema = z.object({
    titulo: z.string("El titulo debe ser una cadena y es obligatorio").min(3, "El titulo debe tener al menos 3 caracteres").max(80, "El titulo no puede superar los 80 caracteres"),
    descripcion: z.string("La descripcion debe ser una cadena y es obligatoria").min(10, "La descripcion debe tener al menos 10 caracteres").max(600, "La descripcion no puede superar los 600 caracteres"),
    categoria: z.string("La categoria es obligatoria").min(3, "La categoria es obligatoria").max(40, "La categoria no puede superar los 40 caracteres"),
    ingredientes: z.array(ingredienteSchema, "Los ingredientes deben ser una lista").min(1, "La receta debe tener al menos un ingrediente"),
    pasos: z.array(pasoSchema, "Los pasos deben ser una lista").min(1, "La receta debe tener al menos un paso"),
    tiempoMinutos: z.number("El tiempo debe ser un numero").int("El tiempo debe ser un numero entero").positive("El tiempo debe ser mayor a 0").max(1440, "El tiempo no puede superar los 1440 minutos"),
    porciones: z.number("Las porciones deben ser un numero").int("Las porciones deben ser un numero entero").positive("Las porciones deben ser mayores a 0").max(50, "Las porciones no pueden superar las 50"),
    dificultad: Dificultad.default("facil"),
    imagen: z.string("La imagen debe ser una cadena").max(300, "La ruta de la imagen no puede superar los 300 caracteres").optional().default("")
}, "No es una receta valida")

// Para PATCH: todos los campos opcionales, pero los que vengan se validan igual
export const recetasPatchSchema = recetasSchema.partial()
