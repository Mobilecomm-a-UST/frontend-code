import React from 'react'
import { useState,useEffect } from 'react'
import {Grid} from '@mui/material'
import { Sidenav, Nav} from 'rsuite';
import FileUploadIcon from '@rsuite/icons/FileUpload';

import { useNavigate } from 'react-router-dom'
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";

import TrendBox from '../TrendBox';
import MakeKPITrendOld from './Make_Trend(Old)/MakeKPITrendOld'
import Make_Trend from './Degrow/Make_Trend';
import MakeTrendV2 from './Degrow/MakeTrendV2';


function HRTrend() {
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

        <Grid container spacing={2}>
            <Grid item xs={2}>
            <div >
      <Sidenav expanded={expanded} defaultOpenKeys={['1','3']} appearance="subtle">
        <Sidenav.Body>
          <Nav activeKey={activeKey} onSelect={setActiveKey} style={{ width:'',minHeight:"670px",height:"100hv",backgroundColor:"#223354",marginTop:8,borderRadius:10,position:'fixed' }}>
          <Nav style={{fontWeight:600,color:'white',textAlign:'center',fontSize:20}}>HR Trend</Nav>
            {/* <Nav.Menu placement="rightStart" eventKey="3" title="Pre-Post Upload" icon={<FileUploadIcon/>}>


            </Nav.Menu> */}
            <Nav.Item eventKey="1" icon={<FileUploadIcon/>}
            onClick={()=>navigate('/trends/hr/make_kpi_trend_old')}
            >
               Make Trend(Old)
            </Nav.Item>
            <Nav.Item eventKey="2" icon={<FileUploadIcon/>}
            onClick={()=>navigate('/trends/hr/degrow')}
            >
               Make Degrow
            </Nav.Item>
            <Nav.Item eventKey="3" icon={<FileUploadIcon/>}
            onClick={()=>navigate('/trends/hr/degrow_v2')}
            >
               Make Degrow V2
            </Nav.Item>

          </Nav>
        </Sidenav.Body>

      </Sidenav>
    </div>
            </Grid>
            <Grid item xs={10}>

        <Routes>
          <Route element={<TrendBox  data={'HR'} />} path="/" />
          <Route element={<MakeKPITrendOld/>} path="/make_kpi_trend_old" />
          <Route element={<Make_Trend/>} path="/degrow" />
          <Route element={<MakeTrendV2/>} path="/degrow_v2" />
        </Routes>

            </Grid>
        </Grid>
    </div>
  )
}

export default HRTrend