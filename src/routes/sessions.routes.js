
import { Router } from "express";
import passport from "passport";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model.js";
import { UserDTO } from "../dto/user.dto.js";
import emailService from "../utils/email.service.js";
import userService from "../services/user.service.js";


const router = Router();

// ===============================
//  LOGIN VISTAS (HANDLEBARS)
// ===============================
router.post("/login", passport.authenticate("login", { session: true }), (req, res) => {
  // Generar token JWT también
  const token = jwt.sign(
    {
      id: req.user._id,
      role: req.user.role,
      email: req.user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  
  // Renderizar página que guarda el token y redirige
  res.send(`
    <script>
      localStorage.setItem("jwtToken", "${token}");
      window.location.href = "/home";
    </script>
  `);
});

// ===============================
// LOGIN API (JWT) - PARA EL TP
// ===============================
router.post("/api-login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ status: "error", error: "Datos incompletos" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ status: "error", error: "Usuario no existe" });
    }

    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) {
      return res
        .status(401)
        .json({ status: "error", error: "Password incorrecta" });
    }

    // Generar JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      status: "success",
      message: "Login exitoso",
      token,
    });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

// ===============================
//  CURRENT (VALIDAR JWT)
// ===============================
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Usar DTO en lugar de enviar user completo
    const userDTO = new UserDTO(req.user);
    res.json({
      status: "success",
      payload: userDTO,
    });
  }
);

//  LOGOUT
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error al destruir sesión:", err);
    }
    res.clearCookie('connect.sid');
    res.redirect("/login");
  });
});

// ===============================
//  RECUPERACIÓN DE CONTRASEÑA
// ===============================

// Solicitar reset de password (envía email)
router.post("/password-reset-request", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        status: "error", 
        error: "Email requerido" 
      });
    }

    // Verificar que el usuario existe
    const user = await UserModel.findOne({ email });
    if (!user) {
      // Por seguridad, NO decimos si el usuario existe o no
      return res.json({ 
        status: "success", 
        message: "Si el email existe, recibirás un link de recuperación" 
      });
    }

    // Generar token JWT con expiración de 1 hora
    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Enviar email
    await emailService.sendPasswordResetEmail(email, token);

    res.json({ 
      status: "success", 
      message: "Email enviado. Revisá tu casilla de correo." 
    });
  } catch (error) {
    console.error("Error en password-reset-request:", error);
    res.status(500).json({ 
      status: "error", 
      error: "Error al procesar la solicitud" 
    });
  }
});

// Validar token de reset
router.get("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;

    // Verificar que el token sea válido
    jwt.verify(token, process.env.JWT_SECRET);

    res.json({ 
      status: "success", 
      message: "Token válido" 
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({ 
        status: "error", 
        error: "El link expiró. Solicitá uno nuevo." 
      });
    }
    res.status(400).json({ 
      status: "error", 
      error: "Token inválido" 
    });
  }
});

// Cambiar la contraseña
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ 
        status: "error", 
        error: "Token y nueva contraseña son requeridos" 
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verificar que la nueva password NO sea igual a la anterior
    const isSame = await userService.isSamePassword(decoded.email, newPassword);
    if (isSame) {
      return res.status(400).json({ 
        status: "error", 
        error: "La nueva contraseña no puede ser igual a la anterior" 
      });
    }

    // Actualizar password
    await userService.updatePassword(decoded.email, newPassword);

    res.json({ 
      status: "success", 
      message: "Contraseña actualizada exitosamente" 
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({ 
        status: "error", 
        error: "El link expiró. Solicitá uno nuevo." 
      });
    }
    res.status(500).json({ 
      status: "error", 
      error: error.message 
    });
  }
});

export default router;


