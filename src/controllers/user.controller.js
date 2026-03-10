import userService from "../services/user.service.js";

class UserController {
  async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers();
      res.json({ status: "success", payload: users });
    } catch (error) {
      res.status(500).json({ status: "error", error: error.message });
    }
  }

  async getUserById(req, res) {
    try {
      const user = await userService.getUserById(req.params.uid);
      res.json({ status: "success", payload: user });
    } catch (error) {
      const status = error.message === "Usuario no encontrado" ? 404 : 500;
      res.status(status).json({ status: "error", error: error.message });
    }
  }

  async createUser(req, res) {
    try {
      const newUser = await userService.createUser(req.body);
      res.status(201).json({ status: "success", payload: newUser });
    } catch (error) {
      const status = error.message === "El usuario ya existe" ? 400 : 500;
      res.status(status).json({ status: "error", error: error.message });
    }
  }

  async updateUser(req, res) {
    try {
      const updatedUser = await userService.updateUser(req.params.uid, req.body);
      res.json({ status: "success", payload: updatedUser });
    } catch (error) {
      const status = error.message === "Usuario no encontrado" ? 404 : 500;
      res.status(status).json({ status: "error", error: error.message });
    }
  }

  async deleteUser(req, res) {
    try {
      const result = await userService.deleteUser(req.params.uid);
      res.json({ status: "success", message: result.message });
    } catch (error) {
      const status = error.message === "Usuario no encontrado" ? 404 : 500;
      res.status(status).json({ status: "error", error: error.message });
    }
  }
}

export default new UserController();