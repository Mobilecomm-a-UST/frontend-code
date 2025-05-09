
import React, { useEffect } from 'react'
import { useState } from 'react'
import { Box } from '@mui/material'
import { Grid } from '@mui/material'
import { Sidenav, Nav } from 'rsuite';
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import FileUploadIcon from '@rsuite/icons/FileUpload';
import { useNavigate } from 'react-router-dom'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PerformanceAtTool from './PerformanceAtTool'
import UploadPerformanceAt from './Upload_Performance_At/UploadPerformanceAt';
import Dashboard from './Dashboard/Dashboard';
import UploadPerformanceAtStatus from './Upload_Performance_At/UploadPerformanceAtStatus';
import AgeingSiteList from './Ageing_site_list/AgeingSiteList';

const Performance_At = () => {
    const [expanded, setExpanded] = useState(true);
    const [activeKey, setActiveKey] = useState();
    const [states, setStates] = useState([])

    const navigate = useNavigate()

//
useEffect(()=>{
  document.title=`${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/',' | ').toUpperCase()}`
},[])


    return (
      <>

        <Box style={{ marginTop: '70px' }}>

          <Grid container spacing={2}>
            <Grid item xs={0} md={2} sx={{}}>
              <div style={{ position: 'fixed' }}>
                <Sidenav expanded={expanded} defaultOpenKeys={[]} appearance="subtle">
                  <Sidenav.Body>
                    <Nav activeKey={activeKey} onSelect={setActiveKey} style={{ width: 'auto', minHeight: "670px", height: "100hv", backgroundColor: "#223354", marginTop: 8, borderRadius: 10 }}>
                      <Nav style={{ fontWeight: 600, color: 'white', textAlign: 'center', fontSize: 19 }}>PERFORMANCE AT</Nav>
                      {/* <Nav.Menu eventKey="1" placement="rightStart" title="Dashboard" icon={<DashboardIcon size="3em" />}>
                        <Nav.Item eventKey="1-1" onClick={() => navigate('/tools/soft_at/master_dashboard')} >
                          Master Dashboard
                        </Nav.Item>
                        <Nav.Item eventKey="1-2" onClick={() => navigate('/tools/soft_at/circle_wise')}>
                          Circle Wise
                        </Nav.Item>
                        <Nav.Item eventKey="1-3" onClick={() => navigate('/tools/soft_at/pending_sites')}>
                          Pending Sites
                        </Nav.Item>
                        <Nav.Item eventKey="1-4" onClick={() => navigate('/tools/soft_at/ageing_circle_wise')}>
                          Ageing Circle Wise
                        </Nav.Item>
                        <Nav.Item eventKey="1-5" onClick={() => navigate('/tools/soft_at/alarm_bucket')}>
                          Alarm Bucket
                        </Nav.Item>
                        <Nav.Item eventKey="1-6" onClick={() => navigate('/tools/soft_at/weekly_comparision')}>
                          Weekly Comparision
                        </Nav.Item>

                      </Nav.Menu> */}
                        <Nav.Item eventKey="1" placement="rightStart" icon={<DashboardIcon />} onClick={() => navigate('/tools/performance_at/dashboard')}>
                          Dashboard
                        </Nav.Item>
                        <Nav.Item eventKey="2" placement="rightStart" icon={<FileUploadIcon />} onClick={() => navigate('/tools/performance_at/upload_perforance_at')}>
                          Upload Performance AT
                        </Nav.Item>
                      {/* <Nav.Item eventKey="3" placement="rightStart" icon={<PageIcon />} onClick={() => navigate('/tools/soft_at/view_report')}>
                        View Report
                      </Nav.Item> */}
                    </Nav>
                  </Sidenav.Body>

                </Sidenav>
              </div>
            </Grid>
            <Grid item xs={12} md={10}>

              <Routes>
                <Route element={<PerformanceAtTool />} path="/" />
                <Route element={<UploadPerformanceAt />} path="/upload_perforance_at/*" />
                <Route element={<Dashboard />} path="/dashboard/*" />
                <Route element={<UploadPerformanceAtStatus/>} path="/upload_perforance_at/status" />
                <Route element={<AgeingSiteList/>} path="/dashboard/site_list" />
              </Routes>
            </Grid>
          </Grid>
        </Box>
      </>
    )
}

export default Performance_At