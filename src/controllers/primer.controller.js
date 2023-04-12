//impportamos modelo y conexion de base de datos
import modelosInit from '../models/init-models.js'
import { sequelize } from '../database/database.js'
import bitacoras from '../models/bitacoras.js'
//inicializamos 
let models = modelosInit(sequelize)

export const hola = (req,res) => {
    let {nombre} = req.params
    res.status(200).json("Hola "+nombre)
}

export const hola2 = async (req,res) => {
    let respose = await models.bitacoras.findAll() //encuentra todos
    res.status(200).json(respose)
}

export const envioJson = (req,res) => {
    let cuerpo = req.body
    console.log(req.headers.authorization)
    cuerpo.passwoord = ""
    cuerpo.registro = "Registro 2"
    let respuesta = {
        "Animal": "perro",
        "Animal": "gato"
    }
    cuerpo.mascotas = respuesta
    res.status(200).json(cuerpo)
}

//backend de club_nautico
//obtener todos los socios

export const getSocios = async (req,res) => {
    let response;
    try {
        response = await models.socios.findAll({
            attributes : {exclude : ["edad"]},
            include: {
                model:models.barcos,
                as: "barcos",
                attributes : {exclude : ["id_barco","socio_id"]},
                include: {
                    model: models.bitacoras,
                    as: "bitacoras",
                    attributes : {exclude : ["id_bitacora", "barco_id", "patron_id"]},
                    include: {
                        model: models.patron,
                        as: "patron",
                        attributes : {exclude : ["id_patron"]}
                    }
                }
            }
        }) //encuentra todos
    } catch (error) {
        console.log("Hubo un error: "+error)
        res.status(500).json({"Error": "Hubo un error, " + error})
        return;
    }
    res.status(200).json(response)
}

//575239802 Encontrar eo socio por su telefono

export const getSociosTelefono = async (req,res) => {
    let {telefono} = req.params
    let response;
    if(isNaN(telefono)){
        res.status(404).json({
            "Estatus": telefono + " No es un numero, ingresa un numero"
        })
    }
    try {
        response = await models.socios.findAll({
            where: {telefono: telefono}
        }) //encuentra al socio por su telefono

        if(response.length == 0){
            res.status(200).json({
                "Estatus": "No se encontro el registro en la base"
            })
            return;
        }
        console.log(response.length)

    } catch (error) {
        console.log("Hubo un error: "+error)
        res.status(500).json({"Error": "Hubo un error, " + error})
        return;
    }
    res.status(200).json(response)
}

//create socio 

export const createSocio = async (req,res) => {
    let {nombre, apellido, telefono, edad, email} = req.body
    let response;
    let aux;
    try {

        aux = await models.socios.findAll({
            where: {email}
        })

        if(aux.length > 0){
            res.status(406).json({
                "Estatus": "Este email ya se encuentra registrado"
            })
            return;
        }

        response = await models.socios.create({
            nombre,
            apellido,
            telefono,
            edad,
            email
        }) 
    } catch (error) {
        console.log("Hubo un error: "+error)
        res.status(500).json({"Error": "Hubo un error, " + error})
        return;
    }
    res.status(201).json(response)
}

//update actualizar socio

export const updateSocio = async (req,res) => {
    let {nombre, apellido, telefono, edad, email} = req.body

    let socio;
    try {

        socio = await models.socios.findOne({
            where: {email}
        })
        
        socio.nombre = nombre
        socio.apellido = apellido
        socio.telefono = telefono
        socio.edad = edad

        await socio.save()
    } catch (error) {
        console.log("Hubo un error: "+error)
        res.status(500).json({"Error": "Hubo un error, " + error})
        return;
    }
    res.status(202).json(socio)
}

//delete eliminar socio
export const deleteSocio = async (req,res) => {
    let {email} = req.params
    let socio;
    try {

        socio = await models.socios.destroy({
            where: {email}
        })
        console.log("Se elimino el " + email)

 
    } catch (error) {
        console.log("Hubo un error: "+error)
        res.status(500).json({"Error": "Hubo un error, " + error})
        return;
    }
    res.status(202).json(socio)
}

//get Obtener todos los barcos


export const getBarcos = async (req,res) => {
    let response;
    try {
        response = await models.barcos.findAll({
           
        }) //encuentra todos
    } catch (error) {
        console.log("Hubo un error: "+error)
        res.status(500).json({"Error": "Hubo un error, " + error})
        return;
    }
    res.status(200).json(response)
}

//
export const createBitacora = async (req,res) => {
    let {tiempo_salida, fecha_salida, barco_id, patron_id} = req.body
    let response;
    let aux;
    try {
        //TIEMPO SALIDA USAR "0023-03-22T12:30:00.000Z" FIJARSE EN LA T Y LA Z ALFINAL
        aux = await models.bitacoras.findAll({
            where: {barco_id,fecha_salida},
        })
        if(aux.length >=2){
            res.status(401).json({
                "Estatus": "El barco no puede salir mas de dos veces "
            })
            return;
        }

        response = await models.bitacoras.create({
            tiempo_salida,
            fecha_salida,
            barco_id,
            patron_id
        })

    } catch (error) {
        console.log("Hubo un error: "+error)
        res.status(500).json({"Error": "Hubo un error, " + error})
        return;
    }
    res.status(201).json(response)
}