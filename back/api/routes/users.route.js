import { Router } from "express"
import * as userController from "../controllers/users.controller.js"
import { validateUser, validateLogin, validateRol } from "../../middlewares/users.validate.js"
import { validateToken, validateRoles } from "../../middlewares/auth.validate.js"

const router = Router()

router.post("/api/usuarios", [validateUser], userController.saveUser)
router.post("/api/usuarios/login", [validateLogin], userController.login)

router.get("/api/usuarios", [validateToken, validateRoles(["superadmin"])], userController.getUsers)
router.get("/api/usuarios/:id", [validateToken, validateRoles(["superadmin"])], userController.getUserById)
router.post("/api/usuarios/asignar", [validateRol, validateToken, validateRoles(["superadmin"])], userController.asignarRol)
router.delete("/api/usuarios/:id", [validateToken, validateRoles(["superadmin"])], userController.deleteUser)

export default router
