
import ticketRepository from "../repositories/ticket.repository.js";
import cartRepository from "../repositories/cart.repository.js";
import productRepository from "../repositories/product.repository.js";
import productDAO from "../dao/product.dao.js";
import cartDAO from "../dao/cart.dao.js";

class TicketService {
  async processPurchase(cartId, purchaserEmail) {
    // 1. Obtener el carrito
    const cart = await cartDAO.getById(cartId);
    if (!cart) {
      throw new Error("Carrito no encontrado");
    }

    if (cart.products.length === 0) {
      throw new Error("El carrito está vacío");
    }

    // 2. Separar productos con stock suficiente vs insuficiente
    const productsWithStock = [];
    const productsWithoutStock = [];
    let totalAmount = 0;

    for (const item of cart.products) {
      const product = await productDAO.getById(item.product);

      if (!product) {
        productsWithoutStock.push({
          productId: item.product,
          reason: "Producto no encontrado",
          requestedQuantity: item.quantity
        });
        continue;
      }

      // Verificar stock
      if (product.stock >= item.quantity) {
        // HAY stock suficiente
        productsWithStock.push({
          product: product,
          quantity: item.quantity,
          price: product.price,
          subtotal: product.price * item.quantity
        });
        totalAmount += product.price * item.quantity;
      } else {
        // NO hay stock suficiente
        productsWithoutStock.push({
          productId: product._id,
          title: product.title,
          requestedQuantity: item.quantity,
          availableStock: product.stock,
          reason: `Stock insuficiente (disponible: ${product.stock})`
        });
      }
    }

    // 3. Si NO hay productos con stock, no se puede comprar nada
    if (productsWithStock.length === 0) {
      return {
        success: false,
        message: "No hay productos con stock suficiente",
        ticket: null,
        productsNotPurchased: productsWithoutStock
      };
    }

    // 4. Restar stock de productos comprados
    for (const item of productsWithStock) {
      await productDAO.updateStock(item.product._id, item.quantity);
    }

    // 5. Generar ticket
    const ticketCode = ticketRepository.generateTicketCode();
    const ticketData = {
      code: ticketCode,
      purchase_datetime: new Date(),
      amount: totalAmount,
      purchaser: purchaserEmail,
      products: productsWithStock.map(item => ({
        product: item.product._id,
        title: item.product.title,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.subtotal
      }))
    };

    const ticket = await ticketRepository.createTicket(ticketData);

    // 6. Eliminar del carrito los productos comprados
const purchasedProductIds = productsWithStock.map(item => item.product._id.toString());

// Obtener el carrito poblado para poder acceder a los IDs
const populatedCart = await cartDAO.getById(cartId);
populatedCart.products = populatedCart.products.filter(
  item => !purchasedProductIds.includes(item.product._id.toString())
);
await populatedCart.save();

    // 7. Devolver resultado
    return {
      success: true,
      message: productsWithoutStock.length > 0 
        ? "Compra parcial completada" 
        : "Compra completada exitosamente",
      ticket,
      productsNotPurchased: productsWithoutStock
    };
  }

  async getTicketById(id) {
    const ticket = await ticketRepository.getTicketById(id);
    if (!ticket) {
      throw new Error("Ticket no encontrado");
    }
    return ticket;
  }

  async getTicketByCode(code) {
    const ticket = await ticketRepository.getTicketByCode(code);
    if (!ticket) {
      throw new Error("Ticket no encontrado");
    }
    return ticket;
  }

  async getUserTickets(email) {
    return await ticketRepository.getTicketsByPurchaser(email);
  }
}

export default new TicketService();