import Chat from "../models/chat_model.js"
import Room from "../models/room_model.js"
import User from "../models/user_model.js"

import { Op } from 'sequelize'



export async function CreateChatWithImage(senderuid, message,images,roomuid){
    const chat = await Chat.create({
        senderuid,
        message,
        images,
        roomuid
    })
    return chat
}

export async function CreateChat(senderuid, message,roomuid){
    const chat = await Chat.create({
        senderuid,
        message,
        roomuid
    })
    return chat
}

export async function ExisRoom(senderuid, candidate) {
    const isRoom = await Room.findOne({
        where: {
            [Op.or]: [
                { user1_uid: senderuid, user2_uid: candidate.uid },
                { user1_uid: candidate.uid, user2_uid: senderuid },
            ],
        },
    })
    return isRoom
}


export async function Roomsfunc(ownerRooms, participantRooms) {

    const data1 = await Promise.all(
        ownerRooms.map(async (element) => {
            const otheruser = await User.findOne({ where: { uid: element.user2_uid } })
            const username = otheruser.dataValues.username
            const userimage = otheruser.dataValues.images
            return { ...element, username, userimage }
        })
    )

    const data2 = await Promise.all(
        participantRooms.map(async (element) => {
            const otheruser = await User.findOne({ where: { uid: element.user1_uid } })
            const username = otheruser.dataValues.username
            const userimage = otheruser.dataValues.images
            return { ...element, username, userimage }
        })
    )

    return [...data1, ...data2]
}
