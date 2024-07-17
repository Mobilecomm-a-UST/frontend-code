import React, { useEffect } from 'react'
import { useState } from 'react'
import { Box } from '@mui/material'
import {Grid} from '@mui/material'
import { Sidenav, Nav} from 'rsuite';
import FileUploadIcon from '@rsuite/icons/FileUpload';
import { useNavigate } from 'react-router-dom'
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import TrendBox from '../TrendBox';
import PrePostReport from './Pre_Post_report/PrePostReport';
import PrePostReportStatus from './Pre_Post_report/PrePostReportStatus';
import MakeKPITrend from './Make Trend/MakeKPITrend'
import MakeKPITrendReport from './Make Trend/MakeKPITrendReport'
import Upload_post_kpi from './Upload_Post_Kpi/Upload_post_kpi'
import MakeKPITrendOld from './Make_Trend(Old)/MakeKPITrendOld'



export default function Trend() {
    const [expanded, setExpanded] = useState(true);
    const [activeKey, setActiveKey] = useState('1');
    const [states,setStates] =  useState([])

    const navigate=useNavigate()

    const  handleScroll=(event)=>{
         console.log(event.document)
    }

    useEffect(()=>{
      window.addEventListener('scroll', handleScroll);
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
            <Nav style={{fontWeight:600,color:'white',textAlign:'center',fontSize:20}}>TN/CH Trend</Nav>

            <Nav.Menu placement="rightStart" eventKey="3" title="Pre-Post Upload" icon={<FileUploadIcon/>}>

              <Nav.Item eventKey="3-2"
               onClick={()=>navigate('/trends/tn_ch/Pre_Post_report')}
               >Pre-Post Report</Nav.Item>

            </Nav.Menu>
            <Nav.Item eventKey="4" icon={<FileUploadIcon/>} onClick={()=>navigate('/trends/tn_ch/make_kpi_trend')}>
               Make Trend
            </Nav.Item>
            <Nav.Item eventKey="7" icon={<FileUploadIcon/>} onClick={()=>navigate('/trends/tn_ch/make_kpi_trend_old')}>
               Make Trend(Old)
            </Nav.Item>
            <Nav.Item eventKey="5" icon={<FileUploadIcon/>} onClick={()=>navigate('/trends/tn_ch/upload_post_kpi')}>
               Upload Post KPI
            </Nav.Item>
            {/* <Nav.Item eventKey="6" icon={<FileUploadIcon/>} >
               Upload Pre KPI
            </Nav.Item> */}

          </Nav>
        </Sidenav.Body>

      </Sidenav>
    </div>
            </Grid>
            <Grid item xs={10}>
            <div >



        <Routes>


          <Route element={<TrendBox data={'TN-CH'} />} path="/" />

          <Route element={<PrePostReport/>} path="/Pre_Post_report" />
          <Route element={<PrePostReportStatus/>} path="/Pre_Post_report_status" />
          <Route element={<MakeKPITrend/>} path="/make_kpi_trend" />
          <Route element={<MakeKPITrendOld/>} path="/make_kpi_trend_old" />
          <Route element={<MakeKPITrendReport />} path="/make_kpi_trend_report" />
          <Route element={<Upload_post_kpi />} path="/upload_post_kpi" />


        </Routes>

    </div>

            </Grid>
        </Grid>
    </div>
  )
}
