import React from 'react'
import { useEffect } from 'react'
import Tilt from 'react-parallax-tilt';
import Grow from '@mui/material/Grow';
import { Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate } from 'react-router-dom';

const Integration_Tool = () => {
  const navigate = useNavigate()
  useEffect(() => {
    document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`
  }, [])
  return (
    <>
      <Grow
        in='true'
        style={{ transformOrigin: '0 0 0' }}
        timeout={1500}
      >
        <div>
          <div style={{ margin: 10, marginLeft: 10 }}>
            <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
              <Link underline="hover" href='/tools'>Tools</Link>
              <Link underline="hover" onClick={() => { navigate('/tools/ix_tools') }}>IX Tools</Link>
              <Typography color='text.primary'>VI Tracker Tool</Typography>
            </Breadcrumbs>
          </div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "20px" }}>

            <Tilt tiltReverse transitionSpeed={1000}>  <div style={{
              textAlign: 'center',
              width: "500px", height: "400px", padding: "40px", backgroundColor: "#0093E9",
              backgroundImage: "linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)", borderRadius: "10px", boxShadow: "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset"
            }}>
              <div style={{ fontFamily: "sans-serif", fontSize: "60px", fontWeight: 500, marginTop: "100px" }}><span style={{ color: "yellow" }}>VI Tracker </span> TOOL</div>
            </div></Tilt>
          </div>
        </div>
      </Grow>
    </>
  )
}

export default Integration_Tool