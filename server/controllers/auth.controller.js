
const bcrypt = require("bcryptjs")
const Jwt = require("jsonwebtoken");
const { check, validationResult } = require( "express-validator");
const { User, Role } = require("../models/models");
const videoService = require ("../services/video.service.js");
const {Sequelize} = require("sequelize"); 
const uuid = require("uuid");
const sendMail = require("../services/mail.service");
const Op = Sequelize.Op;

class AuthController{

    async registration(req,res){
        try {
            const errors = validationResult(req)
             if (!errors.isEmpty()) return res.status(400).json({message:'Некорректные данные'})
            const {email,password, login}= req.body
            
            const candidateLogin = await User.findOne({where: {
                login
            }})

            if (candidateLogin) return res.status(400).json({message: 'Пользователь с таким логином уже существует'})
            const candidateEmail = await User.findOne({where: {
                email
            }})
            if (candidateEmail) return res.status(400).json({message: 'Пользователь с такой почтой уже зарегистрирован'})
            const hashPassword = await bcrypt.hash(password, Number(process.env.HASH_PASSWORD))
            const activationLink=uuid.v4()
            const user = await User.create({login,email,password:hashPassword, roleId:(await Role.findOne({where:{roleName:'USER'}})).id, activationLink})
            
            sendMail({
                to:email,
                subject:'Активация аккаунта',
                html:`Перейдите по  <a href="${process.env.API_URL+'/api/auth/activated/'+activationLink}">ссылке</a> для подтверждения электронной почты`
            })
            const token= Jwt.sign({
                id:user.id,
                email:user.email,
                login:user.login,
                description:user.description,
                avatar:user.avatar?user.avatar: 'default.png',
                role:"USER",
                isActivated:false
            }, process.env.SECRET_KEY, {expiresIn: "24h"})
            
            return res.json({
                token
            })
        } catch (error) {
            console.log(error)
            res.status(500).send({message: "server error"})
        }
    }

    async login(req,res){
        try {
            const {email, password} = req.body
            const user = await User.findOne({where:{email,blocked:false}, include:{
                model:Role,
                required:true,
                attributes:['roleName']
            }})
            if (!user) return res.status(404).json({message:"Пользователь не найден"})
            const isPasswordValid = bcrypt.compareSync(password, user.password)

            if (!isPasswordValid) return res.status(400).json({
                message:"Некорректный пароль"
            })
           
            const token= Jwt.sign({
                id:user.id,
                email:user.email,
                login:user.login,
                avatar:user.avatar?user.avatar: 'default.png',
                description:user.description,
                role:user.role.roleName,
                isActivated:user.isActivated
            }, process.env.SECRET_KEY, {expiresIn: "24h"})
            
            return res.json({
                token
            })
        } catch (error) {
            res.send({message: "server error"})
        }
    }


    async auth(req,res){
        try {
            const user =  await User.findByPk(req.user.id, {
                include:{
                model:Role,
                required:true,
                attributes:['roleName']
            }})
            if(user.blocked) return res.json({message:"Пользователь заблокирован"})
            const token= Jwt.sign({
                id:user.id,
                email:user.email,
                login:user.login,
                avatar:user.avatar?user.avatar: 'default.png',
                description:user.description,
                role:user.role.roleName,
                isActivated:user.isActivated
            }, process.env.SECRET_KEY, {expiresIn: "24h"})
            
            return res.json({
                token,
            })
        } catch (error) {
            console.log(error)
            res.send({message: "server error"})
        }
    }

    async activated(req,res){
        try {
            const {link}=req.params
            const user= await User.findOne({where:{
                activationLink:link
            }})
            if(!user){
                return res.json({massage:'Некорректная ссылка активации'})
            }
            user.isActivated=true
            await user.save()
            res.redirect(process.env.CLIENT_URL)
        } catch (error) {
            console.log(error)
            res.send({message: "server error"})
        }
    }

}

module.exports = new AuthController();