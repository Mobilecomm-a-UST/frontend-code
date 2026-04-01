import React, { useEffect, Suspense, lazy} from 'react'
import { useState } from 'react'

import { Box } from '@mui/material'
import { Grid } from '@mui/material'
import { Sidenav, Nav, Button } from 'rsuite';
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import FileUploadIcon from '@rsuite/icons/FileUpload';
import ListIcon from '@rsuite/icons/List';
import DetailIcon from '@rsuite/icons/Detail';
import { useNavigate } from 'react-router-dom'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
const TrendBox = lazy(() => import('../TrendBox'))
const MakeKPITrendOld = lazy(() => import('./Make_Trend(Old)/MakeKPITrendOld'))
const Degrow = lazy(() => import('./Degrow/Degrow'))
const Relocation = lazy(() => import('./Relocation/Relocation'))
const Samsung = lazy(() => import('./Samsumg/Samsung'))
const Uls = lazy(() => import('./ULS/Uls'))
const Gsm = lazy(() => import('./GSM/Gsm'))
// import TrendBox from '../TrendBox';
// import MakeKPITrendOld from './Make_Trend(Old)/MakeKPITrendOld'
// import Degrow from './Degrow/Degrow';
// import Collapse from '@mui/material/Collapse';
// import SettingsIcon from '@mui/icons-material/Settings';
// import Relocation from './Relocation/Relocation';
// import Samsung from './Samsumg/Samsung';
// import Uls from './ULS/Uls';
// import Gsm from './GSM/Gsm';

const WBKOL_Trend = () => {
  const [expanded, setExpanded] = useState(true);
  const [activeKey, setActiveKey] = useState('1');
  const [states, setStates] = useState([])
  const navigate = useNavigate()
  const [checked, setChecked] = useState(true)
  const [menuButton, setMenuButton] = useState(false)


  const show = () => {
    setChecked(!checked)
    if (checked == true) {
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
            <Box sx={{ display: { xs: 'none', md: 'inherit' } }} >
              <Box sx={{ position: 'fixed', width: '16.5%' }} >
                <Sidenav expanded={expanded} defaultOpenKeys={[]} appearance="subtle" style={{ minHeight: "670px", height: "100vh", backgroundColor: "#223354", marginTop: 8, borderRadius: 10 }}>
                  <Sidenav.Body>
                    <Nav activeKey={activeKey} onSelect={setActiveKey} >
                      <Nav style={{ fontWeight: 500, color: 'white', textAlign: 'center', fontSize: 20 }}>BW/KOL Trend</Nav>
                      <Nav.Menu placement="rightStart" eventKey="3" title="Pre-Post Upload" icon={<FileUploadIcon />}>
                        <Nav.Item eventKey="3-2"
                          onClick={() => navigate()}
                        >Pre-Post Report</Nav.Item>
                      </Nav.Menu>
                      <Nav.Item eventKey="4" placement="rightStart" icon={<FileUploadIcon />} onClick={() => { navigate('/trends/wb_kol/degrow'); show(); setMenuButton(true) }}>
                        Make Degrow
                      </Nav.Item>
                      <Nav.Item eventKey="5" placement="rightStart" icon={<FileUploadIcon />} onClick={() => { navigate('/trends/wb_kol/make_kpi_trend_old'); show(); setMenuButton(true) }}>
                        Make Trend(old)
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
                <Route element={<TrendBox data={'WB-KOL'} />} path="/" />
                <Route element={<MakeKPITrendOld />} path="make_kpi_trend_old" />
                <Route element={<Degrow />} path="degrow" />
                <Route element={<Relocation />} path="relocation" />
                <Route element={<Samsung />} path="samsung" />
                <Route element={<Uls />} path="uls" />
                <Route element={<Gsm />} path="gsm" />
              </Routes>
            </Suspense>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}
export default WBKOL_Trend