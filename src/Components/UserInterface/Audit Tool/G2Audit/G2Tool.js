import React from 'react'
import Tilt from 'react-parallax-tilt';
import { Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate } from 'react-router-dom'
import Slide from '@mui/material/Slide';

const G2Tool = () => {
    const navigate = useNavigate()
  return (
    <>
            <Slide
                direction='left'
                in='true'
                // style={{ transformOrigin: '0 0 0' }}
                timeout={1000}
            >
                <div>
                    <div style={{ margin: 10, marginLeft: 10 }}>
                        <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                            <Link underline="hover" onClick={() => { navigate('/tools') }}>Tools</Link>
                            <Link underline="hover" onClick={() => { navigate('/tools/audit') }}>Audit Tools</Link>
                            <Typography color='text.primary'>2G Audit</Typography>
                        </Breadcrumbs>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "20px" }}>

                        <Tilt tiltReverse transitionSpeed={1000}>  <div style={{
                            textAlign: 'center',
                            width: "500px", height: "400px", padding: "40px", backgroundColor: "#0093E9",
                            backgroundImage: "linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)", borderRadius: "10px", boxShadow: "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset"
                        }}>
                            <div style={{ fontFamily: "sans-serif", fontSize: "60px", fontWeight: 500, marginTop: "100px" }}>Audit For<span style={{ color: "yellow" }}> 2G Audit</span></div>
                        </div></Tilt>
                    </div>
                </div>
            </Slide>
        </>
  )
}

export default G2Tool