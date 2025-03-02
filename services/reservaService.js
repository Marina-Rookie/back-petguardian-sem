const moment = require("moment-timezone");
const Reserva = require("../models/Reserva.js");
const Turno = require("../models/Turno");
const Usuario = require("../models/Usuario.js");
const Estado = require("../models/Estado.js");
const Resenia = require("../models/Resenia.js");
const mongoose = require("mongoose");
const turnoService = require("./turnoService");
const {sendEmailState} = require('./emailService.js');


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
  horaTurno,
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
const startDate = moment
  .utc(fechaInicio, "YYYY-MM-DD")
  .set({ hour: 10, minute: 0, second: 0, millisecond: 0 })
  .toDate();
const endDate = moment
  .utc(fechaFin, "YYYY-MM-DD")
  .set({ hour: 10, minute: 0, second: 0, millisecond: 0 })
  .toDate();
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



    const days = Math.ceil((endDate - startDate + 1000 * 60 * 60 * 24) / (1000 * 60 * 60 * 24));

    // Crear turnos para cada día
for (let i = 0; i < days; i++) {
  const turnoDate = moment.utc(startDate)
    .add(i, "days")
    .set({
      hour: parseInt(horaTurno),
      minute: 0,
      second: 0,
      millisecond: 0,
    })
    .toDate();
  // Crear un nuevo turno
  const newTurno = new Turno({
    fechaHoraInicio: turnoDate,
    reserva: savedReserva._id,
  });
  await newTurno.save({ session });
}

    // Actualizar el contador de turnos en la reserva
    const updatedReserva = await Reserva.findByIdAndUpdate(
      savedReserva._id,
      { $inc: { contadorTurnos: days } },
      { new: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return updatedReserva;
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
}

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

    await turnoService.deleteTurnosByReserva(idReserva);

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

    await turnoService.deleteTurnosByReserva(idReserva);
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

    await turnoService.deleteTurnosByReserva(idReserva);
    reserva.estado = estadoCancelada._id;
    await reserva.save();
    await sendEmailState(reserva);
    return reserva;
  } catch (error) {
    throw new Error(error.message);
  }
};
module.exports = {
  createReserva,
  getReservasCuidadorEnRango,
  updateReservasFinalizadas,
  aprobarReserva,
  rechazarReserva,
  anularReserva,
  cancelarReserva
};
