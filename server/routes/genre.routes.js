const  Router = require("express");
const GenreController = require("../controllers/genre.controller.js");
const adminRoleMiddleware = require("../middleware/admin.role.middleware.js");
const authMiddleware = require("../middleware/auth.middleware.js");
const router = Router()

router.get('/',GenreController.getGenres)
router.post('/',authMiddleware,adminRoleMiddleware,GenreController.addGenre)
router.get('/:id',GenreController.getGenresByVideoId)
router.delete('/:id',authMiddleware,adminRoleMiddleware,GenreController.delGenre)

module.exports = router;