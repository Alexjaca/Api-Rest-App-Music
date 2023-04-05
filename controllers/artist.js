//IMPORTAR MODELO
const Artist = require("../models/artist");
const Album = require("../models/album");
const Song = require("../models/song");

//
const pagination = require("mongoose-pagination");


const fs = require("fs");
const path = require("path");

//RUTA DE PRUEBA
const probando = (req, res) => {
    return res.status(200).send({
        status: "success",
        message: "Mensaje enviado desde: controllers/artist.js"
    });
}


//GUARDAR ARTISTA *************************************************************************
const save = async (req, res) => {
    //Recoger los parametros del body
    const params = req.body;
    let name = params.name.toLowerCase();
    params.name = name;

    //Crear el objeto a guardar
    let artist = new Artist(params);


    //Guardar el objeto
    if (!artist.name) {
        res.status(400).send({
            status: "error",
            message: "No se ha guardado el Artista debe ingresar el nombre"
        });
    } else {
        try {

            const artisFind = await Artist.findOne({ name: artist.name.toLowerCase() });

            if (artisFind) {
                res.status(400).send({
                    status: "error",
                    message: "Este artista ya se encuentra registrado en la BBDD"
                });
            } else {

                let artistStored = await artist.save(artist);

                //Devolver resultado
                res.status(200).send({
                    status: "success",
                    message: "Artista registrado correctamente",
                    artistStored
                });

            }

        } catch (error) {
            res.status(404).send({
                status: "error",
                message: "Error al Intentar guardar el Artista",
                error
            });
        }
    }

}


//SACAR ARTISTA *************************************************************************
const one = async (req, res) => {
    //sacar parametros de la url
    const id = req.params.id;

    //find
    try {
        await Artist.findById(id).then((artist) => {
            res.status(200).send({
                status: "success",
                artist
            });
        });
    } catch (error) {
        res.status(404).send({
            status: "error",
            message: "Error al buscar el artista",
            error
        });
    }
}

//LISTAR ARTISTAS *************************************************************************
const list = async (req, res) => {

    //recibir pagina si existe
    let page = 1;

    if (req.params.page) {
        page = req.params.page;
    }

    //definir numero de items por pagina
    const itemsPerPage = 2;

    //hacer Find, ordenar y paginar
    try {
        let findArtists = await Artist.find();
        let total = findArtists.length; //guardando longitud de consulta

        let skip = (page - 1) * itemsPerPage; //saldo de la pagina para la paginacion
        await Artist.find().sort("name").skip(skip).limit(itemsPerPage).then((artists) => {

            res.status(200).send({
                status: "success",
                artists,
                page,
                itemsPerPage,
                total,
                pages: Math.ceil(total / itemsPerPage)
            });
        });

    } catch (error) {
        res.status(404).send({
            status: "error",
            message: "Error al buscar listado de artistas",
            error
        })
    }

}


//EDITAR ARTISTAS *************************************************************************
const update = async (req, res) => {

    //Recogemos el id del artista a actualizar
    const artistId = req.params.id;

    //Recogemos los parametros a actualizar de dicho artista
    const params = req.body;

    //consultamos quue exista el artista y actualizamos
    try {
        const updateArtist = await Artist.findByIdAndUpdate(artistId, params, { new: true });
        if (!updateArtist || updateArtist == '') {
            res.status(404).send({
                status: "error",
                message: "Error el Artista no existe"
            })
        }
        //Devolvemos respuesta
        res.status(200).send({
            status: "success",
            message: "Artista actualizado con exito",
            updateArtist
        });

    } catch (error) {
        res.status(404).send({
            status: "error",
            message: "Error al intentar editar el artista",
            error
        });
    }
}


//ELIMINAR ARTISTAS *************************************************************************
const remove = async (req, res) => {
    //Recoger id del artista desde la url
    const artistId = req.params.id;

    //consultar y eliminar al artista
    try {
        //Eliminando elArtista de la BBDD
        const artistRemoved = await Artist.findByIdAndDelete(artistId);

        //consultando albunes para recorrer cuantos tiene
        const albumsRemoved = await Album.find({ artist: artistId });

        //recorriendo los albunes del artista
        albumsRemoved.forEach(async (album) => {
            //remove songs
            const deleteFile = await Song.find({ album: album._id });
            deleteFile.forEach(async (file) => { //eliminando archivos de musica en el servidor
                const nameFile = file.file;
                const filePath = "./uploads/songs/" + nameFile;
                fs.unlinkSync(filePath);  //eliminando archivo
            });

            //Eliminando los detalles de las canciones
            const songsRemoved = await Song.deleteMany({album: album._id}); //eliminando canciones

            //Eliminando Albunes del Artista
            album.deleteOne({artist: artistId}); //eliminando albunes
        });

        //devolver el resultado
        res.status(200).send({
            status: "success",
            message: "Artista eliminado con exito",
            artistRemoved
        });
    } catch (error) {
        res.status(404).send({
            status: "error",
            message: "Error al intentar eliminar el artista",
            error
        });
    }
}


//SUBIDA MULTIMEDIA *******************************************************************************
const upload = async (req, res) => {

    //configuracion de subida (multer)


    let artisId = req.params.id;

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
        const artistUpdateImage = await Artist.findOneAndUpdate({ _id: artisId }, { image: req.file.filename }, { new: true });

        if (!artistUpdateImage) {
            return res.status(400).send({
                status: "error",
                message: "Error al Intentar subir archivo multimedia"
            });
        }

        //Devolver Resultado
        return res.status(200).send({
            status: "success",
            message: "Archivo Multimedia subido correctamente",
            artistUpdateImage
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
    const filePath = "./uploads/artists/" + file;

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





//EXPORTANDO LAS FUNCIONES DEL CONTROLADOR
module.exports = {
    probando,
    save,
    one,
    list,
    update,
    remove,
    upload,
    image
}
