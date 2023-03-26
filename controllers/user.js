//IMPORTAR MODELOS
const User = require("../models/user");

//IMPORTAR HELPERS
const validate = require("../helpers/validate");
const bcrypt = require("bcrypt");
const jwt = require("../helpers/jwt");

//RUTA DE PRUEBA
const probando = (req, res) => {
    return res.status(200).send({
        status: "success",
        message: "Mensaje enviado desde: controllers/user.js"
    });
}

//REGISTRAR USUARIOS *******************************************************************************
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
            const pwd = await bcrypt.hash(params.password, 10);
            params.password = pwd;

            //crear objeto del ususario
            const newUser = new User(params);

            //guardar usuario en la bbdd
            try {
                const userSaved = await newUser.save();

                //limpiar el objeto a devolver
                const userCreated = userSaved.toObject();
                delete userCreated.password; //Eliminaodo el password para no mostrarlo
                delete userCreated.role; //Eliminaodo el role para no mostrarlo

                //Devolver Resultado
                return res.status(200).send({
                    status: "sucess",
                    message: "Usuario registrado con exito",
                    user: userCreated
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

//LOGIN DE USUARIOS *******************************************************************************
const login = (req, res) => {

    //recoger parametros del body
    const params = req.body;

    //comprobar que me legan los datos
    if (!params.email || !params.password) {
        return res.status(500).send({
            status: "error",
            message: "Faltan Datos por enviar"
        });
    }

    try {

        User.findOne({ email: params.email })
        .select("+password")
        .then(async (findUser) => {
            if (!findUser || findUser == null) {
                return res.status(500).send({
                    status: "error",
                    message: "Correo Invalido.."
                });
            }

            //comprobar que la contraseña sea correcta
            let pwd = await bcrypt.compareSync(params.password, findUser.password);

            if (!pwd) {
                return res.status(400).send({
                    status: "error",
                    message: "Contraseña Invalida"
                });
            }

            //Limpiar objetos
            let loginUser = findUser.toObject();
            delete loginUser.password;
            delete loginUser.role;

            //conseguir el token jwt (crear un servicio que permita crear el token)
            const token = jwt.createToken(findUser);

            //Devolver datos del usuasrio y el token


            return res.status(200).send({
                status: "sucess",
                message: "Usuario Logueado Correctamente",
                loginUser,
                token: token
            });


        });

    } catch (error) {
        return res.status(404).send({
            status: "error",
            error
        });
    }

}

//PERFIL DE USUARIOS *******************************************************************************
const profile = async (req, res) => {

    //recoger el del usuario por la ruta
    const id = req.params.id;

    //buscar el ususario en le BBDD
    try {
        await User.findById(id).then((user) => {

            // devolver un resultado
            return res.status(200).send({
                status: "sucess",
                message: "Perfil del Usuario",
                user,
                userIdentity: req.user
            });

        });
    } catch (error) {

        return res.status(404).send({
            status: "error",
            message: "Usuario no encontrado en la BBDD"
        });

    }

}



//EXPORTANDO LAS FUNCIONES DEL CONTROLADOR
module.exports = {
    probando,
    register,
    login,
    profile
}
