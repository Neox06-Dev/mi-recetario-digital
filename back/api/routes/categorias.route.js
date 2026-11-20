import { Router } from "express"
import * as categoriaController from "../controllers/categorias.controller.js"
import { validateCategoria, validateCategoriaPatch } from "../../middlewares/categorias.validate.js"
import { validateToken, validateRoles } from "../../middlewares/auth.validate.js"

const router = Router()

router.get("/api/categorias", categoriaController.getCategorias)
router.get("/api/categorias/:id", categoriaController.getCategoriaById)

// Las categorias las administra el equipo (admin / superadmin)
router.post("/api/categorias", [validateCategoria, validateToken, validateRoles(["admin", "superadmin"])], categoriaController.saveCategoria)
router.put("/api/categorias/:id", [validateCategoria, validateToken, validateRoles(["admin", "superadmin"])], categoriaController.replaceCategoria)
router.patch("/api/categorias/:id", [validateCategoriaPatch, validateToken, validateRoles(["admin", "superadmin"])], categoriaController.updateCategoria)
router.delete("/api/categorias/:id", [validateToken, validateRoles(["admin", "superadmin"])], categoriaController.deleteCategoria)

export default router
