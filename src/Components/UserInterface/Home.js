// import * as React from "react";
// import AppBar from "@mui/material/AppBar";
// import Box from "@mui/material/Box";
// import Toolbar from "@mui/material/Toolbar";
// import IconButton from "@mui/material/IconButton";
// import Typography from "@mui/material/Typography";
// import Menu from "@mui/material/Menu";
// // import MenuIcon from "@mui/icons-material/Menu";
// import Container from "@mui/material/Container";
// import Avatar from "@mui/material/Avatar";
// import Button from "@mui/material/Button";
// import Tooltip from "@mui/material/Tooltip";
// import MenuItem from "@mui/material/MenuItem";
// import MenuIcon from '@mui/icons-material/Menu';
// import ListItemIcon from "@mui/material/ListItemIcon";
// import Divider from "@mui/material/Divider";

// import Settings from "@mui/icons-material/Settings";
// import Logout from "@mui/icons-material/Logout";
// import { useNavigate ,useLocation} from "react-router-dom";
// import { Navbar, Nav } from 'rsuite';
// import HomeIcon from '@rsuite/icons/legacy/Home';
// import ConstructionIcon from '@mui/icons-material/Construction';
// import 'rsuite/dist/rsuite.min.css';
// import { ServerURL } from '../services/FetchNodeServices'
// import ToolsIcon from '@rsuite/icons/Tools';
// import InfoIcon from '@mui/icons-material/Info';
// import { getData } from "../services/FetchNodeServices";
// import { getDecreyptedData } from "../utils/localstorage";


// export default function Home() {

//   const [anchorElUser, setAnchorElUser] = React.useState(null);
//   const [anchorElMenu, setAnchorElMenu] = React.useState(null);
//   const [selectedIndex, setSelectedIndex] = React.useState(1);
//   const [image, setImage] = React.useState("");
//   const navigate = useNavigate();
//   // const [dashboard, setDashboard] = React.useState(null);
//   // const open = Boolean(dashboard);
//   const chackToken =getDecreyptedData("tokenKey")
//   const userName = getDecreyptedData("userID")
//   // const userName = JSON.parse(localStorage.getItem("userID"))
//   const location = useLocation()

//   //  console.log('tttttttttttttttt' ,userName )
//   const fetchProfileData = async () => {
//     const response = await getData(`profile/${userName}/`);

//     // setProfileData(response.data);
//     // console.log("11111111", response.data[0].Image);
//     setImage(response?.data[0].Image);
//   };



//   React.useEffect(() => {
//     // fetchProfileData();
//   }, []);


//    React.useEffect(()=>{
//     setSelectedIndex(location.pathname)
//    },[location])


//   //  console.log('location' , location)
//   const handleOpenUserMenu = (event) => {
//     setAnchorElUser(event.currentTarget);
//   };
//   const handleCloseUserMenu = () => {
//     setAnchorElUser(null);
//   };
//   const handleOpenMenu = (event) => {
//     setAnchorElMenu(event.currentTarget);
//   };
//   const handleCloseMenu = () => {
//     setAnchorElMenu(null);
//   };

//   // window.onscroll = ()=>{
//   //   var currentScrollPos = window.pageYOffset;
//   //   console.log('ddddd',currentScrollPos)
//   // }
// var prevScrollpos = window.pageYOffset;
// // window.onscroll = function() {
// // var currentScrollPos = window.pageYOffset;
// //   if (prevScrollpos > currentScrollPos) {
// //     document.getElementById("navbar").style.cssText="top:0px; transition: all 1s ease"
// //   } else {
// //     document.getElementById("navbar").style.cssText="top:-60px; transition: all 1s ease"
// //   }
// //   prevScrollpos = currentScrollPos;
// // }



//   const handleHome = () => {
//     navigate("/");
//   };

//   const handleLogin = () => {
//     navigate("/login");
//   };
//   const handleLogout = () => {
//     localStorage.clear();
//     navigate('/login')
//     // window.location.reload();
//   }
//   const handleTools = () => {
//     navigate("/tools");
//   };
// // rgb(0, 110, 116)

//   return (
//     <div>
//       {/* <AppBar sx={{ backgroundColor: "#223354",height:{xs:50,md:60} }}>  */}
//       <AppBar sx={{ backgroundColor: "rgb(0, 110, 116)" ,height:{xs:50,md:60} }}> 
//         <Container maxWidth="xl">
//           <Toolbar disableGutters>
//             {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}
//             <Typography
//               variant="h6"
//               noWrap
//               component="a"
//               href={ServerURL}
//               sx={{
//                 mr: 2,
//                 display: { xs: "none", md: "flex" },
//                 fontFamily: "monospace",
//                 fontWeight: 700,
//                 letterSpacing: ".3rem",
//                 color: "inherit",
//                 textDecoration: "none",
//               }}
//             >
//               <img src={`${ServerURL}/media/assets/logo.png`} width="100" loading="lazy" />
//             </Typography>

//             <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none",sm:'flex' } }}>

//               {/* <Dropdown icon={<MenuIcon style={{ fontSize: "20px" }} />}>
//                 <Dropdown.Item icon={<HomeIcon style={{ fontSize: "16px" }} />} onClick={handleHome}>Home</Dropdown.Item>
//                 <Dropdown.Item icon={<ToolsIcon style={{ fontSize: "16px" }} />} onClick={handleTools}>Tools</Dropdown.Item>
//                 <Dropdown.Item>About</Dropdown.Item>
//               </Dropdown> */}
//               <Tooltip title="User Data">
//                   <IconButton onClick={handleOpenMenu} sx={{ p: 0 }}>
//                   <MenuIcon sx={{color:'white',fontSize:26}}/>
//                 </IconButton>
//               </Tooltip>
//               <Menu
//                   sx={{ mt: "45px" }}
//                   id="menu-appbar"
//                   anchorEl={anchorElMenu}
//                   anchorOrigin={{
//                     vertical: "top",
//                     horizontal: "right",
//                   }}
//                   keepMounted
//                   transformOrigin={{
//                     vertical: "top",
//                     horizontal: "right",
//                   }}
//                   open={Boolean(anchorElMenu)}
//                   onClose={handleCloseMenu}
//                 >
//                   <MenuItem
//                     style={{
//                       fontFamily: "Poppins",
//                       fontSize: "16px",
//                       fontWeight: 500,
//                     }}
//                     selected={selectedIndex === '/'}
//                     onClick={handleHome}
//                   >
//                     <HomeIcon
//                       style={{color:'#223354',fontSize:25,margin:5}}
//                     />Home
//                   </MenuItem>
//                   <MenuItem
//                     style={{
//                       fontFamily: "Poppins",
//                       fontSize: "16px",
//                       fontWeight: 500,
//                     }}
//                     onClick={handleTools}
//                     selected={selectedIndex === '/tools'}
//                   >
//                     <ConstructionIcon
//                        style={{color:'#223354',fontSize:25,margin:5}}
//                     />
//                     Tools
//                   </MenuItem>
//                   <MenuItem
//                     style={{
//                       fontFamily: "Poppins",
//                       fontSize: "16px",
//                       fontWeight: 500,
//                     }}
//                   >
//                     <InfoIcon
//                        style={{color:'#223354',fontSize:25,margin:5}}
//                     />
//                     About
//                   </MenuItem>
//                 </Menu>


//             </Box>

//             <Typography
//               variant="h5"
//               noWrap
//               component="a"
//               href=""
//               sx={{
//                 mr: 2,
//                 display: { xs: "flex", md: "none" },
//                 flexGrow: 1,
//                 fontFamily: "monospace",
//                 fontWeight: 700,
//                 letterSpacing: ".3rem",
//                 color: "inherit",
//                 textDecoration: "none",
//               }}
//             >
//               <img src={`${ServerURL}/media/assets/logo.png`} width="100" height="45" />
//             </Typography>
//             <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
//               <Navbar appearance="">
//                 <Nav >
//                   <Nav.Item icon={<HomeIcon style={{ fontSize: "19px" }} />} onClick={handleHome}>HOME</Nav.Item>
//                   <Nav.Item icon={<ToolsIcon style={{ fontSize: "19px" }} />} onClick={handleTools}>TOOLS</Nav.Item>
//                   <Nav.Item>ABOUT</Nav.Item>
//                 </Nav>
//               </Navbar>
//             </Box>
//             <Box sx={{ flexGrow: 0, display: { xs: "none", md: "flex" } }}>
//             <span style={{  marginRight: 10, fontSize: 20, fontWeight: 'bold' }}>{userName?.split('@')[0].replace('.', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
//             </Box>

//             {chackToken != null ? <>
//               <Box sx={{ flexGrow: 0 }}>
//                 <Tooltip title="User Data">
//                   <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
//                     <Avatar alt={userName} style={{width:30,height:30}} src={`${ServerURL}${image}`}/>
//                     {/* <AccountCircleIcon style={{fontSize:40,color:"#ffffff"}}/> */}
//                   </IconButton>
//                 </Tooltip>
//                 <Menu
//                   sx={{ mt: "45px" }}
//                   id="menu-appbar"
//                   anchorEl={anchorElUser}
//                   anchorOrigin={{
//                     vertical: "top",
//                     horizontal: "right",
//                   }}
//                   keepMounted
//                   transformOrigin={{
//                     vertical: "top",
//                     horizontal: "right",
//                   }}
//                   open={Boolean(anchorElUser)}
//                   onClose={handleCloseUserMenu}
//                 >
//                   {/* <MenuItem
//                     style={{
//                       fontFamily: "Poppins",
//                       fontSize: "16px",
//                       fontWeight: 500,
//                     }}
//                   >
//                     <Avatar
//                       style={{
//                         width: "25px",
//                         height: "25px",
//                         marginRight: "15px",
//                       }}
//                       src={`${ServerURL}${image}`}
//                     />{userName}
//                   </MenuItem> */}
//                   <MenuItem
//                     style={{
//                       fontFamily: "Poppins",
//                       fontSize: "16px",
//                       fontWeight: 500,
//                     }}
//                     onClick={() => {
//                       navigate("/profile");
//                     }}
//                   >
//                     {/* <Avatar
//                       style={{
//                         width: "25px",
//                         height: "25px",
//                         marginRight: "15px",
//                       }}
//                       src={`${ServerURL}${image}`}
//                     /> */}
//                     My account
//                   </MenuItem>
//                   <Divider />
//                   <MenuItem
//                       style={{
//                         fontFamily: "Poppins",
//                         fontSize: "16px",
//                         fontWeight: 500,
//                       }}
//                       onClick={() => {
//                         navigate("/profileSetting");
//                       }}
//                     >
//                       <ListItemIcon>
//                         <Settings fontSize="small" />
//                       </ListItemIcon>
//                       Profile Settings
//                     </MenuItem>
//                   <MenuItem
//                     style={{
//                       fontFamily: "Poppins",
//                       fontSize: "16px",
//                       fontWeight: 500,
//                     }}
//                     onClick={handleLogout}
//                   >
//                     <ListItemIcon>
//                       <Logout fontSize="small" />
//                     </ListItemIcon>
//                     Logout
//                   </MenuItem>
//                 </Menu>
//               </Box>

//               <Box sx={{ display: { xs: "none", md: "flex" }, marginLeft: "10px" }}>
//                 <Button variant="contained" color="warning">
//                   <span onClick={handleLogout} style={{ textTransform: "none" }}>Logout</span>
//                 </Button>
//               </Box></> : <><Box sx={{ display: { xs: "flex", md: "flex" }, marginLeft: "10px" }}>
//                 <Button variant="contained" color="primary">
//                   <span onClick={handleLogin} style={{ textTransform: "none" }}>Login</span>
//                 </Button>
//               </Box></>}
//           </Toolbar>
//         </Container>
//       </AppBar>

//     </div>
//   );
// }


// import * as React from "react";
// import AppBar from "@mui/material/AppBar";
// import Box from "@mui/material/Box";
// import Toolbar from "@mui/material/Toolbar";
// import IconButton from "@mui/material/IconButton";
// import Typography from "@mui/material/Typography";
// import Menu from "@mui/material/Menu";
// import Container from "@mui/material/Container";
// import Avatar from "@mui/material/Avatar";
// import Button from "@mui/material/Button";
// import Tooltip from "@mui/material/Tooltip";
// import MenuItem from "@mui/material/MenuItem";
// import MenuIcon from '@mui/icons-material/Menu';
// import ListItemIcon from "@mui/material/ListItemIcon";
// import Divider from "@mui/material/Divider";

// import Settings from "@mui/icons-material/Settings";
// import Logout from "@mui/icons-material/Logout";
// import { useNavigate, useLocation } from "react-router-dom";
// import { Navbar, Nav } from 'rsuite';
// import HomeIcon from '@rsuite/icons/legacy/Home';
// import ConstructionIcon from '@mui/icons-material/Construction';
// import 'rsuite/dist/rsuite.min.css';
// import { ServerURL } from '../services/FetchNodeServices';
// import ToolsIcon from '@rsuite/icons/Tools';
// import InfoIcon from '@mui/icons-material/Info';
// import { getData } from "../services/FetchNodeServices";
// import { getDecreyptedData } from "../utils/localstorage";
// import DiwaliCelebration from '../UserInterface/DiwaliCelebration';

// const CELEBRATION_NAV_DELAY = 1800;
// const CELEBRATION_END_DELAY = 3800;

// export default function Home() {

//   const [anchorElUser, setAnchorElUser] = React.useState(null);
//   const [anchorElMenu, setAnchorElMenu] = React.useState(null);
//   const [selectedIndex, setSelectedIndex] = React.useState(1);
//   const [image, setImage] = React.useState("");
//   const [celebrating, setCelebrating] = React.useState(false);

//   const navigate = useNavigate();
//   const chackToken = getDecreyptedData("tokenKey");
//   const userName = getDecreyptedData("userID");
//   const location = useLocation();

//   const celebrateTimers = React.useRef([]);
//   const pendingPath = React.useRef(null);

//   const displayName = userName
//     ?.split('@')[0]
//     .replace('.', ' ')
//     .split(' ')
//     .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
//     .join(' ');

//   const fetchProfileData = async () => {
//     const response = await getData(`profile/${userName}/`);
//     setImage(response?.data[0].Image);
//   };

//   React.useEffect(() => {
//     // fetchProfileData();
//   }, []);

//   React.useEffect(() => {
//     setSelectedIndex(location.pathname);
//   }, [location]);

//   // Clear any pending celebration timers when the navbar unmounts
//   React.useEffect(() => {
//     return () => celebrateTimers.current.forEach(clearTimeout);
//   }, []);

//   const handleOpenUserMenu = (event) => {
//     setAnchorElUser(event.currentTarget);
//   };
//   const handleCloseUserMenu = () => {
//     setAnchorElUser(null);
//   };
//   const handleOpenMenu = (event) => {
//     setAnchorElMenu(event.currentTarget);
//   };
//   const handleCloseMenu = () => {
//     setAnchorElMenu(null);
//   };

//   /** Shows the Diwali overlay, then navigates to the target route. */
//   const celebrateAndGo = (path) => {
//     setAnchorElMenu(null);

//     celebrateTimers.current.forEach(clearTimeout);
//     pendingPath.current = path;
//     setCelebrating(true);

//     celebrateTimers.current = [
//       setTimeout(() => {
//         navigate(path);
//         pendingPath.current = null;
//       }, CELEBRATION_NAV_DELAY),
//       setTimeout(() => setCelebrating(false), CELEBRATION_END_DELAY),
//     ];
//   };

//   /** Tapping the overlay skips the rest of the animation and goes to the destination. */
//   const finishCelebration = () => {
//     celebrateTimers.current.forEach(clearTimeout);
//     celebrateTimers.current = [];
//     setCelebrating(false);
//     if (pendingPath.current) {
//       navigate(pendingPath.current);
//       pendingPath.current = null;
//     }
//   };

//   const handleHome = () => celebrateAndGo("/");
//   const handleTools = () => celebrateAndGo("/tools");

//   const handleLogin = () => {
//     navigate("/login");
//   };
//   const handleLogout = () => {
//     localStorage.clear();
//     navigate('/login');
//   };

//   return (
//     <div>
//       <DiwaliCelebration
//         open={celebrating}
//         onClose={finishCelebration}
//         name={displayName}
//       />

//       <AppBar sx={{ backgroundColor: "rgb(0, 110, 116)", height: { xs: 50, md: 60 } }}>
//         <Container maxWidth="xl">
//           <Toolbar disableGutters>
//             <Typography
//               variant="h6"
//               noWrap
//               component="a"
//               href={ServerURL}
//               sx={{
//                 mr: 2,
//                 display: { xs: "none", md: "flex" },
//                 fontFamily: "monospace",
//                 fontWeight: 700,
//                 letterSpacing: ".3rem",
//                 color: "inherit",
//                 textDecoration: "none",
//               }}
//             >
//               <img src={`${ServerURL}/media/assets/logo.png`} width="100" loading="lazy" />
//             </Typography>

//             <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none", sm: 'flex' } }}>
//               <Tooltip title="User Data">
//                 <IconButton onClick={handleOpenMenu} sx={{ p: 0 }}>
//                   <MenuIcon sx={{ color: 'white', fontSize: 26 }} />
//                 </IconButton>
//               </Tooltip>
//               <Menu
//                 sx={{ mt: "45px" }}
//                 id="menu-appbar"
//                 anchorEl={anchorElMenu}
//                 anchorOrigin={{ vertical: "top", horizontal: "right" }}
//                 keepMounted
//                 transformOrigin={{ vertical: "top", horizontal: "right" }}
//                 open={Boolean(anchorElMenu)}
//                 onClose={handleCloseMenu}
//               >
//                 <MenuItem
//                   style={{ fontFamily: "Poppins", fontSize: "16px", fontWeight: 500 }}
//                   selected={selectedIndex === '/'}
//                   onClick={handleHome}
//                 >
//                   <HomeIcon style={{ color: '#223354', fontSize: 25, margin: 5 }} />Home
//                 </MenuItem>
//                 <MenuItem
//                   style={{ fontFamily: "Poppins", fontSize: "16px", fontWeight: 500 }}
//                   onClick={handleTools}
//                   selected={selectedIndex === '/tools'}
//                 >
//                   <ConstructionIcon style={{ color: '#223354', fontSize: 25, margin: 5 }} />
//                   Tools
//                 </MenuItem>
//                 <MenuItem
//                   style={{ fontFamily: "Poppins", fontSize: "16px", fontWeight: 500 }}
//                 >
//                   <InfoIcon style={{ color: '#223354', fontSize: 25, margin: 5 }} />
//                   About
//                 </MenuItem>
//               </Menu>
//             </Box>

//             <Typography
//               variant="h5"
//               noWrap
//               component="a"
//               href=""
//               sx={{
//                 mr: 2,
//                 display: { xs: "flex", md: "none" },
//                 flexGrow: 1,
//                 fontFamily: "monospace",
//                 fontWeight: 700,
//                 letterSpacing: ".3rem",
//                 color: "inherit",
//                 textDecoration: "none",
//               }}
//             >
//               <img src={`${ServerURL}/media/assets/logo.png`} width="100" height="45" />
//             </Typography>

//             <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
//               <Navbar appearance="">
//                 <Nav>
//                   <Nav.Item icon={<HomeIcon style={{ fontSize: "19px" }} />} onClick={handleHome}>HOME</Nav.Item>
//                   <Nav.Item icon={<ToolsIcon style={{ fontSize: "19px" }} />} onClick={handleTools}>TOOLS</Nav.Item>
//                   <Nav.Item>ABOUT</Nav.Item>
//                 </Nav>
//               </Navbar>
//             </Box>

//             {/* ========== HAPPY DIWALI GREETING BADGE ========== */}
//             <Box
//               sx={{
//                 display: { xs: "none", lg: "flex" },
//                 alignItems: "center",
//                 gap: 1,
//                 px: 2,
//                 py: 0.5,
//                 mr: 2,
//                 borderRadius: "20px",
//                 background: "linear-gradient(135deg, rgba(255, 193, 7, 0.25) 0%, rgba(255, 112, 67, 0.25) 100%)",
//                 border: "1px solid rgba(255, 215, 0, 0.4)",
//                 boxShadow: "0 0 15px rgba(255, 193, 7, 0.15)",
//                 animation: "pulse 3s infinite"
//               }}
//             >
//               <Typography
//                 sx={{
//                   fontFamily: "Poppins, sans-serif",
//                   fontSize: "14px",
//                   fontWeight: 600,
//                   color: "#FFD700",
//                   letterSpacing: "0.5px",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "6px",
//                   textShadow: "0 1px 2px rgba(0,0,0,0.3)"
//                 }}
//               >
//                 <span>🪔</span> Happy Diwali <span>✨</span>
//               </Typography>
//             </Box>

//             <Box sx={{ flexGrow: 0, display: { xs: "none", md: "flex" } }}>
//               <span style={{ marginRight: 10, fontSize: 20, fontWeight: 'bold' }}>{displayName}</span>
//             </Box>

//             {chackToken != null ? <>
//               <Box sx={{ flexGrow: 0 }}>
//                 <Tooltip title="User Data">
//                   <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
//                     <Avatar alt={userName} style={{ width: 30, height: 30 }} src={`${ServerURL}${image}`} />
//                   </IconButton>
//                 </Tooltip>
//                 <Menu
//                   sx={{ mt: "45px" }}
//                   id="menu-appbar"
//                   anchorEl={anchorElUser}
//                   anchorOrigin={{ vertical: "top", horizontal: "right" }}
//                   keepMounted
//                   transformOrigin={{ vertical: "top", horizontal: "right" }}
//                   open={Boolean(anchorElUser)}
//                   onClose={handleCloseUserMenu}
//                 >
//                   <MenuItem
//                     style={{ fontFamily: "Poppins", fontSize: "16px", fontWeight: 500 }}
//                     onClick={() => navigate("/profile")}
//                   >
//                     My account
//                   </MenuItem>
//                   <Divider />
//                   <MenuItem
//                     style={{ fontFamily: "Poppins", fontSize: "16px", fontWeight: 500 }}
//                     onClick={() => navigate("/profileSetting")}
//                   >
//                     <ListItemIcon>
//                       <Settings fontSize="small" />
//                     </ListItemIcon>
//                     Profile Settings
//                   </MenuItem>
//                   <MenuItem
//                     style={{ fontFamily: "Poppins", fontSize: "16px", fontWeight: 500 }}
//                     onClick={handleLogout}
//                   >
//                     <ListItemIcon>
//                       <Logout fontSize="small" />
//                     </ListItemIcon>
//                     Logout
//                   </MenuItem>
//                 </Menu>
//               </Box>

//               <Box sx={{ display: { xs: "none", md: "flex" }, marginLeft: "10px" }}>
//                 <Button variant="contained" color="warning">
//                   <span onClick={handleLogout} style={{ textTransform: "none" }}>Logout</span>
//                 </Button>
//               </Box>
//             </> : <>
//               <Box sx={{ display: { xs: "flex", md: "flex" }, marginLeft: "10px" }}>
//                 <Button variant="contained" color="primary">
//                   <span onClick={handleLogin} style={{ textTransform: "none" }}>Login</span>
//                 </Button>
//               </Box>
//             </>}
//           </Toolbar>
//         </Container>
//       </AppBar>
//     </div>
//   );
// }



// import * as React from "react";
// import AppBar from "@mui/material/AppBar";
// import Box from "@mui/material/Box";
// import Toolbar from "@mui/material/Toolbar";
// import IconButton from "@mui/material/IconButton";
// import Typography from "@mui/material/Typography";
// import Menu from "@mui/material/Menu";
// import Container from "@mui/material/Container";
// import Avatar from "@mui/material/Avatar";
// import Button from "@mui/material/Button";
// import Tooltip from "@mui/material/Tooltip";
// import MenuItem from "@mui/material/MenuItem";
// import MenuIcon from '@mui/icons-material/Menu';
// import ListItemIcon from "@mui/material/ListItemIcon";
// import Divider from "@mui/material/Divider";

// import Settings from "@mui/icons-material/Settings";
// import Logout from "@mui/icons-material/Logout";
// import { useNavigate, useLocation } from "react-router-dom";
// import { Navbar, Nav } from 'rsuite';
// import HomeIcon from '@rsuite/icons/legacy/Home';
// import ConstructionIcon from '@mui/icons-material/Construction';
// import 'rsuite/dist/rsuite.min.css';
// import { ServerURL } from '../services/FetchNodeServices';
// import ToolsIcon from '@rsuite/icons/Tools';
// import InfoIcon from '@mui/icons-material/Info';
// import { getData } from "../services/FetchNodeServices";
// import { getDecreyptedData } from "../utils/localstorage";
// import DiwaliCelebration from '../UserInterface/DiwaliCelebration';

// // Routes where the greeting is allowed to appear
// const CELEBRATION_ROUTES = ["/", "/tools"];
// // sessionStorage key: the greeting shows once per browser tab session
// const DIWALI_SHOWN_KEY = "diwaliCelebrationShown";
// const CELEBRATION_DURATION = 3800;

// const shouldCelebrate = (pathname) =>
//   CELEBRATION_ROUTES.includes(pathname) && !sessionStorage.getItem(DIWALI_SHOWN_KEY);

// export default function Home() {

//   const [anchorElUser, setAnchorElUser] = React.useState(null);
//   const [anchorElMenu, setAnchorElMenu] = React.useState(null);
//   const [selectedIndex, setSelectedIndex] = React.useState(1);
//   const [image, setImage] = React.useState("");

//   const navigate = useNavigate();
//   const location = useLocation();
//   const chackToken = getDecreyptedData("tokenKey");
//   const userName = getDecreyptedData("userID");

//   const displayName = userName
//     ?.split('@')[0]
//     .replace('.', ' ')
//     .split(' ')
//     .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
//     .join(' ');

//   // Decided once on first render: only show if not yet shown this session and on an allowed route
//   const [celebrating, setCelebrating] = React.useState(() => shouldCelebrate(location.pathname));

//   // Mark as shown and auto-hide after the duration
//   React.useEffect(() => {
//     if (!celebrating) return;
//     sessionStorage.setItem(DIWALI_SHOWN_KEY, "1");
//     const timer = setTimeout(() => setCelebrating(false), CELEBRATION_DURATION);
//     return () => clearTimeout(timer);
//   }, [celebrating]);

//   const fetchProfileData = async () => {
//     const response = await getData(`profile/${userName}/`);
//     setImage(response?.data[0].Image);
//   };

//   React.useEffect(() => {
//     // fetchProfileData();
//   }, []);

//   React.useEffect(() => {
//     setSelectedIndex(location.pathname);
//   }, [location]);

//   const handleOpenUserMenu = (event) => {
//     setAnchorElUser(event.currentTarget);
//   };
//   const handleCloseUserMenu = () => {
//     setAnchorElUser(null);
//   };
//   const handleOpenMenu = (event) => {
//     setAnchorElMenu(event.currentTarget);
//   };
//   const handleCloseMenu = () => {
//     setAnchorElMenu(null);
//   };

//   const handleHome = () => {
//     setAnchorElMenu(null);
//     navigate("/");
//   };
//   const handleTools = () => {
//     setAnchorElMenu(null);
//     navigate("/tools");
//   };
//   const handleLogin = () => {
//     navigate("/login");
//   };
//   const handleLogout = () => {
//     localStorage.clear();
//     navigate('/login');
//   };

//   // Overlay only shows on the allowed routes, even if the navbar stays mounted during navigation
//   const overlayOpen = celebrating && CELEBRATION_ROUTES.includes(location.pathname);

//   return (
//     <div>
//       <DiwaliCelebration
//         open={overlayOpen}
//         onClose={() => setCelebrating(false)}
//         name={displayName}
//       />

//       <AppBar sx={{ backgroundColor: "rgb(0, 110, 116)", height: { xs: 50, md: 60 } }}>
//         <Container maxWidth="xl">
//           <Toolbar disableGutters>
//             <Typography
//               variant="h6"
//               noWrap
//               component="a"
//               href={ServerURL}
//               sx={{
//                 mr: 2,
//                 display: { xs: "none", md: "flex" },
//                 fontFamily: "monospace",
//                 fontWeight: 700,
//                 letterSpacing: ".3rem",
//                 color: "inherit",
//                 textDecoration: "none",
//               }}
//             >
//               <img src={`${ServerURL}/media/assets/logo.png`} width="100" loading="lazy" />
//             </Typography>

//             <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none", sm: 'flex' } }}>
//               <Tooltip title="User Data">
//                 <IconButton onClick={handleOpenMenu} sx={{ p: 0 }}>
//                   <MenuIcon sx={{ color: 'white', fontSize: 26 }} />
//                 </IconButton>
//               </Tooltip>
//               <Menu
//                 sx={{ mt: "45px" }}
//                 id="menu-appbar"
//                 anchorEl={anchorElMenu}
//                 anchorOrigin={{ vertical: "top", horizontal: "right" }}
//                 keepMounted
//                 transformOrigin={{ vertical: "top", horizontal: "right" }}
//                 open={Boolean(anchorElMenu)}
//                 onClose={handleCloseMenu}
//               >
//                 <MenuItem
//                   style={{ fontFamily: "Poppins", fontSize: "16px", fontWeight: 500 }}
//                   selected={selectedIndex === '/'}
//                   onClick={handleHome}
//                 >
//                   <HomeIcon style={{ color: '#223354', fontSize: 25, margin: 5 }} />Home
//                 </MenuItem>
//                 <MenuItem
//                   style={{ fontFamily: "Poppins", fontSize: "16px", fontWeight: 500 }}
//                   onClick={handleTools}
//                   selected={selectedIndex === '/tools'}
//                 >
//                   <ConstructionIcon style={{ color: '#223354', fontSize: 25, margin: 5 }} />
//                   Tools
//                 </MenuItem>
//                 <MenuItem
//                   style={{ fontFamily: "Poppins", fontSize: "16px", fontWeight: 500 }}
//                 >
//                   <InfoIcon style={{ color: '#223354', fontSize: 25, margin: 5 }} />
//                   About
//                 </MenuItem>
//               </Menu>
//             </Box>

//             <Typography
//               variant="h5"
//               noWrap
//               component="a"
//               href=""
//               sx={{
//                 mr: 2,
//                 display: { xs: "flex", md: "none" },
//                 flexGrow: 1,
//                 fontFamily: "monospace",
//                 fontWeight: 700,
//                 letterSpacing: ".3rem",
//                 color: "inherit",
//                 textDecoration: "none",
//               }}
//             >
//               <img src={`${ServerURL}/media/assets/logo.png`} width="100" height="45" />
//             </Typography>

//             <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
//               <Navbar appearance="">
//                 <Nav>
//                   <Nav.Item icon={<HomeIcon style={{ fontSize: "19px" }} />} onClick={handleHome}>HOME</Nav.Item>
//                   <Nav.Item icon={<ToolsIcon style={{ fontSize: "19px" }} />} onClick={handleTools}>TOOLS</Nav.Item>
//                   <Nav.Item>ABOUT</Nav.Item>
//                 </Nav>
//               </Navbar>
//             </Box>

//             {/* ========== HAPPY DIWALI GREETING BADGE ========== */}
//             <Box
//               sx={{
//                 display: { xs: "none", lg: "flex" },
//                 alignItems: "center",
//                 gap: 1,
//                 px: 2,
//                 py: 0.5,
//                 mr: 2,
//                 borderRadius: "20px",
//                 background: "linear-gradient(135deg, rgba(255, 193, 7, 0.25) 0%, rgba(255, 112, 67, 0.25) 100%)",
//                 border: "1px solid rgba(255, 215, 0, 0.4)",
//                 boxShadow: "0 0 15px rgba(255, 193, 7, 0.15)",
//                 animation: "pulse 3s infinite"
//               }}
//             >
//               <Typography
//                 sx={{
//                   fontFamily: "Poppins, sans-serif",
//                   fontSize: "14px",
//                   fontWeight: 600,
//                   color: "#FFD700",
//                   letterSpacing: "0.5px",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "6px",
//                   textShadow: "0 1px 2px rgba(0,0,0,0.3)"
//                 }}
//               >
//                 <span>🪔</span> Happy Diwali <span>✨</span>
//               </Typography>
//             </Box>

//             <Box sx={{ flexGrow: 0, display: { xs: "none", md: "flex" } }}>
//               <span style={{ marginRight: 10, fontSize: 20, fontWeight: 'bold' }}>{displayName}</span>
//             </Box>

//             {chackToken != null ? <>
//               <Box sx={{ flexGrow: 0 }}>
//                 <Tooltip title="User Data">
//                   <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
//                     <Avatar alt={userName} style={{ width: 30, height: 30 }} src={`${ServerURL}${image}`} />
//                   </IconButton>
//                 </Tooltip>
//                 <Menu
//                   sx={{ mt: "45px" }}
//                   id="menu-appbar"
//                   anchorEl={anchorElUser}
//                   anchorOrigin={{ vertical: "top", horizontal: "right" }}
//                   keepMounted
//                   transformOrigin={{ vertical: "top", horizontal: "right" }}
//                   open={Boolean(anchorElUser)}
//                   onClose={handleCloseUserMenu}
//                 >
//                   <MenuItem
//                     style={{ fontFamily: "Poppins", fontSize: "16px", fontWeight: 500 }}
//                     onClick={() => navigate("/profile")}
//                   >
//                     My account
//                   </MenuItem>
//                   <Divider />
//                   <MenuItem
//                     style={{ fontFamily: "Poppins", fontSize: "16px", fontWeight: 500 }}
//                     onClick={() => navigate("/profileSetting")}
//                   >
//                     <ListItemIcon>
//                       <Settings fontSize="small" />
//                     </ListItemIcon>
//                     Profile Settings
//                   </MenuItem>
//                   <MenuItem
//                     style={{ fontFamily: "Poppins", fontSize: "16px", fontWeight: 500 }}
//                     onClick={handleLogout}
//                   >
//                     <ListItemIcon>
//                       <Logout fontSize="small" />
//                     </ListItemIcon>
//                     Logout
//                   </MenuItem>
//                 </Menu>
//               </Box>

//               <Box sx={{ display: { xs: "none", md: "flex" }, marginLeft: "10px" }}>
//                 <Button variant="contained" color="warning">
//                   <span onClick={handleLogout} style={{ textTransform: "none" }}>Logout</span>
//                 </Button>
//               </Box>
//             </> : <>
//               <Box sx={{ display: { xs: "flex", md: "flex" }, marginLeft: "10px" }}>
//                 <Button variant="contained" color="primary">
//                   <span onClick={handleLogin} style={{ textTransform: "none" }}>Login</span>
//                 </Button>
//               </Box>
//             </>}
//           </Toolbar>
//         </Container>
//       </AppBar>
//     </div>
//   );
// }

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from '@mui/icons-material/Menu';
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";

import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { useNavigate, useLocation } from "react-router-dom";
import { Navbar, Nav } from 'rsuite';
import HomeIcon from '@rsuite/icons/legacy/Home';
import ConstructionIcon from '@mui/icons-material/Construction';
import 'rsuite/dist/rsuite.min.css';
import { ServerURL } from '../services/FetchNodeServices';
import ToolsIcon from '@rsuite/icons/Tools';
import InfoIcon from '@mui/icons-material/Info';
import { getData } from "../services/FetchNodeServices";
import { getDecreyptedData } from "../utils/localstorage";
import DiwaliCelebration from '../UserInterface/DiwaliCelebration';

// Routes that show the greeting automatically on first visit in a tab
const AUTO_CELEBRATION_ROUTES = ["/", "/tools"];
const DIWALI_SHOWN_KEY = "diwaliCelebrationShown";

// Delay before navigating, and total time before the overlay closes
const NAV_DELAY = 1800;
const OVERLAY_DURATION = 3800;

export default function Home() {

  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorElMenu, setAnchorElMenu] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const [image, setImage] = React.useState("");

  // open: overlay visible | path: route to go to after the animation (null = stay)
  const [celebration, setCelebration] = React.useState({ open: false, path: null });

  const navigate = useNavigate();
  const location = useLocation();
  const chackToken = getDecreyptedData("tokenKey");
  const userName = getDecreyptedData("userID");

  const timers = React.useRef([]);

  const displayName = userName
    ?.split('@')[0]
    .replace('.', ' ')
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  /** Shows the overlay. If a path is given, navigates to it after the delay. */
  const startCelebration = (path = null) => {
    clearTimers();
    setCelebration({ open: true, path });

    if (path) {
      timers.current.push(setTimeout(() => navigate(path), NAV_DELAY));
    }
    timers.current.push(
      setTimeout(() => setCelebration((c) => ({ ...c, open: false })), OVERLAY_DURATION)
    );
  };

  /** Tapping the overlay skips ahead: navigates immediately if a path is pending. */
  const finishCelebration = () => {
    clearTimers();
    const { path } = celebration;
    setCelebration({ open: false, path: null });
    if (path) navigate(path);
  };

  // Automatic greeting: once per browser tab, only on Home and Tools
  React.useEffect(() => {
    if (AUTO_CELEBRATION_ROUTES.includes(location.pathname) && !sessionStorage.getItem(DIWALI_SHOWN_KEY)) {
      sessionStorage.setItem(DIWALI_SHOWN_KEY, "1");
      startCelebration(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    setSelectedIndex(location.pathname);
  }, [location]);

  // Clear pending timers if the navbar unmounts
  React.useEffect(() => clearTimers, []);

  const fetchProfileData = async () => {
    const response = await getData(`profile/${userName}/`);
    setImage(response?.data[0].Image);
  };

  React.useEffect(() => {
    // fetchProfileData();
  }, []);

  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);
  const handleOpenMenu = (event) => setAnchorElMenu(event.currentTarget);
  const handleCloseMenu = () => setAnchorElMenu(null);

  const handleHome = () => {
    setAnchorElMenu(null);
    startCelebration("/");
  };
  const handleTools = () => {
    setAnchorElMenu(null);
    startCelebration("/tools");
  };
  const handleAbout = () => {
    setAnchorElMenu(null);
    startCelebration(null); // no About route yet, so stay on this page
  };

  const handleLogin = () => {
    navigate("/login");
  };
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div>
      <DiwaliCelebration
        open={celebration.open}
        onClose={finishCelebration}
        name={displayName}
      />

      <AppBar sx={{ backgroundColor: "rgb(0, 110, 116)", height: { xs: 50, md: 60 } }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component="a"
              href={ServerURL}
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              <img src={`${ServerURL}/media/assets/logo.png`} width="100" loading="lazy" />
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none", sm: 'flex' } }}>
              <Tooltip title="User Data">
                <IconButton onClick={handleOpenMenu} sx={{ p: 0 }}>
                  <MenuIcon sx={{ color: 'white', fontSize: 26 }} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElMenu}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                keepMounted
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                open={Boolean(anchorElMenu)}
                onClose={handleCloseMenu}
              >
                <MenuItem
                  style={{ fontFamily: "Poppins", fontSize: "16px", fontWeight: 500 }}
                  selected={selectedIndex === '/'}
                  onClick={handleHome}
                >
                  <HomeIcon style={{ color: '#223354', fontSize: 25, margin: 5 }} />Home
                </MenuItem>
                <MenuItem
                  style={{ fontFamily: "Poppins", fontSize: "16px", fontWeight: 500 }}
                  onClick={handleTools}
                  selected={selectedIndex === '/tools'}
                >
                  <ConstructionIcon style={{ color: '#223354', fontSize: 25, margin: 5 }} />
                  Tools
                </MenuItem>
                <MenuItem
                  style={{ fontFamily: "Poppins", fontSize: "16px", fontWeight: 500 }}
                  onClick={handleAbout}
                >
                  <InfoIcon style={{ color: '#223354', fontSize: 25, margin: 5 }} />
                  About
                </MenuItem>
              </Menu>
            </Box>

            <Typography
              variant="h5"
              noWrap
              component="a"
              href=""
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              <img src={`${ServerURL}/media/assets/logo.png`} width="100" height="45" />
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              <Navbar appearance="">
                <Nav>
                  <Nav.Item icon={<HomeIcon style={{ fontSize: "19px" }} />} onClick={handleHome}>HOME</Nav.Item>
                  <Nav.Item icon={<ToolsIcon style={{ fontSize: "19px" }} />} onClick={handleTools}>TOOLS</Nav.Item>
                  <Nav.Item icon={<InfoIcon style={{ fontSize: "19px" }} />} onClick={handleAbout}>ABOUT</Nav.Item>
                </Nav>
              </Navbar>
            </Box>

            {/* ========== HAPPY DIWALI GREETING BADGE ========== */}
            <Box
              sx={{
                display: { xs: "none", lg: "flex" },
                alignItems: "center",
                gap: 1,
                px: 2,
                py: 0.5,
                mr: 2,
                borderRadius: "20px",
                background: "linear-gradient(135deg, rgba(255, 193, 7, 0.25) 0%, rgba(255, 112, 67, 0.25) 100%)",
                border: "1px solid rgba(255, 215, 0, 0.4)",
                boxShadow: "0 0 15px rgba(255, 193, 7, 0.15)",
                animation: "pulse 3s infinite"
              }}
            >
              <Typography
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#FFD700",
                  letterSpacing: "0.5px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  textShadow: "0 1px 2px rgba(0,0,0,0.3)"
                }}
              >
                <span>🪔</span> Happy Diwali <span>✨</span>
              </Typography>
            </Box>

            <Box sx={{ flexGrow: 0, display: { xs: "none", md: "flex" } }}>
              <span style={{ marginRight: 10, fontSize: 20, fontWeight: 'bold' }}>{displayName}</span>
            </Box>

            {chackToken != null ? <>
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="User Data">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={userName} style={{ width: 30, height: 30 }} src={`${ServerURL}${image}`} />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{ vertical: "top", horizontal: "right" }}
                  keepMounted
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem
                    style={{ fontFamily: "Poppins", fontSize: "16px", fontWeight: 500 }}
                    onClick={() => navigate("/profile")}
                  >
                    My account
                  </MenuItem>
                  <Divider />
                  <MenuItem
                    style={{ fontFamily: "Poppins", fontSize: "16px", fontWeight: 500 }}
                    onClick={() => navigate("/profileSetting")}
                  >
                    <ListItemIcon>
                      <Settings fontSize="small" />
                    </ListItemIcon>
                    Profile Settings
                  </MenuItem>
                  <MenuItem
                    style={{ fontFamily: "Poppins", fontSize: "16px", fontWeight: 500 }}
                    onClick={handleLogout}
                  >
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </Box>

              <Box sx={{ display: { xs: "none", md: "flex" }, marginLeft: "10px" }}>
                <Button variant="contained" color="warning">
                  <span onClick={handleLogout} style={{ textTransform: "none" }}>Logout</span>
                </Button>
              </Box>
            </> : <>
              <Box sx={{ display: { xs: "flex", md: "flex" }, marginLeft: "10px" }}>
                <Button variant="contained" color="primary">
                  <span onClick={handleLogin} style={{ textTransform: "none" }}>Login</span>
                </Button>
              </Box>
            </>}
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
}