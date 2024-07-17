import React, { useEffect } from 'react'
import { useState } from 'react'
import { Grid } from '@mui/material'
import { Sidenav, Nav } from 'rsuite';
import FileUploadIcon from '@rsuite/icons/FileUpload';
import { useNavigate } from 'react-router-dom'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MakeKPITrendOld from './Make_Trend(Old)/MakeKPITrendOld'
import TrendBox from '../TrendBox';
import TwoG from './Make_Trend(Old)/2G/TwoG';
import FourG from './Make_Trend(Old)/4G/FourG';


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
    <div >

      <Grid container spacing={1}>
        <Grid item xs={2}>
          <div >
            <Sidenav expanded={expanded} defaultOpenKeys={['1', '3']} appearance="subtle">
              <Sidenav.Body>
                <Nav activeKey={activeKey} onSelect={setActiveKey} style={{ width: '', minHeight: "670px", height: "100hv", backgroundColor: "#223354", marginTop: 8, borderRadius: 10, position: 'fixed' }}>
                  <Nav style={{ fontWeight: 600, color: 'white', textAlign: 'center', fontSize: 20 }}>AP Trend</Nav>

                  {/* <Nav.Menu placement="rightStart" eventKey="3" title="Pre-Post Upload" icon={<FileUploadIcon/>}>
          <Nav.Item eventKey="3-2"
           >Pre-Post Report</Nav.Item>
        </Nav.Menu> */}
                  <Nav.Item eventKey="4" icon={<FileUploadIcon />}
                    onClick={() => navigate('/trends/ap/make_kpi_trend_old')}
                  >
                    Make Trend(Old)
                  </Nav.Item>

                </Nav>
              </Sidenav.Body>

            </Sidenav>
          </div>
        </Grid>
        <Grid item xs={10}>
          <div >



            <Routes>


              <Route element={<TrendBox data={'AP'} />} path="/" />
              <Route element={<MakeKPITrendOld />} path='/make_kpi_trend_old/*' />
              <Route element={<TwoG />} path='/make_kpi_trend_old/2G' />
              <Route element={<FourG />} path='/make_kpi_trend_old/4G' />



            </Routes>

          </div>

        </Grid>
      </Grid>
    </div>
  )
}

export default APTrend