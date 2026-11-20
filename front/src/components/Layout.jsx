import { Outlet } from "react-router"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Nav from "./Nav.jsx"
import Footer from "./Footer.jsx"
import ScrollArriba from "./ScrollArriba.jsx"

export default function Layout() {
    return (
        <div className="flex min-h-screen flex-col bg-crema">
            <ScrollArriba />
            <Nav />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
            <ToastContainer
                position="bottom-right"
                autoClose={3500}
                hideProgressBar
                newestOnTop
                closeOnClick
                pauseOnHover
                theme="light"
            />
        </div>
    )
}
