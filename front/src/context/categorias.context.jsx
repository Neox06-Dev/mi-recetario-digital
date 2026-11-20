import { createContext, useCallback, useContext, useEffect, useState } from "react"
import { useApiCategorias } from "../services/categorias.services"

const contexto = createContext()

export function useCategorias() {
    return useContext(contexto)
}

export function CategoriasProvider({ children }) {
    const { getCategorias } = useApiCategorias()
    const [categorias, setCategorias] = useState([])
    const [cargando, setCargando] = useState(true)

    const cargar = useCallback(() => {
        setCargando(true)
        return getCategorias()
            .then((data) => {
                setCategorias(data)
                return data
            })
            .catch(() => {
                setCategorias([])
                return []
            })
            .finally(() => setCargando(false))
    }, [])

    useEffect(() => {
        cargar()
    }, [cargar])

    const categoriaPorSlug = (slug) => categorias.find((categoria) => categoria.slug === slug)

    const nombreCategoria = (slug) => categoriaPorSlug(slug)?.nombre ?? slug

    const emojiCategoria = (slug) => categoriaPorSlug(slug)?.emoji ?? "🍽️"

    return (
        <contexto.Provider value={{ categorias, cargando, cargar, categoriaPorSlug, nombreCategoria, emojiCategoria }}>
            {children}
        </contexto.Provider>
    )
}
