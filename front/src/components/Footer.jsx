import { Link } from "react-router"
import { FiHeart } from "react-icons/fi"

export default function Footer() {
    return (
        <footer className="mt-20 border-t border-borde bg-crema-hondo/60">
            <div className="contenedor grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                    <p className="font-display text-xl font-semibold text-tinta">Recetario digital</p>
                    <p className="mt-3 max-w-xs text-sm leading-relaxed text-tinta-suave">
                        Un lugar para guardar las recetas de casa, ordenarlas por tipo de comida y descubrir qué
                        cocinar hoy.
                    </p>
                </div>
                <div>
                    <p className="etiqueta text-tinta-suave">Explorar</p>
                    <ul className="mt-3 space-y-2 text-sm text-tinta-suave">
                        <li>
                            <Link to="/recetas" className="transition hover:text-terracota">
                                Todas las recetas
                            </Link>
                        </li>
                        <li>
                            <Link to="/recetas?categoria=desayunos" className="transition hover:text-terracota">
                                Desayunos
                            </Link>
                        </li>
                        <li>
                            <Link to="/recetas?categoria=almuerzos" className="transition hover:text-terracota">
                                Almuerzos
                            </Link>
                        </li>
                        <li>
                            <Link to="/recetas?categoria=postres" className="transition hover:text-terracota">
                                Postres
                            </Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <p className="etiqueta text-tinta-suave">Tu cuenta</p>
                    <ul className="mt-3 space-y-2 text-sm text-tinta-suave">
                        <li>
                            <Link to="/register" className="transition hover:text-terracota">
                                Crear cuenta
                            </Link>
                        </li>
                        <li>
                            <Link to="/login" className="transition hover:text-terracota">
                                Iniciar sesión
                            </Link>
                        </li>
                        <li>
                            <Link to="/favoritos" className="transition hover:text-terracota">
                                Mis favoritas
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-borde/70">
                <div className="contenedor flex flex-col items-center justify-between gap-2 py-5 text-xs text-tinta-suave sm:flex-row">
                    <p>Parcial 2 · Aplicaciones Híbridas · 2026</p>
                    <p className="flex items-center gap-1.5">
                        Hecho con <FiHeart size={13} className="text-terracota" /> y muchas recetas
                    </p>
                </div>
            </div>
        </footer>
    )
}
