//IMPORTAR MODELOS
const User = require("../models/user");

//IMPORTAR HELPERS
const validate = require("../helpers/validate");
const bcrypt = require("bcrypt");
const jwt = require("../helpers/jwt");

const fs = require("fs");
const path = require("path");





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


//ACTUALIZAR USUARIOS *******************************************************************************
const update = async (req, res) => {

    //recoger datos del usuario identificado
    let userIdentity = req.user;

    //recoger datos a actualizar
    let userToUpdate = req.body;

    //comprobar si el usuario existe
    try {

        await User.find({
            $or: [
                { email: userToUpdate.email.toLowerCase() },
                { nick: userToUpdate.nick.toLowerCase() }
            ]
        }).then(async (users) => {

            if (!users || users.length == 0) {
                return res.status(400).send({
                    status: "error",
                    message: "Error el Nick o email ingresados no existen en la bbdd"
                });
            }
            users.forEach(async (user) => {

                if (user._id != userIdentity.id) {

                    // si ya existe devuelvo una respuesta   
                    return res.status(404).send({
                        status: "error",
                        message: "Usuario ya existe en la BBDD"
                    });
                }

                //cifrar contraseña si me llegara y si no borrarla
                if (userToUpdate.password) {
                    let pwd = await bcrypt.hash(userToUpdate.password, 10);
                    userToUpdate.password = pwd;
                } else {
                    delete userToUpdate.password;
                }

                //buscar y actualizar
                try {
                    let userUpdated = await User.findByIdAndUpdate({ _id: userIdentity.id }, userToUpdate, { new: true });
                    if (!userUpdated) {
                        return res.status(400).send({
                            status: "error",
                            message: "Error al actualizar el ususario"
                        });
                    }
                    // devolver un resultado
                    return res.status(200).send({
                        status: "sucess",
                        message: "Usuario actualizado correctamente",
                        userIdentity,
                        userUpdated
                    });
                } catch (error) {
                    return res.status(400).send({
                        status: "error",
                        message: "Error al Intentar actualizar el ususario",
                        error
                    });
                }

            });

        });

    } catch (error) {
        return res.status(404).send({
            status: "error",
            message: "Error en la consulta de usuario en la BBDD",
            error
        });
    }
}


//SUBIDA MULTIMEDIA *******************************************************************************
const upload = async (req, res) => {

    //configuracion de subida (multer)

    //recoger fichero de imagen y comprobar si existe
    if (!req.file) {
        return res.status(400).send({
            status: "error",
            message: "Archivo multimedia vacio, por favor adjunte archivo"
        });
    }

    //conseguir el nombre del archivo
    let nameImage = req.file.originalname;

    //sacar info de la imagen
    const imageSplit = nameImage.split("\.");
    const extension = imageSplit[1];

    //Comprobar si la extension es valida
    if (extension != "jpg" && extension != "png" && extension != "jpeg" && extension != "gif") {
        fs.unlinkSync(req.file.path);
        return res.status(400).send({
            status: "error",
            message: "extension del Archivo Multimedia invalido"
        });
    }
    //si es correcto guardar la imagen en la bbdd
    try {
        const userUpsateImage = await User.findOneAndUpdate({ _id: req.user.id }, { image: req.file.filename }, { new: true });

        if (!userUpsateImage) {
            return res.status(400).send({
                status: "error",
                message: "Error al Intentar subir archivo multimedia"
            });
        }

        //Devolver Resultado
        return res.status(200).send({
            status: "success",
            message: "Archivo Multimedia subido correctamente",
            userUpsateImage
        });
    } catch (error) {
        return res.status(400).send({
            status: "error",
            message: "Error al subir multimedia",
            error
        });
    }
}


//SACAR AVATAR *******************************************************************************
const avatar = async (req, res) => {

    //sacar el parametro de la url
    const file = req.params.file;

    //Montar el path real de la imagen
    const filePath = "./uploads/multimedia/" + file;

    //Comprobar que existe el fichero
    fs.stat(filePath, (error, exist) =>{
        if(error || !exist){
            return res.status(400).send({
                status: "error",
                message: "Error al intentar buscar el archivo en la BBDD",
                error
            });
        }

        //Devolvemo el archivo
        return res.sendFile(path.resolve(filePath));

    });

}


//EXPORTANDO LAS FUNCIONES DEL CONTROLADOR
module.exports = {
    probando,
    register,
    login,
    profile,
    update,
    upload,
    avatar
}
