import bcrypt from "bcrypt"
import { db, toObjectId } from "./db.service.js"
import { createToken } from "./token.service.js"
import { httpError } from "../errors.js"

export async function getUsers() {
    return await db.collection("usuarios")
        .find({}, { projection: { password: 0 } })
        .toArray()
}

export async function getUserById(id) {
    const _id = toObjectId(id)
    if (!_id) return null
    return await db.collection("usuarios").findOne({ _id }, { projection: { password: 0 } })
}

export async function saveUser(usuario) {
    const existe = await db.collection("usuarios").findOne({ email: usuario.email })
    if (existe) throw httpError(400, "Ya existe un usuario registrado con ese email")
    usuario.password = await bcrypt.hash(usuario.password, 10)
    delete usuario.passwordConfirm
    usuario.rol = "user" // El rol nunca llega desde el cliente: arranca siempre como user
    usuario.fechaCreacion = new Date().toISOString()
    const { insertedId } = await db.collection("usuarios").insertOne(usuario)
    return {
        _id: insertedId,
        name: usuario.name,
        username: usuario.username,
        email: usuario.email,
        rol: usuario.rol
    }
}

export async function login(usuario) {
    const usuarioDB = await db.collection("usuarios").findOne({ email: usuario.email })
    if (!usuarioDB) throw httpError(401, "Usuario/Contraseña incorrecta")
    const ok = await bcrypt.compare(usuario.password, usuarioDB.password)
    if (!ok) throw httpError(401, "Usuario/Contraseña incorrecta")
    const token = createToken(usuarioDB)
    return {
        _id: usuarioDB._id,
        email: usuarioDB.email,
        name: usuarioDB.name,
        username: usuarioDB.username,
        rol: usuarioDB.rol,
        token: token
    }
}

export async function asignarRol(payload) {
    const { email, rol } = payload
    const usuario = await db.collection("usuarios").findOne({ email })
    if (!usuario) throw httpError(404, "Usuario no encontrado")
    await db.collection("usuarios").updateOne({ email }, { $set: { rol } })
    return { _id: usuario._id, email, name: usuario.name, username: usuario.username, rol }
}

export async function deleteUser(id, usuarioLogueado) {
    const _id = toObjectId(id)
    if (!_id) return null
    const usuario = await db.collection("usuarios").findOne({ _id })
    if (!usuario) return null
    if (usuario.email === usuarioLogueado?.email) throw httpError(400, "No podes eliminar tu propio usuario")
    await db.collection("usuarios").deleteOne({ _id })
    return { _id, email: usuario.email, name: usuario.name }
}
