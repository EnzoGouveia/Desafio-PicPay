const { Router } = require("express");
const UserController = require("../controllers/UserController");

const router = Router();

router.post('/user/register', UserController.registerUser);
router.get('/users', UserController.getUsers);
router.post('/user/find', UserController.findUser);
router.post('/user/update', UserController.updateUser);
router.delete('/user/delete', UserController.deleteUser);

module.exports = router;