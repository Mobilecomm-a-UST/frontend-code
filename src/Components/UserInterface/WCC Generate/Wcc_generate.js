// import React, { useEffect, Suspense, lazy } from 'react'
// import { useState } from 'react'
// import { Box, Button } from '@mui/material'
// import { Grid } from '@mui/material'
// import { Sidenav, Nav } from 'rsuite';
// import { useNavigate } from 'react-router-dom'
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import ArrowRightIcon from '@rsuite/icons/ArrowRight';
// import Divider from '@mui/material/Divider';
// import ImportIcon from '@rsuite/icons/Import';
// import CreditCardPlusIcon from '@rsuite/icons/CreditCardPlus';
// import DashboardIcon from '@rsuite/icons/Dashboard';
// import { getDecreyptedData } from '../../../Components/utils/localstorage';
// import ListIcon from '@rsuite/icons/List';
// import './../../../App.css'
// import FolderIcon from '@rsuite/icons/Folder';
// import { Admin } from '@rsuite/icons';
// import { use } from 'react';
// import Loader from '../../Skeleton/Loader';
// import FileUploadIcon from '@rsuite/icons/FileUpload';



// const Wcc_generatetool = lazy(()=>import('./Wcc_generatetool'))
// const Filemanager = lazy(()=>import('./File Manager/Filemanager'))

// const Wcc_generate = () => {
//     const [expanded, setExpanded] = useState(true);
//         const [activeKey, setActiveKey] = useState();
//         const [states, setStates] = useState(60)
//         const [checked, setChecked] = useState(true)
//         const navigate = useNavigate()
//         const [menuButton, setMenuButton] = useState(false)
//         const userTypes = (getDecreyptedData('user_type')?.split(","))
//         //  const classes = useStyles();
//         const show = () => {
//             setChecked(!checked)
//             if (checked === true) {
//                 setMenuButton(false)
//             }
//         }
    
    
//         useEffect(() => {
//             document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`
    
//         }, [])
//   return (
//      <>

//             <Box style={{ marginTop: states, transition: 'all 1s ease' }} >

//                 <Grid container spacing={2}>
//                     <Grid item xs={0} md={2} sx={{}}>
                        
//                         {/* THIS VIEW FOR PC  */}
//                         <Box sx={{ display: { xs: 'none', md: 'inherit' } }} >
//                             <Box sx={{ position: 'fixed', width: '16.5%' }} >
//                                 <Sidenav expanded={expanded} defaultOpenKeys={[]} appearance="subtle" style={{ minHeight: "670px", height: "100vh", backgroundColor: "#006e74", marginTop: 8, borderRadius: 10 }}>
//                                     <Sidenav.Body>
//                                         <Nav activeKey={activeKey} onSelect={setActiveKey} >
//                                             <Nav style={{ fontWeight: 600, color: 'white', textAlign: 'center', fontSize: 20 }}>WCC Generate</Nav>
//                                             <Divider component="li" sx={{ backgroundColor: 'white' }} />
                                            
//                                                <Nav.Item eventKey="1" placement="rightStart" icon={<FolderIcon style={{}} />} onClick={() => { navigate('/tools/wcc_generate/Filemanager'); show(); setMenuButton(true) }}>
//                                                 File Manager
//                                             </Nav.Item>

//                                         </Nav>
//                                     </Sidenav.Body>
//                                 </Sidenav>
//                             </Box>
//                         </Box>
//                     </Grid>
//                     <Grid item xs={12} md={10}>


//                         <Suspense fallback={<Loader/>}>
//                             <Routes>
//                                   <Route element={<Wcc_generatetool />} path="/" />
//                                   <Route element={<Filemanager/>} path='Filemanager'/>

//                                   {/* <Route element ={<UploadFile/>} path='/UploadFile'/>
//                                   <Route element ={<Dashboard/>} path='/Dashboard'/> */}
                    
//                                 {/* <Route path="/TaskTemplate" element={<TaskTemplate/>} />  */}

//                               {/* {userTypes?.includes('ran_admin') && 
//                                 <Route element={<FinalMailPage />} path="/email_dashboard" />
//                                 }
                                
//                                 {userTypes?.includes('ran_admin') &&
//                                 <Route element={<Module />} path="/module" />
//                                 }  */}

//                             </Routes>
//                         </Suspense>
//                     </Grid>
//                 </Grid>
//             </Box>
//         </>
//     )
// }

// export default Wcc_generate

// import React, { useEffect, Suspense, lazy } from 'react'
// import { useState } from 'react'
// import { Box, Button } from '@mui/material'
// import { Grid } from '@mui/material'
// import { Sidenav, Nav } from 'rsuite';
// import { useNavigate } from 'react-router-dom'
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import ArrowRightIcon from '@rsuite/icons/ArrowRight';
// import Divider from '@mui/material/Divider';
// import ImportIcon from '@rsuite/icons/Import';
// import CreditCardPlusIcon from '@rsuite/icons/CreditCardPlus';
// import DashboardIcon from '@rsuite/icons/Dashboard';
// import { getDecreyptedData } from '../../../Components/utils/localstorage';
// import ListIcon from '@rsuite/icons/List';
// import './../../../App.css'
// import FolderIcon from '@rsuite/icons/Folder';
// import { Admin } from '@rsuite/icons';
// import { use } from 'react';
// import Loader from '../../Skeleton/Loader';
// import FileUploadIcon from '@rsuite/icons/FileUpload';



// const Wcc_generatetool = lazy(()=>import('./Wcc_generatetool'))
// const Filemanager = lazy(()=>import('./File Manager/Filemanager'))

// // Sidebar gradient — a soft top-to-bottom teal fade instead of the old
// // flat #006e74 fill, so it reads a little richer/more modern while
// // staying in the same color family as before.
// const SIDENAV_GRADIENT = 'linear-gradient(180deg, #0e8c7f 0%, #006e74 55%, #004d47 100%)';

// const Wcc_generate = () => {
//     const [expanded, setExpanded] = useState(true);
//         const [activeKey, setActiveKey] = useState();
//         const [states, setStates] = useState(60)
//         const [checked, setChecked] = useState(true)
//         const navigate = useNavigate()
//         const [menuButton, setMenuButton] = useState(false)
//         const userTypes = (getDecreyptedData('user_type')?.split(","))
//         //  const classes = useStyles();
//         const show = () => {
//             setChecked(!checked)
//             if (checked === true) {
//                 setMenuButton(false)
//             }
//         }
    
    
//         useEffect(() => {
//             document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`
    
//         }, [])
//   return (
//      <>

//             <Box style={{ marginTop: states, transition: 'all 1s ease' }} >

//                 <Grid container spacing={2}>
//                     <Grid item xs={0} md={2} sx={{}}>
                        
//                         {/* THIS VIEW FOR PC  */}
//                         <Box sx={{ display: { xs: 'none', md: 'inherit' } }} >
//                             <Box sx={{ position: 'fixed', width: '16.5%' }} >
//                                 <Sidenav
//                                     expanded={expanded}
//                                     defaultOpenKeys={[]}
//                                     appearance="subtle"
//                                     style={{
//                                         minHeight: "670px",
//                                         height: "100vh",
//                                         background: SIDENAV_GRADIENT,
//                                         marginTop: 8,
//                                         borderRadius: 10,
//                                         boxShadow: '0 6px 18px rgba(0, 60, 55, 0.25)',
//                                     }}
//                                 >
//                                     <Sidenav.Body>
//                                         <Nav activeKey={activeKey} onSelect={setActiveKey} >
//                                             <Nav style={{ fontWeight: 600, color: 'white', textAlign: 'center', fontSize: 20 }}>WCC Generate</Nav>
//                                             <Divider component="li" sx={{ backgroundColor: 'rgba(255,255,255,0.25)' }} />
                                            
//                                                <Nav.Item eventKey="1" placement="rightStart" icon={<FolderIcon style={{}} />} onClick={() => { navigate('/tools/wcc_generate/Filemanager'); show(); setMenuButton(true) }}>
//                                                 File Manager
//                                             </Nav.Item>

//                                         </Nav>
//                                     </Sidenav.Body>
//                                 </Sidenav>
//                             </Box>
//                         </Box>
//                     </Grid>
//                     <Grid item xs={12} md={10}>


//                         <Suspense fallback={<Loader/>}>
//                             <Routes>
//                                   <Route element={<Wcc_generatetool />} path="/" />
//                                   <Route element={<Filemanager/>} path='Filemanager'/>

//                                   {/* <Route element ={<UploadFile/>} path='/UploadFile'/>
//                                   <Route element ={<Dashboard/>} path='/Dashboard'/> */}
                    
//                                 {/* <Route path="/TaskTemplate" element={<TaskTemplate/>} />  */}

//                               {/* {userTypes?.includes('ran_admin') && 
//                                 <Route element={<FinalMailPage />} path="/email_dashboard" />
//                                 }
                                
//                                 {userTypes?.includes('ran_admin') &&
//                                 <Route element={<Module />} path="/module" />
//                                 }  */}

//                             </Routes>
//                         </Suspense>
//                     </Grid>
//                 </Grid>
//             </Box>
//         </>
//     )
// }

// export default Wcc_generate

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
import FolderVerifyIcon from '@rsuite/icons/FolderVerify';



const Wcc_generatetool = lazy(()=>import('./Wcc_generatetool'))
const Filemanager = lazy(()=>import('./File Manager/Filemanager'))

// Sidebar gradient — a soft top-to-bottom teal fade instead of the old
// flat #006e74 fill, so it reads a little richer/more modern while
// staying in the same color family as before.
const SIDENAV_GRADIENT = 'linear-gradient(180deg, #0e8c7f 0%, #006e74 55%, #004d47 100%)';

const Wcc_generate = () => {
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
                                <Sidenav
                                    expanded={expanded}
                                    defaultOpenKeys={[]}
                                    appearance="subtle"
                                    style={{
                                        minHeight: "670px",
                                        height: "100vh",
                                        background: SIDENAV_GRADIENT,
                                        marginTop: 8,
                                        borderRadius: 10,
                                        boxShadow: '0 6px 18px rgba(0, 60, 55, 0.25)',
                                    }}
                                >
                                    <Sidenav.Body>
                                        <Nav activeKey={activeKey} onSelect={setActiveKey} >
                                            <Nav style={{ fontWeight: 600, color: 'white', textAlign: 'center', fontSize: 20 }}>WCC Generate</Nav>
                                            <Divider component="li" sx={{ backgroundColor: 'rgba(255,255,255,0.25)' }} />
                                            
                                               <Nav.Item
                                                    eventKey="1"
                                                    placement="rightStart"
                                                    icon={<FolderVerifyIcon style={{ color: '#ffffff' }} />}
                                                    onClick={() => { navigate('/tools/wcc_generate/Filemanager'); show(); setMenuButton(true) }}
                                                    style={{ color: '#ffffff', fontWeight: 500 }}
                                                    className="wcc-sidenav-item"
                                                >
                                                File Manager
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
                                  <Route element={<Wcc_generatetool />} path="/" />
                                  <Route element={<Filemanager/>} path='Filemanager'/>

                                  {/* <Route element ={<UploadFile/>} path='/UploadFile'/>
                                  <Route element ={<Dashboard/>} path='/Dashboard'/> */}
                    
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

export default Wcc_generate