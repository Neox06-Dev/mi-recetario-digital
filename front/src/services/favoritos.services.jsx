import { call } from "./api.services"

export function useApiFavoritos() {
    const getFavoritos = () => call("/favoritos")
    const createFavorito = (recetaId) => call("/favoritos", "POST", { recetaId })
    const deleteFavorito = (id) => call("/favoritos/" + id, "DELETE")

    return {
        getFavoritos,
        createFavorito,
        deleteFavorito
    }
}
