
import { UserModel } from "../models/user.model.js";

class UserDAO {
  async getAll() {
    return await UserModel.find().populate("cart").lean();
  }

  async getById(id) {
    return await UserModel.findById(id).populate("cart");
  }

  async getByEmail(email) {
    return await UserModel.findOne({ email });
  }

  async create(userData) {
    return await UserModel.create(userData);
  }

  async update(id, userData) {
    return await UserModel.findByIdAndUpdate(id, userData, { new: true });
  }

  async delete(id) {
    return await UserModel.findByIdAndDelete(id);
  }

  async existsByEmail(email) {
    const user = await UserModel.findOne({ email });
    return !!user;
  }
}

export default new UserDAO();