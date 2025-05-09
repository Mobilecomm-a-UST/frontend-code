import React,{useState,useEffect} from "react";
import { useSelector } from "react-redux";
import { Box,Button } from "@mui/material";
import { styled } from '@mui/material/styles';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { ServerURL} from '../../../../services/FetchNodeServices'

function MakeKPITrendReport() {
    var obj = JSON.parse(sessionStorage.getItem('makekpitrend'))
    const [fileData,setFileData]= useState(obj.Download_url)

    var link = `${ServerURL}${fileData}`;
    useEffect(()=>{
      document.title=`${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/',' | ').toUpperCase()}`
    },[])
  return (
    <>
    <Box
sx={{
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
  Volte Traffic | Data Volume Pre-Post Report
</Box>
<div style={{margin:"25px 30px",height:"500px"}}>
 <a download href={link}><Button variant="outlined" onClick='' startIcon={<FileDownloadIcon style={{fontSize:30,color:"green"}}/>}  sx={{marginTop:"10px",width:"auto"}}><span style={{fontFamily:"Poppins",fontSize:"22px",fontWeight:800,textTransform:"none",textDecorationLine:"none"}}>Download Pre Post Report</span></Button></a>
</div>

</Box>
</>
  )
}

export default MakeKPITrendReport