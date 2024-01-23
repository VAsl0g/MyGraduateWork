module.exports = (req,res,next) => {
    try {
        if(req.user.role!=='ADMIN') return res.status(403).json({message: 'Недостаточно прав'})
        next()
    } catch (Error) {
        console.log(Error)
        return res.status(401).json({message: "Недостаточно прав"})
    }
}