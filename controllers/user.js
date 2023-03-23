//IMPORTAR MODELOS
const user = require("../models/user");

//RUTA DE PRUEBA
const probando = (req, res) =>{
    return res.status(200).send({
        status: "success",
        message: "Mensaje enviado desde: controllers/user.js"
    });
}

//REGISTRAR USUARIOS /////////////////////////////////////////////////////////////
const register = (req, res) =>{

    //Recoger los datos de la peticion

    //comprobar que me llegan bien

    //validar los datos

    //control usuarios duplicados

    //cifrar la contraseña

    //crear objeto del ususario

    //guardar usuario en la bbdd

    //limpiar el objeto a devolver

    //devolver un resultado
    return res.status(200).send({
        status: "success",
        message: "Usuario Registrado con exito"
    });
}

//EXPORTANDO LAS FUNCIONES DEL CONTROLADOR
module.exports = {
    probando,
    register
}
