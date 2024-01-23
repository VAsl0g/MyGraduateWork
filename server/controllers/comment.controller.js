const { Commentary, User, Video } = require("../models/models")

class CommentController{
    async addComment(req,res) {
        try {
            const {videoId,text}= req.body
            const user = await User.findByPk(req.user.id)
            if (!user) return res.json({
                message:"Пользователь не найден"
            })
            const video = await Video.findByPk(videoId)
            if (!video) return res.json({
                message:"Видео не найдено"
            })

            const comment = await Commentary.create({text: text, userId: req.user.id, videoId:videoId})
           return res.json(comment)
        } catch (error) {
            return res.status(500).json({message:'Ошибка при поиске коментариев'})
        }
        
    }

    async getCommentsByVideoId(req,res){
        try {
          const comment = await Commentary.findAll({
                where:{
                    videoId: req.params.id
                },
                include:{
                    model: User,
                    required:true,
                    attributes:['avatar','id','login']
                },
                order: [['createdAt','DESC']]
            })
            return res.json(comment)
        } catch (error) {
            return res.status(500).json({message:'Ошибка при поиске комментариев'})
        }
    }

    
    async delateCommentary(req,res){
        try {
          const comment = await Commentary.destroy({
              where:{
                  id:req.params.id
              }
          })
            return res.json({message:'комментарий успешно удалён'})

        } catch (error) {
            return res.status(500).json({message:'Ошибка при поиске комментариев'})
        }
    }
}



module.exports = new CommentController()