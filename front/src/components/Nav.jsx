import { useEffect, useState } from "react"
import { Link, NavLink, useLocation } from "react-router"
import { FiBookOpen, FiHeart, FiLogOut, FiMenu, FiPlus, FiUser, FiX } from "react-icons/fi"
import { useRol, useUsuario } from "../context/session.context"

const claseEnlace = ({ isActive }) =>
    `rounded-full px-3.5 py-2 text-sm font-medium transition ${
        isActive ? "bg-crema-hondo text-tinta" : "text-tinta-suave hover:bg-crema-hondo hover:text-tinta"
    }`

export default function Nav() {
    const usuario = useUsuario()
    const rol = useRol()
    const [abierto, setAbierto] = useState(false)
    const { pathname } = useLocation()

    useEffect(() => {
        setAbierto(false)
    }, [pathname])

    const iniciales = usuario?.name
        ? usuario.name
                .split(" ")
                .slice(0, 2)
                .map((parte) => parte[0])
                .join("")
                .toUpperCase()
        : ""

    const enlaces = (
        <>
            <NavLink to="/recetas" className={claseEnlace}>
                Recetas
            </NavLink>
            {usuario && (
                <NavLink to="/favoritos" className={claseEnlace}>
                    Favoritas
                </NavLink>
            )}
            {usuario && (
                <NavLink to="/mis-recetas" className={claseEnlace}>
                    Mis recetas
                </NavLink>
            )}
            {["admin", "superadmin"].includes(rol) && (
                <NavLink to="/categorias" className={claseEnlace}>
                    Categorías
                </NavLink>
            )}
            {rol === "superadmin" && (
                <NavLink to="/usuarios" className={claseEnlace}>
                    Usuarios
                </NavLink>
            )}
        </>
    )

    return (
        <header className="sticky top-0 z-40 border-b border-borde/70 bg-crema/85 backdrop-blur-md">
            <div className="contenedor flex h-16 items-center justify-between gap-3">
                <Link to="/" className="flex shrink-0 items-center gap-2.5">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-terracota text-crema">
                        <FiBookOpen size={17} />
                    </span>
                    <span className="leading-none">
                        <span className="block font-display text-[1.3rem] font-semibold tracking-tight text-tinta">
                            Recetario
                        </span>
                        <span className="mt-0.5 block text-[0.55rem] font-semibold uppercase tracking-[0.3em] text-tinta-suave">
                            digital
                        </span>
                    </span>
                </Link>

                <nav className="hidden items-center gap-1 md:flex">{enlaces}</nav>

                <div className="hidden items-center gap-2 md:flex">
                    {usuario ? (
                        <>
                            <Link to="/nueva-receta" className="btn-primario px-4 py-2 text-[0.82rem]">
                                <FiPlus size={16} /> Nueva receta
                            </Link>
                            <div className="flex items-center gap-1.5 rounded-full border border-borde bg-white py-1 pl-1 pr-1">
                                <span className="grid h-7 w-7 place-items-center rounded-full bg-oliva-claro text-[0.7rem] font-bold text-oliva">
                                    {iniciales || <FiUser size={14} />}
                                </span>
                                <span className="max-w-[7.5rem] truncate pr-1 text-xs font-medium text-tinta-suave">
                                    {usuario.name}
                                </span>
                                <Link
                                    to="/salir"
                                    title="Cerrar sesión"
                                    className="grid h-7 w-7 place-items-center rounded-full text-tinta-suave transition hover:bg-crema-hondo hover:text-terracota"
                                >
                                    <FiLogOut size={14} />
                                </Link>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn-fantasma">
                                Ingresar
                            </Link>
                            <Link to="/register" className="btn-primario">
                                Crear cuenta
                            </Link>
                        </>
                    )}
                </div>

                <button
                    type="button"
                    onClick={() => setAbierto((previo) => !previo)}
                    className="grid h-10 w-10 place-items-center rounded-full border border-borde bg-white text-tinta md:hidden"
                    aria-label="Abrir menú"
                >
                    {abierto ? <FiX size={18} /> : <FiMenu size={18} />}
                </button>
            </div>

            {abierto && (
                <div className="border-t border-borde/70 bg-crema px-5 pb-5 pt-3 md:hidden">
                    <nav className="flex flex-col gap-1">{enlaces}</nav>
                    <div className="mt-4 flex flex-col gap-2">
                        {usuario ? (
                            <>
                                <Link to="/nueva-receta" className="btn-primario w-full">
                                    <FiPlus size={16} /> Nueva receta
                                </Link>
                                <Link to="/salir" className="btn-secundario w-full">
                                    <FiLogOut size={15} /> Cerrar sesión ({usuario.name})
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn-secundario w-full">
                                    Ingresar
                                </Link>
                                <Link to="/register" className="btn-primario w-full">
                                    Crear cuenta
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    )
}
