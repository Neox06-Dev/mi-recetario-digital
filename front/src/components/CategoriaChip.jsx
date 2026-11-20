export default function CategoriaChip({ activa = false, emoji, nombre, total, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                activa
                    ? "border-tinta bg-tinta text-crema"
                    : "border-borde bg-white text-tinta-suave hover:border-oliva hover:text-tinta"
            }`}
        >
            {emoji && <span className="text-base leading-none">{emoji}</span>}
            {nombre}
            {total !== undefined && (
                <span className={`text-[0.68rem] ${activa ? "text-crema/70" : "text-tinta-suave/70"}`}>{total}</span>
            )}
        </button>
    )
}
