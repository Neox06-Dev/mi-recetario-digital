import * as favoritoService from "../../services/favoritos.service.js"

function errorResponse(res, error) {
    if (error.status) return res.status(error.status).json({ message: error.message })
    res.status(503).json({ message: "Error interno del servidor" })
}

export async function getFavoritos(req, res) {
    try {
        const favoritos = await favoritoService.getFavoritos(req.usuario)
        res.status(200).json(favoritos)
    } catch (error) {
        errorResponse(res, error)
    }
}

export async function saveFavorito(req, res) {
    try {
        const favorito = await favoritoService.saveFavorito(req.body.recetaId, req.usuario)
        res.status(201).json(favorito)
    } catch (error) {
        errorResponse(res, error)
    }
}

export async function deleteFavorito(req, res) {
    try {
        const favorito = await favoritoService.deleteFavorito(req.params.id, req.usuario)
        if (favorito) res.status(200).json(favorito)
        else res.status(404).json({ message: "Favorito no encontrado" })
    } catch (error) {
        errorResponse(res, error)
    }
}
