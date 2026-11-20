import { FiAlertTriangle } from "react-icons/fi"

export default function ModalConfirmar({
    abierto,
    titulo = "¿Estás seguro?",
    texto = "Esta acción no se puede deshacer.",
    textoConfirmar = "Eliminar",
    cargando = false,
    onCancelar,
    onConfirmar
}) {
    if (!abierto) return null

    return (
        <div className="fixed inset-0 z-50 grid place-items-center bg-tinta/40 px-4 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-2xl border border-borde bg-crema p-6 shadow-xl">
                <div className="flex items-start gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-terracota/10 text-terracota">
                        <FiAlertTriangle size={18} />
                    </span>
                    <div>
                        <h2 className="font-display text-xl text-tinta">{titulo}</h2>
                        <p className="mt-1.5 text-sm leading-relaxed text-tinta-suave">{texto}</p>
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-2">
                    <button type="button" onClick={onCancelar} className="btn-secundario" disabled={cargando}>
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={onConfirmar}
                        disabled={cargando}
                        className="inline-flex items-center justify-center rounded-full bg-terracota px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-terracota-oscuro disabled:opacity-60"
                    >
                        {cargando ? "Eliminando..." : textoConfirmar}
                    </button>
                </div>
            </div>
        </div>
    )
}
