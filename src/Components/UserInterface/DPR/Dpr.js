import React, { useEffect } from 'react'
import { useState } from 'react'
import Home from '../Home'
import { Box } from '@mui/material'
import { Grid } from '@mui/material'
import { Sidenav, Nav } from 'rsuite';
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import FileUploadIcon from '@rsuite/icons/FileUpload';
import ListIcon from '@rsuite/icons/List';
import DetailIcon from '@rsuite/icons/Detail';
import { useNavigate } from 'react-router-dom'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from './Dashboard'
import NewTable from './NewTable'
import UploadDprKey from './UploadDprKey'
import UploadDprMapa from './UploadDprMapa'
import EditData from './EditData'
import CircleWise from './CircleWise'
import DprTool from './DprTool'
import DprAllData from '../ViewDPR/DprAllData'
import ProjectWiseNT from './ProjectWiseNT'
import ProjectWiseUls from './ProjectWiseUls'
import ProjectWiseCU from './ProjectWiseCU'
import MapaUploadStatus from './MapaUploadStatus'
import DprReport from './DPR_report/DprReport'
import DprReportStatus from './DPR_report/DprReportStatus'
import ProjectWiseRelocation from './ProjectWiseRelocation'
import { getData } from '../../services/FetchNodeServices'
import MasterDasboard from './MasterDasboard'



export default function Dpr() {
  const [expanded, setExpanded] = useState(true);
  const [activeKey, setActiveKey] = useState('1');
  const [states, setStates] = useState([])

  const navigate = useNavigate()

  const fetchViewDPR = async () => {
    const response = await getData('trend/get_circle/')
    setStates(response.cir)
    // console.log(response.cir)

  }


  useEffect(() => {
    // navigate('/dpr');
        fetchViewDPR();
  }, [])


  return (
    <div >
      <Box style={{position: 'static'}}><Home /></Box>
      <Grid container spacing={1} style={{ marginTop: '50px' }}>
        <Grid item xs={2}>
          <div style={{ height: "670px", backgroundColor: "#223354", marginTop: 8, borderRadius: 10, position: 'fixed' }}>
            <Sidenav expanded={expanded} defaultOpenKeys={[]} appearance="subtle">
              <Sidenav.Body >
                <Nav activeKey={activeKey} onSelect={setActiveKey} style={{}}>
                  <Nav style={{ fontWeight: 600, color: 'white', textAlign: 'center', fontSize: 20 }}>DPR TOOL</Nav>
                  <Nav.Item eventKey="5" icon={<ListIcon />} onClick={() => navigate('/dpr/master_dasboard')}>
                    Master Dashboard
                  </Nav.Item>
                  <Nav.Menu eventKey="1" placement="rightStart" title="Dashboard" icon={<DashboardIcon />}>
                    <Nav.Item eventKey='1-1' onClick={() => navigate('/dpr/dashboard')}>Over All</Nav.Item>
                    <Nav.Item eventKey='1-2' onClick={() => navigate('/dpr/circle_wise')}>Circle-Wise</Nav.Item>
                    <Nav.Menu eventKey='1-3' title="Project-Wise" placement="rightStart">
                      <Nav.Item eventKey='1-3-1' onClick={() => navigate('/dpr/project_wise_NT')}>NT</Nav.Item>
                      <Nav.Item eventKey='1-3-2' onClick={() => navigate('/dpr/project_wise_ULS')}>ULS</Nav.Item>
                      <Nav.Item eventKey='1-3-3' onClick={() => navigate('/dpr/project_wise_CU')}>Capacity Upgrade</Nav.Item>
                      <Nav.Item eventKey='1-3-4' onClick={() => navigate('/dpr/project_wise_Relocation')}>Relocation</Nav.Item>
                    </Nav.Menu>
                  </Nav.Menu>
                  <Nav.Item eventKey="2" icon={<ListIcon />} onClick={() => navigate('/dpr/view_site_list')}>
                    View Site Lists
                  </Nav.Item>
                  <Nav.Menu placement="rightStart" eventKey="3" title="DPR Upload" icon={<FileUploadIcon />}>
                    <Nav.Item eventKey="3-1" onClick={() => navigate('/dpr/upload_dpr_key')}>DPR Key</Nav.Item>
                    <Nav.Item eventKey="3-2" onClick={() => navigate('/dpr/dpr_report')}>DPR Report</Nav.Item>
                    <Nav.Item eventKey="3-3" onClick={() => navigate('/dpr/upload_dpr_mapa')}>DPR MAPA Status</Nav.Item>
                  </Nav.Menu>
                  <Nav.Menu
                    placement="rightStart"
                    eventKey="4"
                    title="View DPR"
                    icon={<DetailIcon />}
                  >
                    <Nav.Item eventKey="4-1" onClick={() => navigate('/dpr/dpr_all_data')}>All</Nav.Item>


                  </Nav.Menu>
                </Nav>
              </Sidenav.Body>
              {/* <Sidenav.Toggle expanded={expanded} onToggle={expanded => setExpanded(expanded)} /> */}
            </Sidenav>
          </div>
        </Grid>
        <Grid item xs={10}>
          <div >

            <Routes>

              <Route element={<Dashboard />} path="/dashboard" />
              <Route element={<NewTable />} path="/view_site_list" />
              <Route element={<UploadDprKey />} path="/upload_dpr_key" />
              <Route element={<UploadDprMapa />} path="/upload_dpr_mapa" />
              <Route element={<EditData />} path="/edit_data" />
              <Route element={<CircleWise />} path="/circle_wise" />
              <Route element={<DprTool />} path="/" />
              <Route element={<DprAllData />} path="/dpr_all_data" />
              <Route element={<ProjectWiseNT />} path="/project_wise_NT" />
              <Route element={<ProjectWiseUls />} path="/project_wise_ULS" />
              <Route element={<ProjectWiseCU />} path="/project_wise_CU" />
              <Route element={<ProjectWiseRelocation />} path="/project_wise_Relocation" />
              <Route element={<MapaUploadStatus />} path="/mapa_status" />
              <Route element={<DprReport />} path="/dpr_report" />
              <Route element={<DprReportStatus />} path="/dpr_report_status" />
              <Route element={<MasterDasboard />} path="/master_dasboard" />
            </Routes>

          </div>

        </Grid>
      </Grid>
    </div>
  )
}
