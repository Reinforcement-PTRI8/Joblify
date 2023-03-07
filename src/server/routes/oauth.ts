import express from 'express';
import oauthController from '../controllers/oauthController';
import authController from '../controllers/authController';

const router = express.Router();


router.get('/signup', oauthController.oauthSignup);
router.get('/redirect',
    oauthController.oauthGetToken,
    authController.setCookie, (req, res) => res.redirect('http://localhost:8080/'));


export default router;