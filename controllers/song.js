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
const save = async (req, res) => {

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


//SACAR CANCION ********************************************************
const one = async (req, res) => {

    const songId = req.params.id;

    try {
        const findSong = await Song.findById(songId).populate("album");

        return res.status(200).send({
            status: "success",
            song: findSong
        });
    } catch (error) {
        return res.status(404).send({
            status: "error",
            message: "Error al intentar buscar la cancion",
            error
        });
    }
}


//LISTADO CANCIONES ********************************************************
const list = async (req, res) => {
    //recoger id del album
    const albumId = req.params.albumId;

    //find 
    try {
        const findSongs = await Song.find({ album: albumId })
            .populate({
                path: "album", //PUPULATES
                populate: { path: "artist", model: "Artist" }
            })
            .sort("track");

        return res.status(200).send({
            status: "success",
            songs: findSongs
        });

    } catch (error) {
        return res.status(404).send({
            status: "error",
            message: "Error al buscar las canciones",
            error
        });
    }
}


//ACTUALIZAR CANCION ********************************************************
const update = async (req, res) => {
    //recoger el id de la cancion
    const songId = req.params.songId;

    //datos para guardar
    const data = req.body;

    //busqueda y actualizacion
    try {
        const updateSong = await Song.findByIdAndUpdate(songId, data, { new: true });

        //devolver resultado
        return res.status(200).send({
            status: "success",
            message: "La cancion fue Actualizada correctamente",
            songUpdated: updateSong
        });

    } catch (error) {
        return res.status(404).send({
            status: "error",
            message: "Error al Actualizar la cancion",
            error
        });
    }
}


//BORRAR CANCION ********************************************************
const remove = async(req, res) => {
    const songId = req.params.songId;

    try {
        deleteSong = await Song.findByIdAndRemove(songId);

        if(!deleteSong || deleteSong.length == 0){
            return res.status(400).send({
                status: "error",
                message: "Error La cancion a Eliminar no existe en la BBDD o ya fue eliminada"
            });
        }

        //devolver resultado
        return res.status(200).send({
            status: "success",
            message: "La cancion fue Eliminada correctamente",
            songDeleted: deleteSong
        });
    } catch (error) {
        return res.status(404).send({
            status: "error",
            message: "Error al Eliminar la cancion",
            error
        });
    }

}


//EXPORTANDO LAS FUNCIONES DEL CONTROLADOR
module.exports = {
    probando,
    save,
    one,
    list,
    update,
    remove
}
