import Sequelize from "sequelize";


export const sequelize = new Sequelize(
    "club_nautico", // Nombre de BD
    "postgres", // Usuario
    "12345", // password
    {
        host: "localhost",
        port: "5432",
        dialect: "postgres" //lla base de datos en la que se trabaja
    }
)