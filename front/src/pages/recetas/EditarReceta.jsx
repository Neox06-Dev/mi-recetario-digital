import { useEffect, useState } from "react"
import { Link, useParams } from "react-router"
import { FiArrowLeft } from "react-icons/fi"
import RecetaForm from "../../components/RecetaForm"
import Cargando from "../../components/Cargando"
import MensajeError from "../../components/MensajeError"
import { useApiRecetas } from "../../services/recetas.services"
import { useRol, useUsuario } from "../../context/session.context"

export default function EditarReceta() {
    const { id } = useParams()
    const usuario = useUsuario()
    const rol = useRol()
    const { getRecetaById } = useApiRecetas()
    const [receta, setReceta] = useState(null)
    const [estado, setEstado] = useState("CARGANDO")
    const [mensaje, setMensaje] = useState("")

    useEffect(() => {
        getRecetaById(id)
            .then((data) => {
                const esAutor = data.autor?.email === usuario?.email
                if (!esAutor && !["admin", "superadmin"].includes(rol)) {
                    setMensaje("Solo el autor de la receta puede editarla.")
                    setEstado("ERROR")
                    return
                }
                setReceta(data)
                setEstado("LISTO")
            })
            .catch((error) => {
                setMensaje(error.message)
                setEstado("ERROR")
            })
    }, [id])

    if (estado === "CARGANDO") return <Cargando pantalla />
    if (estado === "ERROR") {
        return (
            <div className="contenedor py-16">
                <MensajeError mensaje={mensaje} />
                <div className="mt-6 text-center">
                    <Link to="/recetas" className="btn-secundario">
                        Volver a las recetas
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="contenedor py-10">
            <Link to={`/recetas/${id}`} className="btn-fantasma -ml-2 mb-4">
                <FiArrowLeft size={15} /> Volver a la receta
            </Link>
            <p className="etiqueta text-terracota">Editar receta</p>
            <h1 className="mt-2 max-w-2xl font-display text-3xl leading-tight text-tinta sm:text-4xl">
                {receta.titulo}
            </h1>

            <div className="mt-8">
                <RecetaForm receta={receta} modo="editar" />
            </div>
        </div>
    )
}
