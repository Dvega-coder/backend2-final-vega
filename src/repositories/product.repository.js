
import productDAO from "../dao/product.dao.js";
import { ProductDTO } from "../dto/product.dto.js";

class ProductRepository {
  async getAllProducts(filter = {}, options = {}) {
    const products = await productDAO.getAll(filter, options);
    return products.map(product => new ProductDTO(product));
  }

  async getProductById(id) {
    const product = await productDAO.getById(id);
    if (!product) return null;
    return new ProductDTO(product);
  }

  async createProduct(productData) {
    const product = await productDAO.create(productData);
    return new ProductDTO(product);
  }

  async updateProduct(id, productData) {
    const product = await productDAO.update(id, productData);
    if (!product) return null;
    return new ProductDTO(product);
  }

  async deleteProduct(id) {
    return await productDAO.delete(id);
  }

  async countProducts(filter = {}) {
    return await productDAO.countDocuments(filter);
  }

  async updateStock(id, quantity) {
    const product = await productDAO.updateStock(id, quantity);
    if (!product) return null;
    return new ProductDTO(product);
  }
}

export default new ProductRepository();