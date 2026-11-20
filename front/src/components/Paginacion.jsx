import { FiChevronLeft, FiChevronRight } from "react-icons/fi"

export default function Paginacion({ pagina, totalPaginas, onCambiar }) {
    if (!totalPaginas || totalPaginas <= 1) return null

    const paginas = Array.from({ length: totalPaginas }, (_, indice) => indice + 1)

    return (
        <nav className="mt-10 flex items-center justify-center gap-2">
            <button
                type="button"
                onClick={() => onCambiar(pagina - 1)}
                disabled={pagina <= 1}
                className="grid h-9 w-9 place-items-center rounded-full border border-borde bg-white text-tinta-suave transition hover:border-oliva hover:text-tinta disabled:opacity-40"
                aria-label="Página anterior"
            >
                <FiChevronLeft size={16} />
            </button>

            {paginas.map((numero) => (
                <button
                    key={numero}
                    type="button"
                    onClick={() => onCambiar(numero)}
                    className={`h-9 min-w-9 rounded-full px-3 text-sm font-medium transition ${
                        numero === pagina
                            ? "bg-tinta text-crema"
                            : "border border-borde bg-white text-tinta-suave hover:border-oliva hover:text-tinta"
                    }`}
                >
                    {numero}
                </button>
            ))}

            <button
                type="button"
                onClick={() => onCambiar(pagina + 1)}
                disabled={pagina >= totalPaginas}
                className="grid h-9 w-9 place-items-center rounded-full border border-borde bg-white text-tinta-suave transition hover:border-oliva hover:text-tinta disabled:opacity-40"
                aria-label="Página siguiente"
            >
                <FiChevronRight size={16} />
            </button>
        </nav>
    )
}
