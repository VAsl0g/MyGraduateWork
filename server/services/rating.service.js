const sequelize = require("sequelize")
const { Sequelize } = require("../models/db")
const { Rating } = require("../models/models")
const Op=sequelize.Op
class RatingService{

    async getRatingVideo(videoId,userId){
        try {
        let result ={}
        const promises=[]
        if (userId){
            promises.push(Rating.findOne({where:{
                videoId:videoId,
                userId:userId
            }}).then((data)=>{
                if(data) result.userLike=data.like
            }))
        }
        promises.push(Rating.findAll({
            attributes:['like', [Sequelize.fn('count', Sequelize.col('like')),'quantity']],
            where:{
                videoId:videoId,
                like:{[Op.not]:null}
            },
            group:['like']
        }).then((data)=>{
            JSON.parse(JSON.stringify(data)).map(e=>e.like?result.like=e.quantity:result.dislike=e.quantity)
        })
        )
        await Promise.all(promises).then(()=>{
        })
        
        return result
    } catch (error) {
            return error
    }
    }

}



module.exports =  new RatingService()