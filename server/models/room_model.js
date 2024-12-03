import Sequelize from "sequelize"
import sequelize from "../utils/connect.js"



const Room = sequelize.define('Room', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: Sequelize.INTEGER
    },
    uid: {
        type: Sequelize.STRING,
        allowNull: false
    },
    user1_uid: {
        type: Sequelize.STRING,
        allowNull: false
    },
    user2_uid: {
        type: Sequelize.STRING,
        allowNull: false
    }
})


export default Room