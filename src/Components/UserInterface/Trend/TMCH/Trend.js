import React, { useEffect, Suspense, lazy} from 'react'
import { useState } from 'react'
import { Box } from '@mui/material'
import { Grid } from '@mui/material'
import { Sidenav, Nav } from 'rsuite';
import FileUploadIcon from '@rsuite/icons/FileUpload';
import { useNavigate } from 'react-router-dom'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
const TrendBox = lazy(() => import('../TrendBox'))
const PrePostReport = lazy(() => import('./Pre_Post_report/PrePostReport'))
const PrePostReportStatus = lazy(() => import('./Pre_Post_report/PrePostReportStatus'))
const MakeKPITrend = lazy(() => import('./Make Trend/MakeKPITrend'))
const MakeKPITrendOld = lazy(() => import('./Make_Trend(Old)/MakeKPITrendOld'))
const MakeKPITrendReport = lazy(() => import('./Make Trend/MakeKPITrendReport'))
const Upload_post_kpi = lazy(() => import('./Upload_Post_Kpi/Upload_post_kpi'))
// import TrendBox from '../TrendBox';
// import PrePostReport from './Pre_Post_report/PrePostReport';
// import PrePostReportStatus from './Pre_Post_report/PrePostReportStatus';
// import MakeKPITrend from './Make Trend/MakeKPITrend'
// import MakeKPITrendReport from './Make Trend/MakeKPITrendReport'
// import Upload_post_kpi from './Upload_Post_Kpi/Upload_post_kpi'
// import MakeKPITrendOld from './Make_Trend(Old)/MakeKPITrendOld'

export default function Trend() {
   const [expanded, setExpanded] = useState(true);
   const [activeKey, setActiveKey] = useState('1');
   const [states, setStates] = useState([])

   const navigate = useNavigate()

   const handleScroll = (event) => {
      console.log(event.document)
   }

   useEffect(() => {
      window.addEventListener('scroll', handleScroll);
      document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`
   }, [])

   return (
      <>
         <Box style={{ marginTop: states, transition: 'all 1s ease' }} >

            <Grid container spacing={2}>
               <Grid item xs={0} md={2} sx={{}}>
                  <Box sx={{ display: { xs: 'none', md: 'inherit' } }} >
                     <Box sx={{ position: 'fixed', width: '16.5%' }} >
                        <Sidenav expanded={expanded} defaultOpenKeys={[]} appearance="subtle" style={{ minHeight: "670px", height: "100vh", backgroundColor: "#223354", marginTop: 8, borderRadius: 10 }}>
                           <Sidenav.Body>
                              <Nav activeKey={activeKey} onSelect={setActiveKey} >
                                 <Nav style={{ fontWeight: 500, color: 'white', textAlign: 'center', fontSize: 20 }}>TN/CH Trend</Nav>
                                 <Nav.Menu placement="rightStart" eventKey="3" title="Pre-Post Upload" icon={<FileUploadIcon />}>

                                    <Nav.Item eventKey="3-2"
                                       onClick={() => navigate('/trends/tn_ch/Pre_Post_report')}
                                    >Pre-Post Report</Nav.Item>

                                 </Nav.Menu>
                                 <Nav.Item eventKey="4" icon={<FileUploadIcon />} onClick={() => navigate('/trends/tn_ch/make_kpi_trend')}>
                                    Make Trend
                                 </Nav.Item>
                                 <Nav.Item eventKey="7" icon={<FileUploadIcon />} onClick={() => navigate('/trends/tn_ch/make_kpi_trend_old')}>
                                    Make Trend(Old)
                                 </Nav.Item>
                                 <Nav.Item eventKey="5" icon={<FileUploadIcon />} onClick={() => navigate('/trends/tn_ch/upload_post_kpi')}>
                                    Upload Post KPI
                                 </Nav.Item>
                                 {/* <Nav.Item eventKey="6" icon={<FileUploadIcon/>} >
               Upload Pre KPI
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
                        <Route element={<TrendBox data={'TN-CH'} />} path="/" />
                        <Route element={<PrePostReport />} path="/Pre_Post_report" />
                        <Route element={<PrePostReportStatus />} path="/Pre_Post_report_status" />
                        <Route element={<MakeKPITrend />} path="/make_kpi_trend" />
                        <Route element={<MakeKPITrendOld />} path="/make_kpi_trend_old" />
                        <Route element={<MakeKPITrendReport />} path="/make_kpi_trend_report" />
                        <Route element={<Upload_post_kpi />} path="/upload_post_kpi" />
                     </Routes>
                  </Suspense>
               </Grid>
            </Grid>
         </Box>
      </>
   )

}

