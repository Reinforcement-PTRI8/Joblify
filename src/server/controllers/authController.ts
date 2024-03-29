import jwt from 'jsonwebtoken';
import * as db from '../models/appModel';
import { Request, Response, NextFunction } from 'express';

const authController = {
    setCookie: async(req: Request, res: Response, next: NextFunction) => {
        console.log('auth controller set cookie')
        if (!res.locals.user) {
            res.locals.loggedIn = false;
            return next();
        };

        try {
            const { id, email } = res.locals.user;
            const token = jwt.sign({ id, email }, process.env.JWT_SECRET, { expiresIn: '24h' });

            res.cookie('jwt', token, {
                secure: false,
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            });
            res.cookie('userid', id, {
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            });

            res.locals.loggedIn = true;
            return next();
        } catch (err) {
            return next({
                log: 'Error setting user cookie',
                status: 500,
                message: { err: `Set Cookie Controller Error: ${err}`},
            });
        };
    },
    verifyCookie: async(req: Request, res: Response, next: NextFunction) => {
        //login not getting back cookie
        const token = req.cookies.jwt;
        console.log('token', token);
        if (!token) return next({
            log: 'User is not logged in',
            status: 404,
            message: {
                err: 'Please log in first',
            },
        });

        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        // console.log('checking jwt cookie:', decoded)
        const { id, email } = decoded;


        const response = await db.query(`SELECT first_name, last_name, email, occupation, access_token, refresh_token FROM users WHERE id=${id}`);

        if (!response.rows.length) return next({
            log: 'Error verifying user',
            status: 401,
            message: { err: 'User not found' },
        });
        console.log('verify user:', response.rows[0]);
        res.locals.user = response.rows[0];
        return next();
    },
    logout: async(req: Request, res: Response, next: NextFunction) => {
        try {
            res.clearCookie('jwt');
            res.clearCookie('oauth');
            res.locals.cookie = null;

            return res.status(200).json({ status: 'success' });
        } catch (err) {
            return next({
                log: 'Error while trying to logout',
                status: 500,
                message: {
                    err: `Error in logout controller: ${err}`
                },
            });
        };
    }
};

export default authController;