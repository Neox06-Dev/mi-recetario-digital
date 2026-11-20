import { z } from "zod"

export const categoriasSchema = z.object({
    nombre: z.string("El nombre es obligatorio").min(3, "Mínimo 3 caracteres").max(40, "Máximo 40 caracteres"),
    descripcion: z.string().max(200, "Máximo 200 caracteres").optional().default(""),
    emoji: z.string().max(8, "Máximo 8 caracteres").optional().default("🍽️"),
    orden: z.number("El orden debe ser un número").int("Debe ser entero").min(0, "No puede ser negativo").max(99, "Máximo 99").optional().default(0)
})
