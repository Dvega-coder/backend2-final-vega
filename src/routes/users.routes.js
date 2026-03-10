
import { Router } from "express";
import userController from "../controllers/user.controller.js";

const router = Router();

//  GET todos los usuarios
router.get("/", userController.getAllUsers);

//  GET usuario por ID
router.get("/:uid", userController.getUserById);

//  POST crear usuario (registro)
router.post("/", userController.createUser);

//  PUT actualizar usuario
router.put("/:uid", userController.updateUser);

//  DELETE usuario
router.delete("/:uid", userController.deleteUser);

export default router;
