//IMPORTAR CONEXION A BBDD
const conecction = require("./database/conecction");

//IMPORTAR DEPENDENCIAS
const express = require("express");//permite hacer peticiones http
const cors = require("cors");//permite la comunicacion entre dominios

//IMPORTAR ARCHIVOS DE RUTAS
const userRoutes = require("./routes/user");
const albumRoutes = require("./routes/album");
const artistRoutes = require("./routes/artist");
const songRoutes = require("./routes/song");

//MENSAJE DE BIENVENIDA
console.log("APIRESTful con NodeJs para AppMusic Iniciada");

//EJECUTAR LA CONEXION A LA BBDD
conecction();

//EJECUTAR EL SERVIDOR DE NODE
const app = express();
const port = 3911;

//CONFIGURAR CORS
app.use(cors());//ejecutar el cors antes de cualquier otra ruta (MIDDLEWARE)

//CONVERTIR LOS DATOS DEL BOY EN OBJETOS JS
app.use(express.json());
app.use(express.urlencoded({extended: true}));  

//CARGAR CONFIGURACION DE RUTAS
app.get("/prueba", (req, res) =>{
    return res.status(200).send({
        "id": 123456,
        "Nombre": "Alex",
        "Apellido": "Cardenas"
    });
});

//PROBAR RUTA DE PRUEBA
app.use("/api/user",userRoutes);
app.use("/api/album",albumRoutes);
app.use("/api/artist",artistRoutes);
app.use("/api/song",songRoutes);

//PONER EL SERVIDOR A ESCUCHAR PETICIONES HTTP
app.listen(port, () =>{
    console.log("Servidor de Node Escuchando por el puerto "+ port);
});

