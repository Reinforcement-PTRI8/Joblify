import express from 'express';
import oauthController from '../controllers/oauthController';
import authController from '../controllers/authController';

const router = express.Router();


router.get('/signup', oauthController.oauthSignup);
router.get('/redirect',
    oauthController.oauthGetToken,
    oauthController.oauthSetUser,
    authController.setCookie, (req, res) => res.redirect('http://localhost:8080/'));

router.get('/getToken',
    authController.verifyCookie,
    oauthController.getAccessToken);



export default router;