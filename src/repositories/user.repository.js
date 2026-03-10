import userDAO from "../dao/user.dao.js";
import { UserResponseDTO } from "../dto/user.dto.js";

class UserRepository {
  async getAllUsers() {
    const users = await userDAO.getAll();
    return users.map(user => new UserResponseDTO(user));
  }

  async getUserById(id) {
    const user = await userDAO.getById(id);
    if (!user) return null;
    return new UserResponseDTO(user);
  }

  async getUserByEmail(email) {
    return await userDAO.getByEmail(email);
  }

  async createUser(userData) {
    const user = await userDAO.create(userData);
    return new UserResponseDTO(user);
  }

  async updateUser(id, userData) {
    const user = await userDAO.update(id, userData);
    if (!user) return null;
    return new UserResponseDTO(user);
  }

  async deleteUser(id) {
    return await userDAO.delete(id);
  }

  async existsByEmail(email) {
    return await userDAO.existsByEmail(email);
  }
}

export default new UserRepository();