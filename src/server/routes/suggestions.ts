import express from 'express';
import suggestionsController from '../controllers/suggestionsController';

const router = express.Router();

router.post('/resume', suggestionsController.getSuggestions);


export default router;