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


const FieldResourceTrackingTool = lazy(() => import('./FieldResourceTrackingTool'))
const UploadFile = lazy(()=> import('./Upload File/Upload_file'))
const Dashboard = lazy(()=> import('./Dasboard/Dashboard'))


const FieldResourceTracking = () => {
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
                                            <Nav style={{ fontWeight: 600, color: 'white', textAlign: 'center', fontSize: 20 }}>Field Resource Tracking</Nav>
                                            <Divider component="li" sx={{ backgroundColor: 'white' }} />
                                            
                                                {/* <Nav.Menu eventKey="1" style={{ fontWeight: 400, color: 'white' }} placement="leftStart" className="menu-title-custom" title="Admin Panel" icon={<ArrowRightIcon />}  >
                                                   
                                                </Nav.Menu> */}
                                            
                                            <Nav.Item eventKey="1" placement="rightStart" className="single-item-custom" icon={<FileUploadIcon style={{}} />} onClick={() => { navigate('/tools/field_resource_tracking/UploadFile'); show(); setMenuButton(true) }}>
                                                 Upload File
                                            </Nav.Item>
                                            <Nav.Item eventKey="2" placement="rightStart" className="single-item-custom" icon={<DashboardIcon style={{}} />} onClick={() => { navigate('/tools/field_resource_tracking/Dashboard'); show(); setMenuButton(true) }}>
                                                 Dashboard
                                            </Nav.Item>

                                        </Nav>
                                    </Sidenav.Body>
                                </Sidenav>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={10}>


                        <Suspense fallback={<Loader/>}>
                            <Routes>
                                  <Route element={<FieldResourceTrackingTool />} path="/" />
                                  <Route element ={<UploadFile/>} path='/UploadFile'/>
                                  <Route element ={<Dashboard/>} path='/Dashboard'/>
                    
                                {/* <Route path="/TaskTemplate" element={<TaskTemplate/>} />  */}

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

export default FieldResourceTracking