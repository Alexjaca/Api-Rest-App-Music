//IMPORTAR DEPENDENCIAS
const express = require("express");

//CARGAR ROUTER
const router = express.Router();    

//IMPORTAR CONTROLADOR
const artistController = require("../controllers/artist");

//DEFINIR RUTAS
router.get("/prueba-artist", artistController.probando);

//EXPORTAR ROUTER
module.exports = router;