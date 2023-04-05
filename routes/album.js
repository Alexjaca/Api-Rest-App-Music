//IMPORTAR DEPENDENCIAS
const express = require("express");
const multer = require("multer");

//IMPORTAR MIDDLEWARES
const authorization = require("../middlewares/auth");

//CARGAR ROUTER
const router = express.Router();    

//IMPORTAR CONTROLADOR
const albumController = require("../controllers/album");


//CONFIGURANDO MULTER PARA LA SUBIDA DE ARCHIVOS
const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "./uploads/albums");//Destino de los Archivos
    },
    filename: (req, file, cb)=>{
        cb(null, "album-"+Date.now()+"-"+file.originalname); //Nombre de copmo se guardara el archivo
    }
});

const uploads = multer({storage});  // se guarda la configuracion en una constante

//DEFINIR RUTAS
router.get("/prueba-album", albumController.probando);

router.post("/register", authorization.auth, albumController.save);
router.get("/one/:id", authorization.auth, albumController.one);
router.get("/list/:artistId", authorization.auth, albumController.list);
router.put("/update/:albumId", authorization.auth, albumController.update);
router.post("/upload/:id", [authorization.auth, uploads.single("file0")], albumController.upload);
router.get("/image/:file", albumController.image);
router.delete("/remove/:id", authorization.auth, albumController.remove);


//EXPORTAR ROUTER
module.exports = router;