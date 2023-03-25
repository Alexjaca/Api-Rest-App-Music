//IMPORTAR DEPENDENCIAS
const jwt = require("jwt-simple");
const moment = require("moment");

//CREAR CLAVE SECRETA
const secret = "API_SECRET_APP_MUSIC_Alex_112544548163333_IronMaIden";

//CREAR FUNCION PARA GENERAR TOKEN
const createToken = (user) =>{

    const payload = {
        name: user._id,
        surname: user.surname,
        nick: user.nick,
        email: user.email,
        password: user.password,
        role: user.role,
        image: user.image,
        create_at: user.create_at,
        iat: moment().unix(),
        exp: moment().add(30, "days").unix()
    }

    //devolver token
    return jwt.encode(payload, secret);
}


//EXPORTAR MODULO
module.exports = {
    secret,
    createToken
}