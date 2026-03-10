
import ticketService from "../services/ticket.service.js";

class TicketController {
  async purchaseCart(req, res) {
    try {
      const { cid } = req.params;
      const purchaserEmail = req.user.email; // Del JWT

      const result = await ticketService.processPurchase(cid, purchaserEmail);

      if (!result.success) {
        return res.status(400).json({
          status: "error",
          message: result.message,
          productsNotPurchased: result.productsNotPurchased
        });
      }

      res.json({
        status: "success",
        message: result.message,
        ticket: result.ticket,
        productsNotPurchased: result.productsNotPurchased
      });
    } catch (error) {
      const status = error.message === "Carrito no encontrado" || 
                     error.message === "El carrito está vacío" ? 400 : 500;
      res.status(status).json({ 
        status: "error", 
        error: error.message 
      });
    }
  }

  async getTicketById(req, res) {
    try {
      const ticket = await ticketService.getTicketById(req.params.tid);
      res.json({ status: "success", payload: ticket });
    } catch (error) {
      const status = error.message === "Ticket no encontrado" ? 404 : 500;
      res.status(status).json({ status: "error", error: error.message });
    }
  }

  async getTicketByCode(req, res) {
    try {
      const ticket = await ticketService.getTicketByCode(req.params.code);
      res.json({ status: "success", payload: ticket });
    } catch (error) {
      const status = error.message === "Ticket no encontrado" ? 404 : 500;
      res.status(status).json({ status: "error", error: error.message });
    }
  }

  async getUserTickets(req, res) {
    try {
      const email = req.user.email; 
      const tickets = await ticketService.getUserTickets(email);
      res.json({ status: "success", payload: tickets });
    } catch (error) {
      res.status(500).json({ status: "error", error: error.message });
    }
  }
}

export default new TicketController();