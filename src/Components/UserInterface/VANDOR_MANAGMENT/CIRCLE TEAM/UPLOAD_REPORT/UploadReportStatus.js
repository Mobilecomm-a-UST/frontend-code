import React,{useState,useEffect} from "react";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';

const UploadReportStatus = () => {
    const fileData =JSON.parse(sessionStorage.getItem('vendor_upload_report'))

    useEffect(function () {
        console.log("SHow data:",fileData)
        document.title=`${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/',' | ').toUpperCase()}`
      }, []);

      const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
          backgroundColor: theme.palette.common.black,
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

    const displayTable=()=>
    {
        return(
        <><TableContainer component={Paper}>
        <Table sx={{ minWidth: 800 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>SITE ID</StyledTableCell>
              <StyledTableCell align="right">UPLOAD/UPDATE STATUS</StyledTableCell>
              <StyledTableCell align="right">REMARKS</StyledTableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {fileData.map((row) => (
              <StyledTableRow>
                <StyledTableCell component="th" scope="row">
                  {row.id}
                </StyledTableCell>
                <StyledTableCell align="center">{row.update_status=='UPDATED'?<><CheckIcon sx={{color:"green"}}/></>:<><ClearIcon sx={{color:"red"}}/></>}</StyledTableCell>
              <StyledTableCell align="right">{row.Remark}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

            </>
        )
    }
  return (
    <>
    <Box sx={{
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginTop: "1px",
  padding: "20px",
  flexDirection: "column",
}}
>
<Box
  sx={{
    display: "flex",
    justifyContent: "center",
    width: "100%",
    padding: "15px 10px",
    fontFamily: "sans-serif",
    fontSize: "25px",
    fontWeight: 600,
    backgroundColor: "#223353",
    color:"white",
    borderRadius:"10px"
  }}
>
   UPLOAD REPORT STATUS
</Box>
<div style={{margin:"25px 30px",height:"500px"}}>
{displayTable()}
</div>

</Box>
</>
  )
}

export default UploadReportStatus