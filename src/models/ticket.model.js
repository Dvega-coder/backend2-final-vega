
import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    required: true
  },
  purchase_datetime: {
    type: Date,
    default: Date.now,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  purchaser: {
    type: String,
    required: true
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products"
    },
    title: String,
    price: Number,
    quantity: Number,
    subtotal: Number
  }]
}, {
  timestamps: true
});

export const TicketModel = mongoose.model("tickets", ticketSchema);