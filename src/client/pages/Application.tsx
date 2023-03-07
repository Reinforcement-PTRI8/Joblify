import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import JobTable from '../components/JobTable';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import '../styles/job.css';

const defaultField = {
  job_url: '',
  title: '',
  company_name: '',
  interview_stage: 'Applied',
  last_interaction: ''
}

const Application = ({ id, firstName, lastName, email }) => {

  const [jobs, setJobs] = useState([]);
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState('');
  const [jobField, setJobField] = useState(defaultField);
  const [create, setCreate] = useState(false);


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    // createJob();
    setOpen(false);
  };

  const handleSubmitClose = () => {
    createJob();
    setOpen(false);
    setCreate(true);
  };


  const createJob = ()=> {
    //send request to backend to create job
    console.log(jobField);
    jobField["last_interaction"] = new Date(Date.now()).toISOString().substring(0, 10);
    if(jobField.title && jobField.company_name) {
      axios.post('/jobs/createJob', {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        data: jobField
      })
      .then((result) => {
        console.log(result.data)
      })
      .catch(err => console.log(err));
    } else {
      alert('please fill in all fields');
    }
  };

  const changeHandler = (event) => {
    const { name, value } = event.target;
    setJobField({ ...jobField, [name]: value });
    // setJobField({ ...jobField, interview_stage: stage });
    // setJobField({ ...jobField, last_interaction: new Date(Date.now()).toISOString().substring(0, 10) });
  }

  useEffect(() => {
    axios.get('/jobs/all', {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })
    .then((result) => {
      setJobs(result.data.jobs)
    })
    .catch(err => console.log(err));
  },[]);

  useEffect(() => {
    setCreate(false);
    // if(create) setCreate(false);
    // else setCreate(true);
}, [create])

  return (
    <div className="job-container">
      <div>
        <div>{`${firstName}, your job applications:`}</div>
        {jobs.length > 0 &&
        <JobTable
          data = {jobs}
        />
        }
      </div>
      <div>
        <Button variant="outlined" onClick={handleClickOpen}>
          Create Job Application
        </Button >
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>New Job Application</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Job Title"
              name = "title"
              fullWidth
              variant="standard"
              onChange = {changeHandler}
            />
             <TextField
              autoFocus
              margin="dense"
              label= "Company Name"
              name = "company_name"
              fullWidth
              variant="standard"
              onChange = {changeHandler}
            />
             <TextField
              autoFocus
              margin="dense"
              label="Job URL"
              name ="job_url"
              fullWidth
              variant="standard"
              onChange = {changeHandler}
            />
            <FormControl sx={{ s: 1, minWidth: 100, mt: 2 }}>
                <Select
                  name = "interview_stage"
                  value = "Applied"
                  onChange = {changeHandler}
                  // onChange={updateStage}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Without label' }}
                >
                  <MenuItem value="">
                    <em>Interview Stage</em>
                  </MenuItem>
                  <MenuItem value={'Applied'}>Applied</MenuItem>
                  <MenuItem value={'Phone Screen'}>Phone Screen</MenuItem>
                  <MenuItem value={'Technical Interviews'}>Technical Interview</MenuItem>
                  <MenuItem value={'System Design Interview'}>System Design Interview</MenuItem>
                  <MenuItem value={'Offer'}>Offer</MenuItem>
                </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmitClose}>Submit</Button>
          </DialogActions>
        </Dialog>
      </div>
  </div>
  )
}

export default Application;