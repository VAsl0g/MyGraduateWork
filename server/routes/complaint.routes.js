const  Router = require("express");
const ComplaintController = require("../controllers/complaint.controller.js");
const adminRoleMiddleware = require("../middleware/admin.role.middleware.js");

const authMiddleware = require("../middleware/auth.middleware.js");
const router = Router()

router.get('',authMiddleware,adminRoleMiddleware, ComplaintController.getComplaints)
router.get('/types', ComplaintController.getComplaintTypes)
router.post('',authMiddleware,ComplaintController.addComplaint)
router.put('/video',authMiddleware,adminRoleMiddleware,ComplaintController.delateComplaint)
router.put('/reject',authMiddleware,adminRoleMiddleware,ComplaintController.rejectComplaint)


module.exports = router;