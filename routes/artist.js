//IMPORTAR DEPENDENCIAS
const express = require("express");

//IMPORTAR MIDDLEWARES
const authorization = require("../middlewares/auth");

//CARGAR ROUTER
const router = express.Router();    

//IMPORTAR CONTROLADOR
const artistController = require("../controllers/artist");

//DEFINIR RUTAS
router.get("/prueba-artist", artistController.probando);


//RUTAS REALES
router.post("/register", authorization.auth, artistController.save);
router.get("/one/:id", authorization.auth, artistController.one);
router.get("/list/:page?", authorization.auth, artistController.list);



//EXPORTAR ROUTER
module.exports = router;