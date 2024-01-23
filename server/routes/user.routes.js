const Router = require("express")

const  UserController = require ("../controllers/user.controller.js");
const adminRoleMiddleware = require("../middleware/admin.role.middleware.js");
const authMiddleware = require("../middleware/auth.middleware.js");

const router = Router()

router.get("/", UserController.getUsers)
router.get('/:id' , UserController.getUser)
router.put('/blocked/:id' , authMiddleware,adminRoleMiddleware,UserController.blockedUser)
router.put('', authMiddleware, UserController.changeUser)

module.exports = router;
