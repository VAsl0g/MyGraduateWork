const Router = require("express");
const playlistController = require("../controllers/playlist.controller");
const authMiddleware = require("../middleware/auth.middleware");
const router = Router()

router.post('/',authMiddleware,playlistController.createPlaylist)
router.post('/video',authMiddleware,playlistController.addVideoInPlaylist)
router.get('/:id', playlistController.getVideosPlaylist)
router.get('/not/:id', playlistController.getNotVideosPlaylist)
router.get('/user/:id',playlistController.getPlaylistsByUser)
router.delete('/:id',authMiddleware,playlistController.delatePlaylist)
router.delete('/:id/video/:video_id',authMiddleware,playlistController.delateVideoFromPlaylist)


module.exports=router