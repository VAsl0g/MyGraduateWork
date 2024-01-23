const fs = require ("fs")
const path  = require ( 'path');
const { Video, Genre, Complaint } = require("../models/models")
const { Op, fn, where } = require("sequelize");
const Sequelize = require("../models/db");
class VideoServices {

    async saveVideo(data, genres, videoFile,previewFile){
        try {
            const video = await Video.create(data)
            if(genres){
                await video.addGenre(genres)
            }
            videoFile.mv(path.resolve('public','videos',data.videoFileName))
            previewFile.mv(path.resolve('public','previews',data.previewFileName))
            return {message:"Видео успешно сохранено"}
        } catch (error) {
            return { message:"Ошибка при сохранения файла"}
        }
    }
    


    async delateVideo(id){
        try {
            const video = await Video.findByPk(id)
            if(video){
                await Video.destroy({where:{
                    id:id
                }})
                fs.unlinkSync(path.resolve('public','videos',video.videoFileName))
                fs.unlinkSync(path.resolve('public','previews',video.previewFileName))
                return {message: 'Видео удалено'}
            }
            return  {message: 'Видео не найдено'}
        } catch (error) {
            return  {message: 'ощибка при удалении',error}
        }
    }
    
    // async deleteVideo(videoId){
    //     await Video.deleteOne({_id:videoId})
    // }


    async getVideosByGenre(genres){
       
        
        const video = (await Video.findAll({
            attributes:['id'],
            having:Sequelize.literal('COUNT(genres.id)>='+genres.length),
            group:[
                'video.id'
            ],
            include:[
                {
                    model:Genre,
                    attributes:[],
                    through:{
                        attributes:[]
                    },
                    where:{
                    id:{
                        [Op.in]:genres
                        }
                    }
                }
            ],
            })).map(e=>e.id)
        return video
    }

















        
    async streamVideo(req, res) {
        const range = req.headers.range;
        if (!range) {
            res.status(400).send("Requires Range header");
        }

    // get video stats (about 61MB)
    //onst videoPath = path.resolve('videos' , video.user.toString(), video.id+'.mp4');
    //const videoSize = fs.statSync(videoPath).size;

    const video = await Video.findByPk(req.params.id)
    const videoPath = path.resolve('public', String(video.userId),'videos' , video.id+'.mp4');

    const videoSize = fs.statSync(videoPath).size;

    // Parse Range
    // Example: "bytes=32324-"
    const CHUNK_SIZE = 10 ** 6; // 1MB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    // Create headers
    const contentLength = end - start + 1;
    const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
    };

    // HTTP Status 206 for Partial Content
    res.writeHead(206, headers);
    // create video read stream for this particular chunk
    const videoStream = fs.createReadStream(videoPath, { start, end });

    // Stream the video chunk to the client
    videoStream.pipe(res);
    }

}


module.exports =  new VideoServices()