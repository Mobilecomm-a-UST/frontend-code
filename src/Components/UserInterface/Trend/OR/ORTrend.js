import React, { useEffect, Suspense ,lazy} from 'react'
import { useState } from 'react'
import { Grid } from '@mui/material'
import { Box } from '@mui/material'
import { Sidenav, Nav } from 'rsuite';
import FileUploadIcon from '@rsuite/icons/FileUpload';
import { useNavigate } from 'react-router-dom'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
const TrendBox = lazy(() => import('../TrendBox'))
const KpiTrend4G = lazy(() => import('./Make_Trend(Old)/KpiTrend4G'))
const KpiTrendRAN = lazy(() => import('./Make_Trend(Old)/KpiTrendRAN'))
const KpiTrend2G = lazy(() => import('./Make_Trend(Old)/KpiTrend2G'))
// import KpiTrend4G from './Make_Trend(Old)/KpiTrend4G';
// import KpiTrendRAN from './Make_Trend(Old)/KpiTrendRAN';
// import TrendBox from '../TrendBox';
// import KpiTrend2G from './Make_Trend(Old)/KpiTrend2G';

// import PrePostReport from './Pre_Post_report/PrePostReport';
// import PrePostReportStatus from './Pre_Post_report/PrePostReportStatus';
// import MakeKPITrend from './Make Trend/MakeKPITrend'
// import MakeKPITrendReport from './Make Trend/MakeKPITrendReport'



function ORTrend() {
  const [expanded, setExpanded] = useState(true);
  const [activeKey, setActiveKey] = useState('1');
  const [states, setStates] = useState([])

  const navigate = useNavigate()
  const headData = document.location.pathname.split('/');
  useEffect(() => {
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
                      <Nav style={{ fontWeight: 500, color: 'white', textAlign: 'center', fontSize: 20 }}>OR Trend</Nav>
                      {/*
        <Nav.Menu placement="rightStart" eventKey="3" title="Pre-Post Upload" icon={<FileUploadIcon/>}>

          <Nav.Item eventKey="3-2"
        //    onClick={()=>navigate('/trends/tn_ch/Pre_Post_report')}
           >Pre-Post Report</Nav.Item>

        </Nav.Menu> */}
                      <Nav.Menu activeKey="2" icon={<FileUploadIcon />} title="Make Trend (Old)">
                        <Nav.Item eventKey="2-1"
                          onClick={() => navigate('/trends/or/kpi_trend_old_2G')}
                        >
                          Trend 2G
                        </Nav.Item>
                        <Nav.Item eventKey="2-2"
                          onClick={() => navigate('/trends/or/kpi_trend_old_4G')}
                        >
                          Trend 4G
                        </Nav.Item>
                        <Nav.Item eventKey="2-3"
                          onClick={() => navigate('/trends/or/kpi_trend_old_RAN')}
                        >
                          Trend RNA
                        </Nav.Item>
                      </Nav.Menu>
                    </Nav>
                  </Sidenav.Body>
                </Sidenav>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={10}>
            <Suspense fallback={<div>loading............</div>}>
              <Routes>
                <Route element={<TrendBox data={'OR'} />} path="/" />
                <Route element={<KpiTrend4G />} path="/kpi_trend_old_4G" />
                <Route element={<KpiTrendRAN />} path="/kpi_trend_old_RAN" />
                <Route element={<KpiTrend2G />} path="/kpi_trend_old_2G" />
              </Routes>
            </Suspense>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}
export default ORTrend