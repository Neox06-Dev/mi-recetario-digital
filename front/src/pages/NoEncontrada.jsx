import { Link } from "react-router"
import { FiArrowLeft } from "react-icons/fi"

export default function NoEncontrada() {
    return (
        <div className="contenedor grid min-h-[60vh] place-items-center py-16 text-center">
            <div>
                <p className="font-display text-7xl text-terracota/30">404</p>
                <h1 className="mt-2 font-display text-3xl text-tinta">Esta página no existe</h1>
                <p className="mx-auto mt-2 max-w-sm text-sm text-tinta-suave">
                    Puede que el enlace esté mal escrito o que la receta ya no esté disponible.
                </p>
                <Link to="/" className="btn-primario mt-6">
                    <FiArrowLeft size={15} /> Volver al inicio
                </Link>
            </div>
        </div>
    )
}
