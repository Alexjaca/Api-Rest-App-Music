//IMPORTAR DEPENDENCIAS
const express = require("express");

//CARGAR ROUTER
const router = express.Router();    

//IMPORTAR MIDDLEWARES
const authorization = require("../middlewares/auth");

//IMPORTAR CONTROLADOR
const songController = require("../controllers/song");

//DEFINIR RUTAS
router.get("/prueba-song", songController.probando);

router.post("/register", authorization.auth, songController.save);

//EXPORTAR ROUTER
module.exports = router;