import jwt from 'jsonwebtoken';
import * as db from '../models/appModel';
import { Request, Response, NextFunction } from 'express';

const authController = {
    setCookie: async(req: Request, res: Response, next: NextFunction) => {
        if (!res.locals.user) {
            res.locals.loggedIn = false;
            return next();
        }

        try {
            const { id, email } = res.locals.user;
            const token = jwt.sign({ id, email }, process.env.JWT_SECRET, { expiresIn: '24h' });

            res.cookie('jwt', token, {
                expires: new Date(Date.now() + 24 + 60 * 60 * 1000),
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
        const { token } = req.cookies.jwt;
        
        if (!token) {
            res.locals.verified = false;
            return next();
        };

        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        const { id, user } = decoded;
        const response = await db.query(
            `SELECT * FROM users
            WHERE id=${id}`
        );

        if (!response.rows.length) return next({
            log: 'Error verifying user',
            status: 401,
            message: { err: 'User not found' },
        });

        res.locals.user = response.rows[0];
        return next();
    },
};

export default authController;