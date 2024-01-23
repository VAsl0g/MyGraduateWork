const Router = require("express");
const authMiddleware = require("../middleware/auth.middleware.js")
const adminRoleMiddleware = require("../middleware/admin.role.middleware.js");

const CommentController = require("../controllers/comment.controller.js")

const router=Router()
router.post('/',authMiddleware, CommentController.addComment)
router.get('/:id', CommentController.getCommentsByVideoId)
router.delete('/:id',authMiddleware,adminRoleMiddleware,CommentController.delateCommentary)


module.exports= router