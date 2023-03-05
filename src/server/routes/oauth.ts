import express from 'express';
import oauthController from '../controllers/oauthController';
import authController from '../controllers/authController';

const router = express.Router();


router.get('/signup', oauthController.oauthSignup);
router.get('/redirect',
    oauthController.oauthGetToken,
    authController.setCookie, (req, res) => res.redirect('http://localhost:8080/'));

router.get('/:documentId', 
    oauthController.parseDocument, 
    (req, res) => res.status(200).json({
        status: 'success',
        body: res.locals.body,
    }));


export default router;