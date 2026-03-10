
export class ProductDTO {
    constructor(product) {
      this.id = product._id;
      this.title = product.title;
      this.description = product.description;
      this.price = product.price;
      this.thumbnail = product.thumbnail;
      this.code = product.code;
      this.stock = product.stock;
      this.status = product.status;
      this.category = product.category;
    }
  }
  
  export class ProductListDTO {
    constructor(product) {
      this.id = product._id;
      this.title = product.title;
      this.price = product.price;
      this.thumbnail = product.thumbnail;
      this.stock = product.stock;
      this.category = product.category;
    }
  }