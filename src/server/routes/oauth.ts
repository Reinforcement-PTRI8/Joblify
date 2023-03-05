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
    oauthController.getAccessToken,
    (req, res) => res.status(200).json({
        status: 'success',
        access_token: res.locals.access_token
    }));


export default router;