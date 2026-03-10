
import productRepository from "../repositories/product.repository.js";

class ProductService {
  async getAllProducts(queryParams) {
    const { limit = 10, page = 1, sort, query } = queryParams;

    // Construir filtro
    const filter = {};
    if (query) {
      const [key, value] = query.split(":");
      if (key === "category") filter.category = value;
      if (key === "status") filter.status = value === "true";
    }

    // Construir opciones de ordenamiento
    const sortOpt = sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {};

    const lim = parseInt(limit);
    const pg = parseInt(page);
    const skip = (pg - 1) * lim;

    // Obtener productos
    const products = await productRepository.getAllProducts(filter, {
      sort: sortOpt,
      skip,
      limit: lim,
    });

    // Obtener total
    const totalDocs = await productRepository.countProducts(filter);
    const totalPages = Math.ceil(totalDocs / lim);

    return {
      products,
      totalPages,
      page: pg,
      hasPrevPage: pg > 1,
      hasNextPage: pg < totalPages,
      prevPage: pg > 1 ? pg - 1 : null,
      nextPage: pg < totalPages ? pg + 1 : null,
    };
  }

  async getProductById(id) {
    const product = await productRepository.getProductById(id);
    if (!product) {
      throw new Error("Producto no encontrado");
    }
    return product;
  }

  async createProduct(productData) {
    const { title, price, category } = productData;

    if (!title || !price || !category) {
      throw new Error("Datos incompletos: title, price y category son requeridos");
    }

    return await productRepository.createProduct(productData);
  }

  async updateProduct(id, productData) {
    const product = await productRepository.updateProduct(id, productData);
    if (!product) {
      throw new Error("Producto no encontrado");
    }
    return product;
  }

  async deleteProduct(id) {
    const deleted = await productRepository.deleteProduct(id);
    if (!deleted) {
      throw new Error("Producto no encontrado");
    }
    return { message: "Producto eliminado" };
  }
}

export default new ProductService();