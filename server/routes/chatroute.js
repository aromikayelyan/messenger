import { Router } from "express"
import Chat from "../models/chat_model.js"
import Room from "../models/room_model.js"
import { v4 as uuidv4 } from "uuid"
import { chekauth } from "../middleware/middlewares.js"
const router = Router()



router.get('/', chekauth, async (req, res) => {
    try {
        // const Room = await Room.findAll({ where: { uid: req.params.id } })
    

        res.status(200).json({message: 'geted' })

    } catch (e) {
        console.log(e)
        res.status(500).json({ message: 'error, try again' })
    }
})

// router.get('/', async (req, res) => {
//     try {
//         const products = await prodmodel.findAll()
//         const data = []
//         products.forEach(product => {
//             data.push(product.dataValues)
//         });

//         res.status(200).json(data)
//     } catch (e) {
//         console.log(e)
//         res.status(500).json({ message: 'error, try again' })
//     }
// })



router.post('/:username', async (req, res) => {
    try {
        const Room = await Room.findAll({ where: { uid: req.params.username } })

        res.status(200).json({ message: 'Добавлено' })
    } catch (e) {
        console.log(e)
        res.status(500).json({ message: 'error, try again' })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const uid = req.params.id
        const product = await prodmodel.findAll({ where: { uid: uid } })
        await product[0].destroy()

        res.status(200).json({ message: 'Удалено' })
    } catch (e) {
        console.log(e)
        res.status(404).json({ message: 'не найдено такого товара' })
    }
})



export default router

