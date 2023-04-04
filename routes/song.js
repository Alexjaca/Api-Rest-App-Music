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
router.get("/one/:id", authorization.auth, songController.one);
router.get("/list/:albumId", authorization.auth, songController.list);
router.put("/update/:songId", authorization.auth, songController.update);
router.delete("/remove/:songId", authorization.auth, songController.remove);

//EXPORTAR ROUTER
module.exports = router;