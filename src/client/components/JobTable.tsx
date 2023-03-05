import React, { useState, useEffect } from 'react';
import TableRow from '@mui/material/TableRow';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import JobTableRow from './JobTableRow';
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

const JobTable = ({ data }) => {
    const [rows, setRows] = useState([]);
    const [selected, setSelected] = useState(new Set());
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);


    useEffect(() => {
        const newRows = data.map(datum => {
            return {
                id: datum.id,
                title: datum.title,
                company_name: datum.company_name,
                job_url: datum.job_url,
                interview_stage: datum.interview_stage,
                last_interaction: datum.last_interaction,
            };
        });
        setRows(newRows);
    }, [data]);

    const handleDelete = async (index, e, id) => {
      setRows(data.filter((item, i) => i !== index));
      const jobId = id;
      // console.log('jobid sent through request:', jobId)
      axios.delete('/jobs/current', {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        data: {jobId: jobId}
      })
      .then((res)=> console.log(res))
      .catch(err => console.log(err));
    };





    const pageChangeHandler = (event: unknown, page: number) => {
        if (page < 0) return;
        setPage(page);
    };

    const rowsPerPageChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const result = parseInt(event.target.value, 10);
        if (!result) return;
        setRowsPerPage(result);
        setPage(0);
    };

    return(
      <Paper sx={{ width: '99%', mb: 2 }}>
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                <StyledTableCell align="center">Job Title</StyledTableCell>
                <StyledTableCell align="center">Company Name</StyledTableCell>
                <StyledTableCell align="center">Job URL</StyledTableCell>
                <StyledTableCell align="center">Interview Stage</StyledTableCell>
                <StyledTableCell align="center">Last Modified</StyledTableCell>
                <StyledTableCell align="center">Update Job</StyledTableCell>
                <StyledTableCell align="center">Delete Job</StyledTableCell>
                </TableRow>
              </TableHead>
                <TableBody>
                    {rows.length > 0 && rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => (
                        <JobTableRow
                            key = {`${i}`}
                            id={`${row.id}`}
                            row={row}
                            index={i}
                            handleDelete = {handleDelete}/>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        <TablePagination
            rowsPerPageOptions={[5, 10, 20]}
            component="div"
            count={rows?.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={pageChangeHandler}
            onRowsPerPageChange={rowsPerPageChangeHandler}
            sx={{mr: 13}}
        />
    </Paper>
    );
};

export default JobTable;