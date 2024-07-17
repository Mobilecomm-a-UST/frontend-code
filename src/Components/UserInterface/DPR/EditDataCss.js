import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles({

   mainContainer:{
       display:'grid',
       placeItems:'center',
       marginTop:'125px',
       justifyContent:'center',
       
   },
   box:{
       height:'auto',
       width:'80%',
       padding:10,
       borderRadius:'8px',
       background:'',
       border:'1px',
       boxShadow:'10px 10px 31px -8.8px black',
       padding:"10px"
   },
   box2:{
       height:'auto',
       width:'auto',
       padding:5,
       borderRadius:'5px',
       border:"1px solid ",
       padding:"10px",
       marginTop:"10px",
    //    boxShadow: '8px 10px 30px -12.8px black',
    //    boxShadow: "rgba(0, 0, 0, 0.45) 0px 25px 20px -20px",
       background: "linear-gradient(to right, #2193b0, #6dd5ed)",
       boxShadow: "rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px"
   },
  

   center:{
       display:'flex',
       justifyContent:'center',
       flexDirection:"column",
       marginTop:"10px",
       fontFamily:"cursive",
       
       
   },
//    des:{
//        transition: "all 0.5s ease-out 100ms",
//        "&:hover": {
           
// background: "linear-gradient(6deg, rgba(255,255,255,1) 0%, rgba(215,234,212,1) 29%, rgba(106,162,209,1) 100%)",
//            transform: "scale(1.1)",
//            boxShadow: "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
//            cursor:"pointer",

//          }
//    }

});