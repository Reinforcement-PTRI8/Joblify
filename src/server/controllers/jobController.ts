import * as db from '../models/appModel';
import { Request, Response, NextFunction } from 'express';
// import { format } from 'date-fns';

const jobController = {

  createJob: async(req: Request, res: Response, next: NextFunction) => {
    let { job_url, title, company_name, interview_stage, last_interaction} = req.body;
    let user_id = res.locals.user.id;
    const params = [user_id, job_url, title, company_name, interview_stage, last_interaction];
    try {
        const createJob = {
            name: 'user-create-job',
            text: 'INSERT INTO jobs (user_id, job_url, title, company_name, interview_stage, last_interaction) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, user_id, job_url, title, company_name, interview_stage, last_interaction',
            values: params,
        };
        const newJob = await db.query(createJob);
        console.log('createJob in try block', newJob.rows);

        if (!newJob.rows.length) return next({
            log: 'Error creating new job',
            status: 404,
            message: {
                err: 'Something went wrong creating new job for the user',
            },
        });

        res.locals.job = newJob.rows[0];
        return next();
    } catch (err) {
        console.log('catch block', err);
        return next({
            log: 'Error in createjob controller',
            status: 500,
            message: {
                err: err
            },
        });
    };
},

//controller for testing
  getAllJobs: async(req: Request, res: Response, next: NextFunction)=> {
    try {
        console.log('checking for cookies:',req.cookies)
        const user_id = req.cookies.userid;
        // console.log('getting user:', user_id);
        const jobs = await db.query(`SELECT * FROM jobs WHERE user_id=${user_id}`);
        res.locals.jobs = jobs.rows;
        console.log('user all jobs:',res.locals.jobs)
        return next();
    }catch (err) {
        return next({
            log: 'Error occurred in get all jobs middleware',
            status: 500,
            message: { err: err},
        });
    }
  },

  getJobById: async(req: Request, res: Response, next: NextFunction)=> {
    try {
        const id  = Number(req.params.id);
        console.log('Getting job id:', typeof id);
        if (!id || typeof id !== 'number') return next({
            log: 'Error requesting job by id',
            status: 404,
            messasge: {
                err: 'Please provide a valid job id',
            },
        });

        const job = await db.query(`SELECT * FROM jobs WHERE id=${id}`);
        res.locals.job = job;
        return next();
    } catch (err) {
        return next({
            log: 'Error occurred in get job by id middleware',
            status: 500,
            message: { err: err},
        });
    }
  },

  updateJobById: async(req: Request, res: Response, next: NextFunction)=> {
    try{
        let {jobId, interview_stage, last_interaction} = req.body.data;
        jobId = Number(jobId);
        last_interaction = new Date(last_interaction).toISOString().substring(0, 10);
        console.log('checking update jobid:', jobId, typeof jobId)

        if (!jobId || typeof jobId !== 'number') return next({
            log: 'Error updating job by id',
            status: 404,
            messasge: {
                err: 'Please provide a valid job id',
            },
        });
        const updateQuery = `UPDATE jobs SET interview_stage = '${interview_stage}', last_interaction = '${last_interaction}' WHERE id=${jobId} RETURNING id, user_id, job_url, title, company_name, interview_stage, last_interaction`
        const updatedJob = await db.query(updateQuery);
        res.locals.updatedJob = updatedJob;
        console.log('createJob in try block', updatedJob.rows);
        return next();
    }catch (err) {
      console.log('Update job error: ', err);
      return next({
        log: 'Error occurred in update job by id middleware',
        status: 500,
        message: { err: err},
      });
    }
  },

  deleteJobById: async(req: Request, res: Response, next: NextFunction) => {
    try{
        let {jobId} = req.body;
        jobId = Number(jobId);
        // console.log('deleting job id', jobId, typeof jobId)
        if (!jobId || typeof jobId !== 'number') return next({
            log: 'Error updating job by id',
            status: 404,
            messasge: {
                err: 'Please provide a valid job id',
            },
        });
        const deleteQuery = `DELETE FROM jobs WHERE id=${jobId} RETURNING id, user_id, job_url, title, company_name, interview_stage, last_interaction`
        const deletedJob = await db.query(deleteQuery);
        res.locals.deletedJob = deletedJob;
        return next();
    } catch (err) {
        return next({
          log: 'Error occurred in delete job by id middleware',
          status: 500,
          message: { err: err},
        });
      }
  }

};

export default jobController;