import React, { useEffect, Suspense, lazy } from 'react'
import { useState } from 'react'
import { Box, Button } from '@mui/material'
import { Grid } from '@mui/material'
import { Sidenav, Nav } from 'rsuite';
import { useNavigate } from 'react-router-dom'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ArrowRightIcon from '@rsuite/icons/ArrowRight';
import Divider from '@mui/material/Divider';
import ImportIcon from '@rsuite/icons/Import';
import CreditCardPlusIcon from '@rsuite/icons/CreditCardPlus';
import DashboardIcon from '@rsuite/icons/Dashboard';
import { getDecreyptedData } from '../../../Components/utils/localstorage';
import ListIcon from '@rsuite/icons/List';
import './../../../App.css'
import FolderIcon from '@rsuite/icons/Folder';
import { Admin } from '@rsuite/icons';
import { use } from 'react';
import Loader from '../../Skeleton/Loader';
import FileUploadIcon from '@rsuite/icons/FileUpload';
import SendToDashboardIcon from '@rsuite/icons/SendToDashboard';
import FileDownloadIcon from '@rsuite/icons/FileDownload';
import DownloadIcon from '@mui/icons-material/Download';
import ConversionIcon from '@rsuite/icons/Conversion';
import FolderVerifyIcon from '@rsuite/icons/FolderVerify';
import WarningRoundIcon from '@rsuite/icons/WarningRound';



// const BasebandTool = lazy(() => import("./BasebandTool"));
// const UploadFile = lazy(() => import("./BasebandUpload"));
// const Dashboard = lazy(() => import("./Dashboard"));
const PendingPerformanceTools = lazy(() => import('./PendingPerformanceRemarksTool'))
const UploadFile = lazy(() => import('./Upload/UploadFile'))
const Uploadupdatedreport = lazy(() => import('./Upload/Uploadupdatedreport'))
const Sitewiseremark = lazy(() => import('./Upload/Sitewiseremark'))
const DownloadCompleteReport = lazy(() => import('./Upload/DownloadCompleteReport'))
const DownloadTemplate = lazy(() => import('./Upload/DownloadTemplate'))
const DeleteDatabase = lazy(() => import('./Upload/DeleteDatabase'))




const PendingPerformanceRemarks = () => {
    const [expanded, setExpanded] = useState(true);
    const [activeKey, setActiveKey] = useState();
    const [states, setStates] = useState(60)
    const [checked, setChecked] = useState(true)
    const navigate = useNavigate()
    const [menuButton, setMenuButton] = useState(false)
    const userTypes = (getDecreyptedData('user_type')?.split(","))
    //  const classes = useStyles();
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
                        {/* THIS VIEW FOR PC  */}
                        <Box sx={{ display: { xs: 'none', md: 'inherit' } }} >
                            <Box sx={{ position: 'fixed', width: '16.5%' }} >
                                <Sidenav expanded={expanded} defaultOpenKeys={[]} appearance="subtle" style={{ minHeight: "670px", height: "100vh", backgroundColor: "#006e74", marginTop: 8, borderRadius: 10 }}>
                                    <Sidenav.Body>
                                        <Nav activeKey={activeKey} onSelect={setActiveKey} >
                                            <Nav style={{ fontWeight: 600, color: 'white', textAlign: 'center', fontSize: 20 }}>Pending Performance Remark</Nav>
                                            <Divider component="li" sx={{ backgroundColor: 'white' }} />


                                            <Nav.Item eventKey="1" placement="rightStart" className="single-item-custom" icon={< FolderVerifyIcon style={{}} />} onClick={() => { navigate('/tools/quality_team/pending_performance_re/UploadFile'); show(); setMenuButton(true) }}>
                                                Input File
                                            </Nav.Item>
                                            <Nav.Item eventKey="2" placement="rightStart" className="single-item-custom" icon={< ConversionIcon style={{}} />} onClick={() => { navigate('/tools/quality_team/pending_performance_re/Sitewiseremark'); show(); setMenuButton(true) }}>
                                                Site-Wise Remarks
                                            </Nav.Item>
                                            <Nav.Item eventKey="3" placement="rightStart" className="single-item-custom" icon={< FileDownloadIcon style={{}} />} onClick={() => { navigate('/tools/quality_team/pending_performance_re/DownloadCompleteReport'); show(); setMenuButton(true) }}>
                                                Download Complete Report
                                            </Nav.Item>
                                            <Nav.Item eventKey="4" placement="rightStart" className="single-item-custom" icon={< FileDownloadIcon style={{}} />} onClick={() => { navigate('/tools/quality_team/pending_performance_re/DownloadTemplate'); show(); setMenuButton(true) }}>
                                                Download Template
                                            </Nav.Item>
                                            <Nav.Item eventKey="5" placement="rightStart" className="single-item-custom" icon={< FileUploadIcon style={{}} />} onClick={() => { navigate('/tools/quality_team/pending_performance_re/Uploadupdatedreport'); show(); setMenuButton(true) }}>
                                                Upload Updated Report
                                            </Nav.Item>
                                            <Nav.Item eventKey="6" placement="rightStart" className="single-item-custom" icon={< WarningRoundIcon style={{}} />} onClick={() => { navigate('/tools/quality_team/pending_performance_re/DeleteDatabase'); show(); setMenuButton(true) }}>
                                                Delete Database
                                            </Nav.Item>


                                            {/* <Nav.Item eventKey="2" placement="rightStart" className="single-item-custom" icon={<SendToDashboardIcon style={{}} />} onClick={() => { navigate('/tools/baseband_requirement/Dashboard'); show(); setMenuButton(true) }}>
                                                Dashboard
                                            </Nav.Item> */}

                                        </Nav>
                                    </Sidenav.Body>
                                </Sidenav>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={10}>


                        <Suspense fallback={<Loader />}>
                            <Routes>
                                <Route path="/" element={<PendingPerformanceTools />} />

                                <Route path="/UploadFile" element={<UploadFile />} />
                                <Route path='/Sitewiseremark' element={<Sitewiseremark />} />
                                <Route path='/DownloadCompleteReport' element={<DownloadCompleteReport />} />
                                <Route path='/DownloadTemplate' element={<DownloadTemplate />} />
                                <Route path='/Uploadupdatedreport' element={<Uploadupdatedreport />} />
                                <Route path='/DeleteDatabase' element={<DeleteDatabase/>}/>
                                
                                {/* <Route path="/dashboard" element={<Dashboard />} /> */}


                                    {/* {userTypes?.includes('ran_admin') && 
                                <Route element={<FinalMailPage />} path="/email_dashboard" />
                                }
                                
                                {userTypes?.includes('ran_admin') &&
                                <Route element={<Module />} path="/module" />
                                }  */}

                            </Routes>
                        </Suspense>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}

export default PendingPerformanceRemarks