//IMPORTAR MODELO
const Artist = require("../models/artist");

//
const pagination = require("mongoose-pagination");
const paginatev2 = require("mongoose-paginate-v2");

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
const list = async(req, res) => {

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
        await Artist.find().sort("name").skip(skip).limit(itemsPerPage).then((artists)=>{
                      
                res.status(200).send({
                    status: "success",
                    artists,
                    page,
                    itemsPerPage,
                    total,
                    pages: Math.ceil(total/itemsPerPage)
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


//EXPORTANDO LAS FUNCIONES DEL CONTROLADOR
module.exports = {
    probando,
    save,
    one,
    list
}
