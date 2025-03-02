const express = require("express");
const multer = require("multer");
const connection = require("./config/conectarDB.js");
const cors = require("cors");
const { swaggerUi, specs } = require("./utils/swaggerConfig");
const port = process.env.PORT || 3000;
const router = require("./routes/routes.js");
const tareaProgramada = require("./utils/tareaProgramada.js");

require("dotenv").config();

connection.conectarDB();

const app = express();
app.use(express.json());

// Enable CORS for multiple origins
const allowedOrigins = [
  "http://localhost:4200",
  "https://frontpetguardiansem.vercel.app",
];
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(router);

// Configuración de multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Configuración de Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.listen(port, () => {
  tareaProgramada.programarUpdateReservas();
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

router.get("/", (req, res) => {
  res.send("Bienvenido a la API de PetGuardian");
});
