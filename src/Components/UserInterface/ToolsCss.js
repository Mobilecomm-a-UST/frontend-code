import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles({

    mainContainer: {
        display: 'grid',
        placeItems: 'center',
        marginTop: '125px',
        justifyContent: 'center',

    },
    box: {
        height: '20vw',
        width: '40vw',
        padding: 10,
        borderRadius: '20px',
        background: '#D0ECE7',
        // boxShadow:'10px 10px 31px -8.8px black',
    },
    box2: {
        height: 'auto',
        width: 'auto',
        padding: 10,
        borderRadius: '20px',
        background: '#fff',
        boxShadow: '8px 10px 30px -12.8px black',
    },
    center: {
        fontFamily: "Poppins",
        fontSize: "25px",
        fontWeight: "bold",
        // textAlign:'center',
        // float:'left',
        // display:'flex',
        // justifyContent:'center',
        // alignItems:'center',
        // marginTop:'50px',
        // backgroundImage: 'url('http://api.iconify.design/fluent-emoji-flat/alarm-clock.svg')'
        // backgroundImage: "url('http://192.168.0.192:8001/media/assets/logo.png')",
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',


    },
    centerIcon: {
        fontFamily: "Poppins",
        fontSize: '35px',
        fontWeight: "bold",
        textAlign: 'center',
        color: 'white',
        // marginTop:'50px',
        textAlignLast: 'left',

    },
    des: {
        padding: '0px 10px',
        transition: "all 0.5s ease-out 100ms",
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignContent: 'center',
        justifyContent: 'space-between',
        alignItems: 'center',
        // gap:'20px',
        backgroundImage: "linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)",
        boxShadow: "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",

        "&:hover": {

            backgroundImage: "linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)",
            transform: "scale(1.1)",
            boxShadow: "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
            // boxShadow: "-10px -10px 15px rgba(255,255,255,0.4),10px 10px 15px rgba(70,70,70,0.15)",
            textShadow: '2px 2px 4px #000000',
            cursor: "pointer",
            color: 'white'
        }
    },
    hover: {
        "&:hover": {
            backgroundColor: 'rgb(42,128,234, 0.5)',
            color: 'black',
            fontWeight: 'bold',
        }
    },
    hoverRT: {
        "&:hover": {
            backgroundColor: 'rgb(0,110,116, 0.5)',
            color: 'black',
            fontWeight: 'bolder',
        }
    },
    custom_select: {
        border: 'none',
        width: '45px',
        "& option": {
            height: '30px',
            width: '100px'
        }
    },

    blink: {
        animation: "$blinkEffect 1s infinite"
    },
    "@keyframes blinkEffect": {
        "0%": { backgroundColor: "#ffcccc" }, // Light Red
        "50%": { backgroundColor: "#fff" },   // White
        "100%": { backgroundColor: "#ffcccc" } // Light Red
    },
    blink1: {
        animation: "$blinkEffect1 1s infinite"
    },
    "@keyframes blinkEffect1": {
        "0%": { backgroundColor: "#FFD95F" }, // Light yellow
        "50%": { backgroundColor: "#fff" },   // White
        "100%": { backgroundColor: "#FFD95F" } // Light Red
    },
    unblink: {
        backgroundColor: "#fff"
    },
    tableRow: {
        "&:nth-of-type(even)": {
            backgroundColor: "#ffd6d6", // Light grey
        },
        "&:nth-of-type(odd)": {
            backgroundColor: "#ffffff", // White
        },
        "&:hover": {
                backgroundColor: 'rgb(0,110,116, 0.5)',
            color: 'black',
            fontWeight: 'bold',
        },
    },

});