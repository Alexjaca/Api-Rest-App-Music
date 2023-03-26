//IMPORTAR DEPENDENCIAS
const jwt = require("jwt-simple");
const moment = require("moment");

//IMPORTAR CLAVE SECRETA
const { secret } = require("../helpers/jwt");

//CREAR MIDDLEWARE (METODO O FUNCION)
exports.auth = (req, res, next) => {

    //CONPROBAR SI ME LLEGA LA CABECERA AUTH
    if (!req.headers.authorization) {
        return res.status(403).send({
            status: "error",
            message: "La peticion no tiene cabecera de Autorizacion"
        });
    }

    //LIMPIAR TOKEN de todo ' o "" que se repita de forma global y dejarlo vacio
    let token = req.headers.authorization.replace(/['"]+/g, '');

    try {
        //DECODIFICAR TOKEN
        let payload = jwt.decode(token, secret);

        //COMPROBAR AL EXPIRACION DEL TOKEN
        if(payload.exp <= moment().unix()){
            return res.status(401).send({
                status: "error",
                message: "Token Expirado"
            });
        }

        //AGREGAR DATOS DEL USUSARIO A LA REQUEST
        req.user = payload;

    } catch (error) {
        return res.status(404).send({
            status: "error",
            message: "Token Invalido",
            error
        });
    }


    //PASAR A LA EJECUCION DE LA ACCION
    next();

}

