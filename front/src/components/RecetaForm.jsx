import { useNavigate } from "react-router"
import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "react-toastify"
import { FiPlus, FiTrash2 } from "react-icons/fi"
import { recetasSchema, DIFICULTADES } from "../schemas/recetas"
import { useApiRecetas } from "../services/recetas.services"
import { useCategorias } from "../context/categorias.context"
import CampoFormulario from "./CampoFormulario"
import SelectorImagen from "./SelectorImagen"

const VALORES_INICIALES = {
    titulo: "",
    descripcion: "",
    categoria: "",
    dificultad: "facil",
    tiempoMinutos: 30,
    porciones: 4,
    imagen: "/img/recetas/tarta-manzana.jpg",
    ingredientes: [{ cantidad: "", nombre: "" }],
    pasos: [{ texto: "" }]
}

export default function RecetaForm({ receta, modo = "crear" }) {
    const navigate = useNavigate()
    const { categorias } = useCategorias()
    const { createReceta, updateReceta } = useApiRecetas()

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(recetasSchema),
        defaultValues: receta
        ? {
            titulo: receta.titulo,
            descripcion: receta.descripcion,
            categoria: receta.categoria,
            dificultad: receta.dificultad ?? "facil",
            tiempoMinutos: receta.tiempoMinutos,
            porciones: receta.porciones,
            imagen: receta.imagen ?? "",
            ingredientes: receta.ingredientes,
            pasos: receta.pasos
        }
            : VALORES_INICIALES
    })

    const ingredientes = useFieldArray({ control, name: "ingredientes" })
    const pasos = useFieldArray({ control, name: "pasos" })
    const imagen = watch("imagen")

    const onSubmit = async (datos) => {
        try {
            if (modo === "editar") {
                await updateReceta(receta._id, datos)
                toast.success("Receta actualizada")
                navigate(`/recetas/${receta._id}`)
            } else {
                const nueva = await createReceta(datos)
                toast.success("¡Receta publicada!")
                navigate(`/recetas/${nueva._id}`)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
            <div className="space-y-8">
                <section className="rounded-2xl border border-borde bg-white p-6">
                    <h2 className="font-display text-xl text-tinta">Lo básico</h2>
                    <p className="mt-1 text-sm text-tinta-suave">Contanos qué vas a cocinar.</p>

                    <div className="mt-5 space-y-4">
                        <CampoFormulario etiqueta="Título de la receta" htmlFor="titulo" error={errors.titulo?.message}>
                            <input
                                id="titulo"
                                type="text"
                                placeholder="Ej: Tarta de manzana de la abuela"
                                className={`campo ${errors.titulo ? "campo-error" : ""}`}
                                {...register("titulo")}
                            />
                        </CampoFormulario>

                        <CampoFormulario
                            etiqueta="Descripción"
                            htmlFor="descripcion"
                            error={errors.descripcion?.message}
                            ayuda="Una o dos frases que den ganas de cocinarla."
                        >
                            <textarea
                                id="descripcion"
                                rows={3}
                                placeholder="Ej: Clásica, con manzanas caramelizadas y masa quebrada."
                                className={`campo resize-none ${errors.descripcion ? "campo-error" : ""}`}
                                {...register("descripcion")}
                            />
                        </CampoFormulario>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <CampoFormulario etiqueta="Tipo de comida" htmlFor="categoria" error={errors.categoria?.message}>
                                <select
                                    id="categoria"
                                    className={`campo ${errors.categoria ? "campo-error" : ""}`}
                                    {...register("categoria")}
                                >
                                    <option value="">Elegí una categoría</option>
                                    {categorias.map((categoria) => (
                                        <option key={categoria.slug} value={categoria.slug}>
                                            {categoria.emoji} {categoria.nombre}
                                        </option>
                                    ))}
                                </select>
                            </CampoFormulario>

                            <CampoFormulario etiqueta="Dificultad" htmlFor="dificultad" error={errors.dificultad?.message}>
                                <select id="dificultad" className="campo" {...register("dificultad")}>
                                    {DIFICULTADES.map((dificultad) => (
                                        <option key={dificultad.valor} value={dificultad.valor}>
                                            {dificultad.etiqueta}
                                        </option>
                                    ))}
                                </select>
                            </CampoFormulario>

                            <CampoFormulario etiqueta="Tiempo (minutos)" htmlFor="tiempoMinutos" error={errors.tiempoMinutos?.message}>
                                <input
                                    id="tiempoMinutos"
                                    type="number"
                                    min={1}
                                    className={`campo ${errors.tiempoMinutos ? "campo-error" : ""}`}
                                    {...register("tiempoMinutos", { valueAsNumber: true })}
                                />
                            </CampoFormulario>

                            <CampoFormulario etiqueta="Porciones" htmlFor="porciones" error={errors.porciones?.message}>
                                <input
                                    id="porciones"
                                    type="number"
                                    min={1}
                                    className={`campo ${errors.porciones ? "campo-error" : ""}`}
                                    {...register("porciones", { valueAsNumber: true })}
                                />
                            </CampoFormulario>
                        </div>
                    </div>
                </section>

                <section className="rounded-2xl border border-borde bg-white p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="font-display text-xl text-tinta">Ingredientes</h2>
                            <p className="mt-1 text-sm text-tinta-suave">Cantidad y nombre, uno por línea.</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => ingredientes.append({ cantidad: "", nombre: "" })}
                            className="btn-secundario shrink-0 px-4 py-2 text-xs"
                        >
                            <FiPlus size={14} /> Agregar
                        </button>
                    </div>

                    {errors.ingredientes?.message && <p className="mensaje-error mt-3">{errors.ingredientes.message}</p>}
                    {errors.ingredientes?.root?.message && (
                        <p className="mensaje-error mt-3">{errors.ingredientes.root.message}</p>
                    )}

                    <div className="mt-4 space-y-2">
                        {ingredientes.fields.map((campo, indice) => (
                            <div key={campo.id} className="grid grid-cols-[6.5rem_1fr_auto] items-start gap-2">
                                <input
                                    type="text"
                                    placeholder="Cantidad"
                                    className="campo py-2 text-sm"
                                    {...register(`ingredientes.${indice}.cantidad`)}
                                />
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Ingrediente"
                                        className={`campo py-2 text-sm ${
                                            errors.ingredientes?.[indice]?.nombre ? "campo-error" : ""
                                        }`}
                                        {...register(`ingredientes.${indice}.nombre`)}
                                    />
                                    {errors.ingredientes?.[indice]?.nombre && (
                                        <p className="mensaje-error">{errors.ingredientes[indice].nombre.message}</p>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => ingredientes.remove(indice)}
                                    disabled={ingredientes.fields.length === 1}
                                    className="grid h-10 w-10 place-items-center rounded-lg text-tinta-suave transition hover:bg-terracota/10 hover:text-terracota disabled:opacity-30"
                                    aria-label="Quitar ingrediente"
                                >
                                    <FiTrash2 size={15} />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="rounded-2xl border border-borde bg-white p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="font-display text-xl text-tinta">Paso a paso</h2>
                            <p className="mt-1 text-sm text-tinta-suave">Escribí los pasos en orden.</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => pasos.append({ texto: "" })}
                            className="btn-secundario shrink-0 px-4 py-2 text-xs"
                        >
                            <FiPlus size={14} /> Agregar
                        </button>
                    </div>

                    {errors.pasos?.message && <p className="mensaje-error mt-3">{errors.pasos.message}</p>}
                    {errors.pasos?.root?.message && <p className="mensaje-error mt-3">{errors.pasos.root.message}</p>}

                    <div className="mt-4 space-y-3">
                        {pasos.fields.map((campo, indice) => (
                            <div key={campo.id} className="flex items-start gap-3">
                                <span className="mt-2 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-crema-hondo text-xs font-bold text-tinta-suave">
                                    {indice + 1}
                                </span>
                                <div className="flex-1">
                                    <textarea
                                        rows={2}
                                        placeholder="Describí el paso..."
                                        className={`campo resize-none py-2 text-sm ${
                                            errors.pasos?.[indice]?.texto ? "campo-error" : ""
                                        }`}
                                        {...register(`pasos.${indice}.texto`)}
                                    />
                                    {errors.pasos?.[indice]?.texto && (
                                        <p className="mensaje-error">{errors.pasos[indice].texto.message}</p>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => pasos.remove(indice)}
                                    disabled={pasos.fields.length === 1}
                                    className="mt-1 grid h-9 w-9 place-items-center rounded-lg text-tinta-suave transition hover:bg-terracota/10 hover:text-terracota disabled:opacity-30"
                                    aria-label="Quitar paso"
                                >
                                    <FiTrash2 size={15} />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
                <section className="rounded-2xl border border-borde bg-white p-5">
                    <h2 className="font-display text-lg text-tinta">Foto de la receta</h2>
                    <p className="mb-4 mt-1 text-xs text-tinta-suave">Elegí una de la galería o pegá una URL.</p>
                    <SelectorImagen valor={imagen} onCambiar={(valor) => setValue("imagen", valor)} />
                </section>

                <div className="rounded-2xl border border-borde bg-crema-hondo/60 p-5">
                    <button type="submit" disabled={isSubmitting} className="btn-primario mt-4 w-full">
                        {isSubmitting ? "Guardando..." : modo === "editar" ? "Guardar cambios" : "Publicar receta"}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="btn-fantasma mt-2 w-full justify-center"
                    >
                        Cancelar
                    </button>
                </div>
            </aside>
        </form>
    )
}
