import { validateToken as validateTokenService } from "../services/token.service.js"

export function validateToken(req, res, next) {
    try {
        const header = req.headers.authorization ?? ""
        // Aceptamos tanto "token" como "Bearer token"
        const token = header.startsWith("Bearer ") ? header.slice(7) : header
        const payload = validateTokenService(token)
        req.usuario = payload
        next()
    } catch {
        res.status(401).json({ message: "Usuario no autorizado" })
    }
}

export function validateRoles(roles) {
    return (req, res, next) => {
        if (roles.includes(req.usuario?.rol)) {
            next()
        } else {
            res.status(403).json({ message: "No tenes permisos para esta accion" })
        }
    }
}
