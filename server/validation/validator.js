import {body} from 'express-validator'



const registerValidation = [
    body('username', 'Имя должно содержать минимум 3 символов').isLength({ min: 3}),
    body('password', 'Пароль должен содержать минимум 3 символов').isLength({ min: 3}),
]

export default registerValidation