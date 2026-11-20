import { z } from "zod"

export const categoriasSchema = z.object({
    nombre: z.string("El nombre de la categoria es obligatorio").min(3, "El nombre debe tener al menos 3 caracteres").max(40, "El nombre no puede superar los 40 caracteres"),
    slug: z.string("El slug debe ser una cadena")
        .regex(/^[a-z0-9-]+$/, "El slug solo admite minusculas, numeros y guiones")
        .min(3, "El slug debe tener al menos 3 caracteres")
        .max(40, "El slug no puede superar los 40 caracteres")
        .optional(),
    descripcion: z.string("La descripcion debe ser una cadena").max(200, "La descripcion no puede superar los 200 caracteres").optional().default(""),
    emoji: z.string("El emoji debe ser una cadena").max(8, "El emoji no puede superar los 8 caracteres").optional().default("🍽️"),
    orden: z.number("El orden debe ser un numero").int("El orden debe ser un numero entero").min(0, "El orden no puede ser negativo").max(99, "El orden no puede superar 99").optional().default(0)
}, "No es una categoria valida")

// PATCH: los campos pasan a ser opcionales para permitir actualizaciones parciales
export const categoriaPatchSchema = categoriasSchema.partial()

export const favoritoSchema = z.object({
    recetaId: z.string("El id de la receta es obligatorio").regex(/^[a-f0-9]{24}$/i, "El id de la receta no es valido")
}, "No es un favorito valido")
