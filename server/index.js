const express = require("express")
require('dotenv').config()
const cors = require("cors");
const sequelize = require('./models/db')
const fileUpload = require("express-fileupload");
const path = require('path')
const router = require('./routes/index')
const App = express();

const PORT = process.env.PORT
App.use(cors())
App.use(express.static(__dirname + "/public"));
//App.use(corsMiddleware)

// App.use(cookieParser())
App.use(express.json())
App.use(fileUpload({
    useTempFiles : true,
    tempFileDir : path.resolve('temp')
}))


App.use('/api',router)

async function StartServer(){
    try {
        await sequelize.authenticate()
        await sequelize.sync({ alter: true })
        App.listen(PORT,()=>{   
            console.log("Server started on port ", PORT)
        })
    } catch (error) {
        console.log(error)
    }
}
StartServer();
