import { google } from 'googleapis';
import axios from 'axios';

import * as db from '../models/appModel';
import { Request, Response, NextFunction } from 'express';

const { OAuth2 } = google.auth;
const oauth2Client = new OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URL
);

const docs = google.docs({
    version: 'v1',
    auth: oauth2Client,
});

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

            const user = await db.query(`SELECT id, first_name, last_name, email FROM users WHERE email='${email}'`);

            if (user.rows.length) {
                res.locals.user = user.rows[0];
            } else {
                const createUser = {
                    name: 'user-signup',
                    text: 'INSERT INTO users (first_name, last_name, email, access_token) VALUES ($1, $2, $3, $4) RETURNING id, first_name, last_name, email',
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
    parseDocument: async(req: Request, res: Response, next: NextFunction) => {
        const { documentId } = req.params;
        console.log('Parse Document controller: ', documentId);
        if (!documentId) return next({
            log: 'Error in parse document controller',
            status: 401,
            message: {
                err: 'Please send a valid document id',
            },
        });

        try {
            const response = await docs.documents.get({ documentId });
            const text = await response.data.body.content.map(obj => obj.paragraph.elements.map(obj2 => obj2.textRun.content)).join('\n');

            console.log('Parsed content: ', text);
            return next();
        } catch (err) {
            console.log('Catch block: ', err);
            return next({
                log: 'Error occurred trying to parse google document',
                status: 500,
                message: {
                    err: err,
                },
            });
        };
    },
};

export default oauthController;