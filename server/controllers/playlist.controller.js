const {QueryTypes} = require("../models/db")
const { Playlist, Video ,User} = require("../models/models")
const Sequelize = require("sequelize")
const uuid = require("uuid")
const fs = require ("fs")
const path  = require ( 'path');

const Op = Sequelize.Op
class PlayListController{

    async createPlaylist(req,res){
        try {
            //video.name.split('.')[1], uuid.v4()
            const {image} = req.files
            const imageFileName=uuid.v4()+'.'+image.name.split('.')[1]
            let playlist
                if(!image) 
                    playlist = await Playlist.create({userId:req.user.id, title:req.body.title})
                else  {
                    await image.mv(path.resolve('public','playlists',imageFileName))
                    playlist = await Playlist.create({userId:req.user.id, imageFileName, title: req.body.title})
                }
            return res.json(playlist)
        } catch (error) {
            console.log(error)
            return res.json({message:"Ошибка при создании плейлиста"})
        }
    }

    async getPlaylistsByUser(req,res){
        try {
            const playlists = await Playlist.findAll({order:[['createdAt', 'DESC']],where:{userId:req.params.id},include:{
                model:Video,
                through:{
                    attributes:[]
                }
            }})
            return res.json(playlists)
        } catch (error) {
            console.log(error)
            return res.json({message:"Ошибка при поиске плейлистов"})
        }
    }

    async getVideosPlaylist(req,res){
        try {
            const playlists = await Playlist.findByPk(req.params.id,{include:{
                model:Video,
                required:true,
                through: {
                    attributes: []
                  }
            }})
            return res.json(playlists)
        } catch (error) {
            return res.json({message:"Ошибка при поиске видео", error})
        }
    }

    async getNotVideosPlaylist(req,res){
        try {
            const playlist = await Playlist.findByPk(req.params.id,{attributes:['userId'],include:{
                model:Video,
                attributes:['id'],
                through:{
                    attributes:[]
                }
            }})
            const userId=playlist.userId
            const videoPlaylist=playlist.videos.map((e)=>(e.id))
            const video= await Video.findAll({where:{
                [Op.and]:[
                    {
                        userId:userId
                    },
                    {
                        
                            id:{
                                [Op.notIn]:videoPlaylist
                                }
                    }
                ]
            }})

            return res.json(video)
        } catch (error) {
            console.error(error);
            return res.json({message:"Ошибка при добавление видео в плейлист"})
        }
    }

    


    async addVideoInPlaylist(req,res){
        try {
            const playlist = await Playlist.findByPk(req.body.playlistId)
            if (!playlist)  return res.json({message:'плейлист не найден'})
            const video = await Video.findAll({where:{
                id:req.body.videoIds
            }})
            if (!video)  return res.json({message:'видео не найдено'})
            playlist.addVideo(video)
            return res.json({message:'видео добалнно в плейлист'})
        } catch (error) {
            console.log(error)
            return res.json({message:"Ошибка при добавление видео в плейлист"})
        }
    }



    async delatePlaylist(req,res){
        try {
            await Playlist.destroy({where: {id:req.params.id}})
            return res.json({message:"Плейлист успешно удалиося", error})
        } catch (error) {
            return res.json({message:"Ошибка при удаления плейлиста", error})
        }
    }

    async delateVideoFromPlaylist(req,res){
        try {
            const playlist=await Playlist.findByPk(req.params.id)
            const video = await Video.findByPk(req.params.video_id)
            playlist.removeVideo(video)
            return res.json({message:"Видео успешно удалилось"})
        } catch (error) {
            return res.json({message:"Ошибка при удаления видео из плейлиста", error})   
        }
    }


}

module.exports = new PlayListController()