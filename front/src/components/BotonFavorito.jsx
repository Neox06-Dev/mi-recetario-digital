import { useState } from "react"
import { useNavigate } from "react-router"
import { FiHeart } from "react-icons/fi"
import { toast } from "react-toastify"
import { useEstaAutenticado } from "../context/session.context"
import { useFavoritos } from "../context/favoritos.context"

export default function BotonFavorito({ recetaId, variante = "flotante" }) {
    const { esFavorita, alternarFavorito } = useFavoritos()
    const autenticado = useEstaAutenticado()
    const navigate = useNavigate()
    const [enviando, setEnviando] = useState(false)
    const activa = esFavorita(recetaId)

    const manejarClick = async (evento) => {
        evento.preventDefault()
        evento.stopPropagation()

        if (!autenticado) {
            toast.info("Ingresá para guardar tus recetas favoritas")
            navigate("/login")
            return
        }

        try {
            setEnviando(true)
            const quedoGuardada = await alternarFavorito(recetaId)
            toast.success(quedoGuardada ? "Guardada en favoritas" : "La sacamos de favoritas")
        } catch (error) {
            toast.error(error.message)
        } finally {
            setEnviando(false)
        }
    }

    if (variante === "completo") {
        return (
            <button
                type="button"
                onClick={manejarClick}
                disabled={enviando}
                className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
                    activa
                        ? "border-terracota bg-terracota text-white hover:bg-terracota-oscuro"
                        : "border-borde bg-white text-tinta hover:border-terracota hover:text-terracota"
                } disabled:opacity-60`}
            >
                <FiHeart size={16} className={activa ? "fill-current" : ""} />
                {activa ? "Guardada en favoritas" : "Guardar en favoritas"}
            </button>
        )
    }

    return (
        <button
            type="button"
            onClick={manejarClick}
            disabled={enviando}
            aria-label={activa ? "Quitar de favoritas" : "Guardar en favoritas"}
            className={`grid h-9 w-9 place-items-center rounded-full backdrop-blur transition ${
                activa
                    ? "bg-terracota text-white"
                    : "bg-white/85 text-tinta-suave hover:bg-white hover:text-terracota"
            } disabled:opacity-60`}
        >
            <FiHeart size={16} className={activa ? "fill-current" : ""} />
        </button>
    )
}
