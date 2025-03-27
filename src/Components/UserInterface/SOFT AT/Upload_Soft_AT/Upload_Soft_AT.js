import React, { useState, useEffect, useCallback } from "react";
import { Box, Button, DialogTitle, Stack } from "@mui/material";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import UploadIcon from '@mui/icons-material/Upload';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import { postData, ServerURL, getData } from "../../../services/FetchNodeServices";
import OverAllCss from "../../../csss/OverAllCss";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import GearIcon from '@rsuite/icons/Gear';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import DownloadIcon from '@mui/icons-material/Download';
import Zoom from '@mui/material/Zoom';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';




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

const Upload_Soft_AT = () => {
  const [softAt, setSoftAt] = useState({ filename: "", bytes: "" })
  const [pdate, setPdate] = useState()
  const [fileData, setFileData] = useState()
  const [show, setShow] = useState(false)
  const [tableData, setTableData] = useState([])
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const fileLength = softAt.filename.length
  const classes = OverAllCss();
  var link = `${ServerURL}${fileData}`;

  const handlesoftAt = (event) => {
    setShow(false);
    setSoftAt({
      filename: event.target.files[0].name,
      bytes: event.target.files[0],
      state: true

    })

  }

  const handleSubmit = async () => {
    if (fileLength > 0) {
      setOpen(true)
      var formData = new FormData();
      formData.append("soft_at_status", softAt.bytes);
      formData.append("upload_date", pdate);
      const response = await postData('Soft_At/upload/', formData )
      // console.log('response data', response)
      // sessionStorage.setItem('upload_soft_at_status', JSON.stringify(response.status_obj))

      if (response.status == true) {
        setOpen(false)
        Swal.fire({
          icon: "success",
          title: "Done",
          text: `${response.message}`,
        });
        setTableData(response.error_rows)
        setOpen1(true)
        // navigate('status')

      } else {
        setOpen(false)
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${response.message}`,
        });
      }
    }
    else {
      setShow(true);
    }
  };

  const handleCancel = () => {
    setSoftAt({ filename: "", bytes: "" })
  }

  // DATA PROCESSING DIALOG BOX...............
  const loadingDialog = useCallback(() => {
    return (
      <Dialog
        open={open}

        // TransitionComponent={Transition}
        keepMounted
      // aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent>
          <Box style={{ padding: 20, display: 'flex', justifyContent: "center" }}></Box>
          <Box style={{ textAlign: 'center' }}><GearIcon pulse style={{ fontSize: '100px', color: '#232455' }} /></Box>
          <Box >DATA UNDER PROCESSING...</Box>
        </DialogContent>

      </Dialog>
    )
  }, [open])

  const showDialogStatus = useCallback(() => {
    return (
      <Dialog
        open={open1}
        // TransitionComponent={Transition}
        fullWidth
        maxWidth="lg"
        keepMounted
      // onClose={() => { setOpen1(false) }}
      // aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>
          <div style={{ display: 'flex' ,justifyContent:'space-between'}}>
            <div>

            </div>
            <div>
                <h4 style={{color:'red'}}>These below sites can not be uploaded</h4>
            </div>
            <div>
            <IconButton sx={{ float: 'right' }} size="large" onClick={() => { setOpen1(false) }}><CloseIcon /></IconButton>
            </div>

        </div>
         
        </DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 800 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Invalid Field</StyledTableCell>
                  <StyledTableCell >REMARKS</StyledTableCell>
                  <StyledTableCell >Unique Key</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData?.map((row) => (
                  <StyledTableRow>
                    <StyledTableCell style={{ whiteSpace: 'nowrap' }}>
                      <ol>
                        {row.invalid_fields?.map((data) => (
                          <li>{data}</li>
                        ))}
                      </ol>

                    </StyledTableCell>
                    <StyledTableCell align="left" style={{ whiteSpace: 'nowrap' }}>
                      <ol>
                        {row.remarks?.map((data) => (
                          <li>{data}</li>
                        ))}
                      </ol>

                    </StyledTableCell>
                    <StyledTableCell align="center">{row.unique_key}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>

      </Dialog>
    )
  }, [open1])

  const pastDate = () => {
    var d = new Date();
    d.setDate(d.getDate() - 1);
    var month = '' + (d.getMonth() + 1)
    var day = '' + d.getDate()
    var year = d.getFullYear()
    // console.log('date----:',day)

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    setPdate([year, month, day].join('-'))
  }

  //   Download Tem. #####################
  const handleDownload = async () => {
    const response = await getData('Soft_At/template/')
    setFileData(response.Download_url)
    // console.log('download data:', response)
  }

  useEffect(() => {
    pastDate();
    handleDownload();
    // useEffect(()=>{
    document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`

    //  },[])
  }, [])

  return (
    <Zoom in='true' timeout={800} style={{ transformOrigin: '1 1 1' }}>
      <div>
        <div style={{ margin: 5, marginLeft: 10 }}>
          <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
            <Link underline="hover" href='/tools'>Tools</Link>
            <Link underline="hover" href='/tools/soft_at'>Soft AT</Link>
            <Typography color='text.primary'>Upload Soft AT</Typography>
          </Breadcrumbs>
        </div>
        <Box style={{ position: 'fixed', right: 20 }}>
          <Tooltip title="Download Soft-At Temp.">
            <a download href={link}>
              <Fab color="primary" aria-label="add" >
                <DownloadIcon />
              </Fab>
            </a>
          </Tooltip>
        </Box>
        <Box className={classes.main_Box}>
          <Box className={classes.Back_Box} sx={{ width: { md: '75%', xs: '100%' } }}>
            <Box className={classes.Box_Hading} >
              UPLOAD SOFT AT REPORT
            </Box>
            <Stack spacing={2} sx={{ marginTop: "-40px" }} direction={'column'}>
              <Box className={classes.Front_Box} >
                <div className={classes.Front_Box_Hading}>
                  Select Soft AT File:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}>{softAt.filename}</span>
                </div>
                <div className={classes.Front_Box_Select_Button} >
                  <div style={{ float: "left" }}>
                    <Button variant="contained" component="label" color={softAt.state ? "warning" : "primary"}>
                      select file
                      <input required onChange={handlesoftAt} hidden accept="/*" multiple type="file" />
                    </Button>
                  </div>
                  <div>  <span style={{ display: show ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span> </div>
                  <div></div>
                </div>
              </Box>
              <Box className={classes.Front_Box}>
                <div className={classes.Front_Box_Hading}>
                  Upload Date:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}></span>
                </div>
                <div className={classes.Front_Box_Select_Button}>
                  <div >
                    <input required value={pdate} onChange={(event) => setPdate(event.target.value)} max={new Date()} type="date" style={{ width: '165px', height: '35px', fontSize: '20px', fontWeight: 500, borderRadius: "10px" }} />
                  </div>
                </div>
              </Box>


            </Stack>
            <Stack direction={{ xs: "column", sm: "column", md: "row" }} spacing={2} style={{ display: 'flex', justifyContent: "space-around", marginTop: "20px" }}>
              <Button variant="contained" color="success" onClick={handleSubmit} endIcon={<UploadIcon />}>upload</Button>

              <Button variant="contained" onClick={handleCancel} style={{ backgroundColor: "red", color: 'white' }} endIcon={<DoDisturbIcon />} >cancel</Button>

            </Stack>
          </Box>
          {/* <a download href={link}><Button variant="outlined" onClick='' startIcon={<FileDownloadIcon style={{ fontSize: 30, color: "green" }} />} sx={{ marginTop: "10px", width: "auto" }}><span style={{ fontFamily: "Poppins", fontSize: "22px", fontWeight: 800, textTransform: "none", textDecorationLine: "none" }}>Download Temp</span></Button></a> */}
        </Box>
        {loadingDialog()}
        {showDialogStatus()}
        {/* {handleError()} */}


      </div>
    </Zoom>
  )
}

export default Upload_Soft_AT