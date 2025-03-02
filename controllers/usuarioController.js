const Usuario = require("../models/Usuario.js");
const service = require("../services/usuarioService.js");
const passwordService = require("../services/passwordService.js");
const tokenAuthService = require("../services/tokenAuthService.js");
const mail = require("../services/emailService.js");

const createNewUser = async (req, res) => {
  try {
    const user = await service.crearUsuario(req.body);
    mail.sendEmailNewUser(user.email, user.rol);
    const token = tokenAuthService.createToken(user._id);
    res
      .status(201)
      .json({
        mesage: "Usuario registrado con exito",
        token: token,
        rol: user.rol,
        idUsuario: user._id,
      });
  } catch (error) {
    console.log("error");
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await Usuario.find({ eliminado: false });
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Usuario.findOne({ email: email, eliminado: false });
    if (!user) {
      res
        .status(404)
        .json({ message: "No existe ningun usuario registrado con ese email" });
    } else {
      const matchedPasswords = await passwordService.decryptPassword(
        password,
        user.password
      );
      if (matchedPasswords) {
        const token = tokenAuthService.createToken(user._id);
        res
          .status(200)
          .json({
            mesage: "Usuario logueado con exito",
            token: token,
            rol: user.rol,
            idUsuario: user._id,
          });
      }
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const idUser = req.params.id;
    const result = await Usuario.updateOne(
      { _id: idUser },
      { eliminado: true }
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const editUser = async (req, res) => {
  try {
    const idUser = req.params.id;
    const result = await Usuario.updateOne({ _id: idUser }, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getCuidadoresHabilitados = async (req, res) => {
  try {
    const users = await Usuario.find({
      rol: "Cuidador Habilitado",
      eliminado: false,
    }).select(
      "nombre apellido telefono email descripcionPersonal tarifaHora promedioPuntuacion imagenPerfil"
    );
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getCuidadoresPendientes = async (req, res) => {
  try {
    const users = await Usuario.find({
      rol: "Cuidador Pendiente",
      eliminado: false,
    }).select("nombre apellido telefono email domicilio");
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getOneUser = async (req, res) => {
  try {
    const idUser = req.params.id;
    const user = await Usuario.findOne({ _id: idUser, eliminado: false });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const guardarImagenPerfil = async (req, res) => {
  try {
    const imagenUrl = req.file.path; // URL de la imagen en Cloudinary
    const usuarioId = req.params.id;
    // Actualizar el usuario con la URL de la imagen
    const usuario = await Usuario.findByIdAndUpdate(
      usuarioId,
      { imagenPerfil: imagenUrl },
      { new: true }
    );
    res.status(200).json({ message: "Imagen cargada exitosamente", usuario });
  } catch (error) {
    res.status(500).json({ message: "Error al cargar la imagen", error });
  }
};

const habilitarCuidador = async (req, res) => {
  try {
    const userId = req.params.id;
    const resultado = await service.habilitarCuidador(userId);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const desaprobarCuidador = async (req, res) => {
  try {
    const userId = req.params.id;
    const resultado = await service.desaprobarCuidador(userId);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const marcarUsuarioComoEliminado = async (req, res) => {
  try {
    const idUser = req.params.id;
    const result = await Usuario.updateOne(
      { _id: idUser },
      { eliminado: true }
    );
    res
      .status(200)
      .json({ message: "Usuario marcado como eliminado con éxito" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createNewUser,
  getUsers,
  login,
  deleteUser,
  editUser,
  getCuidadoresHabilitados,
  getCuidadoresPendientes,
  getOneUser,
  guardarImagenPerfil,
  habilitarCuidador,
  desaprobarCuidador,
  marcarUsuarioComoEliminado,
};
