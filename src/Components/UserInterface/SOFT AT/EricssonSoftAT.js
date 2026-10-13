

import React, { useEffect, Suspense, lazy } from 'react'
import { useState } from 'react'
import PageIcon from '@rsuite/icons/Page';
import FileDownloadIcon from '@rsuite/icons/FileDownload';
import { Box, Button } from '@mui/material'
import { Grid } from '@mui/material'
import { Sidenav, Nav } from 'rsuite';
import Collapse from '@mui/material/Collapse';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import FileUploadIcon from '@rsuite/icons/FileUpload';
import { useNavigate } from 'react-router-dom'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EricssonSoftAtTool from './EricssonSoftAtTool'
import CheckOutlineIcon from '@rsuite/icons/CheckOutline';
import Upload_Soft_AT from './Upload_Soft_AT/Upload_Soft_AT'
import Upload_Soft_AT_Status from './Upload_Soft_AT/Upload_Soft_AT_Status'
import PendingSites from './Dashboard/PendingSites'
import AlarmBucket from './Dashboard/AlarmBucket'
import AgeingCircleWise from './Dashboard/AgeingCircleWise'
import { getDecreyptedData } from '../../utils/localstorage';
import Nokiacheclist5g from './NokiaStatus/nokiacheclist5g';
import Loader from '../../Skeleton/Loader'
import './../../../App.css'




const EricssonChecklist = lazy(() => import('./EricssonStatus/Checklist'))
const EricssonSummary = lazy(() => import('./EricssonStatus/Summary'))
const Softat5GChecklist = lazy(() => import('./Softat5G/Checklist'))
const Softat5GSummary = lazy(() => import('./Softat5G/Summary'))


const SoftAT = () => {
  const [expanded, setExpanded] = useState(true);
  const [activeKey, setActiveKey] = useState();
  const [states, setStates] = useState(60)
  const [checked, setChecked] = useState(true)
  const [menuButton, setMenuButton] = useState(false)
  const [scrollTop, setScrollTop] = useState(0);
  const userTypes = (getDecreyptedData('user_type')?.split(","))


  const navigate = useNavigate()



  const show = () => {
    setChecked(!checked)
    if (checked === true) {
      setMenuButton(false)
    }
  }


  useEffect(() => {
    document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`

  }, [])

  return (
    <>

      <Box style={{ marginTop: states, transition: 'all 1s ease' }} >

        <Grid container spacing={2}>
          <Grid item xs={0} md={2} sx={{}}>
            <Box sx={{ display: { xs: 'inherit', md: 'none' } }}>
              <Collapse in={!checked}>
                <Button onClick={() => { show() }} style={{ position: 'absolute', top: '60px', backgroundColor: "#006e74", }}><SettingsIcon style={{ color: "white" }} /></Button>
              </Collapse>
              <Collapse in={checked} orientation="horizontal" timeout={'auto'}>
                <Box sx={{ width: 240, minHeight: "670px", height: "100hv", backgroundColor: "#006e74", borderRadius: 5, position: 'fixed', zIndex: 10 }}>
                  <Sidenav expanded={expanded} defaultOpenKeys={[]} appearance="subtle">
                    <Sidenav.Body>
                      <Nav activeKey={activeKey} onSelect={setActiveKey} style={{ width: 'auto', minHeight: "670px", height: "100hv", backgroundColor: "#006e74", marginTop: 8, borderRadius: 10 }}>
                        <Nav style={{ fontWeight: 600, color: 'white', textAlign: 'center', fontSize: 20 }}>Ericsson Soft AT</Nav>
                        {/* <Nav.Menu eventKey="1" placement="rightStart" className="menu-title-custom" title="Dashboard" icon={<DashboardIcon size="3em" />}>
                          <Nav.Item eventKey="1-1" className="single-item-custom" onClick={() => { navigate('/tools/soft_at_tools/nokia_soft_at/master_dashboard'); show(); setMenuButton(true) }} >
                            Master Dashboard
                          </Nav.Item>
                          <Nav.Item eventKey="1-2" className="single-item-custom" onClick={() => { navigate('/tools/soft_at_tools/nokia_soft_at/circle_wise'); show(); setMenuButton(true) }}>
                            Circle Wise
                          </Nav.Item>
                          <Nav.Item eventKey="1-6" className="single-item-custom" onClick={() => { navigate('/tools/soft_at_tools/nokia_soft_at/weekly_comparison'); show(); setMenuButton(true) }}>
                            Weekly Comparison
                          </Nav.Item>
                        </Nav.Menu>
                        <Nav.Item eventKey="2" placement="rightStart" icon={<FileUploadIcon />} className="single-item-custom" onClick={() => { navigate('/tools/soft_at_tools/nokia_soft_at/upload_soft_at'); show(); setMenuButton(true) }}>
                          Upload Soft AT
                        </Nav.Item>
                        <Nav.Item eventKey="3" placement="rightStart" icon={<PageIcon />} className="single-item-custom" onClick={() => { navigate('/tools/soft_at_tools/nokia_soft_at/view_report'); show(); setMenuButton(true) }}>
                          View Report
                        </Nav.Item>
                        <Nav.Menu eventKey="4" className="menu-title-custom" title="Download Template" placement="rightStart" icon={<FileDownloadIcon />} >
                          <Nav.Item eventKey="4-1" className="single-item-custom" onClick={() => { navigate('/tools/soft_at_tools/nokia_soft_at/download_soft_at_status_template'); show(); setMenuButton(true) }}>Soft-AT Status</Nav.Item>
                          <Nav.Item eventKey="4-2" className="single-item-custom" onClick={() => { navigate('/tools/soft_at_tools/nokia_soft_at/download_siwa_template'); show(); setMenuButton(true) }}>SIWA Template</Nav.Item>
                          <Nav.Item eventKey="4-3" className="single-item-custom" onClick={() => { navigate('/tools/soft_at_tools/nokia_soft_at/download_soft_at_offering_template'); show(); setMenuButton(true) }}>Soft-AT Offering</Nav.Item>
                        </Nav.Menu> */}
                        <Nav.Menu eventKey="5" className="menu-title-custom" title="Ericsson Status" placement="rightStart" icon={<CheckOutlineIcon />} >
                          <Nav.Item eventKey='5-1' className="single-item-custom" onClick={() => { navigate('/tools/soft_at_tools/ericsson_soft_at/ericsson_checklist'); show(); setMenuButton(true) }} >Checklist</Nav.Item>
                          <Nav.Item eventKey='5-2' className="single-item-custom" onClick={() => { navigate('/tools/soft_at_tools/ericsson_soft_at/ericsson_summary'); show(); setMenuButton(true) }} >Summary</Nav.Item>
                        </Nav.Menu>
                        {/* <Nav.Menu eventKey="6" className="menu-title-custom" title="Nokia Status" placement="rightStart" icon={<CheckOutlineIcon />} >
                          <Nav.Item eventKey='6-1' className="single-item-custom" onClick={() => { navigate('/tools/soft_at_tools/nokia_soft_at/nokia_checklist'); show(); setMenuButton(true) }} >Checklist</Nav.Item>
                          <Nav.Item eventKey='6-2' className="single-item-custom" onClick={() => { navigate('/tools/soft_at_tools/nokia_soft_at/nokia_checklist_table'); show(); setMenuButton(true) }} >Checklist Table</Nav.Item>
                          <Nav.Item eventKey='6-3' className="single-item-custom" onClick={() => { navigate('/tools/soft_at_tools/nokia_soft_at/nokia_summary'); show(); setMenuButton(true) }} >Summary</Nav.Item>
                        </Nav.Menu> */}
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
              <Box sx={{ position: 'fixed', width: '16.5%' }} >
                <Sidenav expanded={expanded} defaultOpenKeys={[]} appearance="subtle" style={{ minHeight: "670px", height: "100vh", backgroundColor: "#006e74", marginTop: 8, borderRadius: 10, overflow: "scroll", scrollbarWidth: "1px" }}>
                  <Sidenav.Body>
                    <Nav activeKey={activeKey} onSelect={setActiveKey} >
                      <Nav style={{ fontWeight: 600, color: 'white', textAlign: 'center', fontSize: 20 }}>Ericsson Soft AT Tool</Nav>

                      <Nav.Menu eventKey="5" className="menu-title-custom" title="4G Ericsson" placement="rightStart" icon={<CheckOutlineIcon />} >
                        <Nav.Item eventKey='5-1' className="single-item-custom" onClick={() => { navigate('/tools/soft_at_tools/ericsson_soft_at/ericsson_checklist'); show(); setMenuButton(true) }} >Checklist</Nav.Item>
                        <Nav.Item eventKey='5-2' className="single-item-custom" onClick={() => { navigate('/tools/soft_at_tools/ericsson_soft_at/ericsson_summary'); show(); setMenuButton(true) }} >Summary</Nav.Item>
                      </Nav.Menu>

                      <Nav.Menu eventKey="7" className="menu-title-custom" title="5G Ericsson" placement="rightStart" icon={<CheckOutlineIcon />} >
                        <Nav.Item eventKey='7-1' className="single-item-custom" onClick={() => { navigate('/tools/soft_at_tools/ericsson_soft_at/softat_5g_checklist'); show(); setMenuButton(true) }} >Checklist</Nav.Item>
                        <Nav.Item eventKey='7-2' className="single-item-custom" onClick={() => { navigate('/tools/soft_at_tools/ericsson_soft_at/softat_5g_summary'); show(); setMenuButton(true) }} >Checklist Table</Nav.Item>
                       
                      </Nav.Menu>



                    </Nav>
                  </Sidenav.Body>

                </Sidenav>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={10}>


            <Suspense fallback={<Loader />}>
              <Routes>
                <Route element={<EricssonSoftAtTool />} path="/" />

                <Route element={<EricssonChecklist />} path='/ericsson_checklist' />
                <Route element={<EricssonSummary />} path='/ericsson_summary' />
                <  Route element={<Softat5GChecklist />} path='/softat_5g_checklist' />
                <Route element={<Softat5GSummary />} path='/softat_5g_summary' />

              </Routes>
            </Suspense>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default SoftAT