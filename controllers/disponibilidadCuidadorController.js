const Disponibilidad = require("../models/DisponibilidadCuidador.js");
const service = require("../services/disponibilidadCuidadorService.js");

const getDisponibilidadesPorCuidador = async (req, res) => {
  try {
    const idCuidador = req.userId;
    const disponibilidades = await service.obtenerDisponibilidadesPorCuidador(
      idCuidador
    );
    res.status(200).json(disponibilidades);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const updateDisponibilidad = async (req, res) => {
  try {
    const idDisponibilidad = req.params.id;
    const { horarios } = req.body;
    const disponibilidad = await Disponibilidad.findByIdAndUpdate(
      idDisponibilidad,
      { horas: horarios },
      { new: true, runValidators: true }
    );
    if (!disponibilidad) {
      return res.status(404).json({ message: "Disponibilidad no encontrada" });
    }
    res.status(200).json(disponibilidad);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteDisponibilidad = async (req, res) => {
  try {
    const idDisponibilidad = req.params.id;
    const result = await Disponibilidad.findByIdAndDelete(idDisponibilidad);
    if (!result) {
      return res.status(404).json({ message: "Disponibilidad no encontrada" });
    }
    res.status(200).json({ message: "Disponibilidad eliminada con éxito" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const createDisponibilidad = async (req, res) => {
  try {
    const idCuidador = req.userId;
    const disponibilidad = await service.crearDisponibilidad(
      req.body.fecha,
      req.body.horarios,
      idCuidador
    );
    res.status(201).json(disponibilidad);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const createOrUpdateDisponibilidad = async (req, res) => {
  try {
    const idCuidador = req.userId;
    const disponibilidad = await service.crearOActualizarDisponibilidad(
      req.body.fecha,
      req.body.horarios,
      idCuidador
    );
    res.status(201).json(disponibilidad);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getDisponibilidadesPorCuidador,
  createDisponibilidad,
  deleteDisponibilidad,
  createOrUpdateDisponibilidad,
  updateDisponibilidad,
};
