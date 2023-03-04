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
        // console.log('reqbody', req.body);
        try {
            
            const existingUser = await db.query(`SELECT first_name FROM users WHERE email='${email}'`);
            if (existingUser.rows.length) {

                return next({
                    log: 'Error creating user account',
                    status: 404,
                    message: { err: 'Email already exists'}
                });
            };
            
            if (!occupation) occupation = 'Misc';
    
            const hashedPassword = await bcrypt.hash(password, 12);
            const params = [first_name, last_name, email, hashedPassword, occupation];
    
            const createUser = {
                name: 'user-signup',
                text: 'INSERT INTO users (first_name, last_name, email, password, occupation) VALUES ($1, $2, $3, $4, $5) RETURNING id, first_name, last_name, email, occupation',
                values: params,
            };
            const newUser = await db.query(createUser);
            
            console.log('in try block', newUser.rows);
            if (!newUser.rows.length) return next({
                log: 'Error creating new user',
                status: 404,
                message: {
                    err: 'Something went wrong creating new account',
                },
            });

            res.locals.user = newUser.rows[0];
            return next();
        } catch (err) {
            console.log('catch block', err);
            return next({
                log: 'Error in signup controller',
                status: 500,
                message: {
                    err: err
                },
            });
        };
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
                text: 
                `SELECT id, first_name, last_name, email, password, occupation FROM users WHERE email=$1`,
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

            delete user.rows[0].password;
            res.locals.user = user.rows[0];
            return next();
        } catch(err) {
            console.log('Catch block:, ', err);
            return next({
                log: 'Error occurred while trying to get user information',
                status: 404,
                message: {
                    err: `Error in get user controller: ${err}`,
                },
            });
        };
    },
    getUserById: async(req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;

            if (!id || typeof id !== 'number') return next({
                log: 'Error requesting user by id',
                status: 404,
                messasge: {
                    err: 'Please provide a valid id',
                },
            });

            const user = await db.query(`SELECT * FROM users WHERE id=${id}`);
            res.locals.user = user;
            return next();
        } catch (err) {
            return next({
                log: 'Error occurred in get user by id middleware',
                status: 500,
                message: { err: err},
            });
        }
    },
    updateUserById: async(req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params
            let { first_name, last_name, email, occupation } = req.body;

            const params = [first_name, last_name, email, occupation];

            const updateUser = {
                name: 'user-update',
                text: 'UPDATE users (first_name, last_name, email, occupation) VALUES ($1, $2, $3, $4) RETURNING id, first_name, last_name, email, occupation',
                values: params
            }

            const updatedUsers = await db.query(updateUser);
            res.locals.user = updatedUsers.rows[0];
            return next();
        } catch (err) {
            return next({
                log: 'Error occured in updating user by id middleware',
                status: 500, 
                message: {err: err}
            })
        }
    }
};

export default usersController;