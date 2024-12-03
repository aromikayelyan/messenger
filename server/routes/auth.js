import bcrypt from "bcrypt"
import usermodel from "../models/user_model.js"
import { Router } from "express"
import { v4 as uuidv4 } from "uuid"
import { validationResult } from "express-validator"

const router = Router()


router.post('/reg', async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }
        const candidate = await usermodel.findOne({ where: { username: req.body.username } })
        if (candidate) {
            res.status(200).json({ message: "you have a account" })
        } else {
            const password = req.body.password
            const salt = await bcrypt.genSalt(10)
            const hash = await bcrypt.hash(password, salt)

            await usermodel.create({
                uid: uuidv4(),
                username: req.body.username,
                password: hash   
            })

            res.status(200).json({ message: "you create a account" })
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({message:'error, try again'})
    }
})

router.post('/login', async (req, res) => {
    try {
        const { password } = req.body
        const candidate = await usermodel.findOne({ where: { username: req.body.username } })

        if (candidate) {
            const isyou = await bcrypt.compare(password, candidate.password)

            if (isyou) {
                req.session.user = candidate
                req.session.isAuthenticated = true
                req.session.save(err => {
                    if (err) {
                        throw err
                    }
                })
                // res.redirect('/chats')
                res.status(200).json({message:"autorized"})

            } else {
                if (err) {
                    throw err
                }
            }
        } else {
            res.redirect('/log')
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({message:'error, try again'})
    }
})

export default router