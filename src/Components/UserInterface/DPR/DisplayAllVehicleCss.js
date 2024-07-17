
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles({

    mainContainer:{
        display:'grid',
        placeItems:'center',
        marginTop:'50px',
        justifyContent:'center',

    },
    display_box:{
        height:'auto',
        width:'80vw',
        padding:10,
        borderRadius:'20px',
        marginTop:'10px',
        boxShadow:'10px 10px 31px -8.8px black',


    },
    box:{
        height:'20vw',
        width:'40vw',
        padding:10,
        borderRadius:'20px',
        background:'#D0ECE7',
        boxShadow:'10px 10px 31px -8.8px black',
    },
    heading:{
        textAlign:'center',
        fontFamily:'cursive',
        fontSize:'1vw',
        fontStyle:'oblique'

    },

    center:{

        display:'grid',
        placeItems:'center',

    }

});