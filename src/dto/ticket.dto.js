
export class TicketDTO {
    constructor(ticket) {
      this.id = ticket._id;
      this.code = ticket.code;
      this.purchaseDateTime = ticket.purchase_datetime;
      this.amount = ticket.amount;
      this.purchaser = ticket.purchaser;
      this.products = ticket.products.map(item => ({
        productId: item.product?._id || item.product,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.subtotal
      }));
    }
  }