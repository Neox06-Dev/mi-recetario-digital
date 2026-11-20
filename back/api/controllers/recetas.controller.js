import * as recetaService from "../../services/recetas.service.js"

function errorResponse(res, error) {
    if (error.status) return res.status(error.status).json({ message: error.message })
    res.status(503).json({ message: "Error interno del servidor" })
}

export async function getRecetas(req, res) {
    try {
        const recetas = await recetaService.getRecetas(req.query)
        res.status(200).json(recetas)
    } catch (error) {
        errorResponse(res, error)
    }
}

export async function getRecetaById(req, res) {
    try {
        const receta = await recetaService.getRecetaById(req.params.id)
        if (receta) res.status(200).json(receta)
        else res.status(404).json({ message: "Receta no encontrada" })
    } catch (error) {
        errorResponse(res, error)
    }
}

export async function saveReceta(req, res) {
    try {
        const receta = await recetaService.saveReceta(req.body, req.usuario)
        res.status(201).json(receta)
    } catch (error) {
        errorResponse(res, error)
    }
}

export async function replaceReceta(req, res) {
    try {
        const receta = await recetaService.replaceReceta(req.body, req.params.id, req.usuario)
        if (receta) res.status(200).json(receta)
        else res.status(404).json({ message: "Receta no encontrada" })
    } catch (error) {
        errorResponse(res, error)
    }
}

export async function updateReceta(req, res) {
    try {
        const receta = await recetaService.updateReceta(req.body, req.params.id, req.usuario)
        if (receta) res.status(200).json(receta)
        else res.status(404).json({ message: "Receta no encontrada" })
    } catch (error) {
        errorResponse(res, error)
    }
}

export async function deleteReceta(req, res) {
    try {
        const receta = await recetaService.deleteReceta(req.params.id, req.usuario)
        if (receta) res.status(200).json(receta)
        else res.status(404).json({ message: "Receta no encontrada" })
    } catch (error) {
        errorResponse(res, error)
    }
}
