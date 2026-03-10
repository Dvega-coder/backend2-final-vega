
import { Router } from "express";
import passport from "passport";
import productController from "../controllers/product.controller.js";
import { authorizeRoles } from "../middlewares/authorization.middleware.js";

const productsRouterFactory = (io) => {
  const router = Router();

  // GET /api/products (PÚBLICO)
  router.get("/", productController.getAllProducts);

  // GET /api/products/:pid (PÚBLICO)
  router.get("/:pid", productController.getProductById);

  // POST /api/products (SOLO ADMIN)
  router.post(
    "/",
    passport.authenticate("jwt", { session: false }),
    authorizeRoles("admin"),
    productController.createProduct
  );

  // PUT /api/products/:pid (SOLO ADMIN)
  router.put(
    "/:pid",
    passport.authenticate("jwt", { session: false }),
    authorizeRoles("admin"),
    productController.updateProduct
  );

  // DELETE /api/products/:pid (SOLO ADMIN)
  router.delete(
    "/:pid",
    passport.authenticate("jwt", { session: false }),
    authorizeRoles("admin"),
    productController.deleteProduct
  );

  // Emitir actualización por socket cuando se crea/actualiza/elimina
  const originalCreate = productController.createProduct;
  const originalUpdate = productController.updateProduct;
  const originalDelete = productController.deleteProduct;

  productController.createProduct = async (req, res) => {
    await originalCreate.call(productController, req, res);
    if (res.statusCode === 201) {
      io.emit("refreshProducts");
    }
  };

  productController.updateProduct = async (req, res) => {
    await originalUpdate.call(productController, req, res);
    if (res.statusCode === 200) {
      io.emit("refreshProducts");
    }
  };

  productController.deleteProduct = async (req, res) => {
    await originalDelete.call(productController, req, res);
    if (res.statusCode === 200) {
      io.emit("refreshProducts");
    }
  };

  return router;
};

export default productsRouterFactory;





