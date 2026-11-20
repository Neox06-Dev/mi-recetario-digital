import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "react-toastify"
import { FiEye, FiEyeOff, FiLock, FiMail } from "react-icons/fi"
import { usersLoginSchema } from "../../schemas/users"
import { useApiUsuarios } from "../../services/usuarios.services"
import { useLogin } from "../../context/session.context"
import { resolverImagen } from "../../services/api.services"
import CampoFormulario from "../../components/CampoFormulario"

export default function Login() {
    const navigate = useNavigate()
    const location = useLocation()
    const loginSession = useLogin()
    const { login } = useApiUsuarios()
    const [verPassword, setVerPassword] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm({ resolver: zodResolver(usersLoginSchema) })

    const onSubmit = async (datos) => {
        try {
            const usuario = await login(datos)
            loginSession(usuario)
            toast.success(`¡Hola de nuevo, ${usuario.name.split(" ")[0]}!`)
            navigate(location.state?.desde ?? "/recetas")
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div className="contenedor py-12">
            <div className="mx-auto grid max-w-4xl overflow-hidden rounded-[1.75rem] border border-borde bg-white lg:grid-cols-[1fr_0.9fr]">
                <div className="p-7 sm:p-10">
                    <p className="etiqueta text-terracota">Bienvenido de nuevo</p>
                    <h1 className="mt-2 font-display text-3xl text-tinta">Iniciar sesión</h1>
                    <p className="mt-2 text-sm text-tinta-suave">
                        Entrá para publicar recetas y guardar tus favoritas.
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4">
                        <CampoFormulario etiqueta="Email" htmlFor="email" error={errors.email?.message}>
                            <div className="relative">
                                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-tinta-suave/60" size={15} />
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="vos@email.com"
                                    className={`campo pl-10 ${errors.email ? "campo-error" : ""}`}
                                    {...register("email")}
                                />
                            </div>
                        </CampoFormulario>

                        <CampoFormulario etiqueta="Contraseña" htmlFor="password" error={errors.password?.message}>
                            <div className="relative">
                                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-tinta-suave/60" size={15} />
                                <input
                                    id="password"
                                    type={verPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    placeholder="Tu contraseña"
                                    className={`campo px-10 ${errors.password ? "campo-error" : ""}`}
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
                        </CampoFormulario>

                        <button type="submit" disabled={isSubmitting} className="btn-primario w-full">
                            {isSubmitting ? "Ingresando..." : "Ingresar"}
                        </button>
                    </form>

                    <p className="mt-5 text-center text-sm text-tinta-suave">
                        ¿No tenés cuenta?{" "}
                        <Link to="/register" className="font-semibold text-terracota hover:underline">
                            Crear una cuenta
                        </Link>
                    </p>

                    <div className="mt-7 rounded-xl border border-dashed border-borde bg-crema-hondo/50 p-4">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-tinta-suave">
                            Usuarios de prueba
                        </p>
                        <ul className="mt-2 space-y-1 text-xs text-tinta-suave">
                            <li>
                                <span className="font-semibold text-tinta">superadmin@recetario.com</span> · Admin1234@
                            </li>
                            <li>
                                <span className="font-semibold text-tinta">chef@recetario.com</span> · Cocina1234@
                            </li>
                            <li>
                                <span className="font-semibold text-tinta">sofia@recetario.com</span> · Vecina1234@
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="relative hidden lg:block">
                    <img
                        src={resolverImagen("/img/recetas/paella-valenciana.jpg")}
                        alt="Receta destacada"
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-tinta/85 via-tinta/30 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-8">
                        <p className="font-display text-2xl leading-snug text-crema">
                            “Cocinar es el único arte que nos alimenta.”
                        </p>
                        <p className="mt-2 text-xs uppercase tracking-[0.2em] text-crema/60">Recetario digital</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
