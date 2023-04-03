//IMPORTAR DEPENDENCIAS
const express = require("express");
const multer = require("multer");

//IMPORTAR MIDDLEWARES
const authorization = require("../middlewares/auth");

//CARGAR ROUTER
const router = express.Router();    

//IMPORTAR CONTROLADOR
const artistController = require("../controllers/artist");

//DEFINIR RUTAS
router.get("/prueba-artist", artistController.probando);


//CONFIGURANDO MULTER PARA LA SUBIDA DE ARCHIVOS
const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "./uploads/artists");//Destino de los Archivos
    },
    filename: (req, file, cb)=>{
        cb(null, "artist-"+Date.now()+"-"+file.originalname); //Nombre de copmo se guardara el archivo
    }
});

const uploads = multer({storage});  // se guarda la configuracion en una constante


//RUTAS REALES
router.post("/register", authorization.auth, artistController.save);
router.get("/one/:id", authorization.auth, artistController.one);
router.get("/list/:page?", authorization.auth, artistController.list);
router.put("/update/:id", authorization.auth, artistController.update);
router.delete("/remove/:id", authorization.auth, artistController.remove);
router.post("/upload/:id", [authorization.auth, uploads.single("file0")], artistController.upload);
router.get("/image/:file", artistController.image);



//EXPORTAR ROUTER
module.exports = router;