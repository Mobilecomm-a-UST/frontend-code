import React from "react";
import { useState,useEffect } from 'react'
import { getData,ServerURL } from '../../services/FetchNodeServices'
import { Table,Pagination } from 'rsuite';
import { Button } from "@mui/material";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const { Column, HeaderCell, Cell } = Table;
export default function DprAllData() {
    const [allDpr,setAllDpr]=useState([])
    const [limit, setLimit] = React.useState(10);
    const [page, setPage] = React.useState(1);
    const [getFile,setGetFile] = useState();
    const [states,setStates] =  useState([])
    const [circles,setCircles] = useState('ALL')

    // const W = screen.availWidth

    var link = `${ServerURL}/${getFile}`
   
   
    const fetchViewDPR= async()=>
    {
      const response = await getData('trend/get_circle/')
      setStates(response.cir)
    
    }

    const handleChange = (event) => {
      setCircles(event.target.value);
      console.log(event.target.value);
      
    };
  

    const featchAllDpr=async()=>
    {
        const response = await getData(`trend/dpr_view/${circles}`)
        setAllDpr(response.data)
        setGetFile(response.path) 
    }
    useEffect(function () {
        featchAllDpr();
        fetchViewDPR();
      }, [circles]);

      const handleChangeLimit = dataKey => {
        setPage(1);
        setLimit(dataKey);
      };
    
      const data = allDpr.filter((v, i) => {
        const start = limit * (page - 1);
        const end = start + limit;
        return i >= start && i < end;
      });

      const DisplayTable=()=>
      {
          return(
            <>
              <Table
              
        height={400}
        data={allDpr}
        onRowClick={rowData => {
        //   console.log(rowData);
        }}
        style={{backgroundColor:"#223353"}}
        
      >
         <Column width={150} align="center" fixed resizable> 
          <HeaderCell style={{fontSize:"16px",fontWeight:"bold",color:"#ffffff",backgroundColor:"#223353"}}>SITE ID</HeaderCell>
          <Cell style={{borderRight:"1px solid gray",color:"black"}} dataKey="SITE_ID" />
        </Column>
  
        <Column width={150} resizable>
          <HeaderCell style={{fontSize:"16px",fontWeight:"bold",color:"#ffffff",backgroundColor:"#223353"}}>CIRCLE</HeaderCell>
          <Cell style={{borderRight:"1px solid gray",color:"black"}} dataKey="CIRCLE" />
        </Column>
  
       
  
        <Column width={200} resizable>
          <HeaderCell style={{fontSize:"16px",fontWeight:"bold",color:"#ffffff",backgroundColor:"#223353"}}>PROJECT</HeaderCell>
          <Cell style={{borderRight:"1px solid gray",color:"black"}} dataKey="Project" />
        </Column>
  
        <Column width={150} resizable>
          <HeaderCell style={{fontSize:"16px",fontWeight:"bold",color:"#ffffff",backgroundColor:"#223353"}}>ACTIVITY</HeaderCell>
          <Cell style={{borderRight:"1px solid gray",color:"black"}} dataKey="Activity" />
        </Column>
  
        <Column width={150} resizable>
          <HeaderCell style={{fontSize:"16px",fontWeight:"bold",color:"#ffffff",backgroundColor:"#223353"}}>BAND</HeaderCell>
          <Cell style={{borderRight:"1px solid gray",color:"black"}} dataKey="BAND" />
        </Column>

        <Column width={150} resizable>
          <HeaderCell style={{fontSize:"16px",fontWeight:"bold",color:"#ffffff",backgroundColor:"#223353"}}>MS1 DATE</HeaderCell>
          <Cell style={{borderRight:"1px solid gray",color:"black"}} dataKey="OA_COMMERCIAL_TRAFFIC_PUT_ON_AIR_MS1_DATE" />
        </Column>

        <Column width={200} resizable>
          <HeaderCell style={{fontSize:"16px",fontWeight:"bold",color:"#ffffff",backgroundColor:"#223353"}}>Soft AT Status</HeaderCell>
          <Cell style={{borderRight:"1px solid gray",color:"black"}} dataKey="Soft_AT_Status" />
        </Column>
        
        <Column width={200} resizable>
          <HeaderCell style={{fontSize:"16px",fontWeight:"bold",color:"#ffffff",backgroundColor:"#223353"}}>SOFT AT ACCEPTANCE DATE</HeaderCell>
          <Cell style={{borderRight:"1px solid gray",color:"black"}} dataKey="SOFT_AT_ACCEPTANCE_DATE" />
        </Column>

        <Column width={200} resizable>
          <HeaderCell style={{fontSize:"16px",fontWeight:"bold",color:"#ffffff",backgroundColor:"#223353"}}>SOFT AT ACCEPTANCE MAIL</HeaderCell>
          <Cell style={{borderRight:"1px solid gray",color:"black"}} dataKey="SOFT_AT_ACCEPTANCE_MAIL" />
        </Column>

        <Column width={200} resizable>
          <HeaderCell style={{fontSize:"16px",fontWeight:"bold",color:"#ffffff",backgroundColor:"#223353"}}>SOFT AT REJECTION DATE</HeaderCell>
          <Cell style={{borderRight:"1px solid gray",color:"black"}} dataKey="SOFT_AT_REJECTION_DATE" />
        </Column>
  
        <Column width={200} resizable>
          <HeaderCell style={{fontSize:"16px",fontWeight:"bold",color:"#ffffff",backgroundColor:"#223353"}}>SOFT_AT_REJECTION_REASON</HeaderCell>
          <Cell style={{borderRight:"1px solid gray",color:"black"}} dataKey="SOFT_AT_REJECTION_REASON" />
        </Column>

        <Column width={200} resizable>
          <HeaderCell style={{fontSize:"16px",fontWeight:"bold",color:"#ffffff",backgroundColor:"#223353"}}>SOFT AT OFFERED DATE</HeaderCell>
          <Cell style={{borderRight:"1px solid gray",color:"black"}} dataKey="SOFT_AT_OFFERED_DATE" />
        </Column>

        <Column width={200} resizable>
          <HeaderCell style={{fontSize:"16px",fontWeight:"bold",color:"#ffffff",backgroundColor:"#223353"}}>SOFT AT OFFERED REMARKS</HeaderCell>
          <Cell style={{borderRight:"1px solid gray",color:"black"}}  dataKey="SOFT_AT_OFFERED_REMARKS" />
        </Column>

        <Column width={200} resizable>
          <HeaderCell style={{fontSize:"16px",fontWeight:"bold",color:"#ffffff",backgroundColor:"#223353"}}>SOFT AT OFFERED REASON</HeaderCell>
          <Cell style={{borderRight:"1px solid gray",color:"black"}} dataKey="SOFT_AT_PENDING_REASON" />
        </Column>

        <Column width={200} resizable>
          <HeaderCell style={{fontSize:"16px",fontWeight:"bold",color:"#ffffff",backgroundColor:"#223353"}}>SOFT AT PENDING REMARKS</HeaderCell>
          <Cell style={{borderRight:"1px solid gray",color:"black"}} dataKey="SOFT_AT_PENDING_REMARKS" />
        </Column>

        <Column width={200} resizable>
          <HeaderCell style={{fontSize:"16px",fontWeight:"bold",color:"#ffffff",backgroundColor:"#223353"}}>SOFT AT PENDING TAT DATE</HeaderCell>
          <Cell style={{borderRight:"1px solid gray",color:"black"}} dataKey="SOFT_AT_PENDING_TAT_DATE" />
        </Column>
{/* PHYSICAL */}
        <Column width={200} resizable>
          <HeaderCell style={{fontSize:"16px",fontWeight:"bold",color:"#ffffff",backgroundColor:"#223353"}}>PHYSICAL AT Status</HeaderCell>
          <Cell style={{borderRight:"1px solid gray",color:"black"}} dataKey="PHYSICAL_AT_Status" />
        </Column>

        <Column width={200} resizable>
          <HeaderCell style={{fontSize:"16px",fontWeight:"bold",color:"#ffffff",backgroundColor:"#223353"}}>PHYSICAL_AT_ACCEPTANCE_DATE</HeaderCell>
          <Cell style={{borderRight:"1px solid gray",color:"black"}} dataKey="PHYSICAL_AT_ACCEPTANCE_DATE" />
        </Column>

        <Column width={200} resizable>
          <HeaderCell style={{fontSize:"16px",fontWeight:"bold",color:"#ffffff",backgroundColor:"#223353"}}>PHYSICAL_AT_ACCEPTANCE_MAIL</HeaderCell>
          <Cell style={{borderRight:"1px solid gray",color:"black"}} dataKey="PHYSICAL_AT_ACCEPTANCE_MAIL" />
        </Column>

        <Column width={200} resizable>
          <HeaderCell style={{fontSize:"16px",fontWeight:"bold",color:"#ffffff",backgroundColor:"#223353"}}>PHYSICAL_AT_REJECTION_DATE</HeaderCell>
          <Cell style={{borderRight:"1px solid gray",color:"black"}} dataKey="PHYSICAL_AT_REJECTION_DATE" />
        </Column>
        
        <Column width={200} resizable>
          <HeaderCell style={{fontSize:"16px",fontWeight:"bold",color:"#ffffff",backgroundColor:"#223353"}}>PHYSICAL_AT_REJECTION_REASON</HeaderCell>
          <Cell style={{borderRight:"1px solid gray",color:"black"}} dataKey="PHYSICAL_AT_REJECTION_REASON" />
        </Column>
        <Column width={200} resizable>
          <HeaderCell style={{fontSize:"16px",fontWeight:"bold",color:"#ffffff",backgroundColor:"#223353"}}>PHYSICAL_AT_OFFERED_DATE</HeaderCell>
          <Cell style={{borderRight:"1px solid gray",color:"black"}} dataKey="PHYSICAL_AT_OFFERED_DATE" />
        </Column>
        <Column width={200} resizable>
          <HeaderCell style={{fontSize:"16px",fontWeight:"bold",color:"#ffffff",backgroundColor:"#223353"}}>PHYSICAL_AT_OFFERED_REMARKS</HeaderCell>
          <Cell style={{borderRight:"1px solid gray",color:"black"}} dataKey="PHYSICAL_AT_OFFERED_REMARKS" />
        </Column>
        <Column width={200} resizable>
          <HeaderCell style={{fontSize:"16px",fontWeight:"bold",color:"#ffffff",backgroundColor:"#223353"}}>PHYSICAL_AT_PENDING_REASON</HeaderCell>
          <Cell style={{borderRight:"1px solid gray",color:"black"}} dataKey="PHYSICAL_AT_PENDING_REASON" />
        </Column> 
         <Column width={200} resizable>
          <HeaderCell style={{fontSize:"16px",fontWeight:"bold",color:"#ffffff",backgroundColor:"#223353"}}>PHYSICAL_AT_PENDING_REMARK</HeaderCell>
          <Cell style={{borderRight:"1px solid gray",color:"black"}} dataKey="PHYSICAL_AT_PENDING_REMARK" />
        </Column>  
        <Column width={200} resizable>
          <HeaderCell style={{fontSize:"16px",fontWeight:"bold",color:"#ffffff",backgroundColor:"#223353"}}>PHYSICAL_AT_PENDING_TAT_DATE</HeaderCell>
          <Cell style={{borderRight:"1px solid gray",color:"black"}} dataKey="PHYSICAL_AT_PENDING_TAT_DATE" />
        </Column>
       {/* PERFORMENCE */}
       <Column width={200} resizable>
          <HeaderCell style={{fontSize:"16px",fontWeight:"bold",color:"#ffffff",backgroundColor:"#223353"}}>Performance AT Status</HeaderCell>
          <Cell style={{borderRight:"1px solid gray",color:"black"}} dataKey="Performance_AT_Status" />
        </Column>

        <Column width={200} resizable>
          <HeaderCell style={{fontSize:"16px",fontWeight:"bold",color:"#ffffff",backgroundColor:"#223353"}}>PERFORMANCE_AT_ACCEPTANCE_DATE</HeaderCell>
          <Cell style={{borderRight:"1px solid gray",color:"black"}} dataKey="PERFORMANCE_AT_ACCEPTANCE_DATE" />
        </Column>

        <Column width={200} resizable>
          <HeaderCell style={{fontSize:"16px",fontWeight:"bold",color:"#ffffff",backgroundColor:"#223353"}}>PERFORMANCE_AT_ACCEPTANCE_MAIL</HeaderCell>
          <Cell style={{borderRight:"1px solid gray",color:"black"}} dataKey="PERFORMANCE_AT_ACCEPTANCE_MAIL" />
        </Column>

        <Column width={200} resizable>
          <HeaderCell style={{fontSize:"16px",fontWeight:"bold",color:"#ffffff",backgroundColor:"#223353"}}>PERFORMANCE_AT_REJECTION_DATE</HeaderCell>
          <Cell style={{borderRight:"1px solid gray",color:"black"}} dataKey="PERFORMANCE_AT_REJECTION_DATE" />
        </Column>
        
        <Column width={200} resizable>
          <HeaderCell style={{fontSize:"16px",fontWeight:"bold",color:"#ffffff",backgroundColor:"#223353"}}>PERFORMANCE_AT_REJECTION_REASON</HeaderCell>
          <Cell style={{borderRight:"1px solid gray",color:"black"}} dataKey="PERFORMANCE_AT_REJECTION_REASON" />
        </Column>
        <Column width={200} resizable>
          <HeaderCell style={{fontSize:"16px",fontWeight:"bold",color:"#ffffff",backgroundColor:"#223353"}}>PERFORMANCE_AT_OFFERED_DATE</HeaderCell>
          <Cell style={{borderRight:"1px solid gray",color:"black"}} dataKey="PERFORMANCE_AT_OFFERED_DATE" />
        </Column>
        <Column width={200} resizable>
          <HeaderCell style={{fontSize:"16px",fontWeight:"bold",color:"#ffffff",backgroundColor:"#223353"}}>PERFORMANCE_AT_OFFERED_REMARKS</HeaderCell>
          <Cell style={{borderRight:"1px solid gray",color:"black"}} dataKey="PERFORMANCE_AT_OFFERED_REMARKS" />
        </Column>
        <Column width={200} resizable>
          <HeaderCell style={{fontSize:"16px",fontWeight:"bold",color:"#ffffff",backgroundColor:"#223353"}}>PERFORMANCE_AT_PENDING_REASON</HeaderCell>
          <Cell style={{borderRight:"1px solid gray",color:"black"}} dataKey="PERFORMANCE_AT_PENDING_REASON" />
        </Column>  
        <Column width={200} resizable>
          <HeaderCell style={{fontSize:"16px",fontWeight:"bold",color:"#ffffff",backgroundColor:"#223353"}}>PERFORMANCE_AT_PENDING_REMARK</HeaderCell>
          <Cell style={{borderRight:"1px solid gray",color:"black"}} dataKey="PERFORMANCE_AT_PENDING_REMARK" />
        </Column>  
        <Column width={200} resizable>
          <HeaderCell style={{fontSize:"16px",fontWeight:"bold",color:"#ffffff",backgroundColor:"#223353"}}>PERFORMANCE_AT_PENDING_TAT_DATE</HeaderCell>
          <Cell style={{borderRight:"1px solid gray",color:"black"}} dataKey="PERFORMANCE_AT_PENDING_TAT_DATE" />
        </Column>
        <Column width={200} resizable>
          <HeaderCell style={{fontSize:"16px",fontWeight:"bold",color:"#ffffff",backgroundColor:"#223353"}}>MAPA_STATUS</HeaderCell>
          <Cell dataKey="MAPA_STATUS" />
        </Column>
        
      </Table>
      
  
         </> )
      }
    return(
        <>
          <Box sx={{ Width:"500px",marginTop:"10px",marginLeft:"60px" }}>
            
      <FormControl sx={{width:200}}>
        <InputLabel id="demo-simple-select-label">SELECT CIRCLE</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={circles}
          label="SELECT CIRCLE"
          onChange={handleChange}
        >
          {states.map((item)=>(
                 <MenuItem value={item}>{item}</MenuItem>
                 
          ))}
        </Select>
      </FormControl>
    </Box>
       <div style={{width:1000,padding:"10px",boxShadow:"1px 1px 14px 1px black",margin:"20px 60px"}}>
        
        {DisplayTable()}
      
        </div>
        <div style={{display:"grid",placeItems:"center"}}>
        <a download href={link}><Button variant="outlined" onClick='' startIcon={<FileDownloadIcon style={{fontSize:30,color:"green"}}/>}  sx={{marginTop:"10px",width:"auto"}}><span style={{fontFamily:"Poppins",fontSize:"22px",fontWeight:800,textTransform:"none",textDecorationLine:"none"}}>Download DPR Report</span></Button></a>

        </div>

        
        </>
    )
}