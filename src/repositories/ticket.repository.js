
import ticketDAO from "../dao/ticket.dao.js";
import { TicketDTO } from "../dto/ticket.dto.js";

class TicketRepository {
  async createTicket(ticketData) {
    const ticket = await ticketDAO.create(ticketData);
    return new TicketDTO(ticket);
  }

  async getTicketById(id) {
    const ticket = await ticketDAO.getById(id);
    if (!ticket) return null;
    return new TicketDTO(ticket);
  }

  async getTicketByCode(code) {
    const ticket = await ticketDAO.getByCode(code);
    if (!ticket) return null;
    return new TicketDTO(ticket);
  }

  async getTicketsByPurchaser(email) {
    const tickets = await ticketDAO.getByPurchaser(email);
    return tickets.map(ticket => new TicketDTO(ticket));
  }

  async getAllTickets() {
    const tickets = await ticketDAO.getAll();
    return tickets.map(ticket => new TicketDTO(ticket));
  }

  // Generar código único para el ticket
  generateTicketCode() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7);
    return `TICKET-${timestamp}-${random}`.toUpperCase();
  }
}

export default new TicketRepository();