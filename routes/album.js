//IMPORTAR DEPENDENCIAS
const express = require("express");

//CARGAR ROUTER
const router = express.Router();    

//IMPORTAR CONTROLADOR
const albumController = require("../controllers/album");

//DEFINIR RUTAS
router.get("/prueba-album", albumController.probando);

//EXPORTAR ROUTER
module.exports = router;