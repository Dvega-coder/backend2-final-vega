
import cartRepository from "../repositories/cart.repository.js";
import productRepository from "../repositories/product.repository.js";

class CartService {
  async createCart() {
    return await cartRepository.createCart();
  }

  async getCartById(id) {
    const cart = await cartRepository.getCartById(id);
    if (!cart) {
      throw new Error("Carrito no encontrado");
    }
    return cart;
  }

  async addProductToCart(cartId, productId) {
  
    const product = await productRepository.getProductById(productId);
    if (!product) {
      throw new Error("Producto no encontrado");
    }

    const cart = await cartRepository.addProductToCart(cartId, productId);
    if (!cart) {
      throw new Error("Carrito no encontrado");
    }

    return cart;
  }

  async updateProductQuantity(cartId, productId, quantity) {
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new Error("La cantidad debe ser un número entero mayor o igual a 1");
    }

    const cart = await cartRepository.updateProductQuantity(cartId, productId, quantity);
    if (!cart) {
      throw new Error("Carrito o producto no encontrado");
    }

    return cart;
  }

  async removeProductFromCart(cartId, productId) {
    const cart = await cartRepository.removeProductFromCart(cartId, productId);
    if (!cart) {
      throw new Error("Carrito no encontrado");
    }

    return cart;
  }

  async clearCart(cartId) {
    const cart = await cartRepository.clearCart(cartId);
    if (!cart) {
      throw new Error("Carrito no encontrado");
    }

    return cart;
  }
}

export default new CartService();