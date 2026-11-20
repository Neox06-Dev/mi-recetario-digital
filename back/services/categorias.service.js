import { db, toObjectId } from "./db.service.js"
import { httpError } from "../errors.js"

// "Postres y Dulces" -> "postres-y-dulces"
export function slugify(texto) {
    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
}

export async function getCategorias() {
    const categorias = await db.collection("categorias")
        .find({ eliminado: { $ne: true } })
        .sort({ orden: 1, nombre: 1 })
        .toArray()

    // Cuantos recetas activas tiene cada categoria (para mostrarlo en el front)
    const conteos = await db.collection("recetas").aggregate([
        { $match: { eliminado: { $ne: true } } },
        { $group: { _id: "$categoria", total: { $sum: 1 } } }
    ]).toArray()

    return categorias.map(categoria => ({
        ...categoria,
        totalRecetas: conteos.find(conteo => conteo._id === categoria.slug)?.total ?? 0
    }))
}

export async function getCategoriaById(id) {
    const _id = toObjectId(id)
    if (!_id) return null
    return await db.collection("categorias").findOne({ _id })
}

export async function getCategoriaBySlug(slug) {
    return await db.collection("categorias").findOne({ slug, eliminado: { $ne: true } })
}

export async function saveCategoria(categoria) {
    const slug = categoria.slug ?? slugify(categoria.nombre)
    const existe = await db.collection("categorias").findOne({ slug })
    if (existe) throw httpError(400, "Ya existe una categoria con ese nombre")
    const documento = { ...categoria, slug, eliminado: false }
    const { insertedId } = await db.collection("categorias").insertOne(documento)
    return { ...documento, _id: insertedId, totalRecetas: 0 }
}

export async function replaceCategoria(categoria, id) {
    const _id = toObjectId(id)
    if (!_id) return null
    const categoriaDB = await db.collection("categorias").findOne({ _id })
    if (!categoriaDB) return null
    const slug = categoria.slug ?? slugify(categoria.nombre)
    const documento = { ...categoria, slug, eliminado: false }
    await db.collection("categorias").replaceOne({ _id }, documento)
    // Si cambio el slug, actualizamos las recetas que la usaban
    if (slug !== categoriaDB.slug) {
        await db.collection("recetas").updateMany({ categoria: categoriaDB.slug }, { $set: { categoria: slug } })
    }
    return { ...documento, _id }
}

export async function updateCategoria(categoria, id) {
    const _id = toObjectId(id)
    if (!_id) return null
    const categoriaDB = await db.collection("categorias").findOne({ _id })
    if (!categoriaDB) return null
    const cambios = { ...categoria }
    if (cambios.nombre && !cambios.slug) cambios.slug = slugify(cambios.nombre)
    await db.collection("categorias").updateOne({ _id }, { $set: cambios })
    if (cambios.slug && cambios.slug !== categoriaDB.slug) {
        await db.collection("recetas").updateMany({ categoria: categoriaDB.slug }, { $set: { categoria: cambios.slug } })
    }
    const categoriaActualizada = await db.collection("categorias").findOne({ _id })
    return categoriaActualizada
}

export async function deleteCategoria(id) {
    const _id = toObjectId(id)
    if (!_id) return null
    const categoria = await db.collection("categorias").findOne({ _id })
    if (!categoria) return null
    const recetasAsociadas = await db.collection("recetas").countDocuments({ categoria: categoria.slug, eliminado: { $ne: true } })
    if (recetasAsociadas > 0) throw httpError(400, "No podes eliminar una categoria que tiene recetas asociadas")
    await db.collection("categorias").updateOne({ _id }, { $set: { eliminado: true } })
    return categoria
}
