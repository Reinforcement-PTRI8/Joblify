import express from 'express';
import usersController from '../controllers/usersController';
const router = express.Router();

router.get('/signup', usersController.signup, (req, res) => {
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

export default router;