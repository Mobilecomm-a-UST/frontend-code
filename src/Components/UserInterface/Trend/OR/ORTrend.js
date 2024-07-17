import React, { useEffect } from 'react'
import { useState } from 'react'
import {Grid} from '@mui/material'
import { Sidenav, Nav} from 'rsuite';
import FileUploadIcon from '@rsuite/icons/FileUpload';
import { useNavigate } from 'react-router-dom'
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import KpiTrend4G from './Make_Trend(Old)/KpiTrend4G';
import KpiTrendRAN from './Make_Trend(Old)/KpiTrendRAN';
import TrendBox from '../TrendBox';

// import PrePostReport from './Pre_Post_report/PrePostReport';
// import PrePostReportStatus from './Pre_Post_report/PrePostReportStatus';
// import MakeKPITrend from './Make Trend/MakeKPITrend'
// import MakeKPITrendReport from './Make Trend/MakeKPITrendReport'



function ORTrend() {
    const [expanded, setExpanded] = useState(true);
    const [activeKey, setActiveKey] = useState('1');
    const [states,setStates] =  useState([])

    const navigate=useNavigate()
    const headData = document.location.pathname.split('/');
    useEffect(()=>{
      document.title=`${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/',' | ').toUpperCase()}`
    },[])
  return (
    <div >

    <Grid container spacing={1}>
        <Grid item xs={2}>
        <div >
  <Sidenav expanded={expanded} defaultOpenKeys={['1','3']} appearance="subtle">
    <Sidenav.Body>
      <Nav activeKey={activeKey} onSelect={setActiveKey} style={{ width:'',minHeight:"670px",height:"100hv",backgroundColor:"#223354",marginTop:8,borderRadius:10,position:'fixed' }}>
      <Nav style={{fontWeight:600,color:'white',textAlign:'center',fontSize:20}}>OR Trend</Nav>
{/*
        <Nav.Menu placement="rightStart" eventKey="3" title="Pre-Post Upload" icon={<FileUploadIcon/>}>

          <Nav.Item eventKey="3-2"
        //    onClick={()=>navigate('/trends/tn_ch/Pre_Post_report')}
           >Pre-Post Report</Nav.Item>

        </Nav.Menu> */}
        <Nav.Menu activeKey="2" icon={<FileUploadIcon/>} title="Make Trend (Old)">
           <Nav.Item eventKey="2-1"
         onClick={()=>navigate('/trends/or/kpi_trend_old_4G')}
         >
           Trend 4G
        </Nav.Item>
           <Nav.Item eventKey="2-2"
              onClick={()=>navigate('/trends/or/kpi_trend_old_RAN')}
         >
           Trend RNA
        </Nav.Item>
        </Nav.Menu>


      </Nav>
    </Sidenav.Body>

  </Sidenav>
</div>
        </Grid>
        <Grid item xs={10}>
        <div >



    <Routes>
      <Route element={<TrendBox data={'OR'} />} path="/" />
      <Route element={<KpiTrend4G/>} path="/kpi_trend_old_4G" />
      <Route element={<KpiTrendRAN/>} path="/kpi_trend_old_RAN" />

    </Routes>

</div>

        </Grid>
    </Grid>
</div>
  )
}

export default ORTrend