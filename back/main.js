import express from "express"
import cors from "cors"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { config } from "./config.js"
import { ping, ensureIndexes } from "./services/db.service.js"
import recetasRoutes from "./api/routes/recetas.route.js"
import categoriasRoutes from "./api/routes/categorias.route.js"
import favoritosRoutes from "./api/routes/favoritos.route.js"
import usersRoutes from "./api/routes/users.route.js"

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()

app.use(cors(config.corsOrigin === "*" ? {} : { origin: config.corsOrigin.split(",") }))
app.use("/", express.static(join(__dirname, "public")))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get("/api/health", async (req, res) => {
    try {
        await ping()
        res.status(200).json({ status: "ok", db: config.dbName })
    } catch {
        res.status(503).json({ status: "error", message: "No hay conexion con MongoDB" })
    }
})

app.use(recetasRoutes)
app.use(categoriasRoutes)
app.use(favoritosRoutes)
app.use(usersRoutes)

app.use((req, res) => {
    res.status(404).json({ message: "Recurso no encontrado" })
})

ensureIndexes()
    .then(() => console.log("Indices de la base verificados"))
    .catch((error) => console.error("No se pudieron crear los indices:", error.message))

app.listen(config.port, () => console.log(`Funcionando... http://localhost:${config.port}`))
