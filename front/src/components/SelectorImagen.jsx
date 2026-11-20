import { useState } from "react"
import { FiImage } from "react-icons/fi"
import { IMAGENES_PREDEFINIDAS } from "../data/imagenes"
import { resolverImagen } from "../services/api.services"

export default function SelectorImagen({ valor, onCambiar }) {
    const [errorVista, setErrorVista] = useState(false)
    const vista = resolverImagen(valor)

    const elegir = (ruta) => {
        setErrorVista(false)
        onCambiar(ruta)
    }

    return (
        <div className="space-y-3">
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-borde bg-arena">
                {vista && !errorVista ? (
                    <img
                        src={vista}
                        alt="Vista previa de la receta"
                        className="h-full w-full object-cover"
                        onError={() => setErrorVista(true)}
                    />
                ) : (
                    <div className="grid h-full w-full place-items-center text-tinta-suave/60">
                        <div className="flex flex-col items-center gap-2">
                            <FiImage size={22} />
                            <span className="text-xs">Sin imagen seleccionada</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-4 gap-2">
                {IMAGENES_PREDEFINIDAS.map((imagen) => (
                    <button
                        key={imagen.ruta}
                        type="button"
                        onClick={() => elegir(imagen.ruta)}
                        title={imagen.nombre}
                        className={`relative aspect-square overflow-hidden rounded-lg border-2 transition ${
                            valor === imagen.ruta
                                ? "border-terracota ring-2 ring-terracota/20"
                                : "border-transparent hover:border-oliva/50"
                        }`}
                    >
                        <img
                            src={resolverImagen(imagen.ruta)}
                            alt={imagen.nombre}
                            loading="lazy"
                            className="h-full w-full object-cover"
                        />
                    </button>
                ))}
            </div>

            <input
                type="text"
                inputMode="url"
                value={valor ?? ""}
                onChange={(evento) => {
                    setErrorVista(false)
                    onCambiar(evento.target.value)
                }}
                placeholder="O pegá la URL de una foto (https://...)"
                className="campo text-xs"
            />
        </div>
    )
}
