
import cartService from "../services/cart.service.js";

class CartController {
  async createCart(req, res) {
    try {
      const newCart = await cartService.createCart();
      res.status(201).json({ status: "success", payload: newCart });
    } catch (error) {
      res.status(500).json({ status: "error", error: error.message });
    }
  }

  async getCartById(req, res) {
    try {
      const cart = await cartService.getCartById(req.params.cid);
      res.json({ status: "success", payload: cart });
    } catch (error) {
      const status = error.message === "Carrito no encontrado" ? 404 : 500;
      res.status(status).json({ status: "error", error: error.message });
    }
  }

  async addProductToCart(req, res) {
    try {
      const { cid, pid } = req.params;
      const cart = await cartService.addProductToCart(cid, pid);
      res.json({
        status: "success",
        message: "Producto agregado al carrito",
        payload: cart,
      });
    } catch (error) {
      const status = error.message.includes("no encontrado") ? 404 : 500;
      res.status(status).json({ status: "error", error: error.message });
    }
  }

  async updateProductQuantity(req, res) {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;
      const cart = await cartService.updateProductQuantity(cid, pid, quantity);
      res.json({
        status: "success",
        message: "Cantidad actualizada",
        payload: cart,
      });
    } catch (error) {
      const status = error.message.includes("cantidad") ? 400 : 
                     error.message.includes("no encontrado") ? 404 : 500;
      res.status(status).json({ status: "error", error: error.message });
    }
  }

  async removeProductFromCart(req, res) {
    try {
      const { cid, pid } = req.params;
      const cart = await cartService.removeProductFromCart(cid, pid);
      res.json({
        status: "success",
        message: "Producto eliminado",
        payload: cart,
      });
    } catch (error) {
      const status = error.message === "Carrito no encontrado" ? 404 : 500;
      res.status(status).json({ status: "error", error: error.message });
    }
  }

  async clearCart(req, res) {
    try {
      const cart = await cartService.clearCart(req.params.cid);
      res.json({
        status: "success",
        message: "Carrito vaciado",
        payload: cart,
      });
    } catch (error) {
      const status = error.message === "Carrito no encontrado" ? 404 : 500;
      res.status(status).json({ status: "error", error: error.message });
    }
  }
}

export default new CartController();