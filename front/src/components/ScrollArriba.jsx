import { useEffect } from "react"
import { useLocation } from "react-router"

export default function ScrollArriba() {
    const { pathname } = useLocation()

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" })
    }, [pathname])

    return null
}
