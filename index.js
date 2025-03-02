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

// Enable CORS for specific origins
const corsOptions = {
  origin: "http://localhost:4200", // Replace with your frontend URL
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
