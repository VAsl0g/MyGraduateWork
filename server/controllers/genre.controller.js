const {Genre, Video} = require('../models/models.js')

class GenreController{
    async getGenres(req,res){
        try {
            const genres= await Genre.findAll({
                order:[['name', 'ASC']],
            })
            res.json(genres)
        } catch (error) {
            res.json(error)
        }
    }

    async getGenresByVideoId(req,res){
        try {
            
        } catch (error) {
            res.json(error)
        }
    }

    async addGenre(req,res){
        try {   
            await Genre.create({name: req.body.name})
            res.json({message: 'success'})
        } catch (error) {
            res.json(error)
        }
    }

    async delGenre(req,res){
        try {
            await Genre.destroy({where:{
                id:req.params.id
            }})
            res.json({message: 'success'})
        } catch (error) {
            res.json(error)
        }
    }
}


module.exports = new GenreController()