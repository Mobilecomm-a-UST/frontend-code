
import React, { useEffect } from 'react'
import { useState } from 'react'
import PageIcon from '@rsuite/icons/Page';
import { Box } from '@mui/material'
import { Grid } from '@mui/material'
import { Sidenav, Nav } from 'rsuite';
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import FileUploadIcon from '@rsuite/icons/FileUpload';
import { useNavigate } from 'react-router-dom'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Degrow_tool from './Degrow_tool';
import Make_Trend from './Make_trend/Make_Trend';
import MakeTrendV2 from './Make_trend_V2/MakeTrendV2';


const Degrow = () => {
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
              <div style={{ position: 'fixed' }}>
                <Sidenav expanded={expanded} defaultOpenKeys={[]} appearance="subtle">
                  <Sidenav.Body>
                    <Nav activeKey={activeKey} onSelect={setActiveKey} style={{ width: '200px', minHeight: "670px", height: "100hv", backgroundColor: "#223354", marginTop: 8, borderRadius: 10 }}>
                      <Nav style={{ fontWeight: 600, color: 'white', textAlign: 'center', fontSize: 19 }}>DEGROW TOOL</Nav>
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
                        <Nav.Item eventKey="1" placement="rightStart" icon={<DashboardIcon />} onClick={() => navigate('/tools/others/degrow/make_trend_v1')}>
                          Make Trend V1
                        </Nav.Item>
                        <Nav.Item eventKey="2" placement="rightStart" icon={<DashboardIcon />} onClick={() => navigate('/tools/others/degrow/make_trend_v2')}>
                          Make Trend V2
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
                <Route element={<Degrow_tool />} path="/" />
                <Route element={<Make_Trend/>} path="/make_trend_v1" />
                <Route element={<MakeTrendV2/>} path="/make_trend_v2" />



              </Routes>
            </Grid>
          </Grid>
        </Box>
      </>
    )
}

export default Degrow