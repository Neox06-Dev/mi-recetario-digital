import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router"
import { FiArrowRight, FiClock, FiPlus } from "react-icons/fi"
import { useApiRecetas } from "../services/recetas.services"
import { useCategorias } from "../context/categorias.context"
import { useEstaAutenticado } from "../context/session.context"
import { resolverImagen } from "../services/api.services"
import { formatearTiempo } from "../utils/formato"
import Buscador from "../components/Buscador"
import RecetaCard from "../components/RecetaCard"
import Cargando from "../components/Cargando"

export default function Home() {
    const navigate = useNavigate()
    const autenticado = useEstaAutenticado()
    const { getRecetas } = useApiRecetas()
    const { categorias } = useCategorias()
    const [recetas, setRecetas] = useState([])
    const [cargando, setCargando] = useState(true)

    useEffect(() => {
        getRecetas({ limit: 7, orden: "recientes" })
            .then((data) => {
                data.pop() // el ultimo elemento trae la info de paginado
                setRecetas(data)
            })
            .catch(() => setRecetas([]))
            .finally(() => setCargando(false))
    }, [])

    const destacada = recetas[0]
    const resto = recetas.slice(1, 4)
    const totalRecetas = categorias.reduce((total, categoria) => total + (categoria.totalRecetas ?? 0), 0)

    return (
        <div>
            {/* Hero */}
            <section className="relative overflow-hidden border-b border-borde/70">
                <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-terracota/5 blur-3xl" />
                <div className="pointer-events-none absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-oliva/10 blur-3xl" />
                <div className="contenedor relative grid items-center gap-12 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
                    <div>
                        <h1 className="mt-6 font-display text-[2.6rem] leading-[1.05] tracking-tight text-tinta sm:text-6xl">
                            Las recetas de casa,
                            <span className="block italic text-terracota">siempre a mano.</span>
                        </h1>

                        <p className="mt-5 max-w-lg text-[0.98rem] leading-relaxed text-tinta-suave">
                            Guardá lo que cocinás, clasificalo por tipo de comida y encontrá en segundos qué preparar
                            hoy. Tus favoritas quedan a un click.
                        </p>

                        <div className="mt-7 max-w-lg">
                            <Buscador
                                grande
                                placeholder="¿Qué querés cocinar hoy?"
                                onBuscar={(texto) => navigate(texto ? `/recetas?q=${encodeURIComponent(texto)}` : "/recetas")}
                            />
                        </div>

                        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-tinta-suave">
                            <span className="font-semibold text-tinta">{totalRecetas} recetas</span>
                            <span className="h-1 w-1 rounded-full bg-borde" />
                            <span>{categorias.length} tipos de comida</span>
                            <span className="h-1 w-1 rounded-full bg-borde" />
                            <span>hecho en casa</span>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="relative overflow-hidden rounded-[2rem] border border-borde bg-arena shadow-[0_30px_60px_-40px_rgba(32,38,29,0.45)]">
                            <div className="aspect-[5/4]">
                                {destacada?.imagen ? (
                                    <img
                                        src={resolverImagen(destacada.imagen)}
                                        alt={destacada.titulo}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="grid h-full w-full place-items-center bg-gradient-to-br from-arena to-crema-hondo text-6xl">
                                        🍲
                                    </div>
                                )}
                            </div>
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-tinta/90 via-tinta/40 to-transparent p-6 pt-20">
                                <div className="flex items-end justify-between gap-4">
                                    <div className="min-w-0">
                                        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-crema/70">
                                            Receta destacada
                                        </p>
                                        <p className="mt-1 font-display text-2xl leading-tight text-crema">
                                            {destacada?.titulo ?? "Tu primera receta"}
                                        </p>
                                        {destacada && (
                                            <p className="mt-1 flex items-center gap-1.5 text-xs text-crema/80">
                                                <FiClock size={12} /> {formatearTiempo(destacada.tiempoMinutos)} ·{" "}
                                                {destacada.porciones} porciones
                                            </p>
                                        )}
                                    </div>
                                    {destacada && (
                                        <Link
                                            to={`/recetas/${destacada._id}`}
                                            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-terracota text-white shadow-lg transition hover:bg-terracota-oscuro"
                                            aria-label="Ver la receta destacada"
                                        >
                                            <FiArrowRight size={18} />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="absolute -right-3 top-6 hidden rotate-3 rounded-2xl border border-borde bg-crema px-4 py-3 shadow-md sm:block">
                            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-tinta-suave">
                                Tip de cocina
                            </p>
                            <p className="mt-1 max-w-[9rem] text-xs leading-snug text-tinta">
                                Las recetas con foto reciben el doble de visitas.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categorias */}
            <section className="contenedor py-14">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="etiqueta text-terracota">Explorá por tipo de comida</p>
                        <h2 className="mt-2 font-display text-3xl text-tinta sm:text-4xl">¿Qué se te antoja hoy?</h2>
                    </div>
                    <Link to="/recetas" className="btn-fantasma">
                        Ver todas las recetas <FiArrowRight size={15} />
                    </Link>
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {categorias.map((categoria) => (
                        <Link
                            key={categoria.slug}
                            to={`/recetas?categoria=${categoria.slug}`}
                            className="group flex items-center gap-4 rounded-2xl border border-borde bg-white px-5 py-4 transition hover:-translate-y-0.5 hover:border-oliva/50 hover:shadow-[0_16px_30px_-24px_rgba(32,38,29,0.4)]"
                        >
                            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-crema-hondo text-xl">
                                {categoria.emoji}
                            </span>
                            <span className="min-w-0 flex-1">
                                <span className="block font-display text-lg leading-tight text-tinta">
                                    {categoria.nombre}
                                </span>
                                <span className="block truncate text-xs text-tinta-suave">
                                    {categoria.descripcion || `${categoria.totalRecetas} recetas`}
                                </span>
                            </span>
                            <span className="flex items-center gap-2 text-xs text-tinta-suave">
                                <span className="rounded-full bg-crema-hondo px-2 py-0.5 font-semibold">
                                    {categoria.totalRecetas}
                                </span>
                                <FiArrowRight
                                    size={15}
                                    className="transition group-hover:translate-x-0.5 group-hover:text-terracota"
                                />
                            </span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Ultimas recetas */}
            <section className="border-y border-borde/70 bg-crema-hondo/40 py-14">
                <div className="contenedor">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <p className="etiqueta text-terracota">Recién salidas del horno</p>
                            <h2 className="mt-2 font-display text-3xl text-tinta sm:text-4xl">Últimas recetas</h2>
                        </div>
                        <Link to="/recetas" className="btn-secundario">
                            Ver todas <FiArrowRight size={15} />
                        </Link>
                    </div>

                    <div className="mt-8">
                        {cargando ? (
                            <Cargando tarjetas={3} />
                        ) : (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {(resto.length > 0 ? resto : recetas).map((receta) => (
                                    <RecetaCard key={receta._id} receta={receta} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="contenedor py-16">
                <div className="relative overflow-hidden rounded-[2rem] bg-tinta px-7 py-12 sm:px-12">
                    <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-terracota/25 blur-3xl" />
                    <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
                        <div className="max-w-xl">
                            <p className="etiqueta text-crema/60">Tu recetario</p>
                            <h2 className="mt-3 font-display text-3xl leading-tight text-crema sm:text-4xl">
                                ¿Tenés esa receta que todos te piden?
                            </h2>
                            <p className="mt-3 text-sm leading-relaxed text-crema/70">
                                Publicala y sumala al recetario. Podés editarla o eliminarla cuando quieras, y guardar
                                tus favoritas para tenerlas siempre a mano.
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Link
                                to={autenticado ? "/nueva-receta" : "/register"}
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-terracota px-6 py-3 text-sm font-semibold text-white transition hover:bg-terracota-oscuro"
                            >
                                <FiPlus size={16} /> {autenticado ? "Publicar mi receta" : "Crear mi cuenta"}
                            </Link>
                            <Link
                                to="/recetas"
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-crema/25 px-6 py-3 text-sm font-semibold text-crema transition hover:border-crema/60"
                            >
                                Explorar recetas
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
