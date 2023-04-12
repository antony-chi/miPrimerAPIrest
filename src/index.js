//MVC
//Modelo -- las tablas de la base
//Vista -- donde el usuario final interactua por ej: el URL + el nombre del pokemon
//Controlador -- es el encargado de tratar la inf que el usuario envia a la api ej: encontrar el pokemon en la base
//Servicios --- es lo que permite usar la api desde otra api
// Modelo <--- vista -- Contralador Servicios <--- Framework MVC

//para compartir informacion en internet
//HTTP HyperTextTypedProtocol metodos de envio: GET, POST, PUT, DELETE
import express from 'express'



//se incluye la conexion a la base de datos
//ORM Object Relational Mapping
import { sequelize } from './database/database.js'
//Se incluyen las rutas
import rutas from './routes/primer.routes.js'

//funcion asincrona para espperar la conexion a la base
async function main(){
    try {
        await sequelize.authenticate()
        await sequelize.sync({force:false})
        console.log("Conexion exitosa")
    }catch (error) {
        console.log(error)
        return;
    }
    const app = express()
    //Vas a permitir que lleguen archivos JSON
    app.use(express.json())

    //Vas a permitar la llegada de datos desde la URL de manera segura
    app.use(express.urlencoded({extended:false}))

    //vas a usar estas rutas
    app.use(rutas)

    //inicializate
    app.listen(3000)

    //mensaje que muestra el servidor
    console.log("el servidor escucha en el puerto 3000")
        
}

main();


