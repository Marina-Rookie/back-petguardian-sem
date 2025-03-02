const DisponibilidadCuidador = require('../models/DisponibilidadCuidador.js');
const crearDisponibilidad = async (fecha, horarios, idCuidador) => {
    try {
        const horas = horarios.map(horario => {
            return horario.horaInicio.toString();
        });

        const disponibilidad = {
            fecha: fecha,
            horas: horas,
            cuidador: idCuidador
        };

        const result = await DisponibilidadCuidador.create(disponibilidad);

        return result;
    } catch (error) {
        throw new Error(error.message);
    }
};

const obtenerDisponibilidadesPorCuidador = async (idCuidador) => {
  try {
    const disponibilidades = await DisponibilidadCuidador.find(
      { cuidador: idCuidador },
      "fecha horas"
    );
    return disponibilidades;
  } catch (error) {
    console.log("Error al obtener disponibilidades:", error.message);
    throw new Error(error.message);
  }
};

const crearOActualizarDisponibilidad = async (fecha, horarios, idCuidador) => {
  try {
    // Extraer la fecha del string
    const fechaSolo = fecha.substring(0, 10);
    const [year, month, day] = fechaSolo.split("-").map(Number);

    // Crear las fechas de inicio y fin del día en UTC
    const inicioDia = new Date(Date.UTC(year, month - 1, day));
    inicioDia.setUTCHours(0, 0, 0, 0);

    const finDia = new Date(Date.UTC(year, month - 1, day));
    finDia.setUTCHours(23, 59, 59, 999);

    const disponibilidadExistente = await DisponibilidadCuidador.findOne({
      cuidador: idCuidador,
      fecha: { $gte: inicioDia, $lt: finDia },
    });

    if (
      disponibilidadExistente || (disponibilidadExistente && horarios.length === 0) ) {
      await DisponibilidadCuidador.deleteOne({
        _id: disponibilidadExistente._id,
      });
    }

    const horas = horarios.map((horario) => horario.horaInicio.toString());
    const nuevaDisponibilidad = {
      fecha: fecha,
      horas: horas,
      cuidador: idCuidador,
    };

  let result = null;
  if (horarios.length > 0) {
    result = await DisponibilidadCuidador.create(nuevaDisponibilidad);
  } else {
    console.log("Horarios está vacío, no se crea una nueva disponibilidad.");
  }

  return result;
} catch (error) {
  console.log("Error al crear o actualizar disponibilidad:", error.message);
  throw new Error(error.message);
}
};
module.exports = {
  crearDisponibilidad,
  obtenerDisponibilidadesPorCuidador,
  crearOActualizarDisponibilidad,
};