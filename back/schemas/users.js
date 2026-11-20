import { z } from "zod"

export const usersRegisterSchema = z.object({
    name: z.string("El nombre debe ser una cadena y es obligatorio").min(3, "El nombre debe tener al menos 3 caracteres"),
    username: z.string("El nombre de usuario debe ser una cadena y es obligatorio").min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
    email: z.email("El campo email es obligatorio y debe ser un email valido"),
    password: z.string("La contraseña es obligatoria")
        .min(8, "La contraseña debe tener como minimo 8 caracteres")
        .regex(/[A-Z]/, "La contraseña debe tener al menos una mayuscula")
        .regex(/[a-z]/, "La contraseña debe tener al menos una minuscula")
        .regex(/[0-9]/, "La contraseña debe tener al menos un numero")
        .regex(/[@_#$%&/()=]/, "La contraseña debe tener al menos un simbolo @_-#$%&/()="),
    passwordConfirm: z.string("El confirmar contraseña debe ser una cadena y es obligatorio").min(8, "El confirmar contraseña debe tener como minimo 8 caracteres")
}, "Objeto invalido")
    .refine((data) => data.password === data.passwordConfirm, {
        error: "Las contraseñas no coinciden",
        path: ["passwordConfirm"]
    })

export const usersLoginSchema = z.object({
    email: z.email("El campo email es obligatorio y debe ser un email valido"),
    password: z.string("La contraseña es obligatoria").min(1, "La contraseña es obligatoria")
}, "Objeto invalido")

export const usersRolSchema = z.object({
    email: z.email("El campo email es obligatorio y debe ser un email valido"),
    rol: z.enum(["user", "admin", "superadmin"], "El rol debe ser user, admin o superadmin")
}, "Objeto invalido")
