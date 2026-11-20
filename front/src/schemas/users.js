import { z } from "zod"

export const usersRegisterSchema = z.object({
    name: z.string("El nombre es obligatorio").min(3, "Mínimo 3 caracteres"),
    username: z.string("El nombre de usuario es obligatorio").min(3, "Mínimo 3 caracteres"),
    email: z.email("Ingresá un email válido"),
    password: z.string("La contraseña es obligatoria")
        .min(8, "Mínimo 8 caracteres")
        .regex(/[A-Z]/, "Al menos una mayúscula")
        .regex(/[a-z]/, "Al menos una minúscula")
        .regex(/[0-9]/, "Al menos un número")
        .regex(/[@_#$%&/()=]/, "Al menos un símbolo @_-#$%&/()="),
    passwordConfirm: z.string("Confirmá la contraseña").min(8, "Mínimo 8 caracteres")
}).refine((data) => data.password === data.passwordConfirm, {
    error: "Las contraseñas no coinciden",
    path: ["passwordConfirm"]
})

export const usersLoginSchema = z.object({
    email: z.email("Ingresá un email válido"),
    password: z.string("La contraseña es obligatoria").min(1, "La contraseña es obligatoria")
})
