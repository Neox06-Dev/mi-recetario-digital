import * as userService from "../../services/users.service.js"

function errorResponse(res, error) {
    if (error.status) return res.status(error.status).json({ message: error.message })
    res.status(503).json({ message: "Error interno del servidor" })
}

export async function getUsers(req, res) {
    try {
        const usuarios = await userService.getUsers(req.query)
        res.status(200).json(usuarios)
    } catch (error) {
        errorResponse(res, error)
    }
}

export async function getUserById(req, res) {
    try {
        const usuario = await userService.getUserById(req.params.id)
        if (usuario) res.status(200).json(usuario)
        else res.status(404).json({ message: "Usuario no encontrado" })
    } catch (error) {
        errorResponse(res, error)
    }
}

export async function saveUser(req, res) {
    try {
        const usuario = await userService.saveUser(req.body)
        res.status(201).json(usuario)
    } catch (error) {
        errorResponse(res, error)
    }
}

export async function login(req, res) {
    try {
        const usuario = await userService.login(req.body)
        res.status(200).json(usuario)
    } catch (error) {
        errorResponse(res, error)
    }
}

export async function asignarRol(req, res) {
    try {
        const usuario = await userService.asignarRol(req.body)
        res.status(200).json(usuario)
    } catch (error) {
        errorResponse(res, error)
    }
}

export async function deleteUser(req, res) {
    try {
        const usuario = await userService.deleteUser(req.params.id, req.usuario)
        if (usuario) res.status(200).json(usuario)
        else res.status(404).json({ message: "Usuario no encontrado" })
    } catch (error) {
        errorResponse(res, error)
    }
}
