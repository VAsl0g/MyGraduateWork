const { Complaint, User, Video, TypeComplaint } = require("../models/models")
const videoService = require("../services/video.service")
const sendMail = require("../services/mail.service")


class ComplaintController{

    async getComplaints(req,res){
        try {
            const complaint = await Complaint.findAll({
                attributes:['id','createdAt','message'],
                 include:[
                    {
                        model:User,
                        required: true,
                        attributes:['id','login','avatar']
                    },
                    {
                        model:Video,
                        required: true,
                        attributes:['id','title','previewFileName']
                    },
                    {
                        model:TypeComplaint
                    }
                ],
            })
            return res.json(complaint)
        } catch (error) {
            console.log(error)
            return res.json( {
                message:"Ошибка при поиске жалоб"
            })
        }
    }

    async getComplaintTypes(req,res){
        try {
            const complaintTypes = await TypeComplaint.findAll()
            return res.json(complaintTypes)
        } catch (error) {
            console.log(error)
            return res.json( {
                message:"Ошибка при поиске жалоб"
            })
        }
    }

    async getComplaintsByVideo(req,res){
        try {
            const complaint = await Complaint.findOne({where:{
                videoId:req.params.id
            }})
            return res.json(complaint)
        } catch (error) {
            return res.json({message:'Ошибка при поиске жалоб'})
        }
    }


    async addComplaint(req,res){
        try {
            const complaint = await Complaint.create({userId:req.user.id,...req.body})
            return res.json(complaint)
        } catch (error) {
            console.log(error)
            return res.json({message:'Ошибка при добавления жалобы', error})
        }
    }


    async rejectComplaint(req,res){
        try {
            const {complaintId,message} = req.body
            const complaint = await Complaint.findByPk(complaintId,{include:[
                {
                    model:User,
                    required:true
                },
                {
                    model:Video,
                    required:true
                },
                {
                    model:TypeComplaint,
                    required:true
                }
            ]})

            Complaint.destroy({where:{
                id:complaintId
            }})

            sendMail({
                
                to:complaint.user.email,
                subject: 'Ваше видео было удалино Администратором',
                html:`
                <h5>Здравствуйте</h5>
                <p>Ваша жалоба об "${complaint.typeComplaint.name}" направленная на видео <b>${complaint.video.title}</b> была отклонена.</p>
                <p>Коментарий от администратора:</p>
                <p>${message?message:'Администратор не оставил коментария'}</p>
                `
            })
            return res.json({message:'Жалоба удалёна'})
        } catch (error) {
            console.log(error)
            return res.json({message:'Ошибка при удалении видео по жалобы'})   
        }
    }


    async delateComplaint(req,res){
        try {
            const {complaintId,message} = req.body
            const complaint = await Complaint.findByPk(complaintId,{include:[
                {
                    model:User,
                    required:true
                },
                {
                    model:Video,
                    required:true
                },
                {
                    model:TypeComplaint,
                    required:true
                }
            ]})
            sendMail({
                
                to:complaint.user.email,
                subject: 'Ваше видео было удалино Администратором',
                html:`
                <h5>Здравствуйте</h5>
                <p>Ваше видео под названием <b>${complaint.video.title}</b> было удалино администратором.</p>
                <p>Причина удаления: <b>${complaint.typeComplaint.name}</b></p>
                <p>Коментарий от администратора:</p>
                <p>${message?message:'Администратор не оставил коментария'}</p>
                `
            })

            await videoService.delateVideo(complaint.video.id)
            Complaint.destroy({where:{
                videoId:complaint.video.id
            }})
            
            return res.json({message:'Фильм удалён'})
        } catch (error) {
            console.log(error)
            return res.json({message:'Ошибка при удалении видео по жалобы'})   
        }
    }
}

module.exports = new ComplaintController()