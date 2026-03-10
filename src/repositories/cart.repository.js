
import cartDAO from "../dao/cart.dao.js";
import { CartDTO } from "../dto/cart.dto.js";

class CartRepository {
  async createCart() {
    const cart = await cartDAO.create();
    return { id: cart._id, products: [] };
  }

  async getCartById(id) {
    const cart = await cartDAO.getById(id);
    if (!cart) return null;
    return new CartDTO(cart);
  }

  async addProductToCart(cartId, productId) {
    const cart = await cartDAO.addProduct(cartId, productId);
    if (!cart) return null;
  
    return await this.getCartById(cartId);
  }

  async updateProductQuantity(cartId, productId, quantity) {
    const cart = await cartDAO.updateProductQuantity(cartId, productId, quantity);
    if (!cart) return null;
    return await this.getCartById(cartId);
  }

  async removeProductFromCart(cartId, productId) {
    const cart = await cartDAO.removeProduct(cartId, productId);
    if (!cart) return null;
    return await this.getCartById(cartId);
  }

  async clearCart(cartId) {
    const cart = await cartDAO.clear(cartId);
    if (!cart) return null;
    return { id: cart._id, products: [] };
  }

  async deleteCart(cartId) {
    return await cartDAO.delete(cartId);
  }
}

export default new CartRepository();