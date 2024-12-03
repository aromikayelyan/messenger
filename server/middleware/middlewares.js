export function chekauth (req, res, next) {
    if (req.session && req.session.isAuthenticated) {
        next()
    } else {
        res.status(401).json({ message: "Unauthorized: Please log in" })
    }
}

export function variable (req,res,next){
    res.locals.isAuth = req.session.isAuthed
    next()
}