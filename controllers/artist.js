//IMPORTAR MODELO
const Artist = require("../models/artist");


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





//EXPORTANDO LAS FUNCIONES DEL CONTROLADOR
module.exports = {
    probando,
    save
}
