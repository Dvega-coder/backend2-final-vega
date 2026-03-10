
import userRepository from "../repositories/user.repository.js";
import bcrypt from "bcrypt";

class UserService {
  async getAllUsers() {
    return await userRepository.getAllUsers();
  }

  async getUserById(id) {
    const user = await userRepository.getUserById(id);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    return user;
  }

  async createUser(userData) {
    const { first_name, last_name, email, age, password } = userData;

    if (!first_name || !last_name || !email || !password) {
      throw new Error("Datos incompletos");
    }

    const exists = await userRepository.existsByEmail(email);
    if (exists) {
      throw new Error("El usuario ya existe");
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = await userRepository.createUser({
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword,
    });

    return newUser;
  }

  async updateUser(id, userData) {
    if (userData.password) {
      userData.password = bcrypt.hashSync(userData.password, 10);
    }

    const updatedUser = await userRepository.updateUser(id, userData);
    if (!updatedUser) {
      throw new Error("Usuario no encontrado");
    }

    return updatedUser;
  }

  async deleteUser(id) {
    const deleted = await userRepository.deleteUser(id);
    if (!deleted) {
      throw new Error("Usuario no encontrado");
    }
    return { message: "Usuario eliminado" };
  }

  // RECUPERACIÓN DE PASSWORD
  async isSamePassword(email, newPassword) {
    const user = await userRepository.getUserByEmail(email);
    if (!user) return false;
    return bcrypt.compareSync(newPassword, user.password);
  }

  async updatePassword(email, newPassword) {
    const user = await userRepository.getUserByEmail(email);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    const updated = await userRepository.updateUser(user._id, { 
      password: hashedPassword 
    });
    return updated;
  }
}

export default new UserService();