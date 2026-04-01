import React, { useEffect, Suspense, lazy } from 'react'
import { useState } from 'react'
import { Grid } from '@mui/material'
import { Sidenav, Nav } from 'rsuite';
import { Box } from '@mui/material'
import FileUploadIcon from '@rsuite/icons/FileUpload';
import { useNavigate } from 'react-router-dom'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
const ZTE = lazy(() => import('./Make_Trend(old)/ZTE'))
const SmallCell = lazy(() => import('./Make_Trend(old)/NOK/SmallCell'))
const HpscCell = lazy(() => import('./Make_Trend(old)/NOK/HpscCell'))
const TrendBox = lazy(() => import('../TrendBox'))
const DegrowV1 = lazy(() => import('./Degrow/DegrowV1'))
const DegrowV2 = lazy(() => import('./DegrowV2/Degrow_V2'))

const PBTrend = () => {
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
                      <Nav style={{ fontWeight: 500, color: 'white', textAlign: 'center', fontSize: 20 }}>PB Trend</Nav>
                      <Nav.Menu placement="rightStart" icon={<FileUploadIcon />} eventKey="1" title="Make Trend(Old)" >
                        <Nav.Menu eventKey="1-1" title="NOK" >
                          <Nav.Item eventKey="1-1-1" onClick={() => { navigate('/trends/pb/small_cell') }}>Small Cells</Nav.Item>
                          <Nav.Item eventKey="1-1-2" onClick={() => { navigate('/trends/pb/hpsc_cell') }}>Hpsc Cells</Nav.Item>
                        </Nav.Menu>
                        <Nav.Item placement='rightStart' eventKey='1-2' icon={<FileUploadIcon />} onClick={() => { navigate('/trends/pb/zte') }}>ZTE</Nav.Item>
                      </Nav.Menu>
                      <Nav.Item eventKey='2' icon={<FileUploadIcon />} onClick={() => { navigate('/trends/pb/degrow_V1') }}>
                        Degrow V1
                      </Nav.Item>
                      <Nav.Item eventKey='3' icon={<FileUploadIcon />} onClick={() => { navigate('/trends/pb/degrow_V2') }}>
                        Degrow V2
                      </Nav.Item>
                      {/* <Nav.Item eventKey="4" icon={<FileUploadIcon/>} onClick={()=>navigate(-1)}>
               Make Trend
            </Nav.Item> */}
                      {/* <Nav.Item eventKey="5" icon={<FileUploadIcon/>}
            // onClick={()=>navigate('/trends/rj/make_kpi_trend_old')}
            >
               Make Trend(old)
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
                <Route element={<TrendBox data={'PB'} />} path="/" />
                <Route element={<ZTE />} path='/zte' />
                <Route element={<SmallCell />} path='/small_cell' />
                <Route element={<HpscCell />} path='/hpsc_cell' />
                <Route element={<DegrowV1 />} path='/degrow_V1' />
                <Route element={<DegrowV2 />} path='/degrow_V2' />
              </Routes>
            </Suspense>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}
export default PBTrend