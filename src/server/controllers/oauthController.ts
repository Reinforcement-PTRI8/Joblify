import { google } from 'googleapis';
const { authenticate } = require('@google-cloud/local-auth');
import axios from 'axios';
const path = require('path');
const util = require('util');

import * as db from '../models/appModel';
import { Request, Response, NextFunction } from 'express';

const { OAuth2 } = google.auth;
const oauth2Client = new OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URL
);

const docs = google.docs('v1');

const oauthController = {
    oauthSignup: async(req: Request, res: Response, next: NextFunction) => {
        console.log('oauth sign up');
        const authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['email', 'profile'],
            include_granted_scopes: true,
            redirect_uri: process.env.GOOGLE_REDIRECT_URL
          });

          res.redirect(authUrl);
    },
    oauthGetToken: async(req: Request, res: Response, next: NextFunction) => {
        console.log('oauth get token');
        try{
            const { code } = req.query;
            const { tokens } = await oauth2Client.getToken(code.toString());
            console.log('Access token: ', tokens.access_token, tokens.refresh_token);

            res.locals.tokens = tokens;

            return next();
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
    oauthSetUser: async(req: Request, res: Response, next: NextFunction) => {
        const { tokens } = res.locals;
        try {
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
            const { access_token, refresh_token } = tokens;
            const params = [given_name, family_name, email, access_token, refresh_token];

            const user = await db.query(`SELECT id, first_name, last_name, email FROM users WHERE email='${email}'`);
            console.log('oauth user sign up ', user);
            if (user.rows.length) {
                await db.query(`UPDATE users SET access_token='${access_token}' refresh_token='${refresh_token}' WHERE id=${user.rows[0].id}`)
                res.locals.user = user.rows[0];
            } else {
                const createUser = {
                    name: 'user-signup',
                    text: 'INSERT INTO users (first_name, last_name, email, access_token, refresh_token) VALUES ($1, $2, $3, $4, $5) RETURNING id, first_name, last_name, email',
                    values: params,
                };
                const newUser = await db.query(createUser);
                if (!newUser.rows.length) return next({
                    log: 'Error creating new user',
                    status: 404,
                    message: {
                        err: 'Something went wrong creating new account',
                    },
                });

                res.locals.user = newUser.rows[0];
            };

            return next();
        } catch (err) {
            console.log('Oauth set user catch: ', err);
            return next({
                log: 'Error in oauthSetUser controller setting user information',
                status: 500,
                message: {
                    err: err
                },
            });
        };
    },
    getDocument: async(req: Request, res: Response, next: NextFunction) => {
        const { documentId } = req.params;
        const auth = await authenticate({
            keyfilePath: path.join(__dirname, '../oauth2.keys.json'),
            scopes: 'https://www.googleapis.com/auth/documents',
          });
        google.options({auth});
    
        const response = await docs.documents.get({
          documentId: documentId,
        });
        console.log(util.inspect(response.data, false, 17));
        return response.data;
    },
    getAccessToken: async(req: Request, res: Response, next: NextFunction) => {
        const user = res.locals.user;
        try {
            const { access_token } = user;
            if (access_token) {
                return res.status(200).json({
                    status: 'success',
                    access_token: access_token,
                })
            } else {
                return next();
            }
        } catch(err) {
            console.log('Get access token catch: ', err);
        };
    },
};

export default oauthController;