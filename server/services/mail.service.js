const nodemailer = require('nodemailer')
require('dotenv').config()

const sendMail= async(mail)=>{
  try {
    await nodemailer.createTransport({
      host: process.env.EMAIL_SMTP_HOST,
      port: process.env.EMAIL_SMTP_PORT,
      secure: false,
    auth: {
      user: process.env.EMAIL_AUTHORS_CINEMA,
      pass: process.env.PASSWORD_AUTHORS_CINEMA,
    },
    }).sendMail({
      from: '"Authors cinema" <'+process.env.EMAIL_AUTHORS_CINEMA+'>',
      ...mail
    })
  } catch (error) { 
    console.log(error)
      return error
  }
}

module.exports=sendMail

