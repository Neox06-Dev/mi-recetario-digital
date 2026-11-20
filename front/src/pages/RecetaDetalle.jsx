import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router"
import { toast } from "react-toastify"
import { FiArrowLeft, FiCalendar, FiCheck, FiClock, FiEdit2, FiTrash2, FiUser, FiUsers } from "react-icons/fi"
import { useApiRecetas } from "../services/recetas.services"
import { resolverImagen } from "../services/api.services"
import { useCategorias } from "../context/categorias.context"
import { useRol, useUsuario } from "../context/session.context"
import { formatearFecha, formatearTiempo, ETIQUETA_DIFICULTAD } from "../utils/formato"
import Cargando from "../components/Cargando"
import MensajeError from "../components/MensajeError"
import BotonFavorito from "../components/BotonFavorito"
import ModalConfirmar from "../components/ModalConfirmar"

export default function RecetaDetalle() {
    const { id } = useParams()
    const navigate = useNavigate()
    const usuario = useUsuario()
    const rol = useRol()
    const { getRecetaById, deleteReceta } = useApiRecetas()
    const { nombreCategoria, emojiCategoria } = useCategorias()

    const [receta, setReceta] = useState(null)
    const [estado, setEstado] = useState("CARGANDO")
    const [error, setError] = useState("")
    const [tildados, setTildados] = useState({})
    const [confirmar, setConfirmar] = useState(false)
    const [eliminando, setEliminando] = useState(false)
    const [errorImagen, setErrorImagen] = useState(false)

    useEffect(() => {
        setEstado("CARGANDO")
        getRecetaById(id)
            .then((data) => {
                setReceta(data)
                setEstado("LISTO")
            })
            .catch((err) => {
                setError(err.message)
                setEstado("ERROR")
            })
    }, [id])

    if (estado === "CARGANDO") return <Cargando pantalla />

    if (estado === "ERROR") {
        return (
            <div className="contenedor py-16">
                <MensajeError mensaje={error || "No encontramos esta receta."} />
                <div className="mt-6 text-center">
                    <Link to="/recetas" className="btn-secundario">
                        <FiArrowLeft size={15} /> Volver a las recetas
                    </Link>
                </div>
            </div>
        )
    }

    const esAutor = usuario?.email && receta.autor?.email === usuario.email
    const puedeEditar = esAutor || ["admin", "superadmin"].includes(rol)
    const imagen = resolverImagen(receta.imagen)
    const tildadosCantidad = Object.values(tildados).filter(Boolean).length

    const eliminar = async () => {
        try {
            setEliminando(true)
            await deleteReceta(receta._id)
            toast.success("Receta eliminada")
            navigate("/mis-recetas")
        } catch (err) {
            toast.error(err.message)
        } finally {
            setEliminando(false)
            setConfirmar(false)
        }
    }

    return (
        <div className="contenedor py-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <Link to="/recetas" className="btn-fantasma -ml-2">
                    <FiArrowLeft size={15} /> Volver a las recetas
                </Link>
                {puedeEditar && (
                    <div className="flex items-center gap-2">
                        <Link to={`/editar-receta/${receta._id}`} className="btn-secundario px-4 py-2 text-xs">
                            <FiEdit2 size={14} /> Editar
                        </Link>
                        <button
                            type="button"
                            onClick={() => setConfirmar(true)}
                            className="inline-flex items-center gap-2 rounded-full border border-terracota/30 px-4 py-2 text-xs font-semibold text-terracota transition hover:bg-terracota/5"
                        >
                            <FiTrash2 size={14} /> Eliminar
                        </button>
                    </div>
                )}
            </div>

            <div className="mt-6 grid gap-10 lg:grid-cols-[1.02fr_1fr]">
                <div className="relative overflow-hidden rounded-[1.75rem] border border-borde bg-arena">
                    <div className="aspect-[4/3] lg:aspect-[4/4]">
                        {imagen && !errorImagen ? (
                            <img
                                src={imagen}
                                alt={receta.titulo}
                                onError={() => setErrorImagen(true)}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="grid h-full w-full place-items-center bg-gradient-to-br from-arena to-crema-hondo text-6xl">
                                {emojiCategoria(receta.categoria)}
                            </div>
                        )}
                    </div>
                    <span className="absolute left-4 top-4 rounded-full bg-crema/95 px-3 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-tinta">
                        {emojiCategoria(receta.categoria)} {nombreCategoria(receta.categoria)}
                    </span>
                </div>

                <div className="flex flex-col justify-center">
                    <p className="etiqueta text-terracota">Receta de {receta.autor?.nombre ?? "la comunidad"}</p>
                    <h1 className="mt-3 font-display text-3xl leading-[1.1] text-tinta sm:text-[2.7rem]">
                        {receta.titulo}
                    </h1>
                    <p className="mt-4 text-[0.95rem] leading-relaxed text-tinta-suave">{receta.descripcion}</p>

                    <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <div className="rounded-xl border border-borde bg-white px-3 py-3 text-center">
                            <FiClock className="mx-auto text-terracota" size={16} />
                            <p className="mt-1.5 text-[0.7rem] uppercase tracking-wide text-tinta-suave">Tiempo</p>
                            <p className="text-sm font-semibold text-tinta">{formatearTiempo(receta.tiempoMinutos)}</p>
                        </div>
                        <div className="rounded-xl border border-borde bg-white px-3 py-3 text-center">
                            <FiUsers className="mx-auto text-terracota" size={16} />
                            <p className="mt-1.5 text-[0.7rem] uppercase tracking-wide text-tinta-suave">Porciones</p>
                            <p className="text-sm font-semibold text-tinta">{receta.porciones}</p>
                        </div>
                        <div className="rounded-xl border border-borde bg-white px-3 py-3 text-center">
                            <FiCheck className="mx-auto text-terracota" size={16} />
                            <p className="mt-1.5 text-[0.7rem] uppercase tracking-wide text-tinta-suave">Dificultad</p>
                            <p className="text-sm font-semibold text-tinta">{ETIQUETA_DIFICULTAD[receta.dificultad]}</p>
                        </div>
                        <div className="rounded-xl border border-borde bg-white px-3 py-3 text-center">
                            <FiUser className="mx-auto text-terracota" size={16} />
                            <p className="mt-1.5 text-[0.7rem] uppercase tracking-wide text-tinta-suave">Autor</p>
                            <p className="truncate text-sm font-semibold text-tinta">{receta.autor?.username}</p>
                        </div>
                    </div>

                    <div className="mt-7 flex flex-wrap items-center gap-3">
                        <BotonFavorito recetaId={receta._id} variante="completo" />
                        <span className="inline-flex items-center gap-1.5 text-xs text-tinta-suave">
                            <FiCalendar size={13} /> {formatearFecha(receta.fechaCreacion)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="mt-14 grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
                <section className="lg:sticky lg:top-24 lg:self-start">
                    <div className="rounded-2xl border border-borde bg-white p-6">
                        <div className="flex items-baseline justify-between">
                            <h2 className="font-display text-2xl text-tinta">Ingredientes</h2>
                            <span className="text-xs text-tinta-suave">
                                {tildadosCantidad}/{receta.ingredientes.length}
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-tinta-suave">
                            Tildá lo que ya tenés en la mesada.
                        </p>

                        <ul className="mt-5 space-y-1">
                            {receta.ingredientes.map((ingrediente, indice) => {
                                const tildado = Boolean(tildados[indice])
                                return (
                                    <li key={`${ingrediente.nombre}-${indice}`}>
                                        <label
                                            className={`flex cursor-pointer items-start gap-3 rounded-lg px-2 py-2 transition hover:bg-crema-hondo/60 ${
                                                tildado ? "opacity-60" : ""
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={tildado}
                                                onChange={() =>
                                                    setTildados((previos) => ({
                                                        ...previos,
                                                        [indice]: !previos[indice]
                                                    }))
                                                }
                                                className="peer sr-only"
                                            />
                                            <span
                                                className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border transition ${
                                                    tildado
                                                        ? "border-oliva bg-oliva text-white"
                                                        : "border-borde bg-white text-transparent"
                                                }`}
                                            >
                                                <FiCheck size={12} />
                                            </span>
                                            <span className={`text-sm leading-relaxed ${tildado ? "line-through" : ""}`}>
                                                {ingrediente.cantidad && (
                                                    <strong className="font-semibold text-tinta">
                                                        {ingrediente.cantidad}{" "}
                                                    </strong>
                                                )}
                                                <span className="text-tinta-suave">{ingrediente.nombre}</span>
                                            </span>
                                        </label>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </section>

                <section>
                    <h2 className="font-display text-2xl text-tinta">Paso a paso</h2>
                    <p className="mt-1 text-xs text-tinta-suave">Seguí el orden y no te apures.</p>

                    <ol className="mt-6 list-none space-y-5 pl-0">
                        {receta.pasos.map((paso, indice) => (
                            <li key={indice} className="flex gap-4">
                                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-borde bg-white font-display text-sm font-semibold text-terracota">
                                    {indice + 1}
                                </span>
                                <p className="pt-1.5 text-[0.95rem] leading-relaxed text-tinta-suave">{paso.texto}</p>
                            </li>
                        ))}
                    </ol>

                    <div className="mt-10 rounded-2xl border border-dashed border-borde bg-white/60 p-5">
                        <p className="text-sm leading-relaxed text-tinta-suave">
                            ¿La cocinaste? Guardala en favoritas para encontrarla rápido la próxima vez.
                        </p>
                        <div className="mt-3">
                            <BotonFavorito recetaId={receta._id} variante="completo" />
                        </div>
                    </div>
                </section>
            </div>

            <ModalConfirmar
                abierto={confirmar}
                titulo="¿Eliminar esta receta?"
                texto="La receta se va a quitar del recetario. Esta acción no se puede deshacer desde la aplicación."
                cargando={eliminando}
                onCancelar={() => setConfirmar(false)}
                onConfirmar={eliminar}
            />
        </div>
    )
}
