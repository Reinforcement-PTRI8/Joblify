import express from 'express';
import usersController from '../controllers/usersController';
import authController from '../controllers/authController';
const router = express.Router();

router.post('/signup', usersController.signup, authController.setCookie, (req, res) => {
    console.log('user router post');
    return res.status(200).json({
        status: 'success',
        user: res.locals.user
    });
});

router.get('/:id', usersController.getUserById, (req, res) => {
    return res.status(200).json({
        status: 'success',
        user: res.locals.user
    });
});

router.patch('/:id', usersController.updateUserById, (req, res) => {
    return res.status(200).json({
        status: 'success',
        user: res.locals.user
    })
})

export default router;