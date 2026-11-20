import { db, toObjectId } from "./db.service.js"
import { httpError } from "../errors.js"

export async function getFavoritos(usuario) {
    const favoritos = await db.collection("favoritos").aggregate([
        { $match: { usuarioEmail: usuario.email } },
        { $sort: { fechaCreacion: -1 } },
        {
            $lookup: {
                from: "recetas",
                localField: "recetaId",
                foreignField: "_id",
                as: "receta"
            }
        },
        { $unwind: { path: "$receta", preserveNullAndEmptyArrays: true } }
    ]).toArray()

    // Si la receta fue eliminada, no la mostramos
    return favoritos.filter(favorito => favorito.receta && !favorito.receta.eliminado)
}

export async function saveFavorito(recetaId, usuario) {
    const _id = toObjectId(recetaId)
    if (!_id) throw httpError(400, "El id de la receta no es valido")
    const receta = await db.collection("recetas").findOne({ _id, eliminado: { $ne: true } })
    if (!receta) throw httpError(404, "Receta no encontrada")
    const existe = await db.collection("favoritos").findOne({ usuarioEmail: usuario.email, recetaId: _id })
    if (existe) return { ...existe, receta }
    const favorito = {
        usuarioEmail: usuario.email,
        recetaId: _id,
        fechaCreacion: new Date().toISOString()
    }
    const { insertedId } = await db.collection("favoritos").insertOne(favorito)
    return { ...favorito, _id: insertedId, receta }
}

export async function deleteFavorito(id, usuario) {
    const _id = toObjectId(id)
    if (!_id) return null
    const favorito = await db.collection("favoritos").findOne({ _id })
    if (!favorito) return null
    if (favorito.usuarioEmail !== usuario.email) throw httpError(403, "Ese favorito no es tuyo")
    await db.collection("favoritos").deleteOne({ _id })
    return favorito
}
