//IMPORTAR DEPENDENCIAS
const express = require("express");

//CARGAR ROUTER
const router = express.Router();    

//IMPORTAR CONTROLADOR
const songController = require("../controllers/song");

//DEFINIR RUTAS
router.get("/prueba-song", songController.probando);

//EXPORTAR ROUTER
module.exports = router;