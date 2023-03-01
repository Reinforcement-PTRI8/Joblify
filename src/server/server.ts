import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';

import userRouter from './routes/user';
import authRouter from './routes/auth';
import oauthRouter from './routes/oauth';
import jobRouter from './routes/jobs';

import { Err } from './types.t';

const app: express.Express = express();
const PORT  = process.env.PORT || 3000;


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', express.static(path.resolve(__dirname, '../../build')));

// --- ROUTES ---//
app.use('/auth', authRouter);
app.use('/oauth', oauthRouter);
app.use('users', userRouter);
app.use('/jobs', jobRouter);

//oauth route
//regular signup
//regular signin
//user upload resume (google doc)
//user upload cv
//user submit job links
//user update job stage
//user view job stage/ visual
//save 

app.use('*', (req: express.Request, res: express.Response)=> {
  res.status(404).send('Sorry, not valid route');
})

// global error handler
app.use((err: Error, req: express.Request, res: express.Response) => {


  const defaultErr: Err = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };

  const error = Object.assign({}, defaultErr, err);
  return res.status(error.status).json(error.message);
})

app.listen(PORT, () => console.log(`Connected to port: ${PORT}...`));