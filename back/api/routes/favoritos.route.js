import { Router } from "express"
import * as favoritoController from "../controllers/favoritos.controller.js"
import { validateFavorito } from "../../middlewares/categorias.validate.js"
import { validateToken } from "../../middlewares/auth.validate.js"

const router = Router()

// Los favoritos son siempre del usuario logueado
router.get("/api/favoritos", [validateToken], favoritoController.getFavoritos)
router.post("/api/favoritos", [validateFavorito, validateToken], favoritoController.saveFavorito)
router.delete("/api/favoritos/:id", [validateToken], favoritoController.deleteFavorito)

export default router
