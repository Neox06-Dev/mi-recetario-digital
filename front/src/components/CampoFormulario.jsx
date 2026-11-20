export default function CampoFormulario({ etiqueta, htmlFor, error, ayuda, children, className = "" }) {
    return (
        <div className={className}>
            {etiqueta && (
                <label htmlFor={htmlFor} className="mb-1.5 block text-[0.8rem] font-semibold text-tinta">
                    {etiqueta}
                </label>
            )}
            {children}
            {ayuda && !error && <p className="mt-1.5 text-xs text-tinta-suave/80">{ayuda}</p>}
            {error && <p className="mensaje-error">{error}</p>}
        </div>
    )
}
