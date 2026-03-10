
import productService from "../services/product.service.js";

class ProductController {
  async getAllProducts(req, res) {
    try {
      const result = await productService.getAllProducts(req.query);
      res.json({
        status: "success",
        payload: result.products,
        totalPages: result.totalPages,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
      });
    } catch (error) {
      res.status(500).json({ status: "error", error: error.message });
    }
  }

  async getProductById(req, res) {
    try {
      const product = await productService.getProductById(req.params.pid);
      res.json({ status: "success", payload: product });
    } catch (error) {
      const status = error.message === "Producto no encontrado" ? 404 : 500;
      res.status(status).json({ status: "error", error: error.message });
    }
  }

  async createProduct(req, res) {
    try {
      const newProduct = await productService.createProduct(req.body);
      res.status(201).json({ status: "success", payload: newProduct });
    } catch (error) {
      const status = error.message.includes("incompletos") ? 400 : 500;
      res.status(status).json({ status: "error", error: error.message });
    }
  }

  async updateProduct(req, res) {
    try {
      const product = await productService.updateProduct(req.params.pid, req.body);
      res.json({ status: "success", payload: product });
    } catch (error) {
      const status = error.message === "Producto no encontrado" ? 404 : 500;
      res.status(status).json({ status: "error", error: error.message });
    }
  }

  async deleteProduct(req, res) {
    try {
      const result = await productService.deleteProduct(req.params.pid);
      res.json({ status: "success", message: result.message });
    } catch (error) {
      const status = error.message === "Producto no encontrado" ? 404 : 500;
      res.status(status).json({ status: "error", error: error.message });
    }
  }
}

export default new ProductController();