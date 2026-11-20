import { useEffect, useState } from "react"
import { useSearchParams } from "react-router"
import { FiSliders } from "react-icons/fi"
import { useApiRecetas } from "../services/recetas.services"
import { useCategorias } from "../context/categorias.context"
import Buscador from "../components/Buscador"
import CategoriaChip from "../components/CategoriaChip"
import RecetaCard from "../components/RecetaCard"
import Cargando from "../components/Cargando"
import MensajeError from "../components/MensajeError"
import SinResultados from "../components/SinResultados"
import Paginacion from "../components/Paginacion"

const ORDENES = [
    { valor: "recientes", etiqueta: "Más recientes" },
    { valor: "rapidas", etiqueta: "Más rápidas" },
    { valor: "titulo", etiqueta: "A - Z" }
]

export default function Recetas() {
    const [params, setParams] = useSearchParams()
    const { getRecetas } = useApiRecetas()
    const { categorias } = useCategorias()

    const categoria = params.get("categoria") ?? ""
    const busqueda = params.get("q") ?? ""
    const orden = params.get("orden") ?? "recientes"
    const pagina = Number(params.get("page") ?? 1)

    const [recetas, setRecetas] = useState([])
    const [meta, setMeta] = useState(null)
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState(null)
    const [reintento, setReintento] = useState(0)

    useEffect(() => {
        setCargando(true)
        setError(null)
        getRecetas({ categoria, q: busqueda, orden, page: pagina, limit: 9 })
            .then((data) => {
                const info = data.pop()
                setRecetas(data)
                setMeta(info)
            })
            .catch((err) => setError(err.message))
            .finally(() => setCargando(false))
    }, [categoria, busqueda, orden, pagina, reintento])

    const actualizar = (cambios) => {
        const nuevos = new URLSearchParams(params)
        Object.entries(cambios).forEach(([clave, valor]) => {
            if (valor) nuevos.set(clave, valor)
            else nuevos.delete(clave)
        })
        if (!("page" in cambios)) nuevos.delete("page")
        setParams(nuevos)
    }

    const categoriaActual = categorias.find((item) => item.slug === categoria)

    return (
        <div className="contenedor py-10">
            <div className="flex flex-wrap items-end justify-between gap-6">
                <div>
                    <p className="etiqueta text-terracota">
                        {categoriaActual ? `Tipo de comida: ${categoriaActual.nombre}` : "Recetario completo"}
                    </p>
                    <h1 className="mt-2 font-display text-3xl leading-tight text-tinta sm:text-4xl">
                        {categoriaActual
                            ? `${categoriaActual.emoji} ${categoriaActual.nombre}`
                            : busqueda
                            ? `Resultados para “${busqueda}”`
                            : "Todas las recetas"
                        }
                    </h1>
                    <p className="mt-2 text-sm text-tinta-suave">
                        {meta ? `${meta.totalDocumentos} recetas encontradas` : "Buscando recetas..."}
                    </p>
                </div>

                <div className="w-full max-w-sm">
                    <Buscador
                        valorInicial={busqueda}
                        onBuscar={(texto) => actualizar({ q: texto })}
                        placeholder="Buscar por receta o ingrediente..."
                    />
                </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-2">
                <CategoriaChip activa={!categoria} nombre="Todas" onClick={() => actualizar({ categoria: "" })} />
                {categorias.map((item) => (
                    <CategoriaChip
                        key={item.slug}
                        activa={categoria === item.slug}
                        emoji={item.emoji}
                        nombre={item.nombre}
                        total={item.totalRecetas}
                        onClick={() => actualizar({ categoria: item.slug })}
                    />
                ))}
            </div>

            <div className="mt-5 flex items-center justify-between gap-4 border-t border-borde/70 pt-4">
                <p className="flex items-center gap-2 text-xs text-tinta-suave">
                    <FiSliders size={14} />
                    {busqueda ? `Filtrando por “${busqueda}”` : "Filtrá por tipo de comida o buscá un ingrediente"}
                </p>
                <label className="flex items-center gap-2 text-xs text-tinta-suave">
                    Ordenar por
                    <select
                        value={orden}
                        onChange={(evento) => actualizar({ orden: evento.target.value })}
                        className="rounded-lg border border-borde bg-white px-2.5 py-1.5 text-xs text-tinta outline-none focus:border-oliva"
                    >
                        {ORDENES.map((opcion) => (
                            <option key={opcion.valor} value={opcion.valor}>
                                {opcion.etiqueta}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <div className="mt-8">
                {cargando && <Cargando tarjetas={6} />}

                {!cargando && error && (
                    <MensajeError mensaje={error} onReintentar={() => setReintento((valor) => valor + 1)} />
                )}

                {!cargando && !error && recetas.length === 0 && (
                    <SinResultados
                        titulo="No encontramos recetas"
                        texto="Probá con otra categoría, otro ingrediente o publicá la primera receta de este tipo."
                        accion="Publicar una receta"
                        enlace="/nueva-receta"
                    />
                )}

                {!cargando && !error && recetas.length > 0 && (
                    <>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {recetas.map((receta) => (
                                <RecetaCard key={receta._id} receta={receta} />
                            ))}
                        </div>
                        <Paginacion
                            pagina={pagina}
                            totalPaginas={meta?.totalPaginas ?? 1}
                            onCambiar={(numero) => actualizar({ page: String(numero) })}
                        />
                    </>
                )}
            </div>
        </div>
    )
}
