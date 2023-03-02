import jwt from 'jsonwebtoken';
import { google } from 'googleapis';
const url = require('url');

import * as db from '../models/appModel';
import { Request, Response, NextFunction } from 'express';

const { OAuth2 } = google.auth;
const oauth2Client = new OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URL
);

const oauthController = {
    oauthSignup: async(req: Request, res: Response, next: NextFunction) => {
        const authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['email', 'profile'],
            include_granted_scopes: true
          }); 

          res.redirect(authUrl);
    },
    
    oauthGetToken: async(req: Request, res: Response, next: NextFunction) => {
        try{
            const { code } = req.query;
            console.log('Access code: ', code);

            const { tokens } = await oauth2Client.getToken(code.toString());
            console.log('Access token: ', tokens);

            oauth2Client.setCredentials(tokens);
            
        } catch (err) {
            return next({
                log: 'Error trying to get access code',
                status: 500,
                message: {
                    err: err,
                },
            });       
        };
    },
};

export default oauthController;