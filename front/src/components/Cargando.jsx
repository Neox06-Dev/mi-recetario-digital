export default function Cargando({ pantalla = false, tarjetas = 0 }) {
    if (pantalla) {
        return (
            <div className="grid min-h-[60vh] place-items-center">
                <div className="flex flex-col items-center gap-3">
                    <span className="h-9 w-9 animate-spin rounded-full border-2 border-borde border-t-terracota" />
                    <p className="text-sm text-tinta-suave">Cargando...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: tarjetas || 6 }).map((_, indice) => (
                <div key={indice} className="animate-pulse overflow-hidden rounded-2xl border border-borde bg-white">
                    <div className="aspect-[4/3] bg-arena" />
                    <div className="space-y-3 p-5">
                        <div className="h-3 w-20 rounded-full bg-arena" />
                        <div className="h-4 w-3/4 rounded-full bg-arena" />
                        <div className="h-3 w-full rounded-full bg-crema-hondo" />
                        <div className="h-3 w-2/3 rounded-full bg-crema-hondo" />
                    </div>
                </div>
            ))}
        </div>
    )
}
