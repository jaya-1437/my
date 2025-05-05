const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
 
// Routes
router.post('/createUser', userController.createUser);
router.get('/getAllUsers', userController.getAllUsers);
router.get('/getUserById/:id', userController.getUserById);
router.put('/updateUser/:id', userController.updateUser);
router.delete('/deleteUser/:id', userController.deleteUser);
 
module.exports = router;