import React, { useEffect } from 'react'
import { useState } from 'react'

import { Box } from '@mui/material'
import { Grid } from '@mui/material'
import { Sidenav, Nav, Button } from 'rsuite';
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import FileUploadIcon from '@rsuite/icons/FileUpload';
import ListIcon from '@rsuite/icons/List';
import DetailIcon from '@rsuite/icons/Detail';
import { useNavigate } from 'react-router-dom'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TrendBox from '../TrendBox';
import MakeKPITrendOld from './Make_Trend(Old)/MakeKPITrendOld'
import Degrow from './Degrow/Degrow';
import Collapse from '@mui/material/Collapse';
import SettingsIcon from '@mui/icons-material/Settings';
import Relocation from './Relocation/Relocation';
import Samsung from './Samsumg/Samsung';
import Uls from './ULS/Uls';
import Gsm from './GSM/Gsm';

const WBKOL_Trend = () => {
  const [expanded, setExpanded] = useState(true);
  const [activeKey, setActiveKey] = useState('1');
  const [states, setStates] = useState([])
  const navigate = useNavigate()
  const [checked, setChecked] = useState(true)
  const [menuButton, setMenuButton] = useState(false)


  const show = () => {
    setChecked(!checked)
    if (checked == true) {
      setMenuButton(false)
    }
  }
  useEffect(()=>{
    document.title=`${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/',' | ').toUpperCase()}`
  },[])

  return (
    <div >


      <Grid container spacing={1}>
        <Grid item xs={0} md={2}>
          <Box sx={{ display: { xs: 'inherit', md: 'none' } }}>
            <Collapse in={!checked} >
              <Button onClick={() => { show() }} style={{ position: 'absolute', top: '60px', backgroundColor: '#223354' }}><SettingsIcon style={{ color: "white" }} /></Button>
            </Collapse>
            <Collapse in={checked} orientation="horizontal" timeout={'auto'}>
              <Box sx={{ width: 240, minHeight: "670px", height: "100hv", backgroundColor: "#223354", borderRadius: 5, position: 'fixed', zIndex: 10 }}>
                <Sidenav expanded={expanded} defaultOpenKeys={[]} appearance="subtle">
                  <Sidenav.Body>
                    <Nav activeKey={activeKey} onSelect={setActiveKey}>
                      <Nav style={{ fontWeight: 600, color: 'white', textAlign: 'center', fontSize: 20 }}>WB/KOL Trend</Nav>

                      <Nav.Menu placement="rightStart" eventKey="3" title="Pre-Post Upload" icon={<FileUploadIcon />}>

                        <Nav.Item eventKey="3-2"
                          onClick={() => navigate()}
                        >Pre-Post Report</Nav.Item>
                      </Nav.Menu>
                      <Nav.Item eventKey="4" icon={<FileUploadIcon />} onClick={() => { navigate('/trends/wb_kol/degrow'); show(); setMenuButton(true) }}>
                        Make Degrow
                      </Nav.Item>
                      <Nav.Item eventKey="5" icon={<FileUploadIcon />} onClick={() => { navigate('/trends/wb_kol/make_kpi_trend_old'); show(); setMenuButton(true) }}>
                        Make Trend(old)
                      </Nav.Item>
                    </Nav>
                  </Sidenav.Body>
                </Sidenav>
              </Box>
            </Collapse>
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'inherit' } }}>
          <Box >
                <Sidenav expanded={expanded} defaultOpenKeys={[]} appearance="subtle">
                  <Sidenav.Body>
                    <Nav activeKey={activeKey} onSelect={setActiveKey} style={{ width:'',minHeight:"670px",height:"100hv",backgroundColor:"#223354",marginTop:8,borderRadius:10,position:'fixed' }}>
                      <Nav style={{ fontWeight: 600, color: 'white', textAlign: 'center', fontSize: 20 }}>WB/KOL Trend</Nav>

                      {/* <Nav.Menu placement="rightStart" eventKey="3" title="Pre-Post Upload" icon={<FileUploadIcon />}>

                        <Nav.Item eventKey="3-2"
                          onClick={() => navigate()}
                        >Pre-Post Report</Nav.Item>
                      </Nav.Menu> */}
                      <Nav.Item eventKey="1" icon={<FileUploadIcon />} onClick={() => { navigate('/trends/wb_kol/degrow'); show(); setMenuButton(true) }}>
                        Make Degrow
                      </Nav.Item>
                      {/* <Nav.Item eventKey="2" icon={<FileUploadIcon />} onClick={() => { navigate('/trends/wb_kol/make_kpi_trend_old'); show(); setMenuButton(true) }}>
                        Make Trend(old)
                      </Nav.Item> */}
                        <Nav.Menu placement="rightStart" eventKey="2" title="Make Trend" icon={<FileUploadIcon />}>
                         <Nav.Item eventKey="2-2" onClick={() => navigate('/trends/wb_kol/relocation')}> Relocation</Nav.Item>
                           <Nav.Item eventKey="2-3" onClick={() => navigate('/trends/wb_kol/samsung')}> Samsung</Nav.Item>
                          <Nav.Item eventKey="2-4" onClick={() => navigate('/trends/wb_kol/uls')}> ULS</Nav.Item>
                          <Nav.Item eventKey="2-5" onClick={() => navigate('/trends/wb_kol/gsm')}> GSM</Nav.Item>
                      </Nav.Menu>
                    </Nav>
                  </Sidenav.Body>
                </Sidenav>
              </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={10}>
          <Box >
            <Routes>
              <Route element={<TrendBox data={'WB-KOL'} />} path="/" />
              <Route element={<MakeKPITrendOld />} path="make_kpi_trend_old" />
              <Route element={<Degrow />} path="degrow" />
              <Route element={<Relocation />} path="relocation" />
              <Route element={<Samsung />} path="samsung" />
              <Route element={<Uls />} path="uls" />
              <Route element={<Gsm />} path="gsm" />
            </Routes>
          </Box>

        </Grid>
      </Grid>
    </div>
  )
}

export default WBKOL_Trend