import { Router } from "express"
import Chat from "../models/chat_model.js"
import Room from "../models/room_model.js"
import { v4 as uuidv4 } from "uuid"
import { chekauth } from "../middleware/middlewares.js"
import { Op, where } from 'sequelize';
import User from "../models/user_model.js"
const router = Router()



router.get('/:username', chekauth, async (req, res) => {
    try {
        const candidate = await User.findOne({ where: { username: req.params.username } })
        if (!candidate) {
            return res.status(501).json({ message: 'user not faund' })
        }
        const candidate_Uid = candidate.uid

        const exisRoom = await Room.findOne({
            where: {
                [Op.or]: [
                    { user1_uid: req.session.user.uid, user2_uid: candidate_Uid },
                    { user1_uid: candidate_Uid, user2_uid: req.session.user.uid },
                ],
            },
        })

        if (exisRoom) {
            const chat = await Chat.findAll({ where: { roomuid: exisRoom.uid } })
            return res.status(200).json(chat)
        } else {
            return res.status(200).json({ message: "room is not defined" })
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({ message: 'error, try again' })
    }
})

router.get('/', chekauth, async (req, res) => {
    try {
        const exisRoom = await Room.findAll({
            where: {
                [Op.or]: [
                    { user1_uid: req.session.user.uid },
                    { user2_uid: req.session.user.uid },
                ],
            },
        })


        if (exisRoom) {
            console.log("in")

            const ownerRooms = await Room.findAll({
                where: { user1_uid: req.session.user.uid },
            })
            const participantRooms = await Room.findAll({
                where: { user2_uid: req.session.user.uid },
            })


            if (ownerRooms) {
                if (ownerRooms[0].user1_uid === req.session.user.uid) {
                    const data1 = await Promise.all(
                        ownerRooms.map(async (element) => {
                            const otheruser = await User.findOne({ where: { uid: element["dataValues"].user2_uid } })
                            const username = otheruser["dataValues"].username
                            const userimage = otheruser["dataValues"].image
                            return { ...element["dataValues"], username, userimage }
                        })
                    )
                    if (participantRooms) {
                        if (participantRooms[0].user2_uid === req.session.user.uid) {
                            const data2 = await Promise.all(
                                participantRooms.map(async (element) => {
                                    const otheruser = await User.findOne({ where: { uid: element["dataValues"].user1_uid } })
                                    const username = otheruser["dataValues"].username
                                    const userimage = otheruser["dataValues"].image
                                    return { ...element["dataValues"], username, userimage }
                                })
                            )
                            return res.status(200).json({data1,data2})
                        }
                    }
                        return res.status(200).json({data1})
                }
            }

            res.status(200).json({ message: "nothing get" })

        }
    } catch (e) {
        console.log(e)
        res.status(500).json({ message: 'error, try again' })
    }
})


router.post('/:username', chekauth, async (req, res) => {
    try {
        const candidate = await User.findOne({ where: { username: req.params.username } })
        if (!candidate) {
            return res.status(501).json({ message: 'user not faund' })
        }
        const candidate_Uid = candidate.uid
        const exisRoom = await Room.findOne({
            where: {
                [Op.or]: [
                    { user1_uid: req.session.user.uid, user2_uid: candidate_Uid },
                    { user1_uid: candidate_Uid, user2_uid: req.session.user.uid },
                ],
            },
        });

        if (exisRoom) {
            const roomuid = exisRoom.uid
            const chat = await Chat.create({

                senderuid: req.session.user.uid,
                message: req.body.message,
                images: 'someimages',
                roomuid
            })
            return res.status(200).json(chat)

        } else {
            const new_room = await Room.create({
                uid: uuidv4(),
                user1_uid: req.session.user.uid,
                user2_uid: candidate.uid
            })

            const room_uid = new_room.uid
            const chat = await Chat.create({

                senderuid: req.session.user.uid,
                message: req.body.message,
                images: 'someimages',
                roomuid: room_uid
            })
            return res.status(200).json(chat)
        }

    } catch (e) {
        console.log(e)
        res.status(500).json({ message: 'error, try again' })
    }
})




export default router
