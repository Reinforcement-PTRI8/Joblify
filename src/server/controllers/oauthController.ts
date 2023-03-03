import jwt from 'jsonwebtoken';
import { google } from 'googleapis';
import axios from 'axios';
// const url = require('url');

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
            include_granted_scopes: true,
          }); 

          res.redirect(authUrl);
    },
    
    oauthGetToken: async(req: Request, res: Response, next: NextFunction) => {
        try{
            const { code } = req.query;
            const { tokens } = await oauth2Client.getToken(code.toString());
            console.log('Access token: ', tokens.access_token, tokens.refresh_token);

            oauth2Client.setCredentials(tokens);

            const url = `https://www.googleapis.com/oauth2/v3/userinfo`
            const { data } = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${tokens.access_token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!data) return next({
                log: 'Unable to authenticate with Google',
                status: 403,
                message: { err: 'Permission not granted to access user information'},
            });

            const { given_name, family_name, email } = data;
            const { access_token } = tokens;
            const params = [given_name, family_name, email, access_token];
     
            const response = await db.query(`SELECT first_name FROM users WHERE email='${email}'`);
            if(!response.rows.length) {
                const createUser = {
                    name: 'user-signup',
                    text: 'INSERT INTO users (first_name, last_name, email, access_token) VALUES ($1, $2, $3, $4) RETURNING id, first_name, last_name, email',
                    values: params,
                };    
                const newUser = await db.query(createUser);
            } else {
                const user = await db.query(`SELECT first_name, last_name, email FROM users WHERE email='${email}'`);
                res.locals.user = user.rows[0];
            };
            
            res.redirect('http://localhost:8080');
        } catch (err) {
            console.log('Catch block: ', err);
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