import React,{useState,useEffect} from "react";
import { Box, Button ,Stack } from "@mui/material";
import { useDispatch } from "react-redux";
import UploadIcon from '@mui/icons-material/Upload';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import { postData,ServerURL,getData } from "../../../services/FetchNodeServices";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Zoom from "@mui/material/Zoom";
import OverAllCss from "../../../csss/OverAllCss";
import Tooltip from '@mui/material/Tooltip';
import Fab from '@mui/material/Fab';
import DownloadIcon from '@mui/icons-material/Download';

export default function DprReport() {
  const [dprFile,setDprFile] = useState({ filename: "", bytes: ""})
  const [softAT,setSoftAT] = useState({ filename: "", bytes: "" })
  const [physicalAT,setPhysicaAT] = useState({ filename: "", bytes: "" })
  const [g1800,setG1800] = useState({ filename: "", bytes: "" })
  const [l900,setL900] = useState({ filename: "", bytes: "" })
  const [l1800,setL1800] = useState({ filename: "", bytes: "" })
  const [l2300,setL2300] = useState({ filename: "", bytes: "" })
  const [l2100,setL2100] = useState({ filename: "", bytes: "" })
  const [getFile,setGetFile]=useState()
  const classes = OverAllCss();
  const dispatch=useDispatch();
  const navigate=useNavigate();

  const size1  = dprFile.state
  var link = `${ServerURL}${getFile}`
  const Fetchdprkey=async()=>
  {
      const response = await getData('trend/get_dpr_temp/')
      setGetFile(response.path)
      console.log('get data:',response.path)
  }
  useEffect(function () {
    Fetchdprkey();

    }, []);

  const handleSoftAT = (event) => {
    setSoftAT({
      filename: event.target.files[0].name,
      bytes: event.target.files[0],
      state: true
    });
  };
  const handleDprFile = (event) => {
    setDprFile({
      filename: event.target.files[0].name,
      bytes: event.target.files[0],
      state: true
    });
  };
  const handlePhysicalAT = (event) => {
    setPhysicaAT({
      filename: event.target.files[0].name,
      bytes: event.target.files[0],
      state: true
    });
  };
  const handleG1800 = (event) => {
    setG1800({
      filename: event.target.files[0].name,
      bytes: event.target.files[0],
      state: true
    });
  };
  const handleL900 = (event) => {
    setL900({
      filename: event.target.files[0].name,
      bytes: event.target.files[0],
      state: true
    });
  };
  const handleL2300 = (event) => {
    setL2300({
      filename: event.target.files[0].name,
      bytes: event.target.files[0],
      state: true
    });
  };
  const handleL2100 = (event) => {
    setL2100({
      filename: event.target.files[0].name,
      bytes: event.target.files[0],
      state: true
    });
  };
  const handleL1800 = (event) => {
    setL1800({
      filename: event.target.files[0].name,
      bytes: event.target.files[0],
      state: true
    });
  };

  const handleSubmit=async()=>
  {
    var formData = new FormData();

    formData.append("myfile", dprFile.bytes);
    formData.append("soft_at", softAT.bytes);
    formData.append("physical_at", physicalAT.bytes);
    formData.append("G1800", g1800.bytes);
    formData.append("L1800", l1800.bytes);
    formData.append("L2300", l2300.bytes);
    formData.append("L2100", l2100.bytes);
    formData.append("L900", l900.bytes);

    const response = await postData('trend/dpr_report_upload/',formData,{headers: {Authorization: `token ${JSON.parse(localStorage.getItem("tokenKey"))}` }})
    dispatch({type:'DPR_REPORT',payload:{response}})
    console.log(response)
    if (response.status) {
      Swal.fire({
        icon: "success",
        title: "Done",
        text: "File Submit Successfully",
      });
      navigate('/dpr/dpr_report_status')
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${response.message}`,
      });
    }
  };

  const handleCancel=()=>
  {
    setDprFile({filename:"",bytes:""})
    setSoftAT({filename:"",bytes:""})
    setPhysicaAT({filename:"",bytes:""})
    setG1800({filename:"",bytes:""})
    setL1800({filename:"",bytes:""})
    setL2300({filename:"",bytes:""})
    setL900({filename:"",bytes:""})
    setL2100({filename:"",bytes:""})
  }


  return (
    <>
    <Zoom in='true' timeout={500}>
      <div>

      <Box style={{ position: 'fixed', right: 20 }}>
            <Tooltip title="Download Temp.">
              <a download href={link}>
                <Fab color="primary" aria-label="add" >
                  <DownloadIcon />
                </Fab>
              </a>
            </Tooltip>
          </Box>

      <Box className={classes.main_Box}>
        <Box className={classes.Back_Box}>
          <Box className={classes.Box_Hading}>
            UPDATE DPR REPORT
          </Box>
          <Stack spacing={2} sx={{ marginTop: "-40px" }}>
            <Box className={classes.Front_Box}>
              <div className={classes.Front_Box_Hading}>
                Select DPR File:-<span style={{fontFamily:'Poppins',fontSize:20,color:"gray",marginLeft:15,fontSize:'16px'}}>{dprFile.filename}</span>
              </div>
              <div className={classes.Front_Box_Select_Button}>
                <div style={{ float: "left" }}>
                  <Button variant="contained" component="label"  color={dprFile.state?"warning":"primary"}>
                    select file
                    <input required onChange={handleDprFile} hidden accept="/*" multiple type="file" />
                  </Button>
                </div>
                <div></div>
              </div>
            </Box>
            <Box className={classes.Front_Box}>
              <div className={classes.Front_Box_Hading}>
                Select Soft AT Acceptance Proof File:-<span style={{fontFamily:'Poppins',color:"gray",marginLeft:15,fontSize:'16px'}}>{softAT.filename}</span>
              </div>
              <div className={classes.Front_Box_Select_Button}>
                <div style={{ float: "left" }}>
                  <Button variant="contained" component="label" color={softAT.state?"warning":"primary"}>
                    select file
                    <input required hidden onChange={handleSoftAT} accept="/*" multiple type="file" />
                  </Button>
                </div>
                <div></div>
              </div>
            </Box>

            <Box className={classes.Front_Box}>
              <div className={classes.Front_Box_Hading}>
                Select Physical AT Acceptance Proof File:-<span style={{fontFamily:'Poppins',color:"gray",marginLeft:15,fontSize:'16px'}}>{physicalAT.filename}</span>
              </div>
              <div className={classes.Front_Box_Select_Button}>
                <div style={{ float: "left" }}>
                  <Button variant="contained" component="label" color={physicalAT.state?"warning":"primary"}>
                    select file
                    <input required hidden onChange={handlePhysicalAT} accept="/*" multiple type="file" />
                  </Button>
                </div>
                <div></div>
              </div>
            </Box>

            <Box className={classes.Front_Box}>
              <div className={classes.Front_Box_Hading}>
                Select Performance AT Acceptance Proof File:-
              </div>
              <div style={{display:"flex",flexWrap:"wrap"}}>
                <div style={{margin:"5px 15px"}}>
                  <span
                    style={{
                      fontFamily: "Poppins",
                      fontSize: "18px",
                      fontWeight: "bold",
                    }}
                  >
                    G1800:-
                  </span>
                  <Button variant="contained" component="label" color={g1800.state?"warning":"primary"}>
                    select file
                    <input hidden onChange={handleG1800} accept="/*" multiple type="file" />
                  </Button>
                </div>
                <div style={{margin:"5px 15px"}}>
                  <span
                    style={{
                      fontFamily: "Poppins",
                      fontSize: "18px",
                      fontWeight: "bold",
                    }}
                  >
                    L900:-
                  </span>
                  <Button variant="contained" component="label" color={l900.state?"warning":"primary"}>
                    select file
                    <input hidden onChange={handleL900} accept="/*" multiple type="file" />
                  </Button>
                </div>
                <div style={{margin:"5px 15px"}}>
                  <span
                    style={{
                      fontFamily: "Poppins",
                      fontSize: "18px",
                      fontWeight: "bold",
                    }}
                  >
                    L1800:-
                  </span>
                  <Button variant="contained" component="label" color={l1800.state?"warning":"primary"}>
                    select file
                    <input hidden onChange={handleL1800} accept="/*" multiple type="file" />
                  </Button>
                </div>
                <div style={{margin:"5px 15px"}}>
                  <span
                    style={{
                      fontFamily: "Poppins",
                      fontSize: "18px",
                      fontWeight: "bold",
                    }}
                  >
                    L2300:-
                  </span>
                  <Button variant="contained" component="label" color={l2300.state?"warning":"primary"}>
                    select file
                    <input hidden onChange={handleL2300} accept="/*" multiple type="file" />
                  </Button>
                </div>
                <div style={{margin:"5px 15px"}}>
                  <span
                    style={{
                      fontFamily: "Poppins",
                      fontSize: "18px",
                      fontWeight: "bold",
                    }}
                  >
                    L2100:-
                  </span>
                  <Button variant="contained" component="label" color={l2100.state?"warning":"primary"}>
                    select file
                    <input hidden onChange={handleL2100} accept="/*" multiple type="file" />
                  </Button>
                </div>
              </div>
            </Box>
          </Stack>
          <Stack direction={{ xs: "column", sm: "column", md: "row" }} spacing={2} style={{display:'flex',justifyContent:"space-around",marginTop:"20px"}}>
          <Button variant="contained" color="success" onClick={handleSubmit} endIcon={<UploadIcon/>}>upload</Button>

            <Button variant="contained" onClick={handleCancel} style={{backgroundColor:"red"}} endIcon={<DoDisturbIcon/>}>cancel</Button>

          </Stack>
        </Box>
        {/* <a download href={link}><Button variant="outlined" onClick='' startIcon={<FileDownloadIcon style={{fontSize:30,color:"green"}}/>}  sx={{marginTop:"10px",width:"auto"}}><span style={{fontFamily:"Poppins",fontSize:"22px",fontWeight:800,textTransform:"none",textDecorationLine:"none"}}>Download Temp</span></Button></a> */}

      </Box>

      </div>
      </Zoom>
    </>
  );
}
