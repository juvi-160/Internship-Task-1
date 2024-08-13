const express = require('express');
const router = express.Router();
const userController = require('../controllers/authControllers');
const { requireLogin } = require('../middlewares/authMiddleware');

router.use(express.urlencoded({ extended: true }));

router.get('/signup', userController.renderSignup);
router.post('/signup', userController.signup);

router.get('/login', userController.renderLogin);
router.post('/login', userController.login);

router.post('/logout', userController.logout);

router.get('/profile', requireLogin, userController.renderProfile);

router.get('/profile/edit', requireLogin, userController.renderEditProfile);
router.post('/profile/edit', requireLogin, userController.editProfile);

router.post('/profile/delete', requireLogin, userController.deleteProfile);

module.exports = router;
