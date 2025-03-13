const EtapaVida = require("../models/EtapaVida.js");
const Mascota = require("../models/Mascota.js");

const getEtapasVida = async (req, res) => {
  try {
    const etapasVida = await EtapaVida.find();
    res.status(200).json(etapasVida);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const createEtapaVida = async (req, res) => {
  try {
    const { nombre } = req.body;
    const newEtapaVida = await EtapaVida.create({ nombre });
    res.status(201).json(newEtapaVida);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
};

const deleteEtapaVida = async (req, res) => {
  try {
    const idEtapaVida = req.params.id;
    const result = await EtapaVida.deleteOne({ _id: idEtapaVida });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const editEtapaVida = async (req, res) => {
  try {
    const idEtapaVida = req.params.id;
    const { nombre } = req.body;
    const result = await EtapaVida.updateOne({ _id: idEtapaVida }, { nombre });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getEtapaVidaByMascotaId = async (req, res) => {
  try {
    const idMascota = req.params.idMascota;
    const mascota = await Mascota.findById(idMascota).populate("etapaVida");
    if (!mascota) {
      return res.status(404).json({ message: "Mascota no encontrada" });
    }
    res.status(200).json(mascota.etapaVida);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getEtapasVida,
  createEtapaVida,
  deleteEtapaVida,
  editEtapaVida,
  getEtapaVidaByMascotaId,
};
