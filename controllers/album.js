//MODELS
const Album = require("../models/album");
const Artist = require("../models/artist");
const Song = require("../models/song");

//IMPORTAR DEPENDENCIAS
const fs = require("fs");
const path = require("path");

//RUTA DE PRUEBA
const probando = (req, res) => {
    return res.status(200).send({
        status: "success",
        message: "Mensaje enviado desde: controllers/album.js"
    });
}


//GUARDAR ALBUM**********************************************************
const save = async (req, res) => {

    //Recoger datos del body
    const params = req.body;

    //Crear Objeto
    let newAlbum = new Album(params);

    //guardar Album en la BBDD
    try {
        const saveAlbum = await newAlbum.save();

        //Devolver resultado
        return res.status(200).send({
            status: "success",
            message: "Album guardado correctamente",
            album: saveAlbum
        });

    } catch (error) {
        return res.status(404).send({
            status: "error",
            message: "Error al intentar Guardar el Album",
            error
        });
    }
}


//SACAR ALBUM**********************************************************
const one = async (req, res) => {
    //sacar id del album
    const albumId = req.params.id;

    //find y popuilar info del artista
    try {
        const album = await Album.findById(albumId).populate("artist");

        //devolver respuesta
        return res.status(200).send({
            status: "success",
            album
        });

    } catch (error) {
        return res.status(404).send({
            status: "error",
            message: "Error al buscar el album",
            error
        });
    }
}


//SACAR ALBUMS DE ARTISTA**********************************************************
const list = async (req, res) => {

    //sacar id del artista
    const artistId = req.params.artistId;

    if (!artistId) {
        return res.status(404).send({
            status: "error",
            message: "Error debe Enviar el id del artista"
        });
    }

    //sacar los albuns del artista en la bbdd
    try {
        const album = await Album.find({ artist: artistId }).select("-artist");
        const artist = await Artist.findById(artistId);

        //devolver un resultado
        return res.status(200).send({
            status: "success",
            artist,
            albums: album
        });
    } catch (error) {
        return res.status(404).send({
            status: "error",
            message: "Error al intentar buscar un album",
            error
        });
    }
}


//ACTUALIZAR ALBUMS**********************************************************
const update = async (req, res) => {
    //recoger paramas por la url
    const albumId = req.params.albumId;

    //recoger el body
    const params = req.body;

    //find y un update
    try {
        const albumUpdated = await Album.findByIdAndUpdate(albumId, params, { new: true });

        //devolvemos resultado
        return res.status(200).send({
            status: "success",
            message: "Albun actualizado correctamente",
            albumUpdated
        });
    } catch (error) {
        return res.status(404).send({
            status: "error",
            message: "Error al intentar actualizar el album",
            error
        });
    }
}


//SUBIDA MULTIMEDIA *******************************************************************************
const upload = async (req, res) => {

    //configuracion de subida (multer)
    let albumId = req.params.id;

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
        const albumUpdateImage = await Album.findOneAndUpdate({ _id: albumId }, { image: req.file.filename }, { new: true });

        if (!albumUpdateImage) {
            return res.status(400).send({
                status: "error",
                message: "Error al Intentar subir archivo multimedia"
            });
        }

        //Devolver Resultado
        return res.status(200).send({
            status: "success",
            message: "Archivo Multimedia subido correctamente",
            album: albumUpdateImage
        });
    } catch (error) {
        return res.status(400).send({
            status: "error",
            message: "Error al subir multimedia",
            error
        });
    }
}


//SACAR ARTIST *******************************************************************************
const image = async (req, res) => {

    //sacar el parametro de la url
    const file = req.params.file;

    //Montar el path real de la imagen
    const filePath = "./uploads/albums/" + file;

    //Comprobar que existe el fichero
    fs.stat(filePath, (error, exist) => {
        if (error || !exist) {
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


//ELIMINAR ALBUMS *************************************************************************
const remove = async (req, res) => {
    //Recoger id del artista desde la url
    const albumId = req.params.id;

    //consultar y eliminar al artista
    try {

        //consultando albun para recorrer cuantos tiene
        const albumsRemoved = await Album.findById(albumId).populate("artist");

        //consultando todas las canciones del album 
        const songsRemoved = await Song.find({ album: albumId });

        songsRemoved.forEach(async (file) => { //eliminando archivos de musica en el servidor
            const nameFile = file.file;
            console.log(nameFile);
            const filePath = "./uploads/songs/" + nameFile;
            fs.unlinkSync(filePath);  //eliminando archivo
        });

        //Eliminando los detalles de las canciones
        await Song.deleteMany({ album: albumId }); //eliminando canciones

        //Eliminando Albunes del Artista
        await albumsRemoved.deleteOne({ _id: albumId }); //eliminando albunes


        //devolver el resultado
        res.status(200).send({
            status: "success",
            message: "Album eliminado con exito",
            AlbunDeleted: albumsRemoved,
            SongsDeleted: songsRemoved
        });
    } catch (error) {
        res.status(404).send({
            status: "error",
            message: "Error al intentar eliminar el artista",
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
    upload,
    image,
    remove
}
