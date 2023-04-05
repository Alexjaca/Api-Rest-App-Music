//IMPORTAR DEPENDENCIAS
const express = require("express");
const multer = require("multer");

//CARGAR ROUTER
const router = express.Router();    

//IMPORTAR MIDDLEWARES
const authorization = require("../middlewares/auth");

//IMPORTAR CONTROLADOR
const songController = require("../controllers/song");


//CONFIGURANDO MULTER PARA LA SUBIDA DE ARCHIVOS
const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "./uploads/songs");//Destino de los Archivos
    },
    filename: (req, file, cb)=>{
        cb(null, "song-"+Date.now()+"-"+file.originalname); //Nombre de copmo se guardara el archivo
    }
});

const uploads = multer({storage});  // se guarda la configuracion en una constante

//DEFINIR RUTAS
router.get("/prueba-song", songController.probando);

router.post("/register", authorization.auth, songController.save);
router.get("/one/:id", authorization.auth, songController.one);
router.get("/list/:albumId", authorization.auth, songController.list);
router.put("/update/:songId", authorization.auth, songController.update);
router.delete("/remove/:songId", authorization.auth, songController.remove);
router.post("/upload/:id", [authorization.auth, uploads.single("file0")], songController.upload);
router.get("/audio/:file", songController.audio);


//EXPORTAR ROUTER
module.exports = router;