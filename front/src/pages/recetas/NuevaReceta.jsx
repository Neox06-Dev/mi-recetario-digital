import { Link } from "react-router"
import { FiArrowLeft } from "react-icons/fi"
import RecetaForm from "../../components/RecetaForm"

export default function NuevaReceta() {
    return (
        <div className="contenedor py-10">
            <Link to="/mis-recetas" className="btn-fantasma -ml-2 mb-4">
                <FiArrowLeft size={15} /> Volver
            </Link>
            <p className="etiqueta text-terracota">Nueva receta</p>
            <h1 className="mt-2 max-w-2xl font-display text-3xl leading-tight text-tinta sm:text-4xl">
                Sumá tu receta al recetario
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-tinta-suave">
                Completá los datos, agregá los ingredientes y los pasos. Después la vas a poder editar cuando quieras.
            </p>

            <div className="mt-8">
                <RecetaForm modo="crear" />
            </div>
        </div>
    )
}
