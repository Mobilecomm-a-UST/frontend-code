

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
import SoftAtTool from './SoftAtTool'
import CheckOutlineIcon from '@rsuite/icons/CheckOutline';
import Upload_Soft_AT from './Upload_Soft_AT/Upload_Soft_AT'
import Upload_Soft_AT_Status from './Upload_Soft_AT/Upload_Soft_AT_Status'
import PendingSites from './Dashboard/PendingSites'
import AlarmBucket from './Dashboard/AlarmBucket'
import AgeingCircleWise from './Dashboard/AgeingCircleWise'
import { getDecreyptedData } from '../../utils/localstorage';
const Circle_Wise = lazy(() => import('./Dashboard/Circle_Wise'))
const Master_Dashboard = lazy(() => import('./Dashboard/Master_Dashboard'))
const WeeklyComparision = lazy(() => import('./Dashboard/WeeklyComparision'))
const ViewReport = lazy(() => import('./View Report/ViewReport'));
const DownloadSoftAtTemplate = lazy(() => import('./DownloadTemp/DownloadSoftAtTemp'));
const SoftAtStatusTemplate = lazy(() => import('./DownloadTemp/SoftAtStatus'));
const SIVATemplate = lazy(() => import('./DownloadTemp/SiwaTemp'));
const SoftAtOffering = lazy(() => import('./DownloadTemp/SoftAtOffering'));
const CircleWiseStatus = lazy(() => import('./Dashboard/CircleWiseStatus'));
const EricssonChecklist = lazy(() => import('./EricssonStatus/Checklist'))
const EricssonSummary = lazy(() => import('./EricssonStatus/Summary'))
const NokiaChecklist = lazy(() => import('./NokiaStatus/Checklist'))
const NokiaSummary = lazy(() => import('./NokiaStatus/Summary'))
const NokiaChecklistTable = lazy(() => import('./NokiaStatus/ChecklistEditor'))
const NokiaSummaryTable = lazy(() => import('./NokiaStatus/SummaryTable'))
const Softat5gChecklist = lazy(() => import('./Softat5G/Checklist'))
const Softat5gSummary = lazy(() => import('./Softat5G/Summary'))
const G5parser = lazy(()=> import('./5Gparser/G5parser'))
const NokiaSA_NSA = lazy(() => import('./Nokia_SA_NSA/ChecklistEditor'))
const NokiaUploadAlarm = lazy(()=>import('./Nokia_SA_NSA/UploadNokiaAlarm'))
const UserCount = lazy(()=>import('./NokiaStatus/UserCounter'))




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
                        <Nav.Menu eventKey="4" title="Download Template" placement="rightStart" icon={<FileDownloadIcon />} >
                          <Nav.Item eventKey="4-1" onClick={() => { navigate('/tools/soft_at/download_soft_at_status_template'); show(); setMenuButton(true) }}>Soft-AT Status</Nav.Item>
                          <Nav.Item eventKey="4-2" onClick={() => { navigate('/tools/soft_at/download_siwa_template'); show(); setMenuButton(true) }}>SIWA Template</Nav.Item>
                          <Nav.Item eventKey="4-3" onClick={() => { navigate('/tools/soft_at/download_soft_at_offering_template'); show(); setMenuButton(true) }}>Soft-AT Offering</Nav.Item>
                        </Nav.Menu>
                        <Nav.Menu eventKey="5" title="Ericsson Status" placement="rightStart" icon={<CheckOutlineIcon />} >
                          <Nav.Item eventKey='5-1' onClick={() => { navigate('/tools/soft_at/ericsson_checklist'); show(); setMenuButton(true) }} >Checklist</Nav.Item>
                          <Nav.Item eventKey='5-2' onClick={() => { navigate('/tools/soft_at/ericsson_summary'); show(); setMenuButton(true) }} >Summary</Nav.Item>
                        </Nav.Menu>
                        <Nav.Menu eventKey="6" title="Nokia Status" placement="rightStart" icon={<CheckOutlineIcon />} >
                          <Nav.Item eventKey='6-1' onClick={() => { navigate('/tools/soft_at/nokia_checklist'); show(); setMenuButton(true) }} >Checklist</Nav.Item>
                          <Nav.Item eventKey='6-2' onClick={() => { navigate('/tools/soft_at/nokia_checklist_table'); show(); setMenuButton(true) }} >Checklist Table</Nav.Item>
                          <Nav.Item eventKey='6-3' onClick={() => { navigate('/tools/soft_at/nokia_summary'); show(); setMenuButton(true) }} >Summary</Nav.Item>
                        </Nav.Menu>
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
              <Box sx={{ position: 'fixed', width: '16.5%'  }} >
                <Sidenav expanded={expanded} defaultOpenKeys={[]} appearance="subtle" style={{ minHeight: "670px", height: "100vh", backgroundColor: "#223354", marginTop: 8, borderRadius: 10,overflow: "scroll", scrollbarWidth: "1px" }}>
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
                      <Nav.Menu eventKey="4" title="Download Template" placement="rightStart" icon={<FileDownloadIcon />} >
                        <Nav.Item eventKey="4-1" onClick={() => { navigate('/tools/soft_at/download_soft_at_status_template'); show(); setMenuButton(true) }}>Soft-AT Status</Nav.Item>
                        <Nav.Item eventKey="4-2" onClick={() => { navigate('/tools/soft_at/download_siwa_template'); show(); setMenuButton(true) }}>SIWA Template</Nav.Item>
                        <Nav.Item eventKey="4-3" onClick={() => { navigate('/tools/soft_at/download_soft_at_offering_template'); show(); setMenuButton(true) }}>Soft-AT Offering</Nav.Item>
                      </Nav.Menu>
                      <Nav.Menu eventKey="5" title="4G Ericsson" placement="rightStart" icon={<CheckOutlineIcon />} >
                        <Nav.Item eventKey='5-1' onClick={() => { navigate('/tools/soft_at/ericsson_checklist'); show(); setMenuButton(true) }} >Checklist</Nav.Item>
                        <Nav.Item eventKey='5-2' onClick={() => { navigate('/tools/soft_at/ericsson_summary'); show(); setMenuButton(true) }} >Summary</Nav.Item>
                      </Nav.Menu>
                     
                      <Nav.Menu eventKey="7" title="5G Ericsson" placement="rightStart" icon={<CheckOutlineIcon />} >
                        <Nav.Item eventKey='7-1' onClick={() => { navigate('/tools/soft_at/softat_5g_checklist'); show(); setMenuButton(true) }} >Checklist</Nav.Item>
                        {/* <Nav.Item eventKey='6-2' onClick={() => { navigate('/tools/soft_at/nokia_checklist_table'); show(); setMenuButton(true) }} >Checklist Table</Nav.Item> */}
                        <Nav.Item eventKey='7-3' onClick={() => { navigate('/tools/soft_at/softat_5g_summary'); show(); setMenuButton(true) }} >Summary</Nav.Item>
                        {/* <Nav.Item eventKey='6-4' onClick={() => { navigate('/tools/soft_at/nokia_summary_table'); show(); setMenuButton(true) }} >Summary Table</Nav.Item> */}
                      </Nav.Menu>

                       <Nav.Menu eventKey="6" title="Nokia Status" placement="rightStart" icon={<CheckOutlineIcon />} >
                        <Nav.Item eventKey='6-1' onClick={() => { navigate('/tools/soft_at/nokia_checklist'); show(); setMenuButton(true) }} >Checklist</Nav.Item>
                        <Nav.Item eventKey='6-2' onClick={() => { navigate('/tools/soft_at/nokia_checklist_table'); show(); setMenuButton(true) }} >Checklist Table</Nav.Item>
                        <Nav.Item eventKey='6-3' onClick={() => { navigate('/tools/soft_at/nokia_summary'); show(); setMenuButton(true) }} >Summary</Nav.Item>
                        <Nav.Item eventKey='6-4' onClick={() => { navigate('/tools/soft_at/nokia_summary_table'); show(); setMenuButton(true) }} >Summary Table</Nav.Item>
                        {userTypes?.includes('Admin') && <Nav.Item eventKey='6-5' onClick={() => { navigate('/tools/soft_at/nokia_user_count'); show(); setMenuButton(true) }} >User Counter</Nav.Item>}
                      </Nav.Menu>

                      <Nav.Menu eventKey="8" title="Nokia SA/NSA" placement="rightStart" icon={<CheckOutlineIcon />} >
                          <Nav.Item eventKey='8-1' onClick={() => { navigate('/tools/soft_at/nokia_sa_nsa_table'); show(); setMenuButton(true) }} >SA/NSA Table</Nav.Item>
                          <Nav.Item eventKey='8-2' onClick={() => { navigate('/tools/soft_at/nokia_upload_alarm'); show(); setMenuButton(true) }} >Upload Nokia Alarm</Nav.Item>

                      </Nav.Menu>

                      <Nav.Item eventKey="8" placement="rightStart" icon={<PageIcon />} onClick={() => { navigate('/tools/soft_at/5g_parser'); show(); setMenuButton(true) }}>
                        5G Parser
                      </Nav.Item>

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
                <Route element={<Circle_Wise />} path="/circle_wise/*" />
                <Route element={<CircleWiseStatus />} path="/circle_wise/:name" />
                <Route element={<Upload_Soft_AT />} path="/upload_soft_at/*" />
                <Route element={<Upload_Soft_AT_Status />} path="/upload_soft_at/status" />
                <Route element={<Master_Dashboard />} path="/master_dashboard" />
                <Route element={<PendingSites />} path='/pending_sites' />
                <Route element={<AlarmBucket />} path='/alarm_bucket' />
                <Route element={<AgeingCircleWise />} path='/ageing_circle_wise' />
                <Route element={<ViewReport />} path='/view_report' />
                <Route element={<WeeklyComparision />} path='/weekly_comparison' />
                <Route element={<SoftAtStatusTemplate />} path='/download_soft_at_status_template' />
                <Route element={<SIVATemplate />} path='/download_siwa_template' />
                <Route element={<SoftAtOffering />} path='/download_soft_at_offering_template' />
                <Route element={<EricssonChecklist />} path='/ericsson_checklist' />
                <Route element={<EricssonSummary />} path='/ericsson_summary' />
                <Route element={<NokiaChecklist />} path='/nokia_checklist' />
                <Route element={<NokiaSummary />} path='/nokia_summary' />
                <Route element={<NokiaChecklistTable />} path='/nokia_checklist_table' />
                <Route element={<NokiaSummaryTable />} path='/nokia_summary_table' />
                <Route element={<Softat5gChecklist />} path='/softat_5g_checklist' />
                <Route element={<Softat5gSummary />} path='/softat_5g_summary' />
                <Route element={<G5parser />} path='/5g_parser' />
                <Route element={<NokiaSA_NSA />} path='/nokia_sa_nsa_table' />
                <Route element={<NokiaUploadAlarm />} path='/nokia_upload_alarm' />
                {userTypes?.includes('Admin') && <Route element={<UserCount />} path='/nokia_user_count' />}

              </Routes>
            </Suspense>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default SoftAT