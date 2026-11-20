import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "react-toastify"
import { FiCheck, FiEye, FiEyeOff } from "react-icons/fi"
import { usersRegisterSchema } from "../../schemas/users"
import { useApiUsuarios } from "../../services/usuarios.services"
import CampoFormulario from "../../components/CampoFormulario"
import { resolverImagen } from "../../services/api.services"

const REQUISITOS = [
    { prueba: (valor) => valor.length >= 8, texto: "8 caracteres" },
    { prueba: (valor) => /[A-Z]/.test(valor), texto: "Una mayúscula" },
    { prueba: (valor) => /[a-z]/.test(valor), texto: "Una minúscula" },
    { prueba: (valor) => /[0-9]/.test(valor), texto: "Un número" },
    { prueba: (valor) => /[@_#$%&/()=]/.test(valor), texto: "Un símbolo" }
]

export default function Register() {
    const navigate = useNavigate()
    const { register: registrarUsuario } = useApiUsuarios()
    const [verPassword, setVerPassword] = useState(false)

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting }
    } = useForm({ resolver: zodResolver(usersRegisterSchema), mode: "onChange" })

    const password = watch("password") ?? ""

    const onSubmit = async (datos) => {
        try {
            await registrarUsuario(datos)
            toast.success("Cuenta creada. Ya podés iniciar sesión")
            navigate("/login")
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div className="contenedor py-12">
            <div className="mx-auto grid max-w-4xl overflow-hidden rounded-[1.75rem] border border-borde bg-white lg:grid-cols-[0.9fr_1fr]">
                <div className="relative hidden lg:block">
                    <img
                        src={resolverImagen("/img/recetas/tarta-manzana.jpg")}
                        alt="Tarta de manzana"
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-tinta/90 via-tinta/30 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-8">
                        <p className="font-display text-2xl leading-snug text-crema">
                            Empezá tu recetario hoy mismo.
                        </p>
                        <p className="mt-2 text-xs uppercase tracking-[0.2em] text-crema/60">
                            Recetas · Favoritas · Categorías
                        </p>
                    </div>
                </div>

                <div className="p-7 sm:p-10">
                    <p className="etiqueta text-terracota">Crear cuenta</p>
                    <h1 className="mt-2 font-display text-3xl text-tinta">Sumate al recetario</h1>
                    <p className="mt-2 text-sm text-tinta-suave">Solo necesitás un email y una contraseña segura.</p>

                    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
                        <CampoFormulario etiqueta="Nombre y apellido" htmlFor="name" error={errors.name?.message}>
                            <input
                                id="name"
                                type="text"
                                placeholder="Ej: Sofia Vecina"
                                className={`campo ${errors.name ? "campo-error" : ""}`}
                                {...register("name")}
                            />
                        </CampoFormulario>

                        <CampoFormulario etiqueta="Nombre de usuario" htmlFor="username" error={errors.username?.message}>
                            <input
                                id="username"
                                type="text"
                                placeholder="Ej: sofia"
                                className={`campo ${errors.username ? "campo-error" : ""}`}
                                {...register("username")}
                            />
                        </CampoFormulario>

                        <CampoFormulario etiqueta="Email" htmlFor="email" error={errors.email?.message}>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                placeholder="vos@email.com"
                                className={`campo ${errors.email ? "campo-error" : ""}`}
                                {...register("email")}
                            />
                        </CampoFormulario>

                        <CampoFormulario etiqueta="Contraseña" htmlFor="password" error={errors.password?.message}>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={verPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    placeholder="Creá una contraseña"
                                    className={`campo pr-10 ${errors.password ? "campo-error" : ""}`}
                                    {...register("password")}
                                />
                                <button
                                    type="button"
                                    onClick={() => setVerPassword((valor) => !valor)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-tinta-suave/60 transition hover:text-tinta"
                                    aria-label={verPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                >
                                    {verPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                </button>
                            </div>
                            <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                                {REQUISITOS.map((requisito) => {
                                    const cumplido = requisito.prueba(password)
                                    return (
                                        <li
                                            key={requisito.texto}
                                            className={`inline-flex items-center gap-1 text-[0.7rem] ${
                                                cumplido ? "text-oliva" : "text-tinta-suave/60"
                                            }`}
                                        >
                                            <FiCheck size={11} className={cumplido ? "opacity-100" : "opacity-30"} />
                                            {requisito.texto}
                                        </li>
                                    )
                                })}
                            </ul>
                        </CampoFormulario>

                        <CampoFormulario
                            etiqueta="Repetir contraseña"
                            htmlFor="passwordConfirm"
                            error={errors.passwordConfirm?.message}
                        >
                            <input
                                id="passwordConfirm"
                                type={verPassword ? "text" : "password"}
                                autoComplete="new-password"
                                placeholder="Repetí la contraseña"
                                className={`campo ${errors.passwordConfirm ? "campo-error" : ""}`}
                                {...register("passwordConfirm")}
                            />
                        </CampoFormulario>

                        <button type="submit" disabled={isSubmitting} className="btn-primario w-full">
                            {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
                        </button>
                    </form>

                    <p className="mt-5 text-center text-sm text-tinta-suave">
                        ¿Ya tenés cuenta?{" "}
                        <Link to="/login" className="font-semibold text-terracota hover:underline">
                            Iniciar sesión
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
