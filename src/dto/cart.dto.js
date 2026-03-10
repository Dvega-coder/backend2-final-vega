
export class CartDTO {
    constructor(cart) {
      this.id = cart._id;
      this.products = cart.products.map(item => ({
        product: {
          id: item.product._id,
          title: item.product.title,
          price: item.product.price,
          thumbnail: item.product.thumbnail,
          stock: item.product.stock,
        },
        quantity: item.quantity,
        subtotal: item.product.price * item.quantity,
      }));
      this.total = this.products.reduce((acc, item) => acc + item.subtotal, 0);
    }
  }
  
  export class CartResponseDTO {
    constructor(cart) {
      this.id = cart._id;
      this.products = cart.products;
    }
  }