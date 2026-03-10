
import { TicketModel } from "../models/ticket.model.js";

class TicketDAO {
  async create(ticketData) {
    return await TicketModel.create(ticketData);
  }

  async getById(id) {
    return await TicketModel.findById(id).populate("products.product");
  }

  async getByCode(code) {
    return await TicketModel.findOne({ code }).populate("products.product");
  }

  async getByPurchaser(email) {
    return await TicketModel.find({ purchaser: email })
      .populate("products.product")
      .sort({ purchase_datetime: -1 })
      .lean();
  }

  async getAll() {
    return await TicketModel.find()
      .populate("products.product")
      .sort({ purchase_datetime: -1 })
      .lean();
  }
}

export default new TicketDAO();