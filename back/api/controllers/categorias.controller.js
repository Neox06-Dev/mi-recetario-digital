import * as categoriaService from "../../services/categorias.service.js"

function errorResponse(res, error) {
    if (error.status) return res.status(error.status).json({ message: error.message })
    res.status(503).json({ message: "Error interno del servidor" })
}

export async function getCategorias(req, res) {
    try {
        const categorias = await categoriaService.getCategorias(req.query)
        res.status(200).json(categorias)
    } catch (error) {
        errorResponse(res, error)
    }
}

export async function getCategoriaById(req, res) {
    try {
        const categoria = await categoriaService.getCategoriaById(req.params.id)
        if (categoria) res.status(200).json(categoria)
        else res.status(404).json({ message: "Categoria no encontrada" })
    } catch (error) {
        errorResponse(res, error)
    }
}

export async function saveCategoria(req, res) {
    try {
        const categoria = await categoriaService.saveCategoria(req.body)
        res.status(201).json(categoria)
    } catch (error) {
        errorResponse(res, error)
    }
}

export async function replaceCategoria(req, res) {
    try {
        const categoria = await categoriaService.replaceCategoria(req.body, req.params.id)
        if (categoria) res.status(200).json(categoria)
        else res.status(404).json({ message: "Categoria no encontrada" })
    } catch (error) {
        errorResponse(res, error)
    }
}

export async function updateCategoria(req, res) {
    try {
        const categoria = await categoriaService.updateCategoria(req.body, req.params.id)
        if (categoria) res.status(200).json(categoria)
        else res.status(404).json({ message: "Categoria no encontrada" })
    } catch (error) {
        errorResponse(res, error)
    }
}

export async function deleteCategoria(req, res) {
    try {
        const categoria = await categoriaService.deleteCategoria(req.params.id)
        if (categoria) res.status(200).json(categoria)
        else res.status(404).json({ message: "Categoria no encontrada" })
    } catch (error) {
        errorResponse(res, error)
    }
}
