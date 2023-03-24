const validator = require("validator");

const validate = (params) => {

    let esValido = false;

    let name = !validator.isEmpty(params.name) &&
        validator.isLength(params.name, { min: 3, max: undefined }) &&
        validator.isAlpha(params.name, "es-ES");

    let nick = !validator.isEmpty(params.nick) &&
        validator.isLength(params.nick, { min: 3, max: 60 });

    let email = !validator.isEmpty(params.email) &&
        validator.isEmail(params.email);

    let password = !validator.isEmpty(params.password);

    if(params.surname){
        let surname = !validator.isEmpty(params.surname) &&
        validator.isLength(params.surname, { min: 3, max: undefined }) &&
        validator.isAlpha(params.surname, "es-ES");

        if(!surname){
            throw new Error("No se ha superado la Validacion por apellido invalido");
        }else{
            console.log("Validacion superada en el Apellido");
        }
    }

    if(!name || !nick || !email || !password){
        throw new Error("No se ha superado la Validacion");
    }else{
        console.log("Validacion superada con exito");
        esValido = true;
    }

    return esValido;
}

module.exports = validate;