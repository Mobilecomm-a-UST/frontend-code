
import React, { useEffect, lazy,Suspense } from 'react'
import { useState } from 'react'
import { Box } from '@mui/material'
import { Grid } from '@mui/material'
import { Sidenav, Nav } from 'rsuite';
import FileUploadIcon from '@rsuite/icons/FileUpload';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
const SchedularTools = lazy(() => import('./SchedularTools'))
const MakeAlaramTrend  = lazy(() => import('./MakeAlaramTrend/MakeAlaramTrend'))
const FormPage = lazy(() => import('./Form/FormPage'))

const Schedular = () => {
    const [expanded, setExpanded] = useState(true);
  const [activeKey, setActiveKey] = useState();
  const [states, setStates] = useState([])

  const navigate = useNavigate()
  useEffect(()=>{
    document.title=`${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/',' | ').toUpperCase()}`
  },[])

  return (
    <>

    <Box style={{ marginTop: '60px' }}>
      <Grid container spacing={2}>
        <Grid item xs={0} md={2} sx={{}}>
          <div style={{ position: 'fixed', width: '16%' }}>
            <Sidenav expanded={expanded} defaultOpenKeys={[]} appearance="subtle" style={{minHeight: "670px", height: "100hv", backgroundColor: "#223354", marginTop: 8, borderRadius: 10 }}>
              <Sidenav.Body>
                <Nav activeKey={activeKey} onSelect={setActiveKey} >
                  <Nav style={{ fontWeight: 600, color: 'white', textAlign: 'center', fontSize: 20 }}>SCHEDULER TOOL</Nav>

                  {/* <Nav.Menu eventKey="1" placement="rightStart" title="Dashboard" icon={<DashboardIcon size="3em"/>} >
                      <Nav.Item eventKey='1-1' placement="rightStart"  onClick={() => navigate('/tools/physical_at/dashboard')}>
                        Ageing(Circle Wise)
                      </Nav.Item>

                  </Nav.Menu> */}

                  <Nav.Item eventKey="1" placement="rightStart" icon={<FileUploadIcon />} onClick={() => navigate('/tools/schedular/alarm_trend')} >
                    Make Alarm Trend
                  </Nav.Item>
                  {/* <Nav.Item eventKey="1" placement="rightStart" icon={<FileUploadIcon />} onClick={() => navigate('/tools/others/schedular/form')} >
                    new form page
                  </Nav.Item> */}

                  {/* <Nav.Item eventKey="3" placement="rightStart" icon={<PageIcon />} onClick={() => navigate('/tools/soft_at/view_report')}>
                    View Report
                  </Nav.Item> */}
                </Nav>
              </Sidenav.Body>

            </Sidenav>
          </div>
        </Grid>
        <Grid item xs={12} md={10}>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route element={<SchedularTools />} path="/" />
            <Route element={< MakeAlaramTrend/>} path="/alarm_trend" />
            <Route element={< FormPage/>} path="/form" />
          </Routes>
        </Suspense>
        </Grid>
      </Grid>
    </Box>
  </>
  )
}

export default Schedular