import Sequelize from "sequelize"
import sequelize from "../utils/connect.js"



const Chat = sequelize.define('Chat', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: Sequelize.INTEGER
    },
    senderuid: {
        type: Sequelize.STRING,
        allowNull: false
    },
    message: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    images: {
        type: Sequelize.STRING,
        allowNull: true
    },
    roomuid:{
        type: Sequelize.TEXT,
        allowNull: false
    },
})


export default Chat