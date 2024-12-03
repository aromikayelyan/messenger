import Sequelize from "sequelize"

const NAME = 'chat_data_base'
const USER = 'root'
const PASSWORD = '12345678'


const sequelize = new Sequelize(NAME, USER, PASSWORD, {
    host: 'localhost',
    dialect: 'mysql'
})



export default sequelize