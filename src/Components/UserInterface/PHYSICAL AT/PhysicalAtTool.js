import React from 'react'
import Tilt from 'react-parallax-tilt';
import Grow from '@mui/material/Grow';

const PhysicalAtTool = () => {
  return (
    <>
    <Grow
    in='true'
    style={{ transformOrigin: '0 0 0' }}
     timeout={1500}
  >
    <div style={{display:"flex",justifyContent:"center",alignItems:"center",marginTop:"20px"}}>
       
      <Tilt tiltReverse transitionSpeed={1000}>  <div style={{width:"auto",height:"400px",padding:"40px",backgroundColor: "#0093E9",
backgroundImage: "linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)",borderRadius:"10px",boxShadow: "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset"}}>
        <div style={{fontFamily:"sans-serif",fontSize:"60px",fontWeight:500,marginTop:"100px"}}> <span style={{color:"yellow"}}>PHYSICAL AT</span> TOOL</div>
        </div></Tilt>
    </div>
    </Grow>
    </>
  )
}

export default PhysicalAtTool