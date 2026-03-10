
import { Router } from "express";
import mongoose from "mongoose";
import passport from "passport";
import cartController from "../controllers/cart.controller.js";
import ticketController from "../controllers/ticket.controller.js";
import { authorizeRoles } from "../middlewares/authorization.middleware.js";

const router = Router();

// Helper para validar ObjectId
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// Middleware de validación de IDs
const validateIds = (req, res, next) => {
  const { cid, pid } = req.params;
  
  if (cid && !isValidId(cid)) {
    return res.status(400).json({ status: "error", error: "ID de carrito inválido" });
  }
  
  if (pid && !isValidId(pid)) {
    return res.status(400).json({ status: "error", error: "ID de producto inválido" });
  }
  
  next();
};

// POST / - Crear carrito (PÚBLICO)
router.post("/", cartController.createCart);

// GET /:cid - Obtener carrito por ID (PÚBLICO)
router.get("/:cid", validateIds, cartController.getCartById);

// POST /:cid/products/:pid - Agregar producto (PÚBLICO para localStorage)
router.post(
  "/:cid/products/:pid",
  validateIds,
  cartController.addProductToCart
);

// PUT /:cid/products/:pid - Actualizar cantidad (PÚBLICO)
router.put(
  "/:cid/products/:pid",
  validateIds,
  cartController.updateProductQuantity
);

//  DELETE /:cid/products/:pid - Eliminar producto (PÚBLICO)
router.delete(
  "/:cid/products/:pid",
  validateIds,
  cartController.removeProductFromCart
);

//  DELETE /:cid - Vaciar carrito (PÚBLICO)
router.delete(
  "/:cid",
  validateIds,
  cartController.clearCart
);

//  POST /:cid/purchase - Procesar compra (SOLO USER AUTENTICADO)
router.post(
  "/:cid/purchase",
  passport.authenticate("jwt", { session: false }),
  authorizeRoles("user"),
  validateIds,
  ticketController.purchaseCart
);

export default router;




