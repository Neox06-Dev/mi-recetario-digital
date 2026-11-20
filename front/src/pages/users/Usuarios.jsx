import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { FiTrash2 } from "react-icons/fi"
import { useApiUsuarios } from "../../services/usuarios.services"
import { useUsuario } from "../../context/session.context"
import Cargando from "../../components/Cargando"
import MensajeError from "../../components/MensajeError"
import ModalConfirmar from "../../components/ModalConfirmar"

const ROLES = ["user", "admin", "superadmin"]

export default function Usuarios() {
    const usuarioActual = useUsuario()
    const { getUsuarios, asignarRol, deleteUsuario } = useApiUsuarios()
    const [usuarios, setUsuarios] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState(null)
    const [aEliminar, setAEliminar] = useState(null)
    const [eliminando, setEliminando] = useState(false)

    const cargar = () => {
        setCargando(true)
        setError(null)
        getUsuarios()
            .then(setUsuarios)
            .catch((err) => setError(err.message))
            .finally(() => setCargando(false))
    }

    useEffect(() => {
        cargar()
    }, [])

    const cambiarRol = async (usuario, rol) => {
        try {
            await asignarRol({ email: usuario.email, rol })
            setUsuarios((previos) =>
                previos.map((item) => (item.email === usuario.email ? { ...item, rol } : item))
            )
            toast.success(`Rol de ${usuario.name} actualizado a ${rol}`)
        } catch (err) {
            toast.error(err.message)
        }
    }

    const confirmarEliminar = async () => {
        try {
            setEliminando(true)
            await deleteUsuario(aEliminar._id)
            setUsuarios((previos) => previos.filter((item) => item._id !== aEliminar._id))
            toast.success("Usuario eliminado")
            setAEliminar(null)
        } catch (err) {
            toast.error(err.message)
        } finally {
            setEliminando(false)
        }
    }

    return (
        <div className="contenedor py-10">
            <p className="etiqueta text-terracota">Administración</p>
            <h1 className="mt-2 font-display text-3xl leading-tight text-tinta sm:text-4xl">Usuarios</h1>
            <p className="mt-2 max-w-xl text-sm text-tinta-suave">
                Solo el superadmin puede ver la lista de usuarios, cambiar roles o eliminar cuentas.
            </p>

            <div className="mt-8">
                {cargando && <Cargando pantalla />}
                {!cargando && error && <MensajeError mensaje={error} onReintentar={cargar} />}

                {!cargando && !error && (
                    <div className="overflow-hidden rounded-2xl border border-borde bg-white">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-crema-hondo/70 text-[0.68rem] uppercase tracking-[0.12em] text-tinta-suave">
                                <tr>
                                    <th className="px-5 py-3 font-semibold">Usuario</th>
                                    <th className="hidden px-5 py-3 font-semibold sm:table-cell">Email</th>
                                    <th className="px-5 py-3 font-semibold">Rol</th>
                                    <th className="px-5 py-3 text-right font-semibold">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-borde/70">
                                {usuarios.map((usuario) => (
                                    <tr key={usuario._id} className="transition hover:bg-crema-hondo/30">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-oliva-claro text-xs font-bold text-oliva">
                                                    {usuario.name?.slice(0, 2).toUpperCase()}
                                                </span>
                                                <div className="min-w-0">
                                                    <p className="truncate font-semibold text-tinta">{usuario.name}</p>
                                                    <p className="truncate text-xs text-tinta-suave">@{usuario.username}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="hidden px-5 py-4 text-tinta-suave sm:table-cell">{usuario.email}</td>
                                        <td className="px-5 py-4">
                                            <select
                                                value={usuario.rol}
                                                onChange={(evento) => cambiarRol(usuario, evento.target.value)}
                                                disabled={usuario.email === usuarioActual?.email}
                                                className="rounded-lg border border-borde bg-white px-2.5 py-1.5 text-xs font-medium text-tinta outline-none focus:border-oliva disabled:opacity-60"
                                            >
                                                {ROLES.map((rol) => (
                                                    <option key={rol} value={rol}>
                                                        {rol}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <button
                                                type="button"
                                                onClick={() => setAEliminar(usuario)}
                                                disabled={usuario.email === usuarioActual?.email}
                                                className="grid h-8 w-8 place-items-center rounded-lg text-tinta-suave transition hover:bg-terracota/10 hover:text-terracota disabled:opacity-30"
                                                aria-label={`Eliminar ${usuario.name}`}
                                            >
                                                <FiTrash2 size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <ModalConfirmar
                abierto={Boolean(aEliminar)}
                titulo={`¿Eliminar a ${aEliminar?.name ?? "este usuario"}?`}
                texto="Se va a borrar la cuenta. Sus recetas van a quedar publicadas en el recetario."
                cargando={eliminando}
                onCancelar={() => setAEliminar(null)}
                onConfirmar={confirmarEliminar}
            />
        </div>
    )
}
