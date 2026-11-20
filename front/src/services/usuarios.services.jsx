import { call } from "./api.services"

export function useApiUsuarios() {
    const login = (usuario) => call("/usuarios/login", "POST", usuario)
    const register = (usuario) => call("/usuarios", "POST", usuario)
    const getUsuarios = () => call("/usuarios")
    const getUsuarioById = (id) => call("/usuarios/" + id)
    const asignarRol = (payload) => call("/usuarios/asignar", "POST", payload)
    const deleteUsuario = (id) => call("/usuarios/" + id, "DELETE")

    return {
        login,
        register,
        getUsuarios,
        getUsuarioById,
        asignarRol,
        deleteUsuario
    }
}
