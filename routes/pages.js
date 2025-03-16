const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');

router.get('/', pageController.getHomePage);
router.get('/blog/:slug', pageController.getPostPage);
router.get('/about', pageController.getAboutPage);

module.exports = router;