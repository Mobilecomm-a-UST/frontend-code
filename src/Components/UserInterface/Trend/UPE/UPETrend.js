import { useState, useEffect, Suspense ,lazy} from 'react'
import { Grid } from '@mui/material'
import { Sidenav, Nav } from 'rsuite';
import { Box } from '@mui/material'
import FileUploadIcon from '@rsuite/icons/FileUpload';
import { useNavigate } from 'react-router-dom'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
const TrendBox = lazy(() => import('../TrendBox'))
const Degrow = lazy(() => import('./MakeTrend/Degrow'))
// import TrendBox from '../TrendBox';
// import Degrow from './MakeTrend/Degrow';
// import TrendBox from '../TrendBox';
// import Degrow from './MakeTrend/Degrow';


const UPETrend = () => {
    const [expanded, setExpanded] = useState(true);
    const [activeKey, setActiveKey] = useState('1');
    const [states, setStates] = useState([])

    const navigate = useNavigate()

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
                                            <Nav style={{ fontWeight: 500, color: 'white', textAlign: 'center', fontSize: 20 }}>UPE Trend</Nav>
                                            <Nav.Menu placement="rightStart" eventKey="1" title="Make Trend" icon={<FileUploadIcon />}>
                                                {/* <Nav.Item eventKey="1-1"
                                 onClick={()=>navigate('/trends/mp/2G')}
                                >2G
                                </Nav.Item> */}
                                                <Nav.Item eventKey="1-2"
                                                    onClick={() => navigate('/trends/upe/degrow')}
                                                >Degrow
                                                </Nav.Item>
                                            </Nav.Menu>
                                        </Nav>
                                    </Sidenav.Body>
                                </Sidenav>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={10}>
                        <Suspense fallback={<div>loading............</div>}>
                            <Routes>
                                <Route element={<TrendBox data={'UPE'} />} path="/" />
                                <Route element={<Degrow />} path="/degrow" />
                            </Routes>
                        </Suspense>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}
export default UPETrend