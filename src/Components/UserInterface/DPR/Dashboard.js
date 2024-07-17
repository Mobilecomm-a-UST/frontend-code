import React from "react";
import Box from "@mui/material/Box";
import Zoom from "@mui/material/Zoom";
import { Grid } from "@mui/material";
import { getData } from "../../services/FetchNodeServices";
import { useState } from "react";
import { useEffect } from "react";


export default function Dashboard() {
  const [dash, setDash] = useState([])

  const featchAllDash = async () => {
    const response = await getData('trend/dashboard/')
    setDash(response)
    console.log(response)
  }
  useEffect(function () {
    featchAllDash();
  }, []);


  return (
    <>

      <div style={{ padding: "20px" }}>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Box
            sx={{
              padding: "7px 0px",
              fontFamily: "sans-serif",
              fontSize: "25px",
              fontWeight: 500,
              backgroundColor: "#223354",
              borderRadius: 10,
              width: "90%",
              textAlign: "center",
              color: "#ffffff"
            }}
          >
            DASHBOARD
          </Box></Box>
        <Zoom in='true' timeout={800}>
          <Grid
            container
            spacing={2}
            direction={{ xs: "column", sm: "column", md: "row" }}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "5px",
            }}
          >
            <Grid item xs={4}>
              <Box
                sx={{
                  width: "300px",
                  height: "200px",
                  border: "0px solid ",
                  // backgroundColor: "rgb(214,219,225,0.5)",
                  marginLeft: "auto",
                  marginRight: "auto",
                  borderRadius: "10px",
                  boxShadow: "-5px 5px 10px -5px black",
                  background: "linear-gradient(to right, #00b4db, #0083b0)",
                  backgroundImage: "linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <h4>
                    <span style={{ color: "#ffffff" }}>Total Soft AT done</span>
                  </h4>
                  <Box
                    sx={{
                      width: "80px",
                      height: "35px",
                      borderRadius: "8px",
                      backgroundColor: "white",
                      color: "#4a3d5d",
                      textAlign: "center",
                      // border: "1px solid black",
                      // boxShadow: "1px 1px 5px 1px black",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "fantasy",
                        fontSize: "25px",
                        fontWeight: "bolder",
                      }}
                    >
                      {dash.total_soft_at_done}
                    </span>
                  </Box>
                  <Box
                    sx={{
                      color: "#ffffff",
                      fontFamily: "Poppins",
                      fontSize: "16px",
                      padding: "2px 0px",
                      marginTop: "4px",
                    }}
                  >
                    Percentage: {dash.percent_soft_at_done}%
                  </Box>
                  <Box
                    sx={{
                      color: "#ffffff",
                      fontFamily: "Poppins",
                      fontSize: "16px",
                      padding: "2px 0px",
                    }}
                  >
                    Total Msl Site: {dash.total_no_site}
                  </Box>
                  <Box
                    sx={{
                      color: "#ffffff",
                      fontFamily: "Poppins",
                      fontSize: "16px",
                      padding: "2px 0px",
                    }}
                  >
                    Total Ms2 Site: {dash.Ms2_site}
                  </Box>
                  <Box
                    sx={{
                      color: "#ffffff",
                      fontFamily: "Poppins",
                      fontSize: "16px",
                      padding: "2px 0px",
                      fontWeight: "bold"
                    }}
                  >
                    Ms2 Percentage: {dash.percent_ms2_site >= 90 && dash.percent_ms2_site <= 100 ? <span style={{ color: "green" }}>{dash.percent_ms2_site}%</span> : dash.percent_ms2_site >= 80 && dash.percent_ms2_site < 90 ? <span style={{ color: "yellow" }}>{dash.percent_ms2_site}%</span> : <span style={{ color: "red" }}>{dash.percent_ms2_site}%</span>}
                  </Box>
                </div>
              </Box>
            </Grid>

            <Grid item xs={4}>
              <Box
                sx={{
                  width: "300px",
                  height: "200px",
                  border: "0px solid ",
                  // backgroundColor: "rgb(214,219,225,0.5)",
                  marginLeft: "auto",
                  marginRight: "auto",
                  borderRadius: "10px",
                  boxShadow: "-5px 5px 10px -5px black",
                  background: "linear-gradient(to right, #00b4db, #0083b0)",
                  backgroundImage: "linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)"
                }}
              >
                <div style={{
                  display: "flex", justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}>
                  <h4>
                    <span style={{ color: "#ffffff" }}>
                      Total Physical AT done
                    </span>
                  </h4>
                  <Box
                    sx={{
                      width: "80px",
                      height: "35px",
                      borderRadius: "8px",
                      backgroundColor: "white",
                      color: "#4a3d5d",
                      textAlign: "center",
                      // border: "1px solid black",
                      // boxShadow: "1px 1px 5px 1px black",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "fantasy",
                        fontSize: "25px",
                        fontWeight: "bolder",
                      }}
                    >
                      {dash.total_physical_at_done}
                    </span>
                  </Box>
                  <Box
                    sx={{
                      color: "#ffffff",
                      fontFamily: "Poppins",
                      fontSize: "16px",
                      padding: "2px 0px",
                      marginTop: "4px",
                    }}
                  >
                    Percentage: {dash.percent_physical_at_done}%
                  </Box>
                  <Box
                    sx={{
                      color: "#ffffff",
                      fontFamily: "Poppins",
                      fontSize: "16px",
                      padding: "2px 0px",
                    }}
                  >
                    Total Msl Site: {dash.total_no_site}
                  </Box>
                  <Box
                    sx={{
                      color: "#ffffff",
                      fontFamily: "Poppins",
                      fontSize: "16px",
                      padding: "2px 0px",
                    }}
                  >
                    Total Ms2 Site: {dash.Ms2_site}
                  </Box>
                  <Box
                    sx={{
                      color: "#ffffff",
                      fontFamily: "Poppins",
                      fontSize: "16px",
                      padding: "2px 0px",
                      fontWeight: "bold"
                    }}
                  >
                    Ms2 Percentage: {dash.percent_ms2_site >= 90 && dash.percent_ms2_site <= 100 ? <span style={{ color: "green" }}>{dash.percent_ms2_site}%</span> : dash.percent_ms2_site >= 80 && dash.percent_ms2_site < 90 ? <span style={{ color: "yellow" }}>{dash.percent_ms2_site}%</span> : <span style={{ color: "red" }}>{dash.percent_ms2_site}%</span>}
                  </Box>
                </div>
              </Box>
            </Grid>

            <Grid item xs={4}>
              <Box
                sx={{
                  width: "300px",
                  height: "200px",
                  border: "0px solid ",
                  // backgroundColor: "rgb(214,219,225,0.5)",
                  marginLeft: "auto",
                  marginRight: "auto",
                  borderRadius: "10px",
                  boxShadow: "-5px 5px 10px -5px black",
                  background: "linear-gradient(to right, #00b4db, #0083b0)",
                  backgroundImage: "linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)"
                }}
              >
                <div style={{
                  display: "flex", justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}>
                  <h4>
                    <span style={{ color: "#ffffff " }}>
                      Total Performance AT done
                    </span>
                  </h4>
                  <Box
                    sx={{
                      width: "80px",
                      height: "35px",
                      borderRadius: "8px",
                      backgroundColor: "white",
                      color: "#4a3d5d",
                      textAlign: "center",
                      // border: "1px solid black",
                      // boxShadow: "1px 1px 5px 1px black",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "fantasy",
                        fontSize: "25px",
                        fontWeight: "bolder",
                      }}
                    >
                      {dash.total_performance_at_done}
                    </span>
                  </Box>
                  <Box
                    sx={{
                      color: "#ffffff",
                      fontFamily: "Poppins",
                      fontSize: "16px",
                      padding: "2px 0px",
                      marginTop: "4px",
                    }}
                  >
                    Percentage: {dash.percent_performance_at_done}%
                  </Box>
                  <Box
                    sx={{
                      color: "#ffffff",
                      fontFamily: "Poppins",
                      fontSize: "16px",
                      padding: "2px 0px",
                    }}
                  >
                    Total Msl Site: {dash.total_no_site}
                  </Box>
                  <Box
                    sx={{
                      color: "#ffffff",
                      fontFamily: "Poppins",
                      fontSize: "16px",
                      padding: "2px 0px",
                    }}
                  >
                    Total Ms2 Site: {dash.Ms2_site}
                  </Box>
                  <Box
                    sx={{
                      color: "#ffffff",
                      fontFamily: "Poppins",
                      fontSize: "16px",
                      padding: "2px 0px",
                      fontWeight: "bold"
                    }}
                  >
                    Ms2 Percentage: {dash.percent_ms2_site >= 90 && dash.percent_ms2_site <= 100 ? <span style={{ color: "green" }}>{dash.percent_ms2_site}%</span> : dash.percent_ms2_site >= 80 && dash.percent_ms2_site < 90 ? <span style={{ color: "yellow" }}>{dash.percent_ms2_site}%</span> : <span style={{ color: "red" }}>{dash.percent_ms2_site}%</span>}
                  </Box>
                </div>
              </Box>
            </Grid>
          </Grid>
        </Zoom>

        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 3 }}>
          <Box
            sx={{
              padding: "7px 0px",
              fontFamily: "sans-serif",
              fontSize: "25px",
              fontWeight: 500,
              backgroundColor: "#223354",
              borderRadius: 10,
              width: "90%",
              textAlign: "center",
              color: "#ffffff"
            }}
          >
            ONLY STATUS
          </Box></Box>

        <Zoom in='true' timeout={800}>
          <Grid
            container
            spacing={2}
            direction={{ xs: "column", sm: "column", md: "row" }}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "5px",
            }}
          >
            <Grid item xs={4}>
              <Box
                sx={{
                  width: "300px",
                  height: "150px",
                  border: "0px solid ",
                  // backgroundColor: "rgb(214,219,225,0.5)",
                  marginLeft: "auto",
                  marginRight: "auto",
                  borderRadius: "10px",
                  boxShadow: "-5px 5px 10px -5px black",
                  background: "linear-gradient(to right, #00b4db, #0083b0)",
                  backgroundImage: "linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <h4>
                    <span style={{ color: "#ffffff " }}>Only Soft AT done</span>
                  </h4>
                  <Box
                    sx={{
                      marginTop: "20px",
                      width: "40px",
                      height: "40px",
                      borderRadius: "15px",
                      backgroundColor: "white",
                      color: "black",
                      textAlign: "center",
                      border: "1px solid black",
                      boxShadow: "1px 1px 5px 1px black",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "fantasy",
                        fontSize: "25px",
                        fontWeight: "bolder",
                      }}
                    >
                      {dash.only_soft_at_done}
                    </span>
                  </Box>
                  <Box
                    sx={{
                      color: "#DC7633",
                      fontFamily: "Poppins",
                      fontSize: "16px",
                      padding: "2px 0px",
                      marginTop: "4px",
                    }}
                  >
                    {/* Percentage: 0% */}
                  </Box>
                  <Box
                    sx={{
                      color: "#ffffff",
                      fontFamily: "Poppins",
                      fontSize: "16px",
                      padding: "2px 0px",
                    }}
                  >

                  </Box>
                  <Box
                    sx={{
                      color: "#ffffff",
                      fontFamily: "Poppins",
                      fontSize: "16px",
                      padding: "2px 0px",
                    }}
                  >

                  </Box>
                </div>
              </Box>
            </Grid>

            <Grid item xs={4}>
              <Box
                sx={{
                  width: "300px",
                  height: "150px",
                  border: "0px solid ",
                  // backgroundColor: "rgb(214,219,225,0.5)",
                  marginLeft: "auto",
                  marginRight: "auto",
                  borderRadius: "10px",
                  boxShadow: "-5px 5px 10px -5px black",
                  background: "linear-gradient(to right, #00b4db, #0083b0)",
                  backgroundImage: "linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)"
                }}
              >
                <div style={{
                  display: "flex", justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}>
                  <h4>
                    <span style={{ color: "#ffffff " }}>
                      Only Physical AT done
                    </span>
                  </h4>
                  <Box
                    sx={{
                      marginTop: "20px",
                      width: "40px",
                      height: "40px",
                      borderRadius: "15px",
                      backgroundColor: "white",
                      color: "black",
                      textAlign: "center",
                      border: "1px solid black",
                      boxShadow: "1px 1px 5px 1px black",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "fantasy",
                        fontSize: "25px",
                        fontWeight: "bolder",
                      }}
                    >
                      {dash.only_physical_at_done}
                    </span>
                  </Box>
                  <Box
                    sx={{
                      color: "#DC7633",
                      fontFamily: "Poppins",
                      fontSize: "16px",
                      padding: "2px 0px",
                      marginTop: "4px",
                    }}
                  >
                    {/* Percentage: 0.1% */}
                  </Box>
                  <Box
                    sx={{
                      color: "#ffffff",
                      fontFamily: "Poppins",
                      fontSize: "16px",
                      padding: "2px 0px",
                    }}
                  >

                  </Box>
                  <Box
                    sx={{
                      color: "#ffffff",
                      fontFamily: "Poppins",
                      fontSize: "16px",
                      padding: "2px 0px",
                    }}
                  >

                  </Box>
                </div>
              </Box>
            </Grid>

            <Grid item xs={4}>
              <Box
                sx={{
                  width: "300px",
                  height: "150px",
                  border: "0px solid ",
                  // backgroundColor: "rgb(214,219,225,0.5)",
                  marginLeft: "auto",
                  marginRight: "auto",
                  borderRadius: "10px",
                  boxShadow: "-5px 5px 10px -5px black",
                  background: "linear-gradient(to right, #00b4db, #0083b0)",
                  backgroundImage: "linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)"
                }}
              >
                <div style={{
                  display: "flex", justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}>
                  <h4>
                    <span style={{ color: "#ffffff " }}>
                      Only Performance AT done
                    </span>
                  </h4>
                  <Box
                    sx={{
                      marginTop: "20px",
                      width: "40px",
                      height: "40px",
                      borderRadius: "15px",
                      backgroundColor: "white",
                      color: "black",
                      textAlign: "center",
                      border: "1px solid black",
                      boxShadow: "1px 1px 5px 1px black",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "fantasy",
                        fontSize: "25px",
                        fontWeight: "bolder",
                      }}
                    >
                      {dash.only_performance_at_done}
                    </span>
                  </Box>
                  <Box
                    sx={{
                      color: "#ffffff",
                      fontFamily: "Poppins",
                      fontSize: "16px",
                      padding: "2px 0px",
                      marginTop: "4px",
                    }}
                  >

                  </Box>
                  <Box
                    sx={{
                      color: "#ffffff",
                      fontFamily: "Poppins",
                      fontSize: "16px",
                      padding: "2px 0px",
                    }}
                  >

                  </Box>
                  <Box
                    sx={{
                      color: "#ffffff",
                      fontFamily: "Poppins",
                      fontSize: "16px",
                      padding: "2px 0px",
                    }}
                  >

                  </Box>
                </div>
              </Box>
            </Grid>
          </Grid>
        </Zoom>
      </div>
    </>
  );
}
