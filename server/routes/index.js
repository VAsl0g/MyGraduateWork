const Router = require("express")
const router = new Router
const userRouter = require("./user.routes");
const videoRouter = require("./video.routes");
const genreRouter = require("./genre.routes");
const authRouter = require('./auth.routes');
const commentRouter = require('./comment.routes');
const complaintRouter = require('./complaint.routes');
const playlistRouter = require('./playlist.routes');
const ratingRouter = require('./rating.routes')

router.use('/video',videoRouter)
router.use('/auth',authRouter)
router.use('/user', userRouter )
router.use('/genre',genreRouter)
router.use('/comment',commentRouter)
router.use('/complaint',complaintRouter)
router.use('/playlist',playlistRouter)
router.use('/rating',ratingRouter)

module.exports = router