const express = require('express');
const router = express.Router();
const passport = require('passport');



const habitsController = require('../controllers/habitsController');
//page route
router.get('/dashboard',passport.checkAuthentication, habitsController.habitsPage);
router.get('/weeklyview', passport.checkAuthentication,habitsController.weeklyview);
//action route
router.post('/create',passport.checkAuthentication, habitsController.create);
router.get('/delete/:id',passport.checkAuthentication, habitsController.delete);
router.get('/update/:id/:day/:status',passport.checkAuthentication, habitsController.update);
module.exports = router;
