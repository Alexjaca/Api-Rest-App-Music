//IMPORTAR DEPENDENCIAS
const express = require("express");

//IMPORTAR MIDDLEWARES
const authorization = require("../middlewares/auth");

//CARGAR ROUTER
const router = express.Router();    

//IMPORTAR CONTROLADOR
const albumController = require("../controllers/album");

//DEFINIR RUTAS
router.get("/prueba-album", albumController.probando);

router.post("/register", authorization.auth, albumController.save);

//EXPORTAR ROUTER
module.exports = router;