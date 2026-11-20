import { call } from "./api.services"

export function useApiCategorias() {
    const getCategorias = () => call("/categorias")
    const getCategoriaById = (id) => call("/categorias/" + id)
    const createCategoria = (categoria) => call("/categorias", "POST", categoria)
    const updateCategoria = (id, categoria) => call("/categorias/" + id, "PUT", categoria)
    const patchCategoria = (id, categoria) => call("/categorias/" + id, "PATCH", categoria)
    const deleteCategoria = (id) => call("/categorias/" + id, "DELETE")

    return {
        getCategorias,
        getCategoriaById,
        createCategoria,
        updateCategoria,
        patchCategoria,
        deleteCategoria
    }
}
