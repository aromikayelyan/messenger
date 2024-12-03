import Sequelize from "sequelize"
import sequelize from "../utils/connect.js"



const User = sequelize.define('User', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: Sequelize.INTEGER
    },
    username:{
        type: Sequelize.STRING,
        allowNull: false
    },
    uid: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password:{
        type: Sequelize.STRING,
        allowNull: false
    },
    images: {
        type: Sequelize.STRING,
        allowNull: true
    }
})


export default User