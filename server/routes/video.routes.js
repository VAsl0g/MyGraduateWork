const  Router = require("express");
const  authMiddleWare = require ('../middleware/auth.middleware.js')
const videoController = require("../controllers/video.controller.js")

const router = Router()
router.post("/upload",authMiddleWare, videoController.uploadVideo)
router.delete('/:id',authMiddleWare, videoController.delateVideo)
router.get('/',videoController.getVideos)
router.get('/:id', videoController.getVideoById )
router.get('/user/:id', videoController.getVideoByUserId )
router.put('/', videoController.changeDateVideo )

module.exports= router;

