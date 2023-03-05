import express from 'express';
import jobController from '../controllers/jobController';
import authController from '../controllers/authController';
const router = express.Router();

router.post('/createJob', authController.verifyCookie,  jobController.createJob, (req, res) => {
  res.status(200).json({
      status: 'success',
      job: res.locals.job
  });
});

//route for testing, need to adjust controller
router.get('/all', jobController.getAllJobs, (req, res) => {
  return res.status(200).json({
      status: 'success',
      jobs: res.locals.jobs
  });
});

router.get('/:id', jobController.getJobById, (req, res) => {
  return res.status(200).json({
      status: 'success',
      job: res.locals.job
  });
});

router.put('/update', jobController.updateJobById, (req, res) => {
  res.status(200).json({
      status: 'success',
      updatedJob: res.locals.updatedJob
  });
});

router.delete('/current', jobController.deleteJobById, (req, res) => {
  res.status(200).json({
    status: 'success',
    deletedJob: res.locals.deletedJob
});
})

export default router;