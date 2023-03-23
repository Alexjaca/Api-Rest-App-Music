//IMPORTAR MONGOOSE
const mongoose = require("mongoose");

//HACER METODO DE CONMEXION
const conection = async() =>{
    try {
        mongoose.set("strictQuery", true);
        await mongoose.connect("mongodb://127.0.0.1:27017/app_musica");
        console.log("Conectados a la Base de Datos app_musica");
    } catch (error) {
        console.log(error);
        throw new Error("No se pudo establecer la conecciona a la BBDD");
    }
}

//EXPORTAR METODO DE CONEXION
module.exports = conection;