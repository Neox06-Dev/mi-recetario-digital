import jwt from "jsonwebtoken"
import { config } from "../config.js"

export function createToken(usuario) {
    const token = jwt.sign({
        _id: usuario._id?.toString(),
        email: usuario.email,
        name: usuario.name,
        username: usuario.username,
        rol: usuario.rol
    }, config.jwtSecret, { expiresIn: config.jwtExpires })
    return token
}

export function validateToken(token) {
    const payload = jwt.verify(token, config.jwtSecret)
    return payload
}
