import { useEffect, useState } from "react"
import { Link } from "react-router"
import { FiPlus } from "react-icons/fi"
import { useApiRecetas } from "../services/recetas.services"
import { useUsuario } from "../context/session.context"
import RecetaCard from "../components/RecetaCard"
import Cargando from "../components/Cargando"
import MensajeError from "../components/MensajeError"
import SinResultados from "../components/SinResultados"

export default function MisRecetas() {
    const usuario = useUsuario()
    const { getRecetas } = useApiRecetas()
    const [recetas, setRecetas] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState(null)
    const [reintento, setReintento] = useState(0)

    useEffect(() => {
        if (!usuario?.email) return
        setCargando(true)
        setError(null)
        getRecetas({ autor: usuario.email, limit: 50 })
            .then((data) => {
                data.pop()
                setRecetas(data)
            })
            .catch((err) => setError(err.message))
            .finally(() => setCargando(false))
    }, [usuario?.email, reintento])

    return (
        <div className="contenedor py-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="etiqueta text-terracota">Mi cocina</p>
                    <h1 className="mt-2 font-display text-3xl leading-tight text-tinta sm:text-4xl">Mis recetas</h1>
                    <p className="mt-2 text-sm text-tinta-suave">
                        {recetas.length > 0
                            ? `Publicaste ${recetas.length} ${recetas.length === 1 ? "receta" : "recetas"}`
                            : "Todavía no publicaste ninguna receta"}
                    </p>
                </div>
                <Link to="/nueva-receta" className="btn-primario">
                    <FiPlus size={16} /> Nueva receta
                </Link>
            </div>

            <div className="mt-8">
                {cargando && <Cargando tarjetas={3} />}
                {!cargando && error && (
                    <MensajeError mensaje={error} onReintentar={() => setReintento((valor) => valor + 1)} />
                )}
                {!cargando && !error && recetas.length === 0 && (
                    <SinResultados
                        emoji="👩‍🍳"
                        titulo="Tu recetario personal está vacío"
                        texto="Publicá tu primera receta y empezá a armar tu colección."
                        accion="Publicar mi primera receta"
                        enlace="/nueva-receta"
                    />
                )}
                {!cargando && !error && recetas.length > 0 && (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {recetas.map((receta) => (
                            <RecetaCard key={receta._id} receta={receta} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
