import express from 'express';
import oauthController from '../controllers/oauthController';

const router = express.Router();


router.get('/signup', oauthController.oauthSignup);
router.get('/redirect', oauthController.oauthGetToken);


export default router;