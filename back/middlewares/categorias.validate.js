import { categoriasSchema, categoriaPatchSchema, favoritoSchema } from "../schemas/categorias.js"

function responderErrores(res, errors) {
    const messages = errors.issues.map(error => `${error.path.length > 0 ? error.path : "Body "}:${error?.message}`)
    res.status(400).json(messages)
}

export async function validateCategoria(req, res, next) {
    try {
        const categoria = await categoriasSchema.parseAsync(req.body)
        req.body = categoria
        next()
    } catch (errors) {
        responderErrores(res, errors)
    }
}

export async function validateFavorito(req, res, next) {
    try {
        const favorito = await favoritoSchema.parseAsync(req.body)
        req.body = favorito
        next()
    } catch (errors) {
        responderErrores(res, errors)
    }
}

export async function validateCategoriaPatch(req, res, next) {
    try {
        const categoria = await categoriaPatchSchema.parseAsync(req.body)
        req.body = categoria
        next()
    } catch (errors) {
        responderErrores(res, errors)
    }
}
