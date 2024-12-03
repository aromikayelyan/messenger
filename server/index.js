import express, { urlencoded } from 'express'
import sequelize from "./utils/connect.js"
import session from 'express-session'
import cors from 'cors'
import User from './models/user_model.js'
import Room from './models/room_model.js'
import Chat from './models/chat_model.js'
import chat from './routes/chatroute.js'
import room from './routes/roomroute.js'
import auth from './routes/auth.js'

import { variable } from './middleware/middlewares.js'


const PORT = process.env.PORT || 4601

const app = express()


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // Время жизни куки (в данном случае — 1 день)
        secure: false, // Устанавливать true, если используешь HTTPS
        httpOnly: true, // Защита от XSS, куки доступны только через HTTP (не JavaScript)
    }
}))
app.use(variable)


app.use('/chat', chat)
app.use('/room', room)
app.use('/auth', auth)



async function start(){
    try {
        await sequelize.sync()
        app.listen(PORT, ()=>{
            console.log(`server run on port ${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }
}



start()

