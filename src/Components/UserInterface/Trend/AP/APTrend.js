import React, { useEffect, Suspense ,lazy} from 'react'
import { useState } from 'react'
import { Grid } from '@mui/material'
import { Box } from '@mui/material'
import { Sidenav, Nav } from 'rsuite';
import FileUploadIcon from '@rsuite/icons/FileUpload';
import { useNavigate } from 'react-router-dom'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
const TrendBox = lazy(() => import('../TrendBox'))
const MakeKPITrendOld = lazy(() => import('./Make_Trend(Old)/MakeKPITrendOld'))
const TwoG = lazy(() => import('./Make_Trend(Old)/2G/TwoG'))
const FourG = lazy(() => import('./Make_Trend(Old)/4G/FourG'))
// import MakeKPITrendOld from './Make_Trend(Old)/MakeKPITrendOld'
// import TrendBox from '../TrendBox';
// import TwoG from './Make_Trend(Old)/2G/TwoG';
// import FourG from './Make_Trend(Old)/4G/FourG';


function APTrend() {
  const [expanded, setExpanded] = useState(true);
  const [activeKey, setActiveKey] = useState('1');
  const [states, setStates] = useState([])
  const navigate = useNavigate()

  const headData = document.location.pathname.split('/');
  useEffect(() => {
    document.title = `Tools | ${headData[1]} | ${headData[2]}`
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
                      <Nav style={{ fontWeight: 500, color: 'white', textAlign: 'center', fontSize: 20 }}>AP Trend</Nav>

                      <Nav.Item eventKey="4" placement="rightStart" icon={<FileUploadIcon />} onClick={() => navigate('/trends/ap/make_kpi_trend_old')}>
                        Make Trend(Old)
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
                <Route element={<TrendBox data={'AP'} />} path="/" />
                <Route element={<MakeKPITrendOld />} path='/make_kpi_trend_old/*' />
                <Route element={<TwoG />} path='/make_kpi_trend_old/2G' />
                <Route element={<FourG />} path='/make_kpi_trend_old/4G' />
              </Routes>
            </Suspense>
          </Grid>
        </Grid>
      </Box>
    </>
  )

}
export default APTrend