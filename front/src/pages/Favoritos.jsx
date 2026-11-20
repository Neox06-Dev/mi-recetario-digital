import { FiHeart } from "react-icons/fi"
import { useFavoritos } from "../context/favoritos.context"
import RecetaCard from "../components/RecetaCard"
import Cargando from "../components/Cargando"
import SinResultados from "../components/SinResultados"

export default function Favoritos() {
    const { favoritos, cargando } = useFavoritos()

    return (
        <div className="contenedor py-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="etiqueta flex items-center gap-2 text-terracota">
                        <FiHeart size={12} /> Tus favoritas
                    </p>
                    <h1 className="mt-2 font-display text-3xl leading-tight text-tinta sm:text-4xl">
                        Las recetas que guardaste
                    </h1>
                    <p className="mt-2 text-sm text-tinta-suave">
                        {favoritos.length > 0
                            ? `${favoritos.length} ${favoritos.length === 1 ? "receta guardada" : "recetas guardadas"}`
                            : "Todavía no guardaste ninguna receta"}
                    </p>
                </div>
            </div>

            <div className="mt-8">
                {cargando ? (
                    <Cargando tarjetas={3} />
                ) : favoritos.length === 0 ? (
                    <SinResultados
                        emoji="🤍"
                        titulo="Tu lista de favoritas está vacía"
                        texto="Cuando encuentres una receta que te guste, tocá el corazón y la vas a encontrar acá."
                        accion="Explorar recetas"
                        enlace="/recetas"
                    />
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {favoritos.map((favorito) => (
                            <RecetaCard key={favorito._id} receta={favorito.receta} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
