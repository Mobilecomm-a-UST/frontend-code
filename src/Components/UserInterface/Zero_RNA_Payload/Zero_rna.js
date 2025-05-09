import React,{Suspense, lazy} from 'react'
import { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import { Grid } from '@mui/material'
import { Sidenav, Nav } from 'rsuite';
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import FileUploadIcon from '@rsuite/icons/FileUpload';
import AppSelectIcon from '@rsuite/icons/AppSelect';
import { useNavigate } from 'react-router-dom'
import { Routes, Route } from "react-router-dom";
const Zero_rna_tool = lazy(() => import('./Zero_rna_tool'));
const Upload_RNA_2G = lazy(() => import('./Upload_RNA/Upload_RNA_2G'));
const Uploas_RNA_4G = lazy(() => import('./Upload_RNA/Uploas_RNA_4G'));
const Dashboard2G = lazy(() => import('./Dashboard/Dashboard2G'));
const Dashboard4G = lazy(() => import('./Dashboard/Dashboard4G'));
const MasterDasboard = lazy(() => import('./Dashboard/MasterDashboard'));
const ZeroPayload100RNA = lazy(() => import('./Dashboard/Zero-100RNA/ZeroPayload100RNA'));
const Dip_Track_D1 = lazy(() => import('./Dashboard/Dip_Track_D1'));
const Dip_Track_A_A = lazy(() => import('./Dashboard/Dip_Track_A_A'));
const TicketStatus = lazy(() => import('./Dashboard/TicketStatus'));
const TicketStatusData = lazy(() => import('./Dashboard/Ticket Status/TicketStatusExpend'));
const Ms1_Done = lazy(() => import('./Upload_RNA/MS1-Done-site/Ms1_Done'));
const TicketCounter = lazy(()=> import('./Upload_RNA/TicketCounter'));
const PayloadDip = lazy(()=> import('./MasterDashboard/PayloadDip'));


const Zero_rna = () => {
  const [expanded, setExpanded] = useState(true);
  const [activeKey, setActiveKey] = useState();
  const navigate = useNavigate()

  useEffect(() => {
    document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`
  }, [])

  return (
    <>
      <Box style={{ marginTop: '60px' }}>
        <Grid container spacing={1}>
          <Grid item xs={2} >
            <div style={{ position: 'fixed' ,width:'16%',overflow:"scroll",scrollbarWidth:"2px"}}>
              <Sidenav expanded={expanded} defaultOpenKeys={[]} appearance="subtle" style={{ minHeight: "670px", height: "100vh", backgroundColor: "#223354", marginTop: 5, borderRadius: 10 }}>
                <Sidenav.Body>
                  <Nav activeKey={activeKey} onSelect={setActiveKey} >
                    <Nav style={{ fontWeight: 600, color: 'white', textAlign: 'center', fontSize: 18 }}>Zero RNA Tool</Nav>

                    <Nav.Menu eventKey="3" placement="rightStart" title="Master Dashboard" icon={<AppSelectIcon size="3em" />}>
                      <Nav.Item eventKey="3-1" placement="rightStart" onClick={() => navigate('/tools/zero_RNA_payload/payload_dip')}>
                        Payload Dip
                      </Nav.Item>
                    </Nav.Menu>

                    <Nav.Menu eventKey="1" placement="rightStart" title="Dashboard" icon={<DashboardIcon size="3em" />}>
                      <Nav.Item eventKey="1-1" placement="rightStart" onClick={() => navigate('/tools/zero_RNA_payload/master_dasboard')}>
                        Master Dashboard
                      </Nav.Item>
                      <Nav.Item eventKey="1-2" placement="rightStart" onClick={() => navigate('/tools/zero_RNA_payload/GSM_KPI_Trend')}>
                        GSM KPI Trend
                      </Nav.Item>
                      <Nav.Item eventKey="1-3" placement="rightStart" onClick={() => navigate('/tools/zero_RNA_payload/LTE_KPI_Trend')}>
                        LTE KPI Trend
                      </Nav.Item>
                      <Nav.Item eventKey="1-4" placement="rightStart" onClick={() => navigate('/tools/zero_RNA_payload/zero_payload_100_rna')}>
                        Zero Payload 100 RNA
                      </Nav.Item>
                      <Nav.Item eventKey="1-5" placement="rightStart" onClick={() => navigate('/tools/zero_RNA_payload/day_wise_payload_Analysis')}>
                        Day Wise Payload
                      </Nav.Item>
                      <Nav.Item eventKey="1-6" placement="rightStart" onClick={() => navigate('/tools/zero_RNA_payload/ticket_status')}>
                        Ticket Status
                      </Nav.Item>
                      <Nav.Item eventKey="1-7" placement="rightStart" onClick={() => navigate('/tools/zero_RNA_payload/week_wise_payload_Analysis')}>
                      Week Wise Payload
                      </Nav.Item>
                    </Nav.Menu>


                    <Nav.Menu eventKey="2" placement="rightStart" title="Report Upload" icon={<FileUploadIcon size="3em" />}>
                      <Nav.Item eventKey="2-1" placement="rightStart" onClick={() => navigate('/tools/zero_RNA_payload/report_upload_2G')}>
                        For 2G
                      </Nav.Item>
                      <Nav.Item eventKey="2-2" placement="rightStart" onClick={() => navigate('/tools/zero_RNA_payload/report_upload_4G')}>
                        For 4G
                      </Nav.Item>
                      <Nav.Item eventKey="2-3" placement="rightStart" onClick={() => navigate('/tools/zero_RNA_payload/ms1_done_sites')}>
                        MS1 Done Site
                      </Nav.Item>
                      <Nav.Item eventKey="2-4" placement="rightStart" onClick={() => navigate('/tools/zero_RNA_payload/report_upload_ticket_counter')}>
                        Ticket Counter
                      </Nav.Item>
                    </Nav.Menu>

                  </Nav>
                </Sidenav.Body>

              </Sidenav>
            </div>
          </Grid>
          <Grid item xs={10}>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route element={<Zero_rna_tool />} path="/" />
                <Route element={<Upload_RNA_2G />} path="/report_upload_2G" />
                <Route element={<Uploas_RNA_4G />} path="/report_upload_4G" />
                <Route element={<TicketCounter />} path="/report_upload_ticket_counter" />
                <Route element={<Dashboard2G />} path="/GSM_KPI_Trend" />
                <Route element={<Dashboard4G />} path="/LTE_KPI_Trend" />
                <Route element={<MasterDasboard />} path="/master_dasboard" />
                <Route element={<ZeroPayload100RNA />} path="/zero_payload_100_rna" />
                <Route element={<Dip_Track_D1 />} path="/day_wise_payload_Analysis" />
                <Route element={<Dip_Track_A_A />} path="/week_wise_payload_Analysis" />
                <Route element={<TicketStatus />} path="/ticket_status/*" />
                <Route element={<TicketStatusData />} path="/ticket_status/:name" />
                <Route element={< Ms1_Done />} path="/ms1_done_sites/*" />
                <Route element={< PayloadDip />} path="/payload_dip" />

              </Routes>
          </Suspense>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default Zero_rna