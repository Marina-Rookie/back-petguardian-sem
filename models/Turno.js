const mongoose = require("mongoose");
const Reserva = require("./Reserva");
const TurnoSchema = new mongoose.Schema({
  fechaHoraInicio: {
    type: Date,
    required: true,
  },
  reserva: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reserva",
    required: true,
  },
  eliminado: {
    type: Boolean,
    default: false,
  },
});
TurnoSchema.pre("save", async function (next) {
  try {
    await Reserva.findByIdAndUpdate(this.reserva, {
      $inc: { contadorTurnos: 1 },
    });
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Turno", TurnoSchema);
