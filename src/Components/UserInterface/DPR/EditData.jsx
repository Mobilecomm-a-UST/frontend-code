import React from 'react'
import { Box, TextField,Button } from '@mui/material'
import { useSelector } from 'react-redux'
import { useState,useEffect } from 'react'
import { useStyles } from './EditDataCss'
import { Grid,Table,TableCell,TableRow,TableHead } from '@mui/material'
import { Dropdown } from 'rsuite';
import { Modal,ButtonGroup } from 'rsuite';
import { getData, postData } from '../../services/FetchNodeServices'
import Swal from 'sweetalert2'
import { styled } from '@mui/material/styles';
import { Input } from 'rsuite';

const EditData = () => {
    const listData= useSelector(state=>state.datetime)
    const [saveData,setSaveData] = useState(listData.event)
    const [secondApi,setSecondApi] = useState([])
    const [tempApi,setTempApi] = useState([])
    const [bands,setBands] = useState([])
    const [openSoftAcc,setOpenSoftAcc]=useState(false)
    const [openSoftRej,setOpenSoftRej]=useState(false)
    const [openSoftOff,setOpenSoftOff]=useState(false)
    const [openSoftPen,setOpenSoftPen]=useState(false)
    const [openPhysicalAcc,setOpenPhysicalAcc]=useState(false)
    const [openPhysicalRej,setOpenPhysicalRej]=useState(false)
    const [openPhysicalOff,setOpenPhysicalOff]=useState(false)
    const [openPhysicalPen,setOpenPhysicalPen]=useState(false)
    const [openPerforAcc,setOpenPerforAcc]=useState(false)
    const [openPerforRej,setOpenPerforRej]=useState(false)
    const [openPerforOff,setOpenPerforOff]=useState(false)
    const [openPerforPen,setOpenPerforPen]=useState(false)
    const [softAtAcceptDate,setSoftAtAcceptData]=useState()
    const [softAtAcceptFile,setSoftAtAcceptFile]=useState({ filename: "", bytes: "" })
    const [physicalAtAcceptDate,setPhysicalAtAcceptData]=useState()
    const [physicalAtAcceptFile,setPhysicalAtAcceptFile]=useState({ bytes: "" })
    const [perforAtAcceptDate,setPerforAtAcceptData]=useState()
    const [perforAtAcceptFile,setPerforAtAcceptFile]=useState({ bytes: "" })
    const [softAtRejectDate,setSoftAtRejectDate]=useState()
    const [softAtRejectReason,setSoftAtRejectReason]=useState()
    const [physicalAtRejectDate,setPhysicalAtRejectDate]=useState()
    const [physicalAtRejectReason,setPhysicalAtRejectReason]=useState()
    const [perforAtRejectDate,setPerforAtRejectDate]=useState()
    const [perforAtRejectReason,setPerforAtRejectReason]=useState()
    const [softAtOfferDate,setSoftAtOfferDate]=useState()
    const [softAtOfferRemark,setSoftAtOfferRemark]=useState()
    const [physicalAtOfferDate,setPhysicalAtOfferDate]=useState()
    const [physicalAtOfferRemark,setPhysicalAtOfferRemark]=useState()
    const [perforAtOfferDate,setPerforAtOfferDate]=useState()
    const [perforAtOfferRemark,setPerforAtOfferRemark]=useState()
    const [softAtPendingDate,setSoftAtPendingDate]=useState()
    const [softAtPendingRemark,setSoftAtPendingRemark]=useState()
    const [softAtPendingReason,setSoftAtPendingReason]=useState()
    const [physicalAtPendingDate,setPhysicalAtPendingDate]=useState()
    const [physicalAtPendingRemark,setPhysicalAtPendingRemark]=useState()
    const [physicalAtPendingReason,setPhysicalAtPendingReason]=useState()
    const [perforAtPendingDate,setPerforAtPendingDate]=useState()
    const [perforAtPendingRemark,setPerforAtPendingRemark]=useState()
    const [perforAtPendingReason,setPerforAtPendingReason]=useState()
    const [accBands,setAccBands]=useState()
    const [rejBands,setRejBands]=useState()
    const [offBands,setOffBands]=useState()
    const [penBands,setPenBands] = useState()
    const [mapaOk,setMapaOk] = useState('OK')
    const [mapaNotOk,setMapaNotOk] = useState('NOT OK')
    const [perforBand,setPerforBand] = useState([])
    const classes=useStyles();
    var softAt = 'Null'

    delete secondApi.id
    // delete secondApi.MAPA_STATUS
    Object.keys(secondApi).forEach(key => {
      if (secondApi[key] === null || secondApi[key]==='') {
        delete secondApi[key];
      }

    });

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
      // hide last border
      '&:last-child td, &:last-child th': {
        border: 0,
      },
    }));

// console.log('BANDS:',accBands)
var i = -1;
    const chackbands=()=>
    {
        return(
        perforBand.map((row)=>{ i=i+1;
          return(
            <Dropdown.Item>
            <span><span style={{fontSize:16,fontWeight:"bold"}}> {row.band} </span>
             <Dropdown  title={row.Performance_AT_Status}  Placement="right" style={{width:"100px"}}>
            <Dropdown.Item style={{width:"120px"}} onClick={()=>{setAccBands(row.band); setOpenPerforAcc(true)}} disabled={row.Performance_AT_Status=='ACCEPTED'?true:false}>ACCEPTED</Dropdown.Item>
            <Dropdown.Item  onClick={()=>{setRejBands(row.band); setOpenPerforRej(true)}}>REJECTED</Dropdown.Item>
            <Dropdown.Item onClick={()=>{setOffBands(row.band); setOpenPerforOff(true)}}>OFFERED</Dropdown.Item>
            <Dropdown.Item onClick={()=>{setPenBands(row.band); setOpenPerforPen(true)}}>PENDING</Dropdown.Item>
          </Dropdown>
          </span>
          </Dropdown.Item>

          )


        }))
    }

    const handleMapaStatusOk=async()=>
    {
     var  formData = new FormData()
     formData.append('MAPA',mapaOk)
      const response = await postData(`trend/mapa_single_site_update/${saveData.id}`,formData)
      if (response.status) {
        Swal.fire({
          icon: "success",
          title: "Done",
          text: "MAPA Updated Successfully",
        });
        handleClose()
        fetchSecondApiData()
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "ALL STATUS are not ACCEPTED",
        });
        handleClose()
      }
    }
    const handleMapaStatusNotOk=async()=>
    {
     var  formData = new FormData()
     formData.append('MAPA',mapaNotOk)
      const response = await postData(`trend/mapa_single_site_update/${saveData.id}`,formData)
      if (response.status) {
        Swal.fire({
          icon: "success",
          title: "Done",
          text: "MAPA Updated Successfully",
        });
        handleClose()
        fetchSecondApiData()
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "ALL STATUS are not ACCEPTED",
        });
        handleClose()
      }
    }




    const handleSoftAtAcceptFile = (event) => {
      setSoftAtAcceptFile({
        filename: URL.createObjectURL(event.target.files[0]),
        bytes: event.target.files[0],
      });
    };

    const fetchSecondApiData=async()=>
    {
      const response = await getData(`trend/single_site_view/${saveData.id}/`)
      setSecondApi(response.data)
      setTempApi(response.data)
      setPerforBand(response.band_status)
      setBands(response.band_list)

      console.log("second Api Data",response.band_list)
      console.log("perfor bands Data",response.band_status)
    }

    const postSoftAtAcceptData= async()=>
    {
      var formData = new FormData()
      formData.append('SOFT_AT_ACCEPTANCE_DATE',softAtAcceptDate)
      formData.append('SOFT_AT_ACCEPTANCE_MAIL',softAtAcceptFile.bytes)
      const response = await postData(`trend/soft_at_update/${saveData.id}/ACCEPTED`,formData)
      console.log("SOFT AT ACCEPTED:",response)
      if (response.status) {
        Swal.fire({
          icon: "success",
          title: "Done",
          text: "Soft AT Accepted Update Successfully",
        });
        handleClose()
        fetchSecondApiData()
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
        handleClose()
      }
    }
    const postPhysicalAtAcceptData= async()=>
    {
      var formData = new FormData()
      formData.append('PHYSICAL_AT_ACCEPTANCE_DATE',physicalAtAcceptDate)
      formData.append('PHYSICAL_AT_ACCEPTANCE_MAIL',physicalAtAcceptFile.bytes)
      const response = await postData(`trend/physical_at_update/${saveData.id}/ACCEPTED`,formData)
      console.log("PHYSICAL AT ACCEPTED:",response)
      if (response.status) {
        Swal.fire({
          icon: "success",
          title: "Done",
          text: "Physical AT Accepted Update Successfully",
        });
        handleClose()
        fetchSecondApiData()
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
        handleClose()
      }
    }
    const postPerforAtAcceptData= async()=>
    {
      var formData = new FormData()
      formData.append('PERFORMANCE_AT_ACCEPTANCE_DATE',perforAtAcceptDate)
      formData.append('PERFORMANCE_AT_ACCEPTANCE_MAIL',perforAtAcceptFile.bytes)
      const response = await postData(`trend/performance_at_update/${saveData.id}/ACCEPTED/${accBands}`,formData)
      console.log("performance AT ACCEPTED:",response)
      if (response.status) {
        Swal.fire({
          icon: "success",
          title: "Done",
          text: "Performance AT Accepted Update Successfully",
        });
        handleClose()
        fetchSecondApiData()
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
        handleClose()
      }
    }
    const postSoftAtRejectData= async()=>
    {
      var formData = new FormData()
      formData.append('SOFT_AT_REJECTION_DATE',softAtRejectDate)
      formData.append('SOFT_AT_REJECTION_REASON',softAtRejectReason)
      const response = await postData(`trend/soft_at_update/${saveData.id}/REJECTED`,formData)
      console.log("SOFT AT Rejected:",response)
      if (response.status) {
        Swal.fire({
          icon: "success",
          title: "Done",
          text: "Soft AT Rejected Update Successfully",
        });
        handleClose()
        fetchSecondApiData()
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
        handleClose()
      }
    }
    const postPhysicalAtRejectData= async()=>
    {
      var formData = new FormData()
      formData.append('PHYSICAL_AT_REJECTION_DATE',physicalAtRejectDate)
      formData.append('PHYSICAL_AT_REJECTION_REASON',physicalAtRejectReason)
      const response = await postData(`trend/physical_at_update/${saveData.id}/REJECTED`,formData)
      console.log("physical AT Rejected:",response)
      if (response.status) {
        Swal.fire({
          icon: "success",
          title: "Done",
          text: "physical AT Rejected Update Successfully",
        });
        handleClose()
        fetchSecondApiData()
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
        handleClose()
      }
    }
    const postPerforAtRejectData= async()=>
    {
      var formData = new FormData()
      formData.append('PERFORMANCE_AT_REJECTION_DATE',perforAtRejectDate)
      formData.append('PERFORMANCE_AT_REJECTION_REASON',perforAtRejectReason)
      const response = await postData(`trend/performance_at_update/${saveData.id}/REJECTED/${rejBands}`,formData)
      console.log("performance AT Rejected:",response)
      if (response.status) {
        Swal.fire({
          icon: "success",
          title: "Done",
          text: "performance AT Rejected Update Successfully",
        });
        handleClose()
        fetchSecondApiData()
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
        handleClose()
      }
    }
    const postSoftAtOfferData= async()=>
    {
      var formData = new FormData()
      formData.append('SOFT_AT_OFFERED_DATE',softAtOfferDate)
      formData.append('SOFT_AT_OFFERED_REMARKS',softAtOfferRemark)
      const response = await postData(`trend/soft_at_update/${saveData.id}/OFFERED`,formData)
      console.log("SOFT AT Offered:",response)
      if (response.status) {
        Swal.fire({
          icon: "success",
          title: "Done",
          text: "Soft AT Offered Update Successfully",
        });
        handleClose()
        fetchSecondApiData()
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
        handleClose()
      }
    }
    const postPhysicalAtOfferData= async()=>
    {
      var formData = new FormData()
      formData.append('PHYSICAL_AT_OFFERED_DATE',physicalAtOfferDate)
      formData.append('PHYSICAL_AT_OFFERED_REMARKS',physicalAtOfferRemark)
      const response = await postData(`trend/physical_at_update/${saveData.id}/OFFERED`,formData)
      console.log("physical AT Offered:",response)
      if (response.status) {
        Swal.fire({
          icon: "success",
          title: "Done",
          text: "Physical AT Offered Update Successfully",
        });
        handleClose()
        fetchSecondApiData()
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
        handleClose()
      }
    }
    const postPerforAtOfferData= async()=>
    {
      var formData = new FormData()
      formData.append('PERFORMANCE_AT_OFFERED_DATE',perforAtOfferDate)
      formData.append('PERFORMANCE_AT_OFFERED_REMARKS',perforAtOfferRemark)
      const response = await postData(`trend/performance_at_update/${saveData.id}/OFFERED/${offBands}`,formData)
      console.log("performance AT Offered:",response)
      if (response.status) {
        Swal.fire({
          icon: "success",
          title: "Done",
          text: "Performance AT Offered Update Successfully",
        });
        handleClose()
        fetchSecondApiData()
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
        handleClose()
      }
    }
    const postSoftAtPendingData= async()=>
    {
      var formData = new FormData()
      formData.append('SOFT_AT_PENDING_TAT_DATE',softAtPendingDate)
      formData.append('SOFT_AT_PENDING_REMARK',softAtPendingRemark)
      formData.append('SOFT_AT_PENDING_REASON',softAtPendingReason)
      const response = await postData(`trend/soft_at_update/${saveData.id}/PENDING`,formData)
      console.log("SOFT AT Pending:",response)
      if (response.status) {
        Swal.fire({
          icon: "success",
          title: "Done",
          text: "Soft AT Pending Update Successfully",
        });
        handleClose()
        fetchSecondApiData()
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
        handleClose()
      }
    }
    const postPhysicalAtPendingData= async()=>
    {
      var formData = new FormData()
      formData.append('PHYSICAL_AT_PENDING_TAT_DATE',physicalAtPendingDate)
      formData.append('PHYSICAL_AT_PENDING_REMARK',physicalAtPendingRemark)
      formData.append('PHYSICAL_AT_PENDING_REASON',physicalAtPendingReason)
      const response = await postData(`trend/physical_at_update/${saveData.id}/PENDING`,formData)
      console.log("physical AT Pending:",response)
      if (response.status) {
        Swal.fire({
          icon: "success",
          title: "Done",
          text: "physical AT Pending Update Successfully",
        });
        handleClose()
        fetchSecondApiData()
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
        handleClose()
      }
    }
    const postPerforAtPendingData= async()=>
    {
      var formData = new FormData()
      formData.append('PERFORMANCE_AT_PENDING_TAT_DATE',perforAtPendingDate)
      formData.append('PERFORMANCE_AT_PENDING_REMARK',perforAtPendingRemark)
      formData.append('PERFORMANCE_AT_PENDING_REASON',perforAtPendingReason)
      const response = await postData(`trend/performance_at_update/${saveData.id}/PENDING/${penBands}`,formData)
      console.log("performance AT Pending:",response)
      if (response.status) {
        Swal.fire({
          icon: "success",
          title: "Done",
          text: "performance AT Pending Update Successfully",
        });
        handleClose()
        fetchSecondApiData()
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
        handleClose()
      }
    }

    useEffect(function () {
      fetchSecondApiData();

    }, []);

    const handleUpdate=()=>
    {
        Swal.fire({
            title: 'Do you want to save the changes?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Save',
            denyButtonText: `Don't save`,
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              Swal.fire('Saved!', '', 'success')

            } else if (result.isDenied) {
              Swal.fire('Changes are not saved', '', 'info')
            }
          })

    }
    const handleClose=()=>
    {
        setOpenSoftAcc(false)
        setOpenSoftRej(false)
        setOpenSoftOff(false)
        setOpenSoftPen(false)
        setOpenPhysicalAcc(false)
        setOpenPhysicalRej(false)
        setOpenPhysicalOff(false)
        setOpenPhysicalPen(false)
        setOpenPerforAcc(false)
        setOpenPerforRej(false)
        setOpenPerforOff(false)
        setOpenPerforPen(false)
    }
  return (
    <div style={{display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"column",marginTop:"10px"}}>
        <Box sx={{fontSize:"25px",fontWeight:600}}>{saveData.Unique_SITE_ID}</Box>
        <Box className={classes.box}>
            <Grid container spacing={2}>
                <Grid item xs={8} >

                <Table >
                {Object.entries(secondApi).map(([k,v])=>(

      <StyledTableRow>
         <TableCell style={{padding:'5px'}}><span style=
                    {{fontFamily:"monospace",fontSize:18,fontWeight:600}}>{k}</span></TableCell>
        <TableCell style={{wordBreak:"break-word"}}>{v}</TableCell>
      </StyledTableRow>
    ))}
</Table>

                </Grid>
                <Grid item xs={4} direction="column" spacing={2}>
                  {/* SOFT AT STATUS */}
                    <Box className={classes.box2}>
                        <div style={{fontWeight:"bold",fontSize:"20px",color:"#ffffff"}}>SOFT AT Status:-<span>{tempApi.Soft_AT_Status==null?<span style={{color:'red'}}>{softAt}</span>:<span style={{color:'green'}}>{tempApi.Soft_AT_Status}</span>}</span></div>
                        <div style={{marginTop:5}}>
                            <Dropdown title="SELECT OPTION" placement="right" style={{width:"100px"}}>
                             <Dropdown.Item style={{width:"120px"}} onClick={()=>setOpenSoftAcc(true)} disabled={tempApi.Soft_AT_Status=='ACCEPTED'?true:false}>ACCEPTED</Dropdown.Item>
                             <Dropdown.Item onClick={()=>setOpenSoftRej(true)}>REJECTED</Dropdown.Item>
                             <Dropdown.Item onClick={()=>setOpenSoftOff(true)}>OFFERED</Dropdown.Item>
                             <Dropdown.Item onClick={()=>setOpenSoftPen(true)}>PENDING</Dropdown.Item>
                           </Dropdown>
                        </div>
                    </Box>
                    {/* PYSICAL AT STATUS */}
                    <Box className={classes.box2}>
                        <div style={{fontWeight:"bold",fontSize:"20px",color:"#ffffff"}}>PHYSICAL AT Status:-<span>{tempApi.PHYSICAL_AT_Status==null?<span style={{color:'red'}}>{softAt}</span>:<span style={{color:'green'}}>{tempApi.PHYSICAL_AT_Status}</span>}</span></div>
                        <div style={{marginTop:5}}>
                            <Dropdown title="SELECT OPTION" placement="right" style={{width:"100px"}}>
                            <Dropdown.Item style={{width:"120px"}} onClick={()=>setOpenPhysicalAcc(true)} disabled={tempApi.PHYSICAL_AT_Status=='ACCEPTED'?true:false}>ACCEPTED</Dropdown.Item>
                             <Dropdown.Item onClick={()=>setOpenPhysicalRej(true)}>REJECTED</Dropdown.Item>
                             <Dropdown.Item onClick={()=>setOpenPhysicalOff(true)}>OFFERED</Dropdown.Item>
                             <Dropdown.Item onClick={()=>setOpenPhysicalPen(true)}>PENDING</Dropdown.Item>

                           </Dropdown>
                        </div>
                    </Box>
                    {/* PERFORMANCE AT STATUS */}
                    <Box className={classes.box2}>
                        <div style={{fontWeight:"bold",fontSize:"20px",color:"#ffffff"}}>PERFORMANCE AT Status:-<span>{tempApi.Performance_AT_Status==null?<span style={{color:'red'}}>{softAt}</span>:<span style={{color:'green'}}>{tempApi.Performance_AT_Status}</span>}</span></div>
                        <div style={{marginTop:5}}>
                        <Dropdown title="SELECT BAND" placement="right" style={{width:"600px"}}>

                          {chackbands()}
                        </Dropdown>
                        </div>
                    </Box>
                    {/* MAPA AT STATUS */}
                    <Box className={classes.box2}>
                        <div style={{fontWeight:"bold",fontSize:"20px",color:"#ffffff"}}>MAPA Status:-<span>{tempApi.MAPA_STATUS=='NOT OK'?<span style={{color:'red'}}>{tempApi.MAPA_STATUS}</span>:<span style={{color:'green'}}>{tempApi.MAPA_STATUS}</span>}</span></div>
                        <div style={{marginTop:5}}>
                        <Dropdown title="SELECT " placement="right" style={{width:"600px"}}>
                        <Dropdown.Item onClick={handleMapaStatusOk}>OK</Dropdown.Item>
                        <Dropdown.Item onClick={handleMapaStatusNotOk}>NOT OK</Dropdown.Item>


                        </Dropdown>
                        </div>
                    </Box>
                </Grid>
            </Grid>
        </Box>

        {/* MODAL FOR SOFT AT ACCEPTED */}
              <Modal open={openSoftAcc} onClose={handleClose} style={{display:"grid",justifyContent:"center",alignItems:"center"}}>
        <Modal.Header style={{width:"600px"}}>
          <Modal.Title>UPDATE SOFT AT Status (Accepted) </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className={classes.center}>
            <span>ACCEPTED DATE:</span>
          <TextField onChange={(event)=>setSoftAtAcceptData(event.target.value)}  type={'date'} variant="outlined" fullWidth  />
          <span style={{marginTop:"8px",marginBottom:"10px"}}>SELECT FILE:</span>
          <div>
            <Button variant="contained" component="label">
                    select file
                    <input hidden onChange={handleSoftAtAcceptFile} accept="/*" multiple type="file" />
             </Button>
          </div>

          <Button variant='contained' color='success' onClick={postSoftAtAcceptData}><span style={{fontSize:"20px"}}>UPdate</span></Button>
          </div>
        </Modal.Body>
        <Modal.Footer>

          <Button onClick={handleClose} variant="contained" color='warning' >

            Cancel
          </Button>
        </Modal.Footer>
           </Modal>

        {/* MODAL FOR PHYSICAL AT ACCEPTED */}
              <Modal open={openPhysicalAcc} onClose={handleClose} style={{display:"grid",justifyContent:"center",alignItems:"center"}}>
        <Modal.Header style={{width:"600px"}}>
          <Modal.Title>UPDATE PHYSICAL AT Status (Accepted) </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className={classes.center}>
            <span>ACCEPTED DATE:</span>
          <TextField onChange={(event)=>setPhysicalAtAcceptData(event.target.value)}  type={'date'} variant="outlined" fullWidth  />
          <span style={{marginTop:"8px",marginBottom:"10px"}}>SELECT FILE:</span>
          <div>
            <Button variant="contained" component="label">
                    select file
                    <input hidden onChange={(event)=>setPhysicalAtAcceptFile({bytes:event.target.files[0]})} accept="/*" multiple type="file" />
             </Button>
          </div>

          <Button variant='contained' color='success' onClick={postPhysicalAtAcceptData}><span style={{fontSize:"20px"}}>UPdate</span></Button>
          </div>
        </Modal.Body>
        <Modal.Footer>

          <Button onClick={handleClose} variant="contained" color='warning' >

            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
        {/* MODAL FOR PERFORMANCE AT ACCEPTED */}
              <Modal open={openPerforAcc} onClose={handleClose} style={{display:"grid",justifyContent:"center",alignItems:"center"}}>
        <Modal.Header style={{width:"600px"}}>
          <Modal.Title>UPDATE PERFORMANCE AT Status (Accepted) </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className={classes.center}>
            <span>ACCEPTED DATE:</span>
          <TextField onChange={(event)=>setPerforAtAcceptData(event.target.value)}  type={'date'} variant="outlined" fullWidth  />
          <span style={{marginTop:"8px",marginBottom:"10px"}}>SELECT FILE:</span>
          <div>
            <Button variant="contained" component="label">
                    select file
                    <input hidden onChange={(event)=>setPerforAtAcceptFile({bytes:event.target.files[0]})} accept="/*" multiple type="file" />
             </Button>
          </div>

          <Button variant='contained' color='success' onClick={postPerforAtAcceptData}><span style={{fontSize:"20px"}}>UPdate</span></Button>
          </div>
        </Modal.Body>
        <Modal.Footer>

          <Button onClick={handleClose} variant="contained" color='warning' >

            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

        {/* MODAL FOR SOFT AT REJECTED */}
              <Modal open={openSoftRej} onClose={handleClose} style={{display:"grid",justifyContent:"center",alignItems:"center"}}>
        <Modal.Header style={{width:"600px"}}>
          <Modal.Title>UPDATE SOFT AT Status (Rejected) </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className={classes.center}>
            <span>REJECTED DATE:</span>
          <TextField onChange={(event)=>setSoftAtRejectDate(event.target.value)} type={'date'} variant="outlined" fullWidth  />

          <span style={{marginTop:"8px",marginBottom:"10px"}}>REJECTIN REASON:</span>
          {/* <Input as="textarea" onChange={(event)=>setSoftAtRejectReason(event.target.value)} rows={3} placeholder="Enter reason" /> */}
          <TextField
  placeholder="Enter Reason"
  onChange={(event)=>setSoftAtRejectReason(event.target.value)}
  multiline
  rows={2}
  maxRows={4}
  fullWidth
  style={{marginBottom:3}}
/>


          <Button variant='contained' color='success' onClick={postSoftAtRejectData}><span style={{fontSize:"20px"}}>UPdate</span></Button>
          </div>
        </Modal.Body>
        <Modal.Footer>

          <Button onClick={handleClose} variant="contained" color='warning' >

            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

        {/* MODAL FOR PHYSICAL AT REJECTED */}
              <Modal open={openPhysicalRej} onClose={handleClose} style={{display:"grid",justifyContent:"center",alignItems:"center"}}>
        <Modal.Header style={{width:"600px"}}>
          <Modal.Title>UPDATE PHYSICAL AT Status (Rejected) </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className={classes.center}>
            <span>REJECTED DATE:</span>
          <TextField onChange={(event)=>setPhysicalAtRejectDate(event.target.value)} type={'date'} variant="outlined" fullWidth  />

          <span style={{marginTop:"8px",marginBottom:"10px"}}>REJECTIN REASON:</span>
          {/* <Input as="textarea" onChange={(event)=>setSoftAtRejectReason(event.target.value)} rows={3} placeholder="Enter reason" /> */}
          <TextField
  placeholder="Enter Reason"
  onChange={(event)=>setPhysicalAtRejectReason(event.target.value)}
  multiline
  rows={2}
  maxRows={4}
  fullWidth
  style={{marginBottom:3}}
/>


          <Button variant='contained' color='success' onClick={postPhysicalAtRejectData}><span style={{fontSize:"20px"}}>UPdate</span></Button>
          </div>
        </Modal.Body>
        <Modal.Footer>

          <Button onClick={handleClose} variant="contained" color='warning' >

            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
        {/* MODAL FOR PERFORMANCE AT REJECTED */}
              <Modal open={openPerforRej} onClose={handleClose} style={{display:"grid",justifyContent:"center",alignItems:"center"}}>
        <Modal.Header style={{width:"600px"}}>
          <Modal.Title>UPDATE PERFORMANCE AT Status (Rejected) </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className={classes.center}>
            <span>REJECTED DATE:</span>
          <TextField onChange={(event)=>setPerforAtRejectDate(event.target.value)} type={'date'} variant="outlined" fullWidth  />

          <span style={{marginTop:"8px",marginBottom:"10px"}}>REJECTIN REASON:</span>
          {/* <Input as="textarea" onChange={(event)=>setSoftAtRejectReason(event.target.value)} rows={3} placeholder="Enter reason" /> */}
          <TextField
  placeholder="Enter Reason"
  onChange={(event)=>setPerforAtRejectReason(event.target.value)}
  multiline
  rows={2}
  maxRows={4}
  fullWidth
  style={{marginBottom:3}}
/>


          <Button variant='contained' color='success' onClick={postPerforAtRejectData}><span style={{fontSize:"20px"}}>UPdate</span></Button>
          </div>
        </Modal.Body>
        <Modal.Footer>

          <Button onClick={handleClose} variant="contained" color='warning' >

            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

        {/* MODAL FOR SOFT AT OFFERED */}
              <Modal open={openSoftOff} onClose={handleClose} style={{display:"grid",justifyContent:"center",alignItems:"center"}}>
        <Modal.Header style={{width:"600px"}}>
          <Modal.Title>UPDATE SOFT AT Status (Offered) </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className={classes.center}>
                <span>OFFERED DATE:</span>
          <TextField onChange={(event)=>setSoftAtOfferDate(event.target.value)}  type={'date'} variant="outlined" fullWidth  />

          <span style={{marginTop:"8px",marginBottom:"10px"}}>OFFERED REMARKS:</span>
          {/* <Input as="textarea" rows={3} placeholder="Enter remarks" /> */}
          <TextField
  placeholder="Enter Reason"
  onChange={(event)=>setSoftAtOfferRemark(event.target.value)}
  multiline
  rows={2}
  maxRows={4}
  fullWidth
  style={{marginBottom:3}}
/>
      <Button variant='contained' color='success' onClick={postSoftAtOfferData}><span style={{fontSize:"20px"}}>UPdate</span></Button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose} variant="contained" color='warning' >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

        {/* MODAL FOR PHYSICAL AT OFFERED */}
              <Modal open={openPhysicalOff} onClose={handleClose} style={{display:"grid",justifyContent:"center",alignItems:"center"}}>
        <Modal.Header style={{width:"600px"}}>
          <Modal.Title>UPDATE PHYSICAL AT Status (Offered) </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className={classes.center}>
                <span>OFFERED DATE:</span>
          <TextField onChange={(event)=>setPhysicalAtOfferDate(event.target.value)}  type={'date'} variant="outlined" fullWidth  />

          <span style={{marginTop:"8px",marginBottom:"10px"}}>OFFERED REMARKS:</span>
          {/* <Input as="textarea" rows={3} placeholder="Enter remarks" /> */}
          <TextField
  placeholder="Enter Reason"
  onChange={(event)=>setPhysicalAtOfferRemark(event.target.value)}
  multiline
  rows={2}
  maxRows={4}
  fullWidth
  style={{marginBottom:3}}
/>
      <Button variant='contained' color='success' onClick={postPhysicalAtOfferData}><span style={{fontSize:"20px"}}>UPdate</span></Button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose} variant="contained" color='warning' >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
        {/* MODAL FOR PERFORMANCE AT OFFERED */}
              <Modal open={openPerforOff} onClose={handleClose} style={{display:"grid",justifyContent:"center",alignItems:"center"}}>
        <Modal.Header style={{width:"600px"}}>
          <Modal.Title>UPDATE PERFORMANCE AT Status (Offered) </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className={classes.center}>
                <span>OFFERED DATE:</span>
          <TextField onChange={(event)=>setPerforAtOfferDate(event.target.value)}  type={'date'} variant="outlined" fullWidth  />

          <span style={{marginTop:"8px",marginBottom:"10px"}}>OFFERED REMARKS:</span>
          {/* <Input as="textarea" rows={3} placeholder="Enter remarks" /> */}
          <TextField
  placeholder="Enter Reason"
  onChange={(event)=>setPerforAtOfferRemark(event.target.value)}
  multiline
  rows={2}
  maxRows={4}
  fullWidth
  style={{marginBottom:3}}
/>
      <Button variant='contained' color='success' onClick={postPerforAtOfferData}><span style={{fontSize:"20px"}}>UPdate</span></Button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose} variant="contained" color='warning' >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

        {/* MODAL FOR SOFT AT PENDING */}
              <Modal open={openSoftPen} onClose={handleClose} style={{display:"grid",justifyContent:"center",alignItems:"center"}}>
        <Modal.Header style={{width:"600px"}}>
          <Modal.Title>UPDATE SOFT AT Status (Pending) </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className={classes.center}>
                <span>PENDING DATE:</span>
          <TextField onChange={(event)=>setSoftAtPendingDate(event.target.value)} type={'date'} variant="outlined" fullWidth  />

          <span style={{marginTop:"8px",marginBottom:"10px"}}>PENDING REASON:</span>
          <TextField
  placeholder="Enter Reason"
  onChange={(event)=>setSoftAtPendingReason(event.target.value)}
  multiline
  rows={2}
  maxRows={4}
  fullWidth
  style={{marginBottom:5}}
/>


          <span style={{marginTop:"8px",marginBottom:"10px"}}>PENDING REMARKS:</span>
          <TextField
  placeholder="Enter Reason"
  onChange={(event)=>setSoftAtPendingRemark(event.target.value)}
  multiline
  rows={2}
  maxRows={4}
  fullWidth
  style={{marginBottom:3}}
/>


          <Button variant='contained' color='success' onClick={postSoftAtPendingData}><span style={{fontSize:"20px"}}>UPdate</span></Button>
          </div>
        </Modal.Body>
        <Modal.Footer>

          <Button onClick={handleClose} variant="contained" color='warning' >

            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

        {/* MODAL FOR PHYSICAL AT PENDING */}
              <Modal open={openPhysicalPen} onClose={handleClose} style={{display:"grid",justifyContent:"center",alignItems:"center"}}>
        <Modal.Header style={{width:"600px"}}>
          <Modal.Title>UPDATE PHYSICAL AT Status (Pending) </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className={classes.center}>
                <span>PENDING DATE:</span>
          <TextField onChange={(event)=>setPhysicalAtPendingDate(event.target.value)} type={'date'} variant="outlined" fullWidth  />

          <span style={{marginTop:"8px",marginBottom:"10px"}}>PENDING REASON:</span>
          <TextField
  placeholder="Enter Reason"
  onChange={(event)=>setPhysicalAtPendingReason(event.target.value)}
  multiline
  rows={2}
  maxRows={4}
  fullWidth
  style={{marginBottom:5}}
/>


          <span style={{marginTop:"8px",marginBottom:"10px"}}>PENDING REMARKS:</span>
          <TextField
  placeholder="Enter Reason"
  onChange={(event)=>setPhysicalAtPendingRemark(event.target.value)}
  multiline
  rows={2}
  maxRows={4}
  fullWidth
  style={{marginBottom:3}}
/>


          <Button variant='contained' color='success' onClick={postPhysicalAtPendingData}><span style={{fontSize:"20px"}}>UPdate</span></Button>
          </div>
        </Modal.Body>
        <Modal.Footer>

          <Button onClick={handleClose} variant="contained" color='warning' >

            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
        {/* MODAL FOR PERFORMANCE AT PENDING */}
              <Modal open={openPerforPen} onClose={handleClose} style={{display:"grid",justifyContent:"center",alignItems:"center"}}>
        <Modal.Header style={{width:"600px"}}>
          <Modal.Title>UPDATE PERFORMANCE AT Status (Pending) </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className={classes.center}>
                <span>PENDING DATE:</span>
          <TextField onChange={(event)=>setPerforAtPendingDate(event.target.value)} type={'date'} variant="outlined" fullWidth  />

          <span style={{marginTop:"8px",marginBottom:"10px"}}>PENDING REASON:</span>
          <TextField
  placeholder="Enter Reason"
  onChange={(event)=>setPerforAtPendingReason(event.target.value)}
  multiline
  rows={2}
  maxRows={4}
  fullWidth
  style={{marginBottom:5}}
/>


          <span style={{marginTop:"8px",marginBottom:"10px"}}>PENDING REMARKS:</span>
          <TextField
  placeholder="Enter Reason"
  onChange={(event)=>setPerforAtPendingRemark(event.target.value)}
  multiline
  rows={2}
  maxRows={4}
  fullWidth
  style={{marginBottom:3}}
/>


          <Button variant='contained' color='success' onClick={postPerforAtPendingData}><span style={{fontSize:"20px"}}>UPdate</span></Button>
          </div>
        </Modal.Body>
        <Modal.Footer>

          <Button onClick={handleClose} variant="contained" color='warning' >

            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

    {/*  */}

    </div>
  )
}

export default EditData