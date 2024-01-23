const  {User, Role} = require  ("../models/models.js")
const sendMail = require("../services/mail.service.js")
const path = require('path')
const uuid = require("uuid");

class UserController{
    async getUsers( req, res){
        try {
            return res.json( await User.findAll({
                where:{
                    blocked:false
                },
                attributes:['id', 'login','avatar',]
                }))
        } catch (error) {
            return res.json( {
                message:"Ошибка при поиске пользователя",
            })
        }
    }

    async blockedUser(req,res){
        try {
            const user= await User.findByPk(req.params.id,{attributes:['login','email']})
            if(!user) return res.json({message:"пользователь не найден",})
            const {reason,message}=req.body
            sendMail({
                to: user.email,
                subject: 'Вы были заблокированны администратором',
                html:`
                <p>Здравствуйте, <b>${user.login}</b></p>
                <p>Вы были заблокированны администратором ${req.user.login}.</p>
                <p>Причина блокировки: <b>${reason?reason:'Не указана'}</b></p>
                <p>Коментарий от администратора:</p>
                <p>${message?message:'Администратор не оставил коментария'}</p>
                `
            })
            User.update({blocked:true},{where:{
                id:req.params.id
            }})
            return res.json({message:"пользователь заблокирован",})
        } catch (error) {
            console.log(error)
            return res.json( {message:"Ошибка при блокировании пользователя",})
        }
    }

    async getUser(req,res){
        try {
            
            const user = await User.findByPk(Number(req.params.id),{include:{
                model:Role,
                required:true,
                attributes:['roleName']
            }})
            if(!user || user.blocked) res.json({massage:'Пользователь не найден'})
             return res.json( {
                id:user.id,
                login:user.login,
                avatar:user.avatar?user.avatar:'default.png',
                role:user.role.roleName,
                description:user.description
            })
        } catch (error) {
            return res.json( {
                message:"Ошибка при поиске пользователя",
            })
        }
    }

    async changeUser(req,res){
        try {
            const {login,description }=req.body
            const user = await User.findByPk(req.user.id,{
                attributes:['id','login','avatar','description'],
                include:{
                    model:Role,
                    attributes:['roleName']
                }
    })
            if(!user) return res.json( {message:"Ошибка при поиске пользователя"})
            user.login=login
            user.description=description!=='null'?description:null
            if(req.files?.avatar){
                user.avatar=uuid.v4()+'.'+ req.files.avatar.name.split('.')[1]
                req.files.avatar.mv(path.resolve('public','avatars',user.avatar))
            }
            await user.save()
            return res.json({
                id:user.id,
                login:user.login,
                avatar:user.avatar,
                description:user.description,
                role:user.role.roleName
            })
            
        } catch (error) {
            console.log(error)
            return res.json( {
                
                message:"Ошибка при изменения данных пользователя",
            })
        }
    }

}

module.exports = new UserController()