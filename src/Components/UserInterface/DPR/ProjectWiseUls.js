import React, { useState,useEffect } from 'react'
import { getData } from "../../services/FetchNodeServices";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function ProjectWiseUls() {
    const [pwUls,setPwUls]=useState([])


    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
          backgroundColor: '#223353',
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


    const FetchAllULS=async()=>
    {
        const response = await getData('trend/circle_wise_dashboard/?project=ULS')
        setPwUls(response.data)
        console.log(response.data)
    }
    useEffect(function () {
        FetchAllULS();
      }, []);

    const displayTable=()=>
    {
        return(
        <><TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>CIRCLE</StyledTableCell>
              <StyledTableCell align="right">total_ms1_site</StyledTableCell>
              <StyledTableCell align="right">total_soft_at_done</StyledTableCell>
              <StyledTableCell align="right">total_physical_at_done</StyledTableCell>
              <StyledTableCell align="right">total_performance_at_done</StyledTableCell>
              <StyledTableCell align="right">percent_soft_at_done</StyledTableCell>
              <StyledTableCell align="right">percent_physical_at_done</StyledTableCell>
              <StyledTableCell align="right">percent_performance_at_done</StyledTableCell>
              <StyledTableCell>Total_ms2_site</StyledTableCell>
              <StyledTableCell>percent_ms2_site</StyledTableCell>
              <StyledTableCell>total_mapa</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pwUls.map((row) => (
              <StyledTableRow>
                <StyledTableCell component="th" scope="row">
                  {row.circle}
                </StyledTableCell>
                <StyledTableCell align="right">{row.total_ms1_site}</StyledTableCell>
              <StyledTableCell align="right">{row.total_soft_at_done}</StyledTableCell>
              <StyledTableCell align="right">{row.total_physical_at_done}</StyledTableCell>
              <StyledTableCell align="right">{row.total_performance_at_done}</StyledTableCell>
              <StyledTableCell align="right">{row.percent_soft_at_done}</StyledTableCell>
              <StyledTableCell align="right">{row.percent_physical_at_done}</StyledTableCell>
              <StyledTableCell align="right">{row.percent_performance_at_done}</StyledTableCell>
              <StyledTableCell>{row.Total_ms2_site}</StyledTableCell>
              {/* <StyledTableCell>{row.percent_ms2_site}</StyledTableCell>  */}
              <StyledTableCell>{row.percent_ms2_site >=90 && row.percent_ms2_site <= 100?<span style={{color:"green"}}>{row.percent_ms2_site}%</span>:row.percent_ms2_site >=80 && row.percent_ms2_site <90 ?<span style={{color:"orange"}}>{row.percent_ms2_site}%</span>:<span style={{color:"red"}}>{row.percent_ms2_site}%</span> }</StyledTableCell>
              <StyledTableCell>{row.total_mapa}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

            </>
        )
    }
  return (
    <div>
        <div style={{margin:"50px 60px"}}>
        {displayTable()}
    </div>
    </div>
  )
}
