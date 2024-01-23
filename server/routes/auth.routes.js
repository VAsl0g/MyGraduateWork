const  Router = require("express");
const  authController = require("../controllers/auth.controller.js");
const { check } = require("express-validator");
const authMiddleware = require("../middleware/auth.middleware.js");
const router=  Router()

router.post("/registration", [
check( 'email', 'error').isEmail(),
check('password', 'error').isLength({min:3,max:24}),
check( 'login', 'error').isLength({min:3,max:40}),
], authController.registration)


router.post("/login", authController.login )
router.get('/auth', authMiddleware, authController.auth)
router.get('/activated/:link',  authController.activated)


module.exports = router;