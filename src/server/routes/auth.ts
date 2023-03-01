import express from 'express';
const router = express.Router();

import authController from '../controllers/authController';

router.get('/verify', authController.verifyCookie, (req, res, next) => {
    res.status(200).json(res.locals.token)
});



export default router;