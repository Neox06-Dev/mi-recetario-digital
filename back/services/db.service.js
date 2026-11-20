import { MongoClient, ObjectId } from "mongodb"
import { config } from "../config.js"

const client = new MongoClient(config.mongoUri) //Se conectan al cluster
export const db = client.db(config.dbName) //Se conectan a mi db

// Devuelve un ObjectId o null si el id que llego por la URI no es valido
export function toObjectId(id) {
    try {
        return new ObjectId(id)
    } catch {
        return null
    }
}

export async function ping() {
    await client.db("admin").command({ ping: 1 })
    return true
}

// Indices que sostienen las reglas del modelo:
// - el email identifica al usuario (unico)
// - un usuario no puede guardar dos veces la misma receta en favoritos
// - las busquedas por categoria y por autor son las mas frecuentes
export async function ensureIndexes() {
    await db.collection("usuarios").createIndex({ email: 1 }, { unique: true })
    await db.collection("recetas").createIndex({ categoria: 1, fechaCreacion: -1 })
    await db.collection("recetas").createIndex({ "autor.email": 1 })
    await db.collection("categorias").createIndex({ slug: 1 })
    await db.collection("favoritos").createIndex({ usuarioEmail: 1, recetaId: 1 }, { unique: true })
}
