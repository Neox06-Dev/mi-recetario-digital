import { Link } from "react-router"
import { FiPlus } from "react-icons/fi"

export default function SinResultados({
    emoji = "🍳",
    titulo = "Todavía no hay recetas acá",
    texto = "Probá con otra categoría o buscá por ingrediente.",
    accion,
    enlace
}) {
    return (
        <div className="rounded-2xl border border-dashed border-borde bg-white/60 px-6 py-16 text-center">
            <p className="text-4xl">{emoji}</p>
            <p className="mt-4 font-display text-2xl text-tinta">{titulo}</p>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-tinta-suave">{texto}</p>
            {accion && enlace && (
                <Link to={enlace} className="btn-primario mt-6">
                    <FiPlus size={16} /> {accion}
                </Link>
            )}
        </div>
    )
}
