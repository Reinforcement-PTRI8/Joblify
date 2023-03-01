import express from 'express';
const router = express.Router();

import authController from '../controllers/authController';
import usersController from '../controllers/usersController';

router.get('/verify', authController.verifyCookie, (req, res, next) => {
    res.status(200).json({
        status: 'success',
        user: res.locals.user,
    });
});

router.get('/logout', authController.logout);
  
router.post('/login', 
    usersController.getUser, 
    authController.setCookie, (req, res) => {
        res.status(200).json({
            status: 'success',
            user: res.locals.user,
        }); 
    });


export default router;