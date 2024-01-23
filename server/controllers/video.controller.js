const { Video, Genre, User, Playlist, Role, Rating } = require("../models/models");
const path  = require("path");
const VideoService = require("../services/video.service.js");
const fs = require("fs");
const e = require("express");
const uuid = require("uuid");
const { Op, fn, where } = require("sequelize");
const Sequelize = require("../models/db");
const { group } = require("console");
const ratingService = require("../services/rating.service");
const sendMail = require("../services/mail.service");

const allowedExtension = ['MOV',
'.mp4',
'.MPG',
'.AVI',
'.MPEGWMV',
'.MPEGPS',
'.FLV',
'.3GPP',
'.WebM',
'.DNxHR',
'.ProRes',
'.CineForm',
'.HEVC (H.265)']


class VideoController{

    async uploadVideo(req,res){
        try {
            const {video,preview} = req.files
            if (!video) res.json({message:'Нет файла'})
            const extensionName = path.extname(video.name);
            if (!req.body.title)  res.json({message:'нет названия'})
             if(!allowedExtension.includes(extensionName)){
                 return res.status(422).json({message:"Неверный тип файла"})
            }  
            const result = await VideoService.saveVideo({
                title:req.body.title, 
                description: req.body.description ,
                userId:req.user.id,
                videoFileName: uuid.v4()+'.'+video.name.split('.')[1],
                previewFileName:uuid.v4()+'.'+preview.name.split('.')[1],
            },req.body.genres,video,preview)
            return res.json(result)        
        } catch (error) {
            console.log(error)
            return res.status(500).json({message:"Ошибка загрузки файла" })
        }
    }

    async getVideoById(req, res) {
        try {
            const promises=[]
            let video={}
            promises.push(Video.findByPk(req.params.id,{
                include: [
                    {
                        model:Genre,
                        through: {
                        attributes: []
                    }},
                    {
                        model:User,
                        required:true,
                        where:{
                            blocked:false
                        },
                        attributes:['id','avatar','login']
                    }

            ]}).then(data=>{
                    data.views= data.views+1
                    data.save()
                    Object.assign(video,JSON.parse(JSON.stringify(data)))
              }))
            promises.push(ratingService.getRatingVideo(req.params.id,req.query.userId).then((data)=>{
                Object.assign(video,data)
            }
            ))
            await Promise.all(promises)
            if (!video.id)  return res.json({message:'Видео не найдено'}) 
            res.json(video) 
        } catch (error) {
            console.log(error)
           res.status(500).json({message: 'Ошибка при поиске видео'}) 
        }
    }

    async getVideoByUserId(req, res) {
        try {
            const video = await Video.findAll({where:{userId: req.params.id}, order:[['createdAt', 'DESC']],include:[{
                model:User,
                where:{
                    blocked:false
                },
                required:true,
                attributes:['login','id','avatar']
            },
            {
                model:Genre
            }
        ]})
            return res.json(video) 
        } catch (error) {
           res.status(500).json({message: 'ошибка при поиске видео'}) 
        }
      
    }

    async delateVideo(req,res){
        try {
            const {id}=req.params
            const user = await User.findByPk(req.user.id,{
                include:{
                model:Role
            }})
            if(!user)  return res.json({message: 'Пользователь не найден'})
            const video = await Video.findByPk(id,{include:User})
            if(!video) return res.json({message: 'Видео не найдено'})
                
            if(video.userId===req.user.id){
                await VideoService.delateVideo(id)
                return res.json({message: 'Видео удалино'})
            }
            if(user.role.roleName==='ADMIN'){
                const {message,reason}=req.body
                await VideoService.delateVideo(id)
                sendMail({
                    to:video.user.email,
                    subject: 'Ваше видео было удалино Администратором',
                    html:`
                    <p>Ваше видео под названием <b>${video.title}</b> было удалино администратором ${user.login}.</p>
                    <p>Причина удаления: <b>${reason?reason:'Не указана'}</b></p>
                    <p>Коментарий от администратора:</p>
                    <p>${message?message:'Администратор не оставил коментария'}</p>
                    `
                })
                return res.json({message: 'Видео Удалино'})
            }

            return res.json({message: 'Недостаточно прав'})
        } catch (error) {
            console.log(error)
            res.status(500).json({message: 'Ошибка удалении видео'}) 
        }
    }

    async changeDateVideo(req,res){
        try {
            const {title, description, genres, id}=req.body
            const promises=[]
            let video= await Video.findByPk(id,{
                include:{
                    model:Genre,
                    through:{
                        attributes:[]
                    }
                }
            })
            promises.push(Video.update({title, description},{where:{
                id:id
            }}))
            promises.push(video.setGenres(genres))

            await Promise.all(promises)
            // await Video.update(data,{where:{
            //     id:
            // }})
            
            return res.json(video)
            
        } catch (error) {
            console.log(error)
            return res.json({message:'ошибка при изменения информации'})
        }
    }




    async getVideos(req, res){
        try {
            const {genres,title,only_in_genre}=req.query
            const options={
                order:[['createdAt', 'DESC']],
                include:[
                    {
                        model:User,
                        required:true,
                        where:{
                            blocked:false
                        },
                        attributes:['id','login','avatar']
                    },
                    {
                        model:Genre,
                        order:[['name', 'DESC']],
                        required:true,
                        through:{
                            attributes:[]
                        }
                    }
                ],
            }
            if(only_in_genre==='true'&& genres) options.include[1].where={id:genres.split(',')}
            if(!only_in_genre){
                let whereOptions={and:[]}
                if(genres)whereOptions.and.push({id:await VideoService.getVideosByGenre(genres.split(','))})
                if(title) whereOptions.and.push({
                    [Op.or]:[
                        Sequelize.literal(`to_tsvector(title) @@ plainto_tsquery('${title}')`),
                        title.split(' ').length===1?Sequelize.literal(`title  % '${title}'`):Sequelize.literal(`title %> '${title}'`)
                    ]})
                if(whereOptions.and.length) options.where={[Op.and]:whereOptions.and}
            }
            res.json(await Video.findAll(options));
        } catch (error) {
            console.log(error)
            res.status(500).json({message: "Ошибка при поиске видео"})
        }
    }
}

module.exports = new VideoController()




// if(only_in_genre==='true'&& genres){
            //     videos = await Video.findAll({
            //         order:[['createdAt', 'DESC']],
            //         include:[
            //             {
            //                 model:User,
            //                 required:true,
            //                 where:{
            //                     blocked:false
            //                 },
            //                 attributes:['id','login','avatar']
            //             },
            //             {
            //                 model:Genre,
            //                 order:[['name', 'DESC']],
            //                 where:{
            //                     id:genres.split(',')
            //                 },
            //                 required:true,
            //                 through:{
            //                     attributes:[]
            //                 }
            //             }
            //         ],
            //     });
            //     return res.json(videos)
            // }

            // if(!genres && !title)
            //     videos = await Video.findAll({

            //         order:[['createdAt', 'DESC']],
            //         include:[
            //             {
            //                 model:User,
            //                 where:{
            //                     blocked:false
            //                 },
            //                 required:true,
            //                 attributes:['id','login','avatar']
            //             },
            //             {
            //                 model:Genre,
            //                 order:[['name', 'DESC']],
            //                 through:{
            //                     attributes:[]
            //                 }
            //             }
            //         ]
            //     });
            // if(!genres && title){

            //     if(title.split(' ').length===1) videos = await Video.findAll({
            //             order:[['createdAt', 'DESC']],
            //             include:[
            //                 {
            //                     model:User,
            //                     where:{
            //                         blocked:false
            //                     },
            //                     required:true,
            //                     attributes:['id','login','avatar']
            //                 },
            //                 {
            //                     model:Genre,
            //                     order:[['name', 'DESC']],
            //                     through:{
            //                         attributes:[]
            //                     }
            //                 },
            //             ],  
            //             where:Sequelize.literal(`title %> '${title}'`)
            //         })
            //     else videos = await Video.findAll({
            //                 order:[['createdAt', 'DESC']],
            //                 include:[
            //                     {
            //                         model:User,
            //                         where:{
            //                             blocked:false
            //                         },
            //                         required:true,
            //                         attributes:['id','login','avatar']
            //                     },
            //                     {
            //                         model:Genre,
            //                         order:[['name', 'DESC']],
            //                         through:{
            //                             attributes:[]
            //                         }
            //                     },
            //                 ],
            //             where:Sequelize.literal(`to_tsvector(title) @@ plainto_tsquery('${title}')`)
            //         });
            //     }
            //     if(genres && !title){
            //         videos = await Video.findAll({
            //             order:[['createdAt', 'DESC']],
            //             where:{
            //                 id:await VideoService.getVideosByGenre(genres.split(','))
            //             },
            //             include:[
            //                 {
            //                     model:User,
            //                     required:true,
            //                     where:{
            //                         blocked:false
            //                     },
            //                     attributes:['id','login','avatar']
            //                 },
            //                 {
            //                     model:Genre,
            //                     order:[['name', 'DESC']],
            //                     required:true,
            //                     through:{
            //                         attributes:[]
            //                     }
            //                 }
            //             ],
            //         });
            //     }
            //     if(genres && title)

            //         if(title.split(' ').length===1) videos = await Video.findAll({
            //             order:[['createdAt', 'DESC']],
            //             include:[
            //                     {
            //                         model:User,
            //                         required:true,
            //                         where:{
            //                             blocked:false
            //                         },
            //                         attributes:['id','login','avatar']
            //                     },
            //                     {
            //                         model:Genre,
            //                         order:[['name', 'DESC']],
            //                         required:true,
            //                         through:{
            //                             attributes:[]
            //                         }
            //                     }
            //              ],
            //              where:{
            //                  [Op.and]:[
            //                     Sequelize.literal(`title %> '${title}'`),
            //                     {id:await VideoService.getVideosByGenre(genres.split(','))}
            //                  ]
            //              }
            //         });
            //         else videos = await Video.findAll({
            //             order:[['createdAt', 'DESC']],
            //             include:[
            //                     {
            //                         model:User,
            //                         required:true,
            //                         where:{
            //                             blocked:false
            //                         },
            //                         attributes:['id','login','avatar']
            //                     },
            //                     {
            //                         model:Genre,
            //                         order:[['name', 'DESC']],
            //                         required:true,
            //                         through:{
            //                             attributes:[]
            //                         }
            //                     }
            //              ],
            //              where:{
            //                  [Op.and]:[
            //                     Sequelize.literal(`to_tsvector(title) @@ plainto_tsquery('${title}')`),
            //                     {id:await VideoService.getVideosByGenre(genres.split(','))}
            //                  ]
            //              }
            //         });