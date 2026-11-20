import { createContext, useCallback, useContext, useEffect, useState } from "react"
import { useApiFavoritos } from "../services/favoritos.services"
import { useUsuario } from "./session.context"

const contexto = createContext()

export function useFavoritos() {
    return useContext(contexto)
}

export function FavoritosProvider({ children }) {
    const usuario = useUsuario()
    const { getFavoritos, createFavorito, deleteFavorito } = useApiFavoritos()
    const [favoritos, setFavoritos] = useState([])
    const [cargando, setCargando] = useState(false)

    const cargar = useCallback(() => {
        if (!usuario?.token) {
            setFavoritos([])
            return Promise.resolve([])
        }
        setCargando(true)
        return getFavoritos()
            .then((data) => {
                setFavoritos(data)
                return data
            })
            .catch(() => {
                setFavoritos([])
                return []
            })
            .finally(() => setCargando(false))
    }, [usuario?.token])

    useEffect(() => {
        cargar()
    }, [cargar])

    const esFavorita = (recetaId) => favoritos.some((favorito) => favorito.receta?._id === recetaId)

    const favoritoDe = (recetaId) => favoritos.find((favorito) => favorito.receta?._id === recetaId)

    const alternarFavorito = async (recetaId) => {
        const existente = favoritoDe(recetaId)
        if (existente) {
            await deleteFavorito(existente._id)
            setFavoritos((previos) => previos.filter((favorito) => favorito._id !== existente._id))
            return false
        }
        const nuevo = await createFavorito(recetaId)
        setFavoritos((previos) => [nuevo, ...previos])
        return true
    }

    return (
        <contexto.Provider value={{ favoritos, cargando, cargar, esFavorita, alternarFavorito }}>
            {children}
        </contexto.Provider>
    )
}
