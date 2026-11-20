import { usersRegisterSchema, usersLoginSchema, usersRolSchema } from "../schemas/users.js"

function responderErrores(res, errors) {
    const messages = errors.issues.map(error => `${error.path.length > 0 ? error.path : "Body "}:${error?.message}`)
    res.status(400).json(messages)
}

export async function validateUser(req, res, next) {
    try {
        const user = await usersRegisterSchema.parseAsync(req.body)
        req.body = user
        next()
    } catch (errors) {
        responderErrores(res, errors)
    }
}

export async function validateLogin(req, res, next) {
    try {
        const user = await usersLoginSchema.parseAsync(req.body)
        req.body = user
        next()
    } catch (errors) {
        responderErrores(res, errors)
    }
}

export async function validateRol(req, res, next) {
    try {
        const payload = await usersRolSchema.parseAsync(req.body)
        req.body = payload
        next()
    } catch (errors) {
        responderErrores(res, errors)
    }
}
