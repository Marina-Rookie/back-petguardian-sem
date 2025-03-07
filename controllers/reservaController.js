const Reserva = require("../models/Reserva.js");
const Estado = require("../models/Estado.js");
const Turno = require("../models/Turno.js");
const reservaService = require("../services/reservaService");
// createReserva: Crea unna reserva y sus turnos asociados
//no valida los turnos, eso se valida en la función getDisponibilidadCuidador de turnoService, el cliente seleccionaría directamente de ese array de horas disponibles
// Las reservas son con días consecutivos, se crea un turno de una hora para cada día al mimos horario.
const createReserva = async (req, res) => {
  try {
    const clienteId = req.userId;
    const {
      fechaInicio,
      fechaFin,
      comentario,
      cuidador,
      mascotas,
      diasReserva,
    } = req.body;
    const newReserva = await reservaService.createReserva({
      fechaInicio,
      fechaFin,
      comentario,
      clienteId,
      cuidador,
      mascotas,
      diasReserva,
    });
    res.status(201).json(newReserva);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
};

const deleteReserva = async (req, res) => {
  try {
    const idReserva = req.params.id;
    const reserva = await Reserva.findById(idReserva);
    const estado = await Estado.findOne({ estado: "Pendiente" });
    if (reserva.estado != estado._id) {
      return res.status(400).json({
        message:
          "No se puede eliminar una reserva que no esté en estado Pendiente",
      });
    }
    const result = await Reserva.deleteOne({ _id: idReserva });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const editReserva = async (req, res) => {
  try {
    const idReserva = req.params.id;
    const { tarifaTurno, comentario, mascotas, fechaInicio, fechaFin } =
      req.body;
    const result = await Reserva.updateOne(
      { _id: idReserva },
      { tarifaTurno, comentario, mascotas, fechaInicio, fechaFin }
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// para obtener las reservas de un cliente, para su gestión de reservas
const getReservasPorCliente = async (req, res) => {
  try {
    const idCliente = req.params.id;
    const reservas = await Reserva.find({ cliente: idCliente })
      .populate("cuidador", "nombre apellido telefono")
      .populate("mascotas", "nombre")
      .populate("estado", "estado")
      .populate("resenia", "puntuacion comentario");

    const reservasConTurnos = await Promise.all(
      reservas.map(async (reserva) => {
        const turnos = await Turno.find({ reserva: reserva._id });
        let horaTurno = null;
        if (turnos.length > 0) {
          horaTurno = turnos[0].fechaHoraInicio
            .toISOString()
            .split("T")[1]
            .substring(0, 5);
        }
        return { ...reserva.toObject(), horaTurno };
      })
    );
    res.status(200).json(reservasConTurnos);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// para obtener las reservas de un cuidador, para su gestión de reservas
const getReservasPorCuidador = async (req, res) => {
  try {
    const idCuidador = req.params.id;
    const reservas = await Reserva.find({ cuidador: idCuidador })
      .populate("cliente", "nombre apellido telefono")
      .populate("mascotas", "nombre")
      .populate("estado", "estado")
      .populate("resenia", "puntuacion comentario");
    const reservasConTurnos = await Promise.all(
      reservas.map(async (reserva) => {
        const turnos = await Turno.find({ reserva: reserva._id });
        let horaTurno = null;
        if (turnos.length > 0) {
          horaTurno = turnos[0].fechaHoraInicio
            .toISOString()
            .split("T")[1]
            .substring(0, 5);
        }
        return { ...reserva.toObject(), horaTurno };
      })
    );
    res.status(200).json(reservasConTurnos);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getOneReserva = async (req, res) => {
  try {
    const idReserva = req.params.id;
    const reserva = await Reserva.findById(idReserva)
      .populate("cliente", "nombre")
      .populate("cuidador", "nombre")
      .populate("mascotas", "nombre")
      .populate("estado", "estado");
    res.status(200).json(reserva);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getReservasCuidadorEnRango = async (req, res) => {
  try {
    const idCuidador = req.params.id;
    const { fechaInicio, fechaFin } = req.body;
    const reservas = await getReservasCuidadorEnRango(
      idCuidador,
      fechaInicio,
      fechaFin
    );
    res.status(200).json(reservas);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const cancelarReserva = async (req, res) => {
  try {
    const reserva = await reservaService.cancelarReserva(req.params.idReserva);
    res.status(200).json(reserva);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const aprobarReserva = async (req, res) => {
  try {
    const idReserva = req.params.idReserva;
    const reservaAprobada = await reservaService.aprobarReserva(idReserva);
    res.status(200).json(reservaAprobada);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
};

const rechazarReserva = async (req, res) => {
  try {
    const idReserva = req.params.idReserva;
    const reservaRechazada = await reservaService.rechazarReserva(idReserva);
    res.status(200).json(reservaRechazada);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const anularReserva = async (req, res) => {
  try {
    const reserva = await reservaService.anularReserva(req.params.idReserva);
    res.status(200).json(reserva);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getTurnosPorReserva = async (req, res) => {
  try {
    const idReserva = req.params.idReserva;
    const turnos = await Turno.find({ reserva: idReserva });

    const turnosFormatted = turnos.map((turno) => {
      const fecha = turno.fechaHoraInicio
        .toISOString()
        .split("T")[0]
        .split("-")
        .reverse()
        .join("-");
      const hora = turno.fechaHoraInicio
        .toISOString()
        .split("T")[1]
        .substring(0, 5);
      return { fecha, hora };
    });

    res.status(200).json(turnosFormatted);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createReserva,
  deleteReserva,
  editReserva,
  getReservasPorCliente,
  getReservasPorCuidador,
  getOneReserva,
  getReservasCuidadorEnRango,
  cancelarReserva,
  aprobarReserva,
  rechazarReserva,
  anularReserva,
  getTurnosPorReserva,
};
