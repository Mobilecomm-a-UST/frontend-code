import React from 'react'
import { useState ,useEffect} from 'react'
import {Grid} from '@mui/material'
import { Sidenav, Nav} from 'rsuite';
import FileUploadIcon from '@rsuite/icons/FileUpload';
import { useNavigate } from 'react-router-dom'
import {Routes,Route} from "react-router-dom";
import TrendBox from '../TrendBox';
import Degrow from './Degrow/Degrow';
import Macro from './MakeTrend/Macro';
import SmallCell from './MakeTrend/SmallCell';



function BRTrend() {
    const [expanded, setExpanded] = useState(true);
    const [activeKey, setActiveKey] = useState('1');
    const [states,setStates] =  useState([])

    const navigate=useNavigate()

    const headData = document.location.pathname.split('/');
    useEffect(()=>{
      document.title= `Tools | ${headData[1]} | ${headData[2]}`
      document.title=`${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/',' | ').toUpperCase()}`
    },[])

  return (
    <div >

    <Grid container spacing={1}>
        <Grid item xs={2}>
        <div
        //  style={{ width: 240,minHeight:"670px",height:"100hv",backgroundColor:"#223354",marginTop:8,borderRadius:10 }}
        >
  <Sidenav expanded={expanded} defaultOpenKeys={[]} appearance="subtle">
    <Sidenav.Body>
      <Nav activeKey={activeKey} onSelect={setActiveKey} style={{ width:'',minHeight:"670px",height:"100hv",backgroundColor:"#223354",marginTop:8,borderRadius:10,position:'fixed' }}>
      <Nav style={{fontWeight:500,color:'white',textAlign:'center',fontSize:20}}>BR Trend</Nav>

        <Nav.Menu placement="rightStart" eventKey="1" title="Make Trend" icon={<FileUploadIcon/>}>

          <Nav.Item eventKey="1-1" onClick={()=>navigate('/trends/br/macro')}>Macro</Nav.Item>
          <Nav.Item eventKey="1-2" onClick={()=>navigate('/trends/br/small_cell')}>Small Cell</Nav.Item>


        </Nav.Menu>
        <Nav.Item eventKey="4" icon={<FileUploadIcon/>} onClick={()=>navigate('/trends/br/degrow')}>
           Degrow
        </Nav.Item>

      </Nav>
    </Sidenav.Body>

  </Sidenav>
</div>
        </Grid>
        <Grid item xs={10}>
        <div >

    <Routes>


      <Route element={<TrendBox data={'BR'}/>} path="/" />
      <Route element={<Degrow/>} path="/degrow" />
      <Route element={<Macro/>} path="/macro" />
      <Route element={<SmallCell/>} path="/small_cell" />
      {/* <Route element={<MakeKPITrend/>} path="/make_kpi_trend" /> */}


    </Routes>

</div>

        </Grid>
    </Grid>
</div>
  )
}

export default BRTrend