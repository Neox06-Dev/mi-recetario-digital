import { Router } from "express"
import * as recetaController from "../controllers/recetas.controller.js"
import { validateReceta, validateRecetaPatch } from "../../middlewares/recetas.validate.js"
import { validateToken } from "../../middlewares/auth.validate.js"

const router = Router()

// Lectura publica: el recetario se puede explorar sin iniciar sesion
router.get("/api/recetas", recetaController.getRecetas)
router.get("/api/recetas/:id", recetaController.getRecetaById)

// Escritura: requiere estar logueado. La propiedad del recurso se valida en el service
router.post("/api/recetas", [validateReceta, validateToken], recetaController.saveReceta)
router.put("/api/recetas/:id", [validateReceta, validateToken], recetaController.replaceReceta)
router.patch("/api/recetas/:id", [validateRecetaPatch, validateToken], recetaController.updateReceta)
router.delete("/api/recetas/:id", [validateToken], recetaController.deleteReceta)

export default router
