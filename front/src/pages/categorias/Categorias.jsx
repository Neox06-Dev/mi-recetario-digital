import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "react-toastify"
import { FiEdit2, FiPlus, FiTrash2, FiX } from "react-icons/fi"
import { categoriasSchema } from "../../schemas/categorias"
import { useApiCategorias } from "../../services/categorias.services"
import { useCategorias } from "../../context/categorias.context"
import CampoFormulario from "../../components/CampoFormulario"
import ModalConfirmar from "../../components/ModalConfirmar"
import Cargando from "../../components/Cargando"

const EMOJIS = ["🍽️", "🥐", "🍲", "🧁", "🍝", "🍰", "🥤", "🥗", "🍕", "🍔", "🍪", "🍷"]

export default function Categorias() {
    const { categorias, cargando, cargar } = useCategorias()
    const { createCategoria, updateCategoria, deleteCategoria } = useApiCategorias()
    const [editando, setEditando] = useState(null)
    const [mostrarForm, setMostrarForm] = useState(false)
    const [aEliminar, setAEliminar] = useState(null)
    const [eliminando, setEliminando] = useState(false)

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(categoriasSchema),
        defaultValues: { nombre: "", descripcion: "", emoji: "🍽️", orden: 0 }
    })

    const emojiElegido = watch("emoji")

    const abrirNueva = () => {
        setEditando(null)
        reset({ nombre: "", descripcion: "", emoji: "🍽️", orden: categorias.length + 1 })
        setMostrarForm(true)
    }

    const abrirEditar = (categoria) => {
        setEditando(categoria)
        reset({
            nombre: categoria.nombre,
            descripcion: categoria.descripcion ?? "",
            emoji: categoria.emoji ?? "🍽️",
            orden: categoria.orden ?? 0
        })
        setMostrarForm(true)
    }

    const onSubmit = async (datos) => {
        try {
            if (editando) {
                await updateCategoria(editando._id, datos)
                toast.success("Categoría actualizada")
            } else {
                await createCategoria(datos)
                toast.success("Categoría creada")
            }
            await cargar()
            setMostrarForm(false)
            setEditando(null)
        } catch (error) {
            toast.error(error.message)
        }
    }

    const confirmarEliminar = async () => {
        try {
            setEliminando(true)
            await deleteCategoria(aEliminar._id)
            await cargar()
            toast.success("Categoría eliminada")
            setAEliminar(null)
        } catch (error) {
            toast.error(error.message)
        } finally {
            setEliminando(false)
        }
    }

    return (
        <div className="contenedor py-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="etiqueta text-terracota">Administración</p>
                    <h1 className="mt-2 font-display text-3xl leading-tight text-tinta sm:text-4xl">Categorías</h1>
                    <p className="mt-2 max-w-xl text-sm text-tinta-suave">
                        Los tipos de comida con los que se clasifican las recetas. Solo admin y superadmin pueden
                        modificarlas.
                    </p>
                </div>
                <button type="button" onClick={abrirNueva} className="btn-primario">
                    <FiPlus size={16} /> Nueva categoría
                </button>
            </div>

            {mostrarForm && (
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="mt-8 rounded-2xl border border-oliva/30 bg-white p-6 shadow-sm"
                >
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="font-display text-xl text-tinta">
                                {editando ? `Editar ${editando.nombre}` : "Nueva categoría"}
                            </h2>
                            <p className="mt-1 text-xs text-tinta-suave">
                                El identificador (slug) se genera solo a partir del nombre.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setMostrarForm(false)
                                setEditando(null)
                            }}
                            className="grid h-8 w-8 place-items-center rounded-full text-tinta-suave transition hover:bg-crema-hondo"
                            aria-label="Cerrar formulario"
                        >
                            <FiX size={16} />
                        </button>
                    </div>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <CampoFormulario etiqueta="Nombre" htmlFor="nombre" error={errors.nombre?.message}>
                            <input
                                id="nombre"
                                type="text"
                                placeholder="Ej: Postres"
                                className={`campo ${errors.nombre ? "campo-error" : ""}`}
                                {...register("nombre")}
                            />
                        </CampoFormulario>

                        <CampoFormulario etiqueta="Orden" htmlFor="orden" error={errors.orden?.message}>
                            <input
                                id="orden"
                                type="number"
                                min={0}
                                className={`campo ${errors.orden ? "campo-error" : ""}`}
                                {...register("orden", { valueAsNumber: true })}
                            />
                        </CampoFormulario>

                        <CampoFormulario
                            etiqueta="Descripción"
                            htmlFor="descripcion"
                            error={errors.descripcion?.message}
                            className="sm:col-span-2"
                        >
                            <input
                                id="descripcion"
                                type="text"
                                placeholder="Ej: El dulce final"
                                className={`campo ${errors.descripcion ? "campo-error" : ""}`}
                                {...register("descripcion")}
                            />
                        </CampoFormulario>

                        <CampoFormulario etiqueta="Emoji" htmlFor="emoji" error={errors.emoji?.message} className="sm:col-span-2">
                            <div className="flex flex-wrap items-center gap-2">
                                <input
                                    id="emoji"
                                    type="text"
                                    maxLength={4}
                                    className="campo w-20 text-center text-lg"
                                    {...register("emoji")}
                                />
                                {EMOJIS.map((emoji) => (
                                    <button
                                        key={emoji}
                                        type="button"
                                        onClick={() => setValue("emoji", emoji)}
                                        className={`grid h-9 w-9 place-items-center rounded-lg border text-lg transition ${
                                            emojiElegido === emoji
                                                ? "border-terracota bg-terracota/5"
                                                : "border-borde hover:border-oliva"
                                        }`}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </CampoFormulario>
                    </div>

                    <div className="mt-6 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                setMostrarForm(false)
                                setEditando(null)
                            }}
                            className="btn-secundario"
                        >
                            Cancelar
                        </button>
                        <button type="submit" disabled={isSubmitting} className="btn-primario">
                            {isSubmitting ? "Guardando..." : editando ? "Guardar cambios" : "Crear categoría"}
                        </button>
                    </div>
                </form>
            )}

            <div className="mt-8">
                {cargando ? (
                    <Cargando tarjetas={3} />
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {categorias.map((categoria) => (
                            <article key={categoria._id} className="rounded-2xl border border-borde bg-white p-5">
                                <div className="flex items-start justify-between">
                                    <span className="grid h-11 w-11 place-items-center rounded-full bg-crema-hondo text-xl">
                                        {categoria.emoji}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => abrirEditar(categoria)}
                                            className="grid h-8 w-8 place-items-center rounded-lg text-tinta-suave transition hover:bg-crema-hondo hover:text-tinta"
                                            aria-label={`Editar ${categoria.nombre}`}
                                        >
                                            <FiEdit2 size={14} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setAEliminar(categoria)}
                                            className="grid h-8 w-8 place-items-center rounded-lg text-tinta-suave transition hover:bg-terracota/10 hover:text-terracota"
                                            aria-label={`Eliminar ${categoria.nombre}`}
                                        >
                                            <FiTrash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                                <h2 className="mt-3 font-display text-lg text-tinta">{categoria.nombre}</h2>
                                <p className="mt-1 line-clamp-2 text-xs text-tinta-suave">
                                    {categoria.descripcion || "Sin descripción"}
                                </p>
                                <div className="mt-4 flex items-center gap-2 text-[0.7rem]">
                                    <code className="rounded bg-crema-hondo px-1.5 py-0.5 text-tinta-suave">
                                        {categoria.slug}
                                    </code>
                                    <span className="rounded-full bg-oliva-claro px-2 py-0.5 font-semibold text-oliva">
                                        {categoria.totalRecetas} recetas
                                    </span>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>

            <ModalConfirmar
                abierto={Boolean(aEliminar)}
                titulo={`¿Eliminar ${aEliminar?.nombre ?? "la categoría"}?`}
                texto="Si la categoría tiene recetas asociadas no se va a poder eliminar."
                cargando={eliminando}
                onCancelar={() => setAEliminar(null)}
                onConfirmar={confirmarEliminar}
            />
        </div>
    )
}
