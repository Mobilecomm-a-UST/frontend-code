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
import FileUploadIcon from '@rsuite/icons/FileUpload';
import { Admin } from '@rsuite/icons';
import { use } from 'react';
import Loader from '../../Skeleton/Loader';


const PerformancePendingTool = lazy(() => import("./PerformancePendingTool"));
const FileManager = lazy(() => import("./FileManager/FileManager"));

const PerformancePending = () => {
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
                                <Sidenav expanded={expanded} defaultOpenKeys={['1']} appearance="subtle" style={{ minHeight: "670px", height: "100vh", backgroundColor: "#006e74", marginTop: 8, borderRadius: 10 }}>
                                    <Sidenav.Body>
                                        <Nav activeKey={activeKey} onSelect={setActiveKey} >
                                            <Nav style={{ fontWeight: 600, color: 'white', textAlign: 'center', fontSize: 19 }}>
                                                PERFORMANCE AT TAT
                                            </Nav>
                                            <Nav.Item
                                                eventKey="1"
                                                placement="rightStart"
                                                icon={<FileUploadIcon />}
                                                onClick={() => navigate('/tools/performance_at_pending_aging/FileManager')}
                                            >
                                                Upload Performance AT Pending Aging
                                            </Nav.Item>



                                            {/* <Nav.Menu eventKey="3" style={{ fontWeight: 400, color: 'white' }} placement="leftStart" className="menu-title-custom" title="Master Dashboard" icon={<ArrowRightIcon />}  ></Nav.Menu> */}
                                            <Nav.Item
                                                eventKey="2"
                                                placement="rightStart"
                                                icon={<DashboardIcon />}
                                                onClick={() => navigate('/tools/performance_at_pending_aging')}
                                            >
                                                Performance Aging
                                            </Nav.Item>
                                        </Nav>
                                    </Sidenav.Body>
                                </Sidenav>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={10}>


                        <Suspense fallback={<Loader />}>
                            <Routes>
                                <Route path="/" element={<PerformancePendingTool />} />
                                <Route path="/FileManager" element={<FileManager />} />

                            </Routes>
                        </Suspense>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}

export default PerformancePending