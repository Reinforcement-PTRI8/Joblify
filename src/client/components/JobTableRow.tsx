import React, { useState, useEffect } from 'react';
import TableRow from '@mui/material/TableRow';
// import Checkbox from '@mui/material/Checkbox';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import DeleteIcon from '@mui/icons-material/Delete';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import axios from 'axios';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    // backgroundColor: theme.palette.common.black,
    backgroundColor: '#42a5f5',
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));


const setRowIndex= ()=> {
  
}

const JobTableRow = ({ id, row, index, handleDelete, updateTargetRow}) => {

  // const forceUpdate = useForceUpdate();

  const [stage, setStage] = useState('');
  // const [rowContent, setRowContent] = useState(row);
  const updateStage = (e) => {
    setStage(e.target.value);
  }

  const handleUpdate = (e) => {
    //refactor to get rid of updatedRow
    const updatedRow = Object.assign({}, row);
    updatedRow.interview_stage = stage;
    updatedRow.last_interaction = (new Date()).toJSON();
    console.log('update row:', updatedRow);

    axios.put('/jobs/update', {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      data: {
        jobId: updatedRow.id,
        interview_stage: updatedRow.interview_stage,
        last_interaction: updatedRow.last_interaction
      }
    })
    .then((res) => {
      console.log(res);
      updateTargetRow(index, res.data.updatedJob.rows[0])
    })
    .catch(err => console.log(err));
    // useForceUpdate();
  }


  return (
      <StyledTableRow
          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <StyledTableCell component="th" scope="row">
                  {row.title}
              </StyledTableCell>
              <StyledTableCell align="center">
                  {row.company_name}
              </StyledTableCell>
              <StyledTableCell align="center">
                <a href = {row.job_url}>Link</a>
              </StyledTableCell>
              <StyledTableCell align="center">
                <FormControl sx={{ s: 1, minWidth: 100 }}>
                  <Select
                    value={stage}
                    onChange={updateStage}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                  >
                    <MenuItem value="">
                      <em>{row.interview_stage}</em>
                    </MenuItem>
                    <MenuItem value={'Applied'}>Applied</MenuItem>
                    <MenuItem value={'Phone Screen'}>Phone Screen</MenuItem>
                    <MenuItem value={'Technical Interviews'}>Technical Interview</MenuItem>
                    <MenuItem value={'System Design Interview'}>System Design Interview</MenuItem>
                    <MenuItem value={'Offer'}>Offer</MenuItem>
                  </Select>
              </FormControl>
              </StyledTableCell>
              <StyledTableCell align="center">
                  {row.last_interaction}
              </StyledTableCell>
              <StyledTableCell align="center">
              <Button variant="outlined" onClick = {handleUpdate}>Update</Button>
              </StyledTableCell>
              <StyledTableCell align="center">
                <DeleteIcon onClick={(e) => handleDelete(index, e, id)}/>
              </StyledTableCell>
      </StyledTableRow >
  )
};

export default JobTableRow;