import { recetasSchema, recetasPatchSchema } from "../schemas/recetas.js"

function responderErrores(res, errors) {
    const messages = errors.issues.map(error => `${error.path.length > 0 ? error.path : "Body "}:${error?.message}`)
    res.status(400).json(messages)
}

export async function validateReceta(req, res, next) {
    try {
        const receta = await recetasSchema.parseAsync(req.body)
        req.body = receta
        next()
    } catch (errors) {
        responderErrores(res, errors)
    }
}

export async function validateRecetaPatch(req, res, next) {
    try {
        const receta = await recetasPatchSchema.parseAsync(req.body)
        req.body = receta
        next()
    } catch (errors) {
        responderErrores(res, errors)
    }
}
