import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import JobTable from '../components/JobTable';

const Application = ({ id, firstName, lastName, email }) => {

  const [jobs, setJobs] = useState([]);

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

  // console.log('jobs:', jobs);
  // const [url, setUrl] = useState('');
  // const [title, setTitle] = useState('');
  // const [company, setCompany] = useState('');
  // const [stage, setStage] = useState('Applied');
  // const [interactionDate, setInteractionDate] = useState(new Date());



  return (
    <div>
      <div>{`${firstName}, your job applications:`}</div>
      {jobs.length > 0 &&
      <JobTable
        data = {jobs}
      />
      }

    </div>
  )
}

export default Application;