
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
import PhysicalAtTool from './PhysicalAtTool';
import UploadPhysicalAt, { PhysicalAtStatus } from './Upload_Physical_AT/UploadPhysicalAt';
import Dashoard from './Dashboard/Dashoard';
import UploadPhysicalAtStatus from './Upload_Physical_AT/UploadPhysicalAtStatus';


const Physical_At = () => {

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
              <Sidenav expanded={expanded} defaultOpenKeys={[]} appearance="subtle" style={{ minHeight: "670px", height: "100vh", backgroundColor: "#223354", marginTop: 5, borderRadius: 10 }}>
                <Sidenav.Body>
                  <Nav activeKey={activeKey} onSelect={setActiveKey} >
                    <Nav style={{ fontWeight: 600, color: 'white', textAlign: 'center', fontSize: 20 }}>PHYSICAL AT TOOL</Nav>
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
                    <Nav.Menu eventKey="1" placement="rightStart" title="Dashboard" icon={<DashboardIcon size="3em"/>} >
                        <Nav.Item eventKey='1-1' placement="rightStart"  onClick={() => navigate('/tools/physical_at/dashboard')}>
                          Ageing(Circle Wise)
                        </Nav.Item>

                    </Nav.Menu>

                    <Nav.Item eventKey="2" placement="rightStart" icon={<FileUploadIcon />} onClick={() => navigate('/tools/physical_at/upload_physical_at')}>
                      Upload Physical AT
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
              <Route element={<PhysicalAtTool />} path="/" />
              <Route element={<UploadPhysicalAt />} path="/upload_physical_at/*" />
              <Route element={<Dashoard />} path="/dashboard" />
              <Route element={<UploadPhysicalAtStatus />} path="/upload_physical_at/status" />



            </Routes>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default Physical_At