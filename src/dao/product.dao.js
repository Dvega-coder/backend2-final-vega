
import { ProductModel } from "../models/product.model.js";

class ProductDAO {
  async getAll(filter = {}, options = {}) {
    const { sort, skip, limit } = options;
    return await ProductModel.find(filter)
      .sort(sort || {})
      .skip(skip || 0)
      .limit(limit || 10)
      .lean();
  }

  async getById(id) {
    return await ProductModel.findById(id);
  }

  async create(productData) {
    return await ProductModel.create(productData);
  }

  async update(id, productData) {
    return await ProductModel.findByIdAndUpdate(id, productData, { new: true });
  }

  async delete(id) {
    return await ProductModel.findByIdAndDelete(id);
  }

  async countDocuments(filter = {}) {
    return await ProductModel.countDocuments(filter);
  }

  async updateStock(id, quantity) {
    return await ProductModel.findByIdAndUpdate(
      id,
      { $inc: { stock: -quantity } },
      { new: true }
    );
  }
}

export default new ProductDAO();