//IMPORTAR DEPENDENCIAS
const express = require("express");

//CARGAR ROUTER
const router = express.Router();    

//IMPORTAR CONTROLADOR
const userController = require("../controllers/user");

//IMPORTAR MIDDLEWARES
const authorization = require("../middlewares/auth");

//RUTA DE PRUEBA
router.get("/prueba-user", userController.probando);

//RUTAS REALES
router.post("/register", userController.register);
router.get("/login", userController.login);
router.get("/profile/:id", authorization.auth, userController.profile);
router.put("/update", authorization.auth, userController.update);

//EXPORTAR ROUTER
module.exports = router;

