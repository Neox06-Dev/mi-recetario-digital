import { call } from "./api.services"

export function useApiRecetas() {
    const getRecetas = (filtros = {}) => {
        const params = new URLSearchParams()
        Object.entries(filtros).forEach(([clave, valor]) => {
            if (valor !== undefined && valor !== null && valor !== "") params.set(clave, valor)
        })
        const query = params.toString()
        return call("/recetas" + (query ? `?${query}` : ""))
    }

    const getRecetaById = (id) => call("/recetas/" + id)
    const createReceta = (receta) => call("/recetas", "POST", receta)
    const updateReceta = (id, receta) => call("/recetas/" + id, "PUT", receta)
    const patchReceta = (id, receta) => call("/recetas/" + id, "PATCH", receta)
    const deleteReceta = (id) => call("/recetas/" + id, "DELETE")

    return {
        getRecetas,
        getRecetaById,
        createReceta,
        updateReceta,
        patchReceta,
        deleteReceta
    }
}
