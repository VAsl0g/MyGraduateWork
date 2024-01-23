const Router = require("express");
const playlistController = require("../controllers/playlist.controller");
const authMiddleware = require("../middleware/auth.middleware");
const Sequelize = require("sequelize");
const { User, Video, Rating} = require("../models/models");
const ratingService = require("../services/rating.service");
const router = Router()

const Op=Sequelize.Op


router.post('/',authMiddleware, async (req,res)=>{
    try {
        const {videoId,like} = req.body
        const user=await User.findByPk(req.user.id)
        if (!user) return res.json({message:'Пользователь не найден'})
        const video=await Video.findByPk(videoId)
        if (!video) return res.json({message:'Видео не найдено'})
        if (like===null) await Rating.destroy({where:{
            videoId,
            userId:req.user.id
        }})
        const [rating, created] = await Rating.findOrCreate({
            where:{
                videoId,
                userId:req.user.id
            },
            defaults:{
                videoId,
                userId:req.user.id,
                like
            }
        })

        Rating.update({like},{where:{
                videoId,
                userId:req.user.id
            },
        })

        
        return res.json({message:"успех"})
    } catch (error) {
        console.log(error)
        return res.json(error)
    }
})  

module.exports = router