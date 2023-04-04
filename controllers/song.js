//MODELS
const Song = require("../models/song");

//RUTA DE PRUEBA
const probando = (req, res) => {
    return res.status(200).send({
        status: "success",
        message: "Mensaje enviado desde: controllers/song.js"
    });
}

//GUARDAR CANCION ********************************************************
const save = async(req, res) => {

    //recoger los datos que llegan
    const params = req.body;

    //Crear un objeto del modelo
    const song = new Song(params);

    try {

        const saveSong = await song.save();

        //Guardado
        return res.status(200).send({
            status: "success",
            message: "Cancion Guardada correctamente",
            saveSong
        });
    } catch (error) {
        return res.status(404).send({
            status: "error",
            message: "Error al intentar guardar la cancion",
            error
        });
    }
}



//EXPORTANDO LAS FUNCIONES DEL CONTROLADOR
module.exports = {
    probando,
    save
}
