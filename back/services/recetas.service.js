import { db, toObjectId } from "./db.service.js"
import { getCategoriaBySlug } from "./categorias.service.js"
import { httpError } from "../errors.js"

// Solo el autor de la receta, un admin o un superadmin pueden modificarla
export function puedeEditar(receta, usuario) {
    if (!usuario) return false
    if (receta.autor?.email === usuario.email) return true
    return ["admin", "superadmin"].includes(usuario.rol)
}

export async function getRecetas(filtros = {}) {
    const filter = { eliminado: { $ne: true } }

    // Paginado
    const page = parseInt(filtros.page) || 1
    const limit = parseInt(filtros.limit) || 9
    const skip = (page - 1) * limit

    // Filtro por categoria (tipo de comida)
    if (filtros?.categoria) filter.categoria = filtros.categoria
    if (filtros?.dificultad) filter.dificultad = filtros.dificultad
    if (filtros?.tiempoMax) filter.tiempoMinutos = { $lte: parseInt(filtros.tiempoMax) }
    if (filtros?.autor) filter["autor.email"] = filtros.autor

    // Busqueda por titulo, descripcion o ingrediente
    if (filtros?.q) {
        const busqueda = { $regex: filtros.q, $options: "i" }
        filter.$or = [
            { titulo: busqueda },
            { descripcion: busqueda },
            { "ingredientes.nombre": busqueda }
        ]
    }

    const ordenes = {
        recientes: { fechaCreacion: -1 },
        antiguas: { fechaCreacion: 1 },
        rapidas: { tiempoMinutos: 1 },
        titulo: { titulo: 1 }
    }
    const orden = ordenes[filtros?.orden] ?? ordenes.recientes

    const total = await db.collection("recetas").countDocuments(filter)
    const recetas = await db.collection("recetas")
        .find(filter)
        .sort(orden)
        .skip(skip)
        .limit(limit)
        .toArray()

    const totalPaginas = Math.ceil(total / limit) || 1
    // Mismo criterio que en clase: el ultimo elemento del array trae la info de paginado
    recetas.push({ totalDocumentos: total, totalPaginas, currentPage: page, total: limit })
    return recetas
}

export async function getRecetaById(id) {
    const _id = toObjectId(id)
    if (!_id) return null
    return await db.collection("recetas").findOne({ _id, eliminado: { $ne: true } })
}

async function validarCategoria(slug) {
    const categoria = await getCategoriaBySlug(slug)
    if (!categoria) throw httpError(400, "La categoria indicada no existe")
    return categoria
}

export async function saveReceta(receta, usuario) {
    await validarCategoria(receta.categoria)
    const documento = {
        ...receta,
        autor: {
            email: usuario.email,
            nombre: usuario.name,
            username: usuario.username
        },
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        eliminado: false
    }
    const { insertedId } = await db.collection("recetas").insertOne(documento)
    return { ...documento, _id: insertedId }
}

export async function replaceReceta(receta, id, usuario) {
    const _id = toObjectId(id)
    if (!_id) return null
    const recetaDB = await getRecetaById(id)
    if (!recetaDB) return null
    if (!puedeEditar(recetaDB, usuario)) throw httpError(403, "Solo el autor de la receta puede modificarla")
    await validarCategoria(receta.categoria)
    const documento = {
        ...receta,
        autor: recetaDB.autor,
        fechaCreacion: recetaDB.fechaCreacion,
        fechaActualizacion: new Date().toISOString(),
        eliminado: false
    }
    await db.collection("recetas").replaceOne({ _id }, documento)
    return { ...documento, _id }
}

export async function updateReceta(receta, id, usuario) {
    const _id = toObjectId(id)
    if (!_id) return null
    const recetaDB = await getRecetaById(id)
    if (!recetaDB) return null
    if (!puedeEditar(recetaDB, usuario)) throw httpError(403, "Solo el autor de la receta puede modificarla")
    if (receta.categoria) await validarCategoria(receta.categoria)
    await db.collection("recetas").updateOne(
        { _id },
        { $set: { ...receta, fechaActualizacion: new Date().toISOString() } }
    )
    return await getRecetaById(id)
}

export async function deleteReceta(id, usuario) {
    const _id = toObjectId(id)
    if (!_id) return null
    const receta = await getRecetaById(id)
    if (!receta) return null
    if (!puedeEditar(receta, usuario)) throw httpError(403, "Solo el autor de la receta puede eliminarla")
    // Borrado logico, igual que en clase
    await db.collection("recetas").updateOne({ _id }, { $set: { eliminado: true } })
    return receta
}
