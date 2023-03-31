//IMPORTAR DEPENDENCIAS
const express = require("express");
const multer = require("multer");

//CARGAR ROUTER
const router = express.Router();    

//IMPORTAR CONTROLADOR
const userController = require("../controllers/user");

//IMPORTAR MIDDLEWARES
const authorization = require("../middlewares/auth");

//RUTA DE PRUEBA
router.get("/prueba-user", userController.probando);


//CONFIGURANDO MULTER PARA LA SUBIDA DE ARCHIVOS
const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "./uploads/multimedia");//Destino de los Archivos
    },
    filename: (req, file, cb)=>{
        cb(null, "multi-"+Date.now()+"-"+file.originalname); //Nombre de copmo se guardara el archivo
    }
});

const uploads = multer({storage});  // se guarda la configuracion en una constante

//RUTAS REALES
router.post("/register", userController.register);
router.get("/login", userController.login);
router.get("/profile/:id", authorization.auth, userController.profile);
router.put("/update", authorization.auth, userController.update);
router.post("/upload", [authorization.auth, uploads.single("file0")], userController.upload);
router.get("/avatar/:file", userController.avatar);

//EXPORTAR ROUTER
module.exports = router;

