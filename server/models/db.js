const {Sequelize} = require("sequelize") 

module.exports= new Sequelize(
    'IndFilm',
    'postgres',
    'root',
    {
        dialect: 'postgres',
        host: 'localhost',
        port: 5432,
        logging: false
    }
)


