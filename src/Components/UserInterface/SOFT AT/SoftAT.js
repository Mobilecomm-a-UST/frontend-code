

import React, { useEffect, Suspense, lazy } from 'react'
import { useState } from 'react'
import PageIcon from '@rsuite/icons/Page';
import { Box, Button } from '@mui/material'
import { Grid } from '@mui/material'
import { Sidenav, Nav } from 'rsuite';
import Collapse from '@mui/material/Collapse';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import FileUploadIcon from '@rsuite/icons/FileUpload';
import { useNavigate } from 'react-router-dom'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SoftAtTool from './SoftAtTool'
import ViewsUnauthorizeIcon from '@rsuite/icons/ViewsUnauthorize';
import Upload_Soft_AT from './Upload_Soft_AT/Upload_Soft_AT'
import Upload_Soft_AT_Status from './Upload_Soft_AT/Upload_Soft_AT_Status'
import PendingSites from './Dashboard/PendingSites'
import AlarmBucket from './Dashboard/AlarmBucket'
import AgeingCircleWise from './Dashboard/AgeingCircleWise'
const Circle_Wise = lazy(() => import('./Dashboard/Circle_Wise'))
const Master_Dashboard = lazy(() => import('./Dashboard/Master_Dashboard'))
const WeeklyComparision = lazy(() => import('./Dashboard/WeeklyComparision'))
const ViewReport = lazy(() => import('./View Report/ViewReport'))





const SoftAT = () => {
  const [expanded, setExpanded] = useState(true);
  const [activeKey, setActiveKey] = useState();
  const [states, setStates] = useState(60)
  const [checked, setChecked] = useState(true)
  const [menuButton, setMenuButton] = useState(false)
  const [scrollTop, setScrollTop] = useState(0);

  const navigate = useNavigate()



  const show = () => {
    setChecked(!checked)
    if (checked === true) {
      setMenuButton(false)
    }
  }


 useEffect(()=>{
  document.title=`${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/',' | ').toUpperCase()}`

 },[])

  return (
    <>

      <Box style={{marginTop:states,transition:'all 1s ease'}} >

        <Grid container spacing={2}>
          <Grid item xs={0} md={2} sx={{}}>
            <Box sx={{ display: { xs: 'inherit', md: 'none' } }}>
              <Collapse in={!checked}>
                <Button onClick={() => { show() }} style={{ position: 'absolute', top: '60px', backgroundColor: '#223354' }}><SettingsIcon style={{ color: "white" }} /></Button>
              </Collapse>
              <Collapse in={checked} orientation="horizontal" timeout={'auto'}>
                <Box sx={{ width: 240, minHeight: "670px", height: "100hv", backgroundColor: "#223354", borderRadius: 5, position: 'fixed', zIndex: 10 }}>
                  <Sidenav expanded={expanded} defaultOpenKeys={[]} appearance="subtle">
                    <Sidenav.Body>
                      <Nav activeKey={activeKey} onSelect={setActiveKey} style={{ width: 'auto', minHeight: "670px", height: "100hv", backgroundColor: "#223354", marginTop: 8, borderRadius: 10 }}>
                        <Nav style={{ fontWeight: 600, color: 'white', textAlign: 'center', fontSize: 20 }}>Soft AT TOOL</Nav>
                        <Nav.Menu eventKey="1" placement="rightStart" title="Dashboard" icon={<DashboardIcon size="3em" />}>
                          <Nav.Item eventKey="1-1" onClick={() => { navigate('/tools/soft_at/master_dashboard'); show(); setMenuButton(true) }} >
                            Master Dashboard
                          </Nav.Item>
                          <Nav.Item eventKey="1-2" onClick={() => { navigate('/tools/soft_at/circle_wise'); show(); setMenuButton(true) }}>
                            Circle Wise
                          </Nav.Item>
                          <Nav.Item eventKey="1-6" onClick={() => { navigate('/tools/soft_at/weekly_comparison'); show(); setMenuButton(true) }}>
                            Weekly Comparison
                          </Nav.Item>
                        </Nav.Menu>
                        <Nav.Item eventKey="2" placement="rightStart" icon={<FileUploadIcon />} onClick={() => { navigate('/tools/soft_at/upload_soft_at'); show(); setMenuButton(true) }}>
                          Upload Soft AT
                        </Nav.Item>
                        <Nav.Item eventKey="3" placement="rightStart" icon={<PageIcon />} onClick={() => { navigate('/tools/soft_at/view_report'); show(); setMenuButton(true) }}>
                          View Report
                        </Nav.Item>
                        {/* <Nav.Item eventKey="4" placement="rightStart" icon={<ViewsUnauthorizeIcon />} onClick={() => { navigate('/tools/soft_at/rejected_report'); show(); setMenuButton(true) }}>
                        Rejected Report
                      </Nav.Item> */}
                      </Nav>
                    </Sidenav.Body>

                  </Sidenav>
                </Box>
              </Collapse>

            </Box>
            {/* THIS VIEW FOR PC  */}
            <Box sx={{ display: { xs: 'none', md: 'inherit' } }} >
              <Box sx={{ position:'fixed',width: '16.5%'}} >
                <Sidenav expanded={expanded} defaultOpenKeys={[]} appearance="subtle" style={{ minHeight:"670px",height:"100vh",backgroundColor:"#223354",marginTop:8,borderRadius:10 }}>
                  <Sidenav.Body>
                    <Nav activeKey={activeKey} onSelect={setActiveKey} >
                      <Nav style={{ fontWeight: 600, color: 'white', textAlign: 'center', fontSize: 20 }}>Soft AT TOOL</Nav>
                      <Nav.Menu eventKey="1" placement="rightStart" title="Dashboard" icon={<DashboardIcon size="3em" />}>
                        <Nav.Item eventKey="1-1" onClick={() => { navigate('/tools/soft_at/master_dashboard'); show(); setMenuButton(true) }} >
                          Master Dashboard
                        </Nav.Item>
                        <Nav.Item eventKey="1-2" onClick={() => { navigate('/tools/soft_at/circle_wise'); show(); setMenuButton(true) }}>
                          Circle Wise
                        </Nav.Item>
                        <Nav.Item eventKey="1-6" onClick={() => { navigate('/tools/soft_at/weekly_comparison'); show(); setMenuButton(true) }}>
                          Weekly Comparison
                        </Nav.Item>
                      </Nav.Menu>
                      <Nav.Item eventKey="2" placement="rightStart" icon={<FileUploadIcon />} onClick={() => { navigate('/tools/soft_at/upload_soft_at'); show(); setMenuButton(true) }}>
                        Upload Soft AT
                      </Nav.Item>
                      <Nav.Item eventKey="3" placement="rightStart" icon={<PageIcon />} onClick={() => { navigate('/tools/soft_at/view_report'); show(); setMenuButton(true) }}>
                        View Report
                      </Nav.Item>
                      {/* <Nav.Item eventKey="4" placement="rightStart" icon={<ViewsUnauthorizeIcon />} onClick={() => { navigate('/tools/soft_at/rejected_report'); show(); setMenuButton(true) }}>
                        Rejected Report
                      </Nav.Item> */}
                    </Nav>
                  </Sidenav.Body>

                </Sidenav>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={10}>


            <Suspense fallback={<div>loading............</div>}>
              <Routes>
                <Route element={<SoftAtTool />} path="/" />
                <Route element={<Circle_Wise />} path="/circle_wise" />
                <Route element={<Upload_Soft_AT />} path="/upload_soft_at/*" />
                <Route element={<Upload_Soft_AT_Status />} path="/upload_soft_at/status" />
                <Route element={<Master_Dashboard />} path="/master_dashboard" />
                <Route element={<PendingSites />} path='/pending_sites' />
                <Route element={<AlarmBucket />} path='/alarm_bucket' />
                <Route element={<AgeingCircleWise />} path='/ageing_circle_wise' />
                <Route element={<ViewReport />} path='/view_report' />
                <Route element={<WeeklyComparision />} path='/weekly_comparison' />

              </Routes>
            </Suspense>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default SoftAT