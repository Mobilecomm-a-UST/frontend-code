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
import TextImageIcon from '@rsuite/icons/TextImage';



const DailyTaskTool = lazy(() => import("./DailyTaskTool"));
const AddTask = lazy(() => import("./AdminPanel/AddTask/AddTask"));
const AssignTask = lazy(() => import("./AssignTask/AssignTask"));
const MyTask = lazy(() => import("./MyTask/MyTask"));
const AddEmail = lazy(()=> import("./AdminPanel/AddTask/AddEmail"));
const Dashboard = lazy(() => import("./Dashboard/Dashboard"));
const TaskTemplate = lazy(() => import("./TaskTemplate/TaskTemplate"));
const Tasktracker = lazy(()=> import('./Task Tracker/Tasktracker'))


const DailyTaskReview = () => {
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
                        {/* <Box sx={{ display: { xs: 'inherit', md: 'none' } }}>
                            <Collapse in={!checked}>
                                <Button onClick={() => { show() }} style={{ position: 'absolute', top: '60px', backgroundColor: '#223354' }}><SettingsIcon style={{ color: "white" }} /></Button>
                            </Collapse>
                            <Collapse in={checked} orientation="horizontal" timeout={'auto'}>
                                <Box sx={{ width: 240, minHeight: "670px", height: "100hv", backgroundColor: "#223354", borderRadius: 5, position: 'fixed', zIndex: 10 }}>
                                    <Sidenav expanded={expanded} defaultOpenKeys={[]} appearance="subtle">
                                        <Sidenav.Body>
                                            <Nav activeKey={activeKey} onSelect={setActiveKey} style={{ width: 'auto', minHeight: "670px", height: "100hv", backgroundColor: "#223354", marginTop: 8, borderRadius: 10 }}>
                                                <Nav style={{ fontWeight: 600, color: 'white', textAlign: 'center', fontSize: 20 }}>Nomenclature Scriptor</Nav>
                                                <Nav.Item eventKey="2" placement="rightStart" icon={<ChangeListIcon />} onClick={() => { navigate('/tools/nomenclature_scriptor/generate_script'); show(); setMenuButton(true) }}>
                                                    Genetate Script
                                                </Nav.Item>
                                                <Nav.Menu eventKey="3" placement="rightStart" title="NOM Audit" icon={<DocPassIcon />}>
                                                    <Nav.Item eventKey="3-1" placement="rightStart" onClick={() => { navigate('/tools/nomenclature_scriptor/nom_audit_dashboard'); show(); setMenuButton(true) }}>
                                                        Dashboard
                                                    </Nav.Item>
                                                    <Nav.Item eventKey="3-2" placement="rightStart" onClick={() => { navigate('/tools/nomenclature_scriptor/nom_audit'); show(); setMenuButton(true) }}>
                                                        Pre-Post Audit
                                                    </Nav.Item>
                                                </Nav.Menu>


                                            </Nav>
                                        </Sidenav.Body>

                                    </Sidenav>
                                </Box>
                            </Collapse>

                        </Box> */}
                        {/* THIS VIEW FOR PC  */}
                        <Box sx={{ display: { xs: 'none', md: 'inherit' } }} >
                            <Box sx={{ position: 'fixed', width: '16.5%' }} >
                                <Sidenav expanded={expanded} defaultOpenKeys={[]} appearance="subtle" style={{ minHeight: "670px", height: "100vh", backgroundColor: "#006e74", marginTop: 8, borderRadius: 10 }}>
                                    <Sidenav.Body>
                                        <Nav activeKey={activeKey} onSelect={setActiveKey} >
                                            <Nav style={{ fontWeight: 600, color: 'white', textAlign: 'center', fontSize: 20 }}>Daily Task Review</Nav>
                                            <Divider component="li" sx={{ backgroundColor: 'white' }} />
                                            {/* {userTypes?.includes('ran_admin') && */}
                                                <Nav.Menu eventKey="1" style={{ fontWeight: 400, color: 'white' }} placement="leftStart" className="menu-title-custom" title="Admin Panel" icon={<ArrowRightIcon />}  >
                                                    {/* <Nav.Item eventKey="1-1" placement="rightStart" style={{ fontWeight: 400, color: 'white' }} onClick={() => { navigate('/tools/full_site_dismantle/email_dashboard'); show(); setMenuButton(true) }}>
                                                        EmailAdd
                                                    </Nav.Item> */}
                                                    <Nav.Item eventKey="1-1" placement="rightStart" style={{ fontWeight: 400, color: 'white' }} onClick={() => { navigate('/tools/daily_task_review/AddTask'); show(); setMenuButton(true) }}>
                                                        Add Task
                                                    </Nav.Item>

                                                     <Nav.Item eventKey="1-2" placement="rightStart" style={{ fontWeight: 400, color: 'white' }} onClick={() => { navigate('/tools/daily_task_review/AddEmail'); show(); setMenuButton(true) }}>
                                                        Add Email
                                                    </Nav.Item>
                                                </Nav.Menu>
                                            {/* } */}

                                              <Nav.Item eventKey="4" placement="rightStart" className="single-item-custom" icon={< TextImageIcon style={{}} />} onClick={() => { navigate('/tools/daily_task_review/TaskTemplate'); show(); setMenuButton(true) }}>
                                                Task Templates
                                            </Nav.Item> 

                                            <Nav.Item eventKey="2" placement="rightStart" className="single-item-custom" icon={<DashboardIcon style={{}} />} onClick={() => { navigate('/tools/daily_task_review/Dashboard'); show(); setMenuButton(true) }}>
                                                Dashboard
                                            </Nav.Item>

                                            <Nav.Item eventKey="3" placement="rightStart" className="single-item-custom" icon={<ListIcon style={{}} />} onClick={() => { navigate('/tools/daily_task_review/AssignTask'); show(); setMenuButton(true) }}>
                                                Assign Task
                                            </Nav.Item>
                                            
                                            <Nav.Item eventKey="3" placement="rightStart" className="single-item-custom" icon={<ListIcon style={{}} />} onClick={() => { navigate('/tools/daily_task_review/MyTask'); show(); setMenuButton(true) }}>
                                                 My Task
                                            </Nav.Item>

                                            <Nav.Item eventKey="4" placement="rightStart" className="single-item-custom" icon={<ListIcon style={{}} />} onClick={() => { navigate('/tools/daily_task_review/Tasktracker'); show(); setMenuButton(true) }}>
                                                 Task Tracker
                                            </Nav.Item>

                                        
                                            {/* <Nav.Item eventKey="1" placement="rightStart" className="single-item-custom" icon={<FolderIcon style={{}} />} onClick={() => { navigate('/tools/full_site_dismantle/file_manager'); show(); setMenuButton(true) }}>
                                                File Manager
                                            </Nav.Item> */}

                                        </Nav>
                                    </Sidenav.Body>
                                </Sidenav>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={10}>


                        <Suspense fallback={<Loader/>}>
                            <Routes>
                                <Route path="/" element={<DailyTaskTool />} />
                                <Route path="/AddTask" element={<AddTask />} />
                                <Route path='/AddEmail' element={<AddEmail/>}/>
                                <Route path="/AssignTask" element={<AssignTask />} />
                                <Route path="/MyTask" element={<MyTask />} />
                                <Route path="/Dashboard" element={<Dashboard />} />
                                <Route path="/TaskTemplate" element={<TaskTemplate/>} />
                                <Route path='/Tasktracker' element={<Tasktracker/>}/>

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

export default DailyTaskReview


// import React, { useEffect, Suspense, lazy } from 'react'
// import { useState } from 'react'
// import { Box, Button, Typography } from '@mui/material'
// import { Grid } from '@mui/material'
// import { Sidenav, Nav } from 'rsuite';
// import { useNavigate } from 'react-router-dom'
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Divider from '@mui/material/Divider';
// import { getDecreyptedData } from '../../../Components/utils/localstorage';
// import './../../../App.css'
// import Loader from '../../Skeleton/Loader';

// // Modern high-end icons fitting each menu item precisely
// import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
// import PostAddRoundedIcon from '@mui/icons-material/PostAddRounded';
// import MarkEmailReadRoundedIcon from '@mui/icons-material/MarkEmailReadRounded';
// import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
// import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
// import AssignmentIndRoundedIcon from '@mui/icons-material/AssignmentIndRounded';
// import AssignmentTurnedInRoundedIcon from '@mui/icons-material/AssignmentTurnedInRounded';
// import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded';

// const DailyTaskTool = lazy(() => import("./DailyTaskTool"));
// const AddTask = lazy(() => import("./AdminPanel/AddTask/AddTask"));
// const AssignTask = lazy(() => import("./AssignTask/AssignTask"));
// const MyTask = lazy(() => import("./MyTask/MyTask"));
// const AddEmail = lazy(()=> import("./AdminPanel/AddTask/AddEmail"));
// const Dashboard = lazy(() => import("./Dashboard/Dashboard"));
// const TaskTemplate = lazy(() => import("./TaskTemplate/TaskTemplate"));
// const Tasktracker = lazy(()=> import('./Task Tracker/Tasktracker'))

// const DailyTaskReview = () => {
//     const [expanded, setExpanded] = useState(true);
//     const [activeKey, setActiveKey] = useState();
//     const [states, setStates] = useState(60);
//     const [checked, setChecked] = useState(true);
//     const navigate = useNavigate();
//     const [menuButton, setMenuButton] = useState(false);

//     const show = () => {
//         setChecked(!checked);
//         if (checked === true) {
//             setMenuButton(false);
//         }
//     };

//     useEffect(() => {
//         document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`;
//     }, []);

//     return (
//         <>
//             <Box style={{ marginTop: states, transition: 'all 1s ease' }}>
//                 <Grid container spacing={2}>
//                     <Grid item xs={0} md={2}>
//                         {/* 3D Modern Glassmorphic iPhone-inspired Sidebar with Perfect Alignment */}
//                         <Box sx={{ display: { xs: 'none', md: 'inherit' } }}>
//                             <Box sx={{
//                                 position: 'fixed',
//                                 width: '16.5%',
//                                 p: 1.5,
//                                 height: 'calc(100vh - 70px)',
//                                 overflowY: 'auto'
//                             }}>
//                                 <Sidenav
//                                     expanded={expanded}
//                                     defaultOpenKeys={[]}
//                                     appearance="subtle"
//                                     style={{
//                                         minHeight: "650px",
//                                         height: "100%",
//                                         background: 'linear-gradient(135deg, rgba(0, 110, 116, 0.85) 0%, rgba(10, 50, 60, 0.95) 100%)',
//                                         backdropFilter: 'blur(20px)',
//                                         WebkitBackdropFilter: 'blur(20px)',
//                                         border: '1px solid rgba(255, 255, 255, 0.18)',
//                                         boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 -1px 0 rgba(0, 0, 0, 0.4)',
//                                         borderRadius: 24,
//                                         marginTop: 4,
//                                         overflow: 'hidden'
//                                     }}
//                                 >
//                                     <Sidenav.Body>
//                                         <Nav activeKey={activeKey} onSelect={setActiveKey} style={{ padding: '8px 12px' }}>
//                                             <Box sx={{ py: 2, textAlign: 'center' }}>
//                                                 <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#ffffff', letterSpacing: '0.5px', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
//                                                     Daily Task Review
//                                                 </Typography>
//                                             </Box>
//                                             <Divider component="li" sx={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', mb: 2, mx: 1 }} />

//                                             <Nav.Menu
//                                                 eventKey="1"
//                                                 style={{ fontWeight: 500, color: 'white', margin: '6px 0', borderRadius: 12 }}
//                                                 placement="leftStart"
//                                                 className="menu-title-custom"
//                                                 title="Admin Panel"
//                                                 icon={<AdminPanelSettingsRoundedIcon sx={{ fontSize: 20, color: '#5eead4', mr: 1.5 }} />}
//                                             >
//                                                 <Nav.Item eventKey="1-1" placement="rightStart" style={{ fontWeight: 400, color: 'white' }} onClick={() => { navigate('/tools/daily_task_review/AddTask'); show(); setMenuButton(true); }}>
//                                                     <PostAddRoundedIcon sx={{ fontSize: 18, mr: 1.5, verticalAlign: 'middle', color: '#99f6e4' }} /> Add Task
//                                                 </Nav.Item>
//                                                 <Nav.Item eventKey="1-2" placement="rightStart" style={{ fontWeight: 400, color: 'white' }} onClick={() => { navigate('/tools/daily_task_review/AddEmail'); show(); setMenuButton(true); }}>
//                                                     <MarkEmailReadRoundedIcon sx={{ fontSize: 18, mr: 1.5, verticalAlign: 'middle', color: '#99f6e4' }} /> Add Email
//                                                 </Nav.Item>
//                                             </Nav.Menu>

//                                             <Nav.Item eventKey="4" placement="rightStart" className="single-item-custom" icon={<AssignmentRoundedIcon sx={{ fontSize: 20, color: '#f43f5e', mr: 1.5 }} />} onClick={() => { navigate('/tools/daily_task_review/TaskTemplate'); show(); setMenuButton(true); }}
//                                                 style={{ margin: '6px 0', borderRadius: 12, color: 'white', display: 'flex', alignItems: 'center' }}>
//                                                 Task Templates
//                                             </Nav.Item>

//                                             <Nav.Item eventKey="2" placement="rightStart" className="single-item-custom" icon={<DashboardRoundedIcon sx={{ fontSize: 20, color: '#38bdf8', mr: 1.5 }} />} onClick={() => { navigate('/tools/daily_task_review/Dashboard'); show(); setMenuButton(true); }}
//                                                 style={{ margin: '6px 0', borderRadius: 12, color: 'white', display: 'flex', alignItems: 'center' }}>
//                                                 Dashboard
//                                             </Nav.Item>

//                                             <Nav.Item eventKey="3" placement="rightStart" className="single-item-custom" icon={<AssignmentIndRoundedIcon sx={{ fontSize: 20, color: '#a855f7', mr: 1.5 }} />} onClick={() => { navigate('/tools/daily_task_review/AssignTask'); show(); setMenuButton(true); }}
//                                                 style={{ margin: '6px 0', borderRadius: 12, color: 'white', display: 'flex', alignItems: 'center' }}>
//                                                 Assign Task
//                                             </Nav.Item>

//                                             <Nav.Item eventKey="5" placement="rightStart" className="single-item-custom" icon={<AssignmentTurnedInRoundedIcon sx={{ fontSize: 20, color: '#4ade80', mr: 1.5 }} />} onClick={() => { navigate('/tools/daily_task_review/MyTask'); show(); setMenuButton(true); }}
//                                                 style={{ margin: '6px 0', borderRadius: 12, color: 'white', display: 'flex', alignItems: 'center' }}>
//                                                 My Task
//                                             </Nav.Item>

//                                             <Nav.Item eventKey="6" placement="rightStart" className="single-item-custom" icon={<TimelineRoundedIcon sx={{ fontSize: 20, color: '#facc15', mr: 1.5 }} />} onClick={() => { navigate('/tools/daily_task_review/Tasktracker'); show(); setMenuButton(true); }}
//                                                 style={{ margin: '6px 0', borderRadius: 12, color: 'white', display: 'flex', alignItems: 'center' }}>
//                                                 Task Tracker
//                                             </Nav.Item>
//                                         </Nav>
//                                     </Sidenav.Body>
//                                 </Sidenav>
//                             </Box>
//                         </Box>
//                     </Grid>
//                     <Grid item xs={12} md={10}>
//                         <Suspense fallback={<Loader />}>
//                             <Routes>
//                                 <Route path="/" element={<DailyTaskTool />} />
//                                 <Route path="/AddTask" element={<AddTask />} />
//                                 <Route path='/AddEmail' element={<AddEmail />} />
//                                 <Route path="/AssignTask" element={<AssignTask />} />
//                                 <Route path="/MyTask" element={<MyTask />} />
//                                 <Route path="/Dashboard" element={<Dashboard />} />
//                                 <Route path="/TaskTemplate" element={<TaskTemplate />} />
//                                 <Route path='/Tasktracker' element={<Tasktracker />} />
//                             </Routes>
//                         </Suspense>
//                     </Grid>
//                 </Grid>
//             </Box>
//         </>
//     );
// };

// export default DailyTaskReview;