
const service = require("../services/informesService.js");

const getClientesConReservasPorEstado = async (req, res) => {
  try {
    const filtros = req.query;
    const resultado = await service.obtenerClientesConReservasPorEstado(filtros);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCuidadoresConReservasPorEstado = async (req, res) => {
  try {
    const filtros = req.query;
    const cuidadores  =
      await service.obtenerCuidadoresConReservasPorEstado(filtros);
    res.status(200).json(cuidadores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getReservas = async (req, res) => {
  try {
    const filtros = req.body;
    const reservas = await service.getReservas(filtros);
    res.status(200).json(reservas);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getClientesConReservasPorEstado,
  getCuidadoresConReservasPorEstado,
  getReservas
};