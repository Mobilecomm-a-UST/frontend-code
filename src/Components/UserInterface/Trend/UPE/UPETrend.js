import { useState ,useEffect} from 'react'
import { Grid } from '@mui/material'
import { Sidenav, Nav } from 'rsuite';
import FileUploadIcon from '@rsuite/icons/FileUpload';
import { useNavigate } from 'react-router-dom'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TrendBox from '../TrendBox';
import Degrow from './MakeTrend/Degrow';


const UPETrend = () => {
    const [expanded, setExpanded] = useState(true);
    const [activeKey, setActiveKey] = useState('1');
    const [states, setStates] = useState([])

    const navigate = useNavigate()

useEffect(()=>{
    document.title=`${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/',' | ').toUpperCase()}`
},[])
  return (
    <div >

    <Grid container spacing={1}>
        <Grid item xs={2}>
            <div style={{}}>
                <Sidenav expanded={expanded} defaultOpenKeys={[]} appearance="subtle">
                    <Sidenav.Body>
                        <Nav activeKey={activeKey} onSelect={setActiveKey} style={{ width:'',minHeight:"670px",height:"100hv",backgroundColor:"#223354",marginTop:8,borderRadius:10,position:'fixed' }}>
                            <Nav style={{ fontWeight: 600, color: 'white', textAlign: 'center', fontSize: 20 }}>UPE Trend</Nav>
                            <Nav.Menu placement="rightStart" eventKey="1" title="Make Trend" icon={<FileUploadIcon />}>
                                {/* <Nav.Item eventKey="1-1"
                                 onClick={()=>navigate('/trends/mp/2G')}
                                >2G
                                </Nav.Item> */}
                                <Nav.Item eventKey="1-2"
                                 onClick={()=>navigate('/trends/upe/degrow')}
                                >Degrow
                                </Nav.Item>

                            </Nav.Menu>
                        </Nav>
                    </Sidenav.Body>

                </Sidenav>
            </div>
        </Grid>
        <Grid item xs={10}>
            <div >
                <Routes>
                    <Route element={<TrendBox data={'UPE'}/>} path="/" />
                    <Route element={<Degrow />} path="/degrow" />
                </Routes>

            </div>

        </Grid>
    </Grid>
</div>
  )
}

export default UPETrend