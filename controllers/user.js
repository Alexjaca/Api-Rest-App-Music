//IMPORTAR MODELOS
const user = require("../models/user");

//IMPORTAR HELPERS
const validate = require("../helpers/validate");

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
    const params = req.body;

    //comprobar que me llegan bien
    if(!params.name || !params.nick || !params.email || !params.password){
        return res.status(400).send({
            status: "error",
            message: "Faltan datos por ingresar"
        });
    }

    //validar los datos
    try {
        validate(params);
    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: "Error en la Validacion de los campos del registro de usuarios"
        });
    }

    //control usuarios duplicados

    //cifrar la contraseña

    //crear objeto del ususario

    //guardar usuario en la bbdd

    //limpiar el objeto a devolver

    //devolver un resultado
    return res.status(200).send({
        status: "success",
        message: "Usuario Registrado con exito",
        params
    });
}

//EXPORTANDO LAS FUNCIONES DEL CONTROLADOR
module.exports = {
    probando,
    register
}
