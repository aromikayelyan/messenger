import { Router } from "express"
import { v4 as uuidv4 } from "uuid"
import { chekauth } from "../middleware/middlewares.js"
import { Op, where } from 'sequelize'
import multer from 'multer'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import path from "path"
import fs from 'fs'
import Chat from "../models/chat_model.js"
import Room from "../models/room_model.js"
import User from "../models/user_model.js"
import { CreateChatWithImage, CreateChat, ExisRoom, Roomsfunc } from "../utils/utilsfunctions.js"


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)

const router = Router()


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = `${uuidv4()}${path.extname(file.originalname)}`
        cb(null, uniqueSuffix)
    }
})
const upload = multer({ storage: storage })


router.get('/:username', chekauth, async (req, res) => {
    try {

        const candidate = await User.findOne({ where: { username: req.params.username } })
        const senderuid = req.session.user.uid

        if (!candidate) {
            return res.status(501).json({ message: 'user not faund' })
        }
        const exisRoom = await ExisRoom(senderuid, candidate)

        if (exisRoom) {
            const chat = await Chat.findAll({ where: { roomuid: exisRoom.uid } })
            console.log(chat, exisRoom.uid)
            for (let i = 0; i < chat.length; i++) {
                if (!chat[i].images) {
                    continue
                } else {
                    if (chat[i].images[0] == '[') {
                        const imagename = JSON.parse(chat[i].images)
                        for (let j = 0; j < imagename.length; j++) {
                            const pathfile = path.join(__dirname, '..', 'uploads', imagename[j])
                            res.sendFile(pathfile)
                            // return res.status(200).json(chat)
                        }
                    }
                }
            }
            res.status(200).json(chat)

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

            const ownerRooms = exisRoom.filter((element) => {
                if (element.dataValues.user1_uid != req.session.user.uid || element.dataValues.user1_uid === element.dataValues.user2_uid) {
                    return false
                }
                return true
            }).map((element) => {
                if (element.dataValues.user1_uid === req.session.user.uid) {
                    return element.dataValues
                }
            })

            const participantRooms = exisRoom.filter((element) => {
                if (element.dataValues.user2_uid != req.session.user.uid) {
                    return false
                }
                return true
            }).map((element) => {
                if (element.dataValues.user2_uid === req.session.user.uid) {
                    return element.dataValues
                }
            })

            const resrooms = await Roomsfunc(ownerRooms, participantRooms)

            return res.status(200).json(resrooms)

        }
        res.status(200).json({ message: "nothing get" })
    } catch (e) {
        console.log(e)
        res.status(500).json({ message: 'error, try again' })
    }
})


router.post('/:username', chekauth, upload.array('images', 10), async (req, res) => {
    try {
        const candidate = await User.findOne({ where: { username: req.params.username } })
        const senderuid = req.session.user.uid

        if (!candidate) {
            return res.status(501).json({ message: 'user not found' })
        }

        const exisRoom = await ExisRoom(senderuid, candidate)

        const thedata = req.body.body
        const body = JSON.parse(thedata)


        const message = body.message

        if (exisRoom) {
            if (!req.files || req.files.length === 0) {
                const roomuid = exisRoom.uid
                const chat = await CreateChat(senderuid, message, roomuid)
                return res.status(200).json(chat)
            } else {
                const imagesArray = req.files.map(file => file.filename)
                const images = JSON.stringify(imagesArray)
                const roomuid = exisRoom.uid

                const chat = await CreateChatWithImage(senderuid, message, images, roomuid)

                return res.status(200).json(chat)
            }
        } else {
            const new_room = await Room.create({
                uid: uuidv4(),
                user1_uid: senderuid,
                user2_uid: candidate.uid
            })

            const roomuid = new_room.uid

            const chat = await CreateChat(senderuid, message, roomuid)

            return res.status(200).json(chat)
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({ message: 'error, try again' })
    }
})




export default router