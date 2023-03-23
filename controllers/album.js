

//RUTA DE PRUEBA
const probando = (req, res) =>{
    return res.status(200).send({
        status: "success",
        message: "Mensaje enviado desde: controllers/album.js"
    });
}

//EXPORTANDO LAS FUNCIONES DEL CONTROLADOR
module.exports = {
    probando
}
