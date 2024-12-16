import express, { urlencoded } from 'express'
import { variable } from './middleware/middlewares.js'
import sequelize from "./utils/connect.js"
import session from 'express-session'
import multer from 'multer'
import cors from 'cors'
import dotenv from 'dotenv'
import registerValidation from './validation/validator.js'
import User from './models/user_model.js'
import Room from './models/room_model.js'
import room from './routes/roomroute.js'
import auth from './routes/auth.js'

dotenv.config()


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Папка для сохранения файлов
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = `${uuidv4()}${path.extname(file.originalname)}`
      cb(null, uniqueSuffix);
    }
  });
const upload = multer({ storage: storage})

const PORT =process.env.PORT || 4601
const secret = process.env.SESSION_SECRET || 'secret'

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())
app.use(session({
    secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // Время жизни куки (в данном случае — 1 день)
        secure: false, // Устанавливать true, если используешь HTTPS
        httpOnly: true, // Защита от XSS, куки доступны только через HTTP (не JavaScript)
    }
}))
app.use(variable)




app.use('/room', room)
app.use('/auth',registerValidation, auth)



async function start(){
    try {
        await sequelize.sync()
        app.listen(PORT,()=>{
            console.log(`server run on port ${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }
}



start()


