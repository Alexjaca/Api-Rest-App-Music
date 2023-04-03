const Album = require("../models/album");

//RUTA DE PRUEBA
const probando = (req, res) => {
    return res.status(200).send({
        status: "success",
        message: "Mensaje enviado desde: controllers/album.js"
    });
}


//GUARDAR ALBUM**********************************************************
const save = async(req, res) => {

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



//EXPORTANDO LAS FUNCIONES DEL CONTROLADOR
module.exports = {
    probando,
    save
}
