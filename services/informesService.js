
const Usuario = require("../models/Usuario.js");
const Resenia = require("../models/Resenia.js");
const moment = require("moment-timezone");
const Reserva = require("../models/Reserva.js");
const Estado = require("../models/Estado.js");

const obtenerClientesConReservasPorEstado = async (filtros) => {
  try {
    const { nombre, apellido, email, reservasMin, reservasMax } = filtros;

    const matchStage = { rol: "Cliente" };

    if (nombre) matchStage.nombre = { $regex: nombre, $options: "i" };
    if (apellido) matchStage.apellido = { $regex: apellido, $options: "i" };
    if (email) matchStage.email = { $regex: email, $options: "i" };

    const clientes = await Usuario.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: "reservas", // Nombre de la colección de reservas
          localField: "_id",
          foreignField: "cliente", // Campo en la colección de reservas que referencia al cliente
          as: "reservas",
        },
      },
      {
        $lookup: {
          from: "estados", // Nombre de la colección de estados
          localField: "reservas.estado",
          foreignField: "_id",
          as: "estadoDetalles",
        },
      },
      {
        $addFields: {
          reservasCanceladas: {
            $size: {
              $filter: {
                input: "$estadoDetalles",
                as: "estado",
                cond: { $eq: ["$$estado.estado", "Cancelada"] },
              },
            },
          },
          reservasFinalizadas: {
            $size: {
              $filter: {
                input: "$estadoDetalles",
                as: "estado",
                cond: { $eq: ["$$estado.estado", "Finalizada"] },
              },
            },
          },
          reservasAprobadas: {
            $size: {
              $filter: {
                input: "$estadoDetalles",
                as: "estado",
                cond: { $eq: ["$$estado.estado", "Aprobada"] },
              },
            },
          },
          reservasPendientes: {
            $size: {
              $filter: {
                input: "$estadoDetalles",
                as: "estado",
                cond: { $eq: ["$$estado.estado", "Pendiente"] },
              },
            },
          },
          reservasNoAprobadas: {
            $size: {
              $filter: {
                input: "$estadoDetalles",
                as: "estado",
                cond: { $eq: ["$$estado.estado", "No aprobada"] },
              },
            },
          },
        },
      },
      {
        $addFields: {
          reservasTotales: {
            $sum: [
              "$reservasCanceladas",
              "$reservasFinalizadas",
              "$reservasAprobadas",
              "$reservasPendientes",
              "$reservasNoAprobadas",
            ],
          },
        },
      },
      {
        $match: {
          ...(reservasMin === undefined &&
            reservasMin !== undefined && { reservasTotales: { $eq: 0 } }),
          ...(reservasMin !== undefined &&
            reservasMax !== undefined &&
            reservasMin !== 0 &&
            reservasMax !== 0 && {
              reservasTotales: {
                $gte: Number(reservasMin),
                $lte: Number(reservasMax),
              },
            }),
          ...(reservasMin !== undefined &&
            reservasMax === undefined &&
            reservasMin !== 0 && {
              reservasTotales: { $gte: Number(reservasMin) },
            }),
          ...(reservasMin === undefined &&
            reservasMax !== undefined &&
            reservasMax !== 0 && {
              reservasTotales: { $lte: Number(reservasMax) },
            }),
        },
      },
      {
        $project: {
          createdAt: {
            $dateToString: { format: "%d-%m-%Y", date: "$createdAt" },
          },
          nombre: 1,
          apellido: 1,
          email: 1,
          telefono: 1,
          reservasCanceladas: 1,
          reservasFinalizadas: 1,
          reservasAprobadas: 1,
          reservasPendientes: 1,
          reservasNoAprobadas: 1,
          reservasTotales: 1,
        },
      },
    ]);

    // Obtener estadísticas
    const totalClientes = await Usuario.countDocuments({ rol: "Cliente" });
    const clientesFiltrados = clientes.length;
    const clientes1a10 = await Usuario.aggregate([
      { $match: { rol: "Cliente" } },
      {
        $lookup: {
          from: "reservas",
          localField: "_id",
          foreignField: "cliente",
          as: "reservas",
        },
      },
      {
        $addFields: {
          reservasTotales: { $size: "$reservas" },
        },
      },
      {
        $match: { reservasTotales: { $gte: 1, $lte: 10 } },
      },
      { $count: "count" },
    ]);
    const clientes11a20 = await Usuario.aggregate([
      { $match: { rol: "Cliente" } },
      {
        $lookup: {
          from: "reservas",
          localField: "_id",
          foreignField: "cliente",
          as: "reservas",
        },
      },
      {
        $addFields: {
          reservasTotales: { $size: "$reservas" },
        },
      },
      {
        $match: { reservasTotales: { $gte: 11, $lte: 20 } },
      },
      { $count: "count" },
    ]);
    const clientes21a50 = await Usuario.aggregate([
      { $match: { rol: "Cliente" } },
      {
        $lookup: {
          from: "reservas",
          localField: "_id",
          foreignField: "cliente",
          as: "reservas",
        },
      },
      {
        $addFields: {
          reservasTotales: { $size: "$reservas" },
        },
      },
      {
        $match: { reservasTotales: { $gte: 21, $lte: 50 } },
      },
      { $count: "count" },
    ]);
    const clientes51a100 = await Usuario.aggregate([
      { $match: { rol: "Cliente" } },
      {
        $lookup: {
          from: "reservas",
          localField: "_id",
          foreignField: "cliente",
          as: "reservas",
        },
      },
      {
        $addFields: {
          reservasTotales: { $size: "$reservas" },
        },
      },
      {
        $match: { reservasTotales: { $gte: 51, $lte: 100 } },
      },
      { $count: "count" },
    ]);

    return {
      clientes,
      estadisticas: {
        totalClientes,
        clientesFiltrados,
        clientes1a10: clientes1a10[0] ? clientes1a10[0].count : 0,
        clientes11a20: clientes11a20[0] ? clientes11a20[0].count : 0,
        clientes21a50: clientes21a50[0] ? clientes21a50[0].count : 0,
        clientes51a100: clientes51a100[0] ? clientes51a100[0].count : 0,
      },
    };

  } catch (error) {
    throw new Error(error.message);
  }
};
const obtenerCuidadoresConReservasPorEstado = async (filtros) => {
  try {
    const { nombre, apellido, email, estado } = filtros;

    const matchStage = {
      rol:{ $in: [
        "Cuidador Habilitado" ,
        "Cuidador No Habilitado" ,
        "Cuidador Pendiente"
  ]}};

    if (nombre) matchStage.nombre = { $regex: nombre, $options: "i" };
    if (apellido) matchStage.apellido = { $regex: apellido, $options: "i" };
    if (email) matchStage.email = { $regex: email, $options: "i" };
  
    const cuidadores = await Usuario.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: "reservas", // Nombre de la colección de reservas
          localField: "_id",
          foreignField: "cuidador", // Campo en la colección de reservas que referencia al cuidador
          as: "reservas",
        },
      },
      {
        $lookup: {
          from: "estados", // Nombre de la colección de estados
          localField: "reservas.estado",
          foreignField: "_id",
          as: "estadoDetalles",
        },
      },
      {
        $addFields: {
          reservasCanceladas: {
            $size: {
              $filter: {
                input: "$estadoDetalles",
                as: "estado",
                cond: { $eq: ["$$estado.estado", "Cancelada"] },
              },
            },
          },
          reservasFinalizadas: {
            $size: {
              $filter: {
                input: "$estadoDetalles",
                as: "estado",
                cond: { $eq: ["$$estado.estado", "Finalizada"] },
              },
            },
          },
          reservasAprobadas: {
            $size: {
              $filter: {
                input: "$estadoDetalles",
                as: "estado",
                cond: { $eq: ["$$estado.estado", "Aprobada"] },
              },
            },
          },
          reservasPendientes: {
            $size: {
              $filter: {
                input: "$estadoDetalles",
                as: "estado",
                cond: { $eq: ["$$estado.estado", "Pendiente"] },
              },
            },
          },
          reservasNoAprobadas: {
            $size: {
              $filter: {
                input: "$estadoDetalles",
                as: "estado",
                cond: { $eq: ["$$estado.estado", "No aprobada"] },
              },
            },
          },
        },
      },
      {
        $addFields: {
          estado: {
            $cond: {
              if: { $eq: ["$rol", "Cuidador Habilitado"] },
              then: "Habilitado",
              else: {
                $cond: {
                  if: { $eq: ["$rol", "Cuidador No Habilitado"] },
                  then: "No Habilitado",
                  else: {
                    $cond: {
                      if: { $eq: ["$rol", "Cuidador Pendiente"] },
                      then: "Pendiente",
                      else: "$estado", // Mantener el valor original si no coincide con ninguno
                    },
                  },
                },
              },
            },
          },
          reservasTotales: {
            $sum: [
              "$reservasCanceladas",
              "$reservasFinalizadas",
              "$reservasAprobadas",
              "$reservasPendientes",
              "$reservasNoAprobadas",
            ],
          },
        },
      },
  ...(estado
  ? [{ $match: { estado: {$eq: estado} } }]
  : []),
      {
        $project: {
          createdAt: {
            $dateToString: { format: "%d-%m-%Y", date: "$createdAt" },
          },
          nombre: 1,
          apellido: 1,
          email: 1,
          telefono: 1,
          estado: 1,
          tarifaHora: 1,
          promedioPuntuacion: 1,
          reservasTotales: 1,
          reservasCanceladas: 1,
          reservasFinalizadas: 1,
          reservasAprobadas: 1,
          reservasPendientes: 1,
          reservasNoAprobadas: 1,
        },
      },
    ]);

    // Obtener estadísticas
    const cuidadoresPendientes = await Usuario.countDocuments({rol: "Cuidador Pendiente"});
    const cuidadoresHabilitados = await Usuario.countDocuments({
      rol: "Cuidador Habilitado",
    });
    const cuidadoresNoHabilitados = await Usuario.countDocuments({ rol: "Cuidador No Habilitado" });

    const totalCuidadores = await Usuario.countDocuments({ rol:{$in: ["Cuidador Habilitado" ,"Cuidador No Habilitado" ,   "Cuidador Pendiente"]}});
    const puntuacionPromedioHabilitados = await Usuario.aggregate([
      {
        $match: { rol: "Cuidador Habilitado", promedioPuntuacion: { $ne: 0 } },
      },
      {
        $group: {
          _id: null,
          promedioPuntuacion: { $avg: "$promedioPuntuacion" },
        },
      },
    ]);

    const promedioPuntuacionHabilitados =
      puntuacionPromedioHabilitados.length > 0
        ? Math.round(puntuacionPromedioHabilitados[0].promedioPuntuacion * 10) /
          10
        : 0;

    const cuidadoresFiltrados = cuidadores.length;

  return {
    cuidadores,
    estadisticas: {
      cuidadoresPendientes,
      cuidadoresHabilitados,
      cuidadoresNoHabilitados,
      totalCuidadores,
      cuidadoresFiltrados,
      promedioPuntuacionHabilitados,
    },
  };
  } catch (error) {
    throw new Error(error.message);
  }
};
// Función para obtener todas las reservas con sus turnos, con time zone de argentina, en la BD esta guardado con +00:00 por defecto
const getReservas = async (filtros) => {
  try {
    const estadoPendiente = await Estado.findOne({ estado: "Pendiente" })
      .select("_id")
      .lean();
    const estadoFinalizada = await Estado.findOne({ estado: "Finalizada" })
      .select("_id")
      .lean();
    const estadoAprobada = await Estado.findOne({ estado: "Aprobada" })
      .select("_id")
      .lean();
    const estadoCancelada = await Estado.findOne({ estado: "Cancelada" })
      .select("_id")
      .lean();
    const estadoNoAprobada = await Estado.findOne({ estado: "No aprobada" })
      .select("_id")
      .lean();
    const estadoAnulada = await Estado.findOne({ estado: "Anulada" })
      .select("_id")
      .lean();

    const { fechaInicio, fechaFin, nombre, estado } = filtros;

    const matchStage = {};


    const convertToDate = (dateStr) => {
      return moment(dateStr, "DD-MM-YYYY").toDate();
    };
    if (fechaInicio && fechaFin) {
      const startDate = convertToDate(fechaInicio);
      const endDate = convertToDate(fechaFin);
      if (startDate > endDate) {
        throw new Error(
          "La fechaInicio debe ser menor o igual a la fechafin."
        );
      }
    }

        if (fechaInicio && fechaFin) {
      const startDate = convertToDate(fechaInicio);
      const endDate = convertToDate(fechaFin);
      if (startDate > endDate) {
        throw new Error("La fecha de inicio debe ser menor o igual a la fecha de fin.");
      }
    }

    if (fechaInicio ) {
      const startDate = convertToDate(fechaInicio);
      matchStage.fechaInicio = { $gte: startDate };
    }

    if (fechaFin) {
      const endDate = convertToDate(fechaFin);
      if (matchStage.fechaInicio) {
        const startDate = convertToDate(fechaInicio);
        matchStage.fechaInicio = { $gte: startDate };
        matchStage.fechaFin = { $lte: endDate };
      } else {
        matchStage.fechaFin = { $lte: endDate };
      }
    }

      if (estado) {
        const estadoEncontrado = await Estado.findOne({ estado })
          .select("_id")
          .lean();
        if (!estadoEncontrado) {
          throw new Error("Estado no válido");
        }
        matchStage["estado.estado"]= estado;
      }


    console.log("MatchStage:", matchStage);
    console.log("estado:", estado);
    console.log("match estado", matchStage.estado);
    console.log("estadoPendiente", estadoPendiente._id);

    const reservas = await Reserva.aggregate([
      {
        $lookup: {
          from: "usuarios",
          localField: "cliente",
          foreignField: "_id",
          as: "cliente",
        },
      },
      { $unwind: { path: "$cliente", preserveNullAndEmptyArrays: true } },
      {
        $match: { "cliente.rol": "Cliente" },
      },
      {
        $lookup: {
          from: "usuarios",
          localField: "cuidador",
          foreignField: "_id",
          as: "cuidador",
        },
      },
      { $unwind: { path: "$cuidador", preserveNullAndEmptyArrays: true } },
      {
        $match: { "cuidador.rol": "Cuidador Habilitado" },
      },
      {
        $lookup: {
          from: "estados",
          localField: "estado",
          foreignField: "_id",
          as: "estado",
        },
      },
      { $unwind: { path: "$estado", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "resenias",
          localField: "_id",
          foreignField: "reserva",
          as: "resenia",
        },
      },
      { $unwind: { path: "$resenia", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          precioReserva: {
            $multiply: ["$cuidador.tarifaHora", "$contadorTurnos"],
          },
          puntuacion: "$resenia.puntuacion",
          clienteNombreCompleto: {
            $concat: ["$cliente.nombre", " ", "$cliente.apellido"],
          },
          cuidadorNombreCompleto: {
            $concat: ["$cuidador.nombre", " ", "$cuidador.apellido"],
          },
        },
      },
      {
        $match: {
          ...matchStage,
          ...(nombre && {
            $or: [
              { clienteNombreCompleto: { $regex: nombre, $options: "i" } },
              { cuidadorNombreCompleto: { $regex: nombre, $options: "i" } },
              { "cliente.nombre": { $regex: nombre, $options: "i" } },
              { "cliente.apellido": { $regex: nombre, $options: "i" } },
              { "cuidador.nombre": { $regex: nombre, $options: "i" } },
              { "cuidador.apellido": { $regex: nombre, $options: "i" } },
            ],
          }),
        },
      },
      {
        $project: {
          fechaInicio: {
            $dateToString: { format: "%d-%m-%Y", date: "$fechaInicio" },
          },
          fechaFin: {
            $dateToString: { format: "%d-%m-%Y", date: "$fechaFin" },
          },
          estado: "$estado.estado",
          cliente: "$clienteNombreCompleto",
          cuidador: "$cuidadorNombreCompleto",
          contadorTurnos: 1,
          precioReserva: 1,
          puntuacion: 1,
        },
      },
    ]);

    //  estadísticas
    const totalReservas = await Reserva.countDocuments();
    const reservasFiltradas = reservas.length;
    const reservasPendientes = await Reserva.countDocuments({
      estado: estadoPendiente._id,
    });
    const reservasFinalizadas = await Reserva.countDocuments({
      estado: estadoFinalizada._id,
    });
    const reservasAprobadas = await Reserva.countDocuments({
      estado: estadoAprobada._id,
    });
    const reservasCanceladas = await Reserva.countDocuments({
      estado: estadoCancelada._id,
    });
    const reservasNoAprobadas = await Reserva.countDocuments({
      estado: estadoNoAprobada._id,
    });
    const reservasAnuladas = await Reserva.countDocuments({
      estado: estadoAnulada._id,
    });

    const totalIngresos = await Reserva.aggregate([
      {
        $lookup: {
          from: "usuarios",
          localField: "cuidador",
          foreignField: "_id",
          as: "cuidador",
        },
      },
      { $unwind: "$cuidador" },
      {
        $group: {
          _id: null,
          totalIngresos: {
            $sum: { $multiply: ["$cuidador.tarifaHora", "$contadorTurnos"] },
          },
        },
      },
    ]);

    const promedioPuntuacion = await Resenia.aggregate([
      {
        $group: {
          _id: null,
          promedioPuntuacion: { $avg: "$puntuacion" },
        },
      },
    ]);

    return {
      reservas,
      estadisticas: {
        reservasFiltradas, // o total de registros mostrados en pantalla,
        totalReservas,
        reservasPendientes,
        reservasFinalizadas,
        reservasAprobadas,
        reservasCanceladas,
        reservasNoAprobadas,
        reservasAnuladas,
        totalIngresos: totalIngresos[0] ? totalIngresos[0].totalIngresos : 0,
        promedioPuntuacion: promedioPuntuacion[0]
          ? promedioPuntuacion[0].promedioPuntuacion
          : 0,
      },
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  obtenerClientesConReservasPorEstado,
  obtenerCuidadoresConReservasPorEstado,
  getReservas};