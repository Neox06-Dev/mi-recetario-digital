import { createContext, useContext, useState } from "react"
import { jwtDecode } from "jwt-decode"

export const contexto = createContext()

export function useSession() {
    return useContext(contexto)
}

export function useLogin() {
    const { onLogin } = useSession()
    return onLogin
}

export function useLogout() {
    const { onLogout } = useSession()
    return onLogout
}

export function useUsuario() {
    const { usuario } = useSession()
    return usuario
}

export function useRol() {
    const { onRol } = useSession()
    return onRol()
}

export function useEstaAutenticado() {
    const usuario = useUsuario()
    return Boolean(usuario?.token)
}

export function SessionProvider({ children }) {
    const [usuario, setUsuario] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("usuario") ?? "null")
        } catch {
            return null
        }
    })

    const onLogin = (usuario) => {
        localStorage.setItem("usuario", JSON.stringify(usuario))
        setUsuario(usuario)
    }

    const onLogout = () => {
        localStorage.removeItem("usuario")
        setUsuario(null)
    }

    const onRol = () => {
        if (usuario?.token) {
            try {
                const payload = jwtDecode(usuario.token)
                return payload.rol
            } catch {
                return null
            }
        }
        return null
    }

    return (
        <contexto.Provider value={{ usuario, onLogin, onLogout, onRol }}>
            {children}
        </contexto.Provider>
    )
}
