
export class UserDTO {
    constructor(user) {
      this.firstName = user.first_name;
      this.lastName = user.last_name;
      this.email = user.email;
      this.role = user.role;
      this.age = user.age;
      // NO incluimos: password, _id, __v, timestamps
    }
  }
  
  export class UserResponseDTO {
    constructor(user) {
      this.id = user._id;
      this.firstName = user.first_name;
      this.lastName = user.last_name;
      this.email = user.email;
      this.role = user.role;
      this.age = user.age;
      this.cart = user.cart;
      // NO incluimos: password
    }
  }