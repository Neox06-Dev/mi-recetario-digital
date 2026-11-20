import { useEffect, useState } from "react"
import { FiSearch, FiX } from "react-icons/fi"

export default function Buscador({ valorInicial = "", onBuscar, placeholder = "Buscar por receta o ingrediente...", grande = false }) {
    const [texto, setTexto] = useState(valorInicial)

    useEffect(() => {
        setTexto(valorInicial)
    }, [valorInicial])

    const enviar = (evento) => {
        evento.preventDefault()
        onBuscar(texto.trim())
    }

    return (
        <form onSubmit={enviar} className="relative w-full">
            <FiSearch
                size={grande ? 19 : 16}
                className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-tinta-suave`}
            />
            <input
                type="search"
                value={texto}
                onChange={(evento) => setTexto(evento.target.value)}
                placeholder={placeholder}
                className={`w-full rounded-full border border-borde bg-white pl-11 pr-24 text-tinta outline-none transition placeholder:text-tinta-suave/60 focus:border-oliva focus:ring-3 focus:ring-oliva/15 ${
                    grande ? "py-3.5 text-[0.95rem]" : "py-2.5 text-sm"
                }`}
            />
            <div className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-1">
                {texto && (
                    <button
                        type="button"
                        onClick={() => {
                            setTexto("")
                            onBuscar("")
                        }}
                        className="grid h-8 w-8 place-items-center rounded-full text-tinta-suave transition hover:bg-crema-hondo"
                        aria-label="Limpiar búsqueda"
                    >
                        <FiX size={15} />
                    </button>
                )}
                <button
                    type="submit"
                    className={`rounded-full bg-tinta px-4 font-semibold text-crema transition hover:bg-terracota ${
                        grande ? "py-2.5 text-sm" : "py-2 text-xs"
                    }`}
                >
                    Buscar
                </button>
            </div>
        </form>
    )
}
