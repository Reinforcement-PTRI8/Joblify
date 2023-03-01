import * as db from '../models/appModel';
import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';

const verifyPassword = async(submittedPassword: String, actualPassword: String) => {
    const result = await bcrypt.compare(submittedPassword, actualPassword);
    return result;
};

const usersController = {
    signup: async(req: Request, res: Response, next: NextFunction) => {
        let { first_name, last_name, email, password, occupation } = req.body;

        if (!first_name || !last_name || !email || !password) return next({
            log: 'Error while signing up',
            status: 404,
            messsage: {
                err: 'Please provide all necessary signup information',
            },
        });

        if (!occupation) occupation = 'Misc';

        const hashedPassword = await bcrypt.has(password, 12);
        const params = [first_name, last_name, email, hashedPassword, occupation];

        const createUser = {
            name: 'user-signup',
            text:
                `
                INSERT INTO users (first_name, last_name, email, password) 
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id, first_name, last_name, email, occupation
                `,
            values: params,
        };

        try {
            const newUser = await db.query(createUser);
            
            if (!newUser[0].length) return next({
                log: 'Error creating new user',
                status: 404,
                message: {
                    err: 'Something went wrong creating new account',
                },
            });

            res.locals.user = newUser.rows[0];
            return next();
        } catch (err) {
            return next({
                log: 'Error in signup controller',
                status: 500,
                message: {
                    err: err
                },
            })
        }
    },
    getUser: async(req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) return next({
                log: 'No email or password',
                status: 404,
                message: {
                    err: 'Please provide a valid email and password',
                },
            });

            const query = {
                name: 'login-by-email',
                text: `
                    SELECT id, first_name, last_name, email, occupation 
                    FROM users 
                    WHERE email=$1`,
                values: [email],
            };

            const user = await db.query(query);
            if (!user.rows.length || !await verifyPassword(password, user.rows[0].password)) return next({
                log: 'Error while authenticating user',
                status: 404,
                message: {
                    err: 'Invalid login credentials provided',
                },
            });

            res.locals.user = user.rows[0];
            return next();
        } catch(err) {
            return next({
                log: 'Error occurred while trying to get user information',
                status: 404,
                message: {
                    err: `Error in get user controller: ${err}`,
                },
            });
        };
    },
};

export default usersController;