
import { CartModel } from "../models/cart.model.js";

class CartDAO {
  async create() {
    return await CartModel.create({ products: [] });
  }

  async getById(id) {
    return await CartModel.findById(id).populate("products.product");
  }

  async addProduct(cartId, productId) {
    const cart = await CartModel.findById(cartId);
    if (!cart) return null;

    const item = cart.products.find((p) => p.product.equals(productId));

    if (item) {
      item.quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    await cart.save();
    return cart;
  }

  async updateProductQuantity(cartId, productId, quantity) {
    const cart = await CartModel.findById(cartId);
    if (!cart) return null;

    const item = cart.products.find((p) => p.product.equals(productId));
    if (!item) return null;

    item.quantity = quantity;
    await cart.save();
    return cart;
  }

  async removeProduct(cartId, productId) {
    const cart = await CartModel.findById(cartId);
    if (!cart) return null;

    cart.products = cart.products.filter((p) => !p.product.equals(productId));
    await cart.save();
    return cart;
  }

  async clear(cartId) {
    const cart = await CartModel.findById(cartId);
    if (!cart) return null;

    cart.products = [];
    await cart.save();
    return cart;
  }

  async delete(cartId) {
    return await CartModel.findByIdAndDelete(cartId);
  }
}

export default new CartDAO();