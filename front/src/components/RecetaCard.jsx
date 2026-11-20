import { useState } from "react"
import { Link } from "react-router"
import { FiClock, FiUsers } from "react-icons/fi"
import { resolverImagen } from "../services/api.services"
import { useCategorias } from "../context/categorias.context"
import { formatearTiempo } from "../utils/formato"
import BotonFavorito from "./BotonFavorito"

export default function RecetaCard({ receta }) {
    const { nombreCategoria, emojiCategoria } = useCategorias()
    const [errorImagen, setErrorImagen] = useState(false)
    const imagen = resolverImagen(receta.imagen)
    const mostrarImagen = imagen && !errorImagen

    return (
        <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-borde bg-white transition duration-300 hover:-translate-y-0.5 hover:border-oliva/40 hover:shadow-[0_18px_40px_-24px_rgba(32,38,29,0.35)]">
            <Link to={`/recetas/${receta._id}`} className="relative block overflow-hidden">
                <div className="aspect-[4/3] overflow-hidden bg-arena">
                    {mostrarImagen ? (
                        <img
                            src={imagen}
                            alt={receta.titulo}
                            loading="lazy"
                            onError={() => setErrorImagen(true)}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                        />
                    ) : (
                        <div className="grid h-full w-full place-items-center bg-gradient-to-br from-arena to-crema-hondo text-4xl">
                            {emojiCategoria(receta.categoria)}
                        </div>
                    )}
                </div>
                <span className="absolute left-3 top-3 rounded-full bg-crema/95 px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-tinta">
                    {nombreCategoria(receta.categoria)}
                </span>
            </Link>

            <div className="absolute right-3 top-3">
                <BotonFavorito recetaId={receta._id} />
            </div>

            <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-[1.2rem] leading-snug text-tinta">
                    <Link to={`/recetas/${receta._id}`} className="transition hover:text-terracota">
                        {receta.titulo}
                    </Link>
                </h3>
                <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-tinta-suave">{receta.descripcion}</p>

                <div className="mt-auto flex items-center gap-4 pt-4 text-xs text-tinta-suave">
                    <span className="inline-flex items-center gap-1.5">
                        <FiClock size={13} /> {formatearTiempo(receta.tiempoMinutos)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <FiUsers size={13} /> {receta.porciones} porc.
                    </span>
                    <span className="ml-auto truncate text-[0.7rem] italic text-tinta-suave/80">
                        {receta.autor?.nombre}
                    </span>
                </div>
            </div>
        </article>
    )
}
