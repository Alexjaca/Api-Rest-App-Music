//IMPORTAR MODELOS
const User = require("../models/user");

//IMPORTAR HELPERS
const validate = require("../helpers/validate");
const bcrypt = require("bcrypt");

//RUTA DE PRUEBA
const probando = (req, res) => {
    return res.status(200).send({
        status: "success",
        message: "Mensaje enviado desde: controllers/user.js"
    });
}

//REGISTRAR USUARIOS /////////////////////////////////////////////////////////////
const register = async (req, res) => {

    //Recoger los datos de la peticion
    const params = req.body;

    //comprobar que me llegan bien
    if (!params.name || !params.nick || !params.email || !params.password) {
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

    try {
        const findUser = await User.find({
            $or: [
                { email: params.email.toLowerCase() }, //Validando que no exista otro email en la bd igual
                { nick: params.nick.toLowerCase() }, //Validando que no exista otro nick en la bd igual
            ],
        });

        if (findUser.length >= 1) {
            return res.status(400).send({
                status: "Error",
                message: "El usuario ya existe",
            });
        } else {
            //cifrar la contraseña
            const pwd =  await bcrypt.hash(params.password, 10);
            params.password = pwd;

            //crear objeto del ususario
            const newUser = new User(params);

            //guardar usuario en la bbdd
            try {
                const userSaved = await newUser.save();

                //limpiar el objeto a devolver

                //Devolver Resultado
                return res.status(200).send({
                    status: "sucess",
                    message: "Usuario registrado con exito",
                    user: userSaved
                });

            } catch (error) {
                return res.status(400).send({
                    status: "error",
                    message: "No se pudo registrar el usuario",
                    error
                });
            }
        }

    } catch (error) {
        console.log(error);
        throw new Error("Error al consultar si el usuatrio existe en la BBDD");

    }

}

//EXPORTANDO LAS FUNCIONES DEL CONTROLADOR
module.exports = {
    probando,
    register
}
