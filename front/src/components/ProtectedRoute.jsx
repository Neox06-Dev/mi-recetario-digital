import { Navigate, useLocation } from "react-router"
import { useRol, useUsuario } from "../context/session.context"

export default function ProtectedRoute({ element, rol }) {
    const usuario = useUsuario()
    const rolUsuario = useRol()
    const { pathname } = useLocation()

    if (usuario && (!rol || rol.includes(rolUsuario))) return element
    if (usuario) return <Navigate to="/" replace />
    return <Navigate to="/login" replace state={{ desde: pathname }} />
}
