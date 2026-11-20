import { lazy, Suspense } from "react"
import { createRoot } from "react-dom/client"
import { createBrowserRouter } from "react-router"
import { RouterProvider } from "react-router/dom"
import "./index.css"

import Layout from "./components/Layout.jsx"
import ProtectedRoute from "./components/ProtectedRoute.jsx"
import Cargando from "./components/Cargando.jsx"
import { SessionProvider } from "./context/session.context.jsx"
import { CategoriasProvider } from "./context/categorias.context.jsx"
import { FavoritosProvider } from "./context/favoritos.context.jsx"

const Home = lazy(() => import("./pages/Home.jsx"))
const Recetas = lazy(() => import("./pages/Recetas.jsx"))
const RecetaDetalle = lazy(() => import("./pages/RecetaDetalle.jsx"))
const Favoritos = lazy(() => import("./pages/Favoritos.jsx"))
const MisRecetas = lazy(() => import("./pages/MisRecetas.jsx"))
const Login = lazy(() => import("./pages/auth/Login.jsx"))
const Register = lazy(() => import("./pages/auth/Register.jsx"))
const Logout = lazy(() => import("./pages/auth/Logout.jsx"))
const NuevaReceta = lazy(() => import("./pages/recetas/NuevaReceta.jsx"))
const EditarReceta = lazy(() => import("./pages/recetas/EditarReceta.jsx"))
const Categorias = lazy(() => import("./pages/categorias/Categorias.jsx"))
const Usuarios = lazy(() => import("./pages/users/Usuarios.jsx"))
const NoEncontrada = lazy(() => import("./pages/NoEncontrada.jsx"))

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            { path: "/", element: <Home /> },
            { path: "/recetas", element: <Recetas /> },
            { path: "/recetas/:id", element: <RecetaDetalle /> },
            {
                path: "/favoritos",
                element: <ProtectedRoute element={<Favoritos />} />
            },
            {
                path: "/mis-recetas",
                element: <ProtectedRoute element={<MisRecetas />} />
            },
            { path: "/login", element: <Login /> },
            { path: "/register", element: <Register /> },
            { path: "/salir", element: <Logout /> },
            {
                path: "/nueva-receta",
                element: <ProtectedRoute element={<NuevaReceta />} />
            },
            {
                path: "/editar-receta/:id",
                element: <ProtectedRoute element={<EditarReceta />} />
            },
            {
                path: "/categorias",
                element: <ProtectedRoute rol={["admin", "superadmin"]} element={<Categorias />} />
            },
            {
                path: "/usuarios",
                element: <ProtectedRoute rol={["superadmin"]} element={<Usuarios />} />
            },
            { path: "*", element: <NoEncontrada /> }
        ]
    }
])

createRoot(document.getElementById("root")).render(
    <SessionProvider>
        <CategoriasProvider>
            <FavoritosProvider>
                <Suspense fallback={<Cargando pantalla />}>
                    <RouterProvider router={router} />
                </Suspense>
            </FavoritosProvider>
        </CategoriasProvider>
    </SessionProvider>
)
