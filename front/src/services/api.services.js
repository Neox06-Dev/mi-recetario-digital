const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:2026/api"
const API_ORIGIN = import.meta.env.VITE_API_ORIGIN ?? API_URL.replace(/\/api$/, "")

function usuarioGuardado() {
    try {
        return JSON.parse(localStorage.getItem("usuario") ?? "null")
    } catch {
        return null
    }
}

export function call(uri, method = "GET", body = undefined) {
    const usuario = usuarioGuardado()
    return fetch(API_URL + uri, {
        headers: {
            "Content-Type": "application/json",
            ...(usuario?.token ? { authorization: usuario.token } : {})
        },
        method,
        body: body === undefined ? undefined : JSON.stringify(body)
    }).then(async (res) => {
        const data = await res.json().catch(() => null)
        if (!res.ok) {
            const mensaje = Array.isArray(data) ? data.join(" · ") : data?.message ?? "Ocurrió un error inesperado"
            const error = new Error(mensaje)
            error.status = res.status
            throw error
        }
        return data
    })
}

// Las imagenes que sirve el backend vienen como ruta relativa (/img/recetas/...)
export function resolverImagen(imagen) {
    if (!imagen) return null
    if (/^https?:\/\//.test(imagen)) return imagen
    return API_ORIGIN + imagen
}

export { API_URL, API_ORIGIN }
