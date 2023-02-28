import express from 'express';
import path from 'path';

const app: express.Express = express();
const PORT  = process.env.PORT || 3000;

interface Err {
    log: string;
    status: number;
    message: {
        err: string,
    };
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', express.static(path.resolve(__dirname, '../../build')));

// app.use('/backend', 
// //backend logic
// );

app.use('*', (req: express.Request, res: express.Response)=> {
  res.status(404).send('Sorry, not valid route');
})

// global error handler
app.use((err, req: express.Request, res: express.Response) => {
  

  const defaultErr: Err = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };

  const error = Object.assign({}, defaultErr, err);
  return res.status(error.status).json(error.message);
})

app.listen(PORT, () => console.log(`Connected to port: ${PORT}...`));