import { FiAlertCircle } from "react-icons/fi"

export default function MensajeError({ mensaje = "No pudimos cargar la información.", onReintentar }) {
    return (
        <div className="rounded-2xl border border-terracota/25 bg-terracota/5 px-6 py-10 text-center">
            <FiAlertCircle size={26} className="mx-auto text-terracota" />
            <p className="mt-3 font-display text-xl text-tinta">Algo salió mal</p>
            <p className="mx-auto mt-1 max-w-md text-sm text-tinta-suave">{mensaje}</p>
            {onReintentar && (
                <button type="button" onClick={onReintentar} className="btn-secundario mt-5">
                    Reintentar
                </button>
            )}
        </div>
    )
}
