import React, { useEffect } from 'react'
import Home from './Home'
import MoveBackground from '../csss/MoveBackground'
import { Box } from "@mui/material";

export default function HomePage() {
  useEffect(()=>{
    document.title='MobileComm'
  },[])
  return (
    <div>
    <div style={{ position: "fixed", width: "100%", zIndex: 1 }}>
      <Home />
    </div>
    <div>
      <MoveBackground />
      {/* <img src="assets/5g.webp" style={{width:"100%"}}/> */}
      {/* this is for pc */}
      <Box
        sx={{
          position: "relative",
          display: { md: "flex", sm: "flex", xs: "none" },
          marginTop: { md: 40, sm: 50 },
          justifyContent: "center",
        }}
      >
        <div>
          <span
            style={{
              fontFamily: "sans-serif",
              fontSize: "70px",
              color: "white",
              fontWeight: 700,
              lineHeight: "10px",
              textShadow: "1px 1px 2px #FBFCFC",
            }}
          >
            Welcome to
            <span style={{ color: "#E96421", fontSize: "75px" }}>
              {" "}
              Mobile
            </span>
            <span style={{ color: "#999999" }}>comm</span>
          </span>
        </div>
        <div
          style={{
            color: "white",
            fontSize: 20,
            position: "absolute",
            top: 35,
            marginLeft: 700,
          }}
        >
          A UST Company
        </div>
      </Box>
      {/* //this is a screen applicable for Mobile */}
      <Box
        sx={{
          position: "relative",
          display: { md: "none", sm: "none", xs: "flex" },
          marginTop: 30,
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            placeContent: "center",
            textAlign: "center",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div
            style={{
              fontFamily: "sans-serif",
              fontSize: "60px",
              color: "white",
              fontWeight: 700,
              lineHeight: "10px",
              textShadow: "1px 1px 2px #FBFCFC",
            }}
          >
            Welcome
          </div>
          <br />
          <div
            style={{
              fontFamily: "sans-serif",
              fontSize: "60px",
              color: "white",
              fontWeight: 700,
              lineHeight: "10px",
              textShadow: "1px 1px 2px #FBFCFC",
            }}
          >
            to
          </div>
          <span style={{ color: "#E96421", fontSize: "60px" }}>
            Mobile
            <span style={{ color: "#999999", fontSize: "55px" }}>comm</span>
          </span>
          <div
            style={{
              color: "white",
              fontSize: "20px",
              textAlign: "end",
              position: 'relative',
              top: '-23px',
            }}
          >
            A UST Company
          </div>
        </div>
      </Box>
    </div>
  </div>
  )
}
