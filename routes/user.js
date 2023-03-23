//IMPORTAR DEPENDENCIAS
const express = require("express");

//CARGAR ROUTER
const router = express.Router();    

//IMPORTAR CONTROLADOR
const userController = require("../controllers/user");

//DEFINIR RUTAS
router.get("/prueba-user", userController.probando);

//EXPORTAR ROUTER
module.exports = router;

