//IMPORTAR DEPENDENCIAS
const express = require("express");

//CARGAR ROUTER
const router = express.Router();    

//IMPORTAR CONTROLADOR
const userController = require("../controllers/user");

//RUTA DE PRUEBA
router.get("/prueba-user", userController.probando);

//RUTAS REALES
router.post("/register", userController.register);
router.get("/login", userController.login);

//EXPORTAR ROUTER
module.exports = router;

