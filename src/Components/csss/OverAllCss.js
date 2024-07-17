
import { makeStyles } from "@mui/styles";
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme } from "@mui/material";

const theme = createTheme({
  breakpoints: {
    values: {
      mobile: 0,
      tablet: 640,
      laptop: 1024,
      desktop: 1200,
    },
  },
});

const OverAllCss = makeStyles(theme=>({
  main_Box:{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "20px",
    padding: "20px",
    flexDirection: "column",
    textAlign: "center",
  },
  Back_Box: {
    width:'80%',
    border: "0px solid",
    height: "50%",
    marginTop: 5,
    padding: 30,
    borderRadius: "15px",
    // backgroundColor: '#a7d5f2',
    backgroundImage: "linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)",
    boxShadow: 'rgba(50, 50, 93, 0.25) 0px 50px 10px -40px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset'

  },
  Box_Hading:{
    width: "80%",
    padding: "15px 0px",
    fontFamily: "Poppins",
    fontSize: "120%",
    fontWeight: 700,
    backgroundColor: "#223354",
    borderRadius: 50,
    color: "#ffffff",
    marginRight: "auto",
    marginLeft: "auto",
    position: "relative",
    top: "-60px",

  },


  Front_Box:{
    border: "0px solid",
    borderRadius: 10,
    padding: "10px",
    backgroundColor: 'white',
    boxShadow:' rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px'

  },
  Front_Box_Hading:{
    textAlign: "left",
    fontFamily: "Poppins",
    fontSize: "20px",
    fontWeight: 600,
  },
  Front_Box_Select_Button:{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  },
}))

export default OverAllCss