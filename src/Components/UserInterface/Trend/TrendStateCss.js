 import { makeStyles } from "@mui/styles";

 export const useStyles = makeStyles({

    mainContainer:{
        display:'grid',
        placeItems:'center',
        marginTop:'125px',
        justifyContent:'center',
        
    },
    box:{
        height:'20vw',
        width:'40vw',
        padding:10,
        borderRadius:'20px',
        background:'#D0ECE7',
        // boxShadow:'10px 10px 31px -8.8px black',
    },
    box2:{
        height:'auto',
        width:'auto',
        padding:10,
        borderRadius:'20px',
        background:'#fff',
        boxShadow: '8px 10px 30px -12.8px black',
    },
   

    center:{
        display:'flex',
        justifyContent:'center',
        marginTop:"75px",
        fontFamily:"Poppins",
        fontSize:"35px",
        fontWeight:"bold"
        
    },
    des:{
        display:'grid',
        placeItems:'center',
        color:'white',
        textShadow: '2px 2px 4px white',
        transition: "all 0.5s ease-out 100ms",
        
        "&:hover": {
            
// background: "linear-gradient(6deg, rgba(255,255,255,1) 0%, rgba(215,234,212,1) 29%, rgba(106,162,209,1) 100%)",
            transform: "scale(1.1)",
            // boxShadow: "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
            borderRadius:'10px',
            filter:'drop-shadow(2px 2px 4px #000000)',
            cursor:"pointer",

          }
    },
    lettal:{
        fontFamily:'Poppins',
        fontSize:'22px',
        fontWeight:'bold',
        display:"flex",
       color:'#223354',
     
    }

});