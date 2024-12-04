import Sequelize from "sequelize"
import dotenv from 'dotenv'

dotenv.config()

const NAME = process.env.DB_NAME
const USER = process.env.DB_USER
const PASSWORD = process.env.DB_PASSWORD
const host = process.env.DB_HOST


const sequelize = new Sequelize(NAME, USER, PASSWORD, {
    host,
    dialect: 'mysql'
})



export default sequelize