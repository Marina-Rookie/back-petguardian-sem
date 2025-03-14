const moment = require("moment-timezone");
const Reserva = require("../models/Reserva.js");
const Turno = require("../models/Turno");
const Usuario = require("../models/Usuario.js");
const Estado = require("../models/Estado.js");
const Resenia = require("../models/Resenia.js");
const mongoose = require("mongoose");
const turnoService = require("./turnoService");
const { sendEmailState } = require("./emailService.js");

// createReserva: Crea unna reserva y sus turnos asociados
//no valida los turnos, eso se valida en la función getDisponibilidadCuidador de turnoService, el cliente seleccionaría directamente de ese array de horas disponibles
// Las reservas son con días consecutivos, se crea un turno de una hora para cada día al mimos horario.
const createReserva = async ({
  fechaInicio,
  fechaFin,
  comentario,
  clienteId,
  cuidador,
  mascotas,
  diasReserva,
}) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const estado = await Estado.findOne({ estado: "Pendiente" });
    if (!estado) {
      throw new Error("Estado 'Pendiente' no encontrado");
    }
    const cuidadorData = await Usuario.findById(cuidador);
    if (!cuidadorData || cuidadorData.rol !== "Cuidador Habilitado") {
      throw new Error("El cuidador no está habilitado");
    }
    const tarifaTurno = cuidadorData.tarifaHora;
    const startDate = new Date(`${fechaInicio}T00:00:00.000Z`);
    const endDate = new Date(`${fechaFin}T23:59:59.999Z`);
    const newReserva = new Reserva({
      fechaInicio: startDate,
      fechaFin: endDate,
      comentario,
      tarifaTurno,
      cliente: clienteId,
      cuidador,
      mascotas,
      estado: estado._id,
    });

    const savedReserva = await newReserva.save({ session });

    // Crear turnos para cada día en diasReserva
    for (const dia of diasReserva) {
      const turnoDate = moment
        .utc(dia.fecha, "YYYY-MM-DD")
        .set({
          hour: parseInt(dia.horaTurno),
          minute: 0,
          second: 0,
          millisecond: 0,
        })
        .toDate();
      const newTurno = new Turno({
        fechaHoraInicio: turnoDate,
        reserva: savedReserva._id,
      });
      await newTurno.save({ session });
    }

    // Actualizar el contador de turnos en la reserva
    await Reserva.findByIdAndUpdate(
      savedReserva._id,
      {
        $inc: { contadorTurnos: diasReserva.length },
      },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return savedReserva;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// Función para obtener las reservas de un cuidador en un rango de fechas que tengan estado Aprobada o Pendiente, se utiliza en la función getDisponibilidadCuidador de turnoService
// devuelve las reservas del cuidador en ese rango de fechas con estado Aprobada o Pendiente.
const getReservasCuidadorEnRango = async (
  idCuidador,
  fechaInicio,
  fechaFin
) => {
  try {
    // Obtener los ObjectId de los estados "Aprobada" y "Pendiente"
    const estados = await Estado.find({
      estado: { $in: ["Aprobada", "Pendiente"] },
    });
    const estadoIds = estados.map((estado) => estado._id);

    const reservas = await Reserva.find({
      cuidador: idCuidador,
      fechaInicio: { $lte: fechaFin },
      fechaFin: { $gte: fechaInicio },
      estado: { $in: estadoIds },
    });

    return reservas;
  } catch (error) {
    throw new Error(
      "Error al obtener las reservas del cuidador: " + error.message
    );
  }
};

const updateReservasFinalizadas = async () => {
  const estadoAprobada = await Estado.findOne({ estado: "Aprobada" });
  const estadoFinalizada = await Estado.findOne({ estado: "Finalizada" });

  if (!estadoAprobada || !estadoFinalizada) {
    throw new Error("Estados 'Aprobada' o 'Finalizada' no encontrados");
  }

  const today = new Date();

  const reservasAprobadas = await Reserva.find({
    estado: estadoAprobada._id,
    fechaFin: { $lt: today },
  });

  for (const reserva of reservasAprobadas) {
    reserva.estado = estadoFinalizada._id;
    await reserva.save();
    await sendEmailState(reserva);
  }
};

const aprobarReserva = async (idReserva) => {
  try {
    const estadoAprobada = await Estado.findOne({ estado: "Aprobada" });
    if (!estadoAprobada) {
      throw new Error("Estado 'Aprobada' no encontrado");
    }

    const reserva = await Reserva.findById(idReserva);
    if (!reserva) {
      throw new Error("Reserva no encontrada");
    }

    reserva.estado = estadoAprobada._id;
    await reserva.save();
    await sendEmailState(reserva);
    return reserva;
  } catch (error) {
    throw new Error(error.message);
  }
};

const rechazarReserva = async (idReserva) => {
  try {
    const estadoNoAprobada = await Estado.findOne({ estado: "No aprobada" });
    if (!estadoNoAprobada) {
      throw new Error("Estado 'No aprobada' no encontrado");
    }

    const reserva = await Reserva.findById(idReserva);
    if (!reserva) {
      throw new Error("Reserva no encontrada");
    }

    await Turno.updateMany(
      { reserva: idReserva },
      { $set: { eliminado: true } }
    );

    reserva.estado = estadoNoAprobada._id;
    await reserva.save();
    await sendEmailState(reserva);
    return reserva;
  } catch (error) {
    throw new Error(error.message);
  }
};

const anularReserva = async (idReserva) => {
  try {
    const estadoAnulada = await Estado.findOne({ estado: "Anulada" });
    if (!estadoAnulada) {
      throw new Error("Estado 'Anulada' no encontrado");
    }

    const reserva = await Reserva.findById(idReserva);
    if (!reserva) {
      throw new Error("Reserva no encontrada");
    }

    if (
      reserva.estado.toString() !==
      (await Estado.findOne({ estado: "Aprobada" }))._id.toString()
    ) {
      throw new Error("Solo se pueden anular reservas con estado 'Aprobada'");
    }

    await Turno.updateMany(
      { reserva: idReserva },
      { $set: { eliminado: true } }
    );

    reserva.estado = estadoAnulada._id;
    await reserva.save();
    await sendEmailState(reserva);
    return reserva;
  } catch (error) {
    throw new Error(error.message);
  }
};

const cancelarReserva = async (idReserva) => {
  try {
    const estadoCancelada = await Estado.findOne({ estado: "Cancelada" });
    if (!estadoCancelada) {
      throw new Error("Estado 'Cancelada' no encontrado");
    }

    const reserva = await Reserva.findById(idReserva);
    if (!reserva) {
      throw new Error("Reserva no encontrada");
    }

    const estadoPendiente = await Estado.findOne({ estado: "Pendiente" });
    const estadoAprobada = await Estado.findOne({ estado: "Aprobada" });

    if (
      reserva.estado.toString() !== estadoPendiente._id.toString() &&
      reserva.estado.toString() !== estadoAprobada._id.toString()
    ) {
      throw new Error(
        "Solo se pueden cancelar reservas con estado 'Pendiente' o 'Aprobada'"
      );
    }

    await Turno.updateMany(
      { reserva: idReserva },
      { $set: { eliminado: true } }
    );

    reserva.estado = estadoCancelada._id;
    await reserva.save();
    await sendEmailState(reserva);
    return reserva;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getReservasPorCuidador = async (idCuidador) => {
  try {
    const reservas = await Reserva.find({ cuidador: idCuidador })
      .populate("cliente", "nombre apellido telefono")
      .populate({
        path: "mascotas",
        populate: [
          { path: "etapaVida", select: "nombre" },
          { path: "tipoMascota", select: "nombre" },
        ],
      })
      .populate("mascotas", "nombre obsComida obsEnfermedades obsOtros")
      .populate("estado", "estado")
      .populate("resenia", "puntuacion comentario")
      .lean();

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
        const fechaInicio = reserva.fechaInicio.toISOString().split("T")[0];
        const fechaFin = reserva.fechaFin.toISOString().split("T")[0];
        return { ...reserva, horaTurno, fechaInicio, fechaFin };
      })
    );

    return reservasConTurnos;
  } catch (error) {
    throw new Error(
      "Error al obtener las reservas del cuidador: " + error.message
    );
  }
};

module.exports = {
  createReserva,
  getReservasCuidadorEnRango,
  updateReservasFinalizadas,
  aprobarReserva,
  rechazarReserva,
  anularReserva,
  cancelarReserva,
  getReservasPorCuidador, // Add this line
};
