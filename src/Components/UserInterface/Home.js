import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
// import MenuIcon from "@mui/icons-material/Menu";
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
import { useNavigate ,useLocation} from "react-router-dom";
import { Navbar, Nav } from 'rsuite';
import HomeIcon from '@rsuite/icons/legacy/Home';
import ConstructionIcon from '@mui/icons-material/Construction';
import 'rsuite/dist/rsuite.min.css';
import { ServerURL } from '../services/FetchNodeServices'
import ToolsIcon from '@rsuite/icons/Tools';
import InfoIcon from '@mui/icons-material/Info';
import { getData } from "../services/FetchNodeServices";
import { getDecreyptedData } from "../utils/localstorage";


export default function Home() {

  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorElMenu, setAnchorElMenu] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const [image, setImage] = React.useState("");
  const navigate = useNavigate();
  // const [dashboard, setDashboard] = React.useState(null);
  // const open = Boolean(dashboard);
  const chackToken =getDecreyptedData("tokenKey")
  const userName = getDecreyptedData("userID")
  // const userName = JSON.parse(localStorage.getItem("userID"))
  const location = useLocation()

  //  console.log('tttttttttttttttt' ,userName )
  const fetchProfileData = async () => {
    const response = await getData(`profile/${userName}/`);

    // setProfileData(response.data);
    // console.log("11111111", response.data[0].Image);
    setImage(response?.data[0].Image);
  };



  React.useEffect(() => {
    // fetchProfileData();
  }, []);


   React.useEffect(()=>{
    setSelectedIndex(location.pathname)
   },[location])


  //  console.log('location' , location)
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleOpenMenu = (event) => {
    setAnchorElMenu(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorElMenu(null);
  };

  // window.onscroll = ()=>{
  //   var currentScrollPos = window.pageYOffset;
  //   console.log('ddddd',currentScrollPos)
  // }
var prevScrollpos = window.pageYOffset;
// window.onscroll = function() {
// var currentScrollPos = window.pageYOffset;
//   if (prevScrollpos > currentScrollPos) {
//     document.getElementById("navbar").style.cssText="top:0px; transition: all 1s ease"
//   } else {
//     document.getElementById("navbar").style.cssText="top:-60px; transition: all 1s ease"
//   }
//   prevScrollpos = currentScrollPos;
// }



  const handleHome = () => {
    navigate("/");
  };

  const handleLogin = () => {
    navigate("/login");
  };
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login')
    // window.location.reload();
  }
  const handleTools = () => {
    navigate("/tools");
  };
// rgb(0, 110, 116)

  return (
    <div>
      {/* <AppBar sx={{ backgroundColor: "#223354",height:{xs:50,md:60} }}>  */}
      <AppBar sx={{ backgroundColor: "rgb(0, 110, 116)" ,height:{xs:50,md:60} }}> 
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}
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

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none",sm:'flex' } }}>

              {/* <Dropdown icon={<MenuIcon style={{ fontSize: "20px" }} />}>
                <Dropdown.Item icon={<HomeIcon style={{ fontSize: "16px" }} />} onClick={handleHome}>Home</Dropdown.Item>
                <Dropdown.Item icon={<ToolsIcon style={{ fontSize: "16px" }} />} onClick={handleTools}>Tools</Dropdown.Item>
                <Dropdown.Item>About</Dropdown.Item>
              </Dropdown> */}
              <Tooltip title="User Data">
                  <IconButton onClick={handleOpenMenu} sx={{ p: 0 }}>
                  <MenuIcon sx={{color:'white',fontSize:26}}/>
                </IconButton>
              </Tooltip>
              <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElMenu}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElMenu)}
                  onClose={handleCloseMenu}
                >
                  <MenuItem
                    style={{
                      fontFamily: "Poppins",
                      fontSize: "16px",
                      fontWeight: 500,
                    }}
                    selected={selectedIndex === '/'}
                    onClick={handleHome}
                  >
                    <HomeIcon
                      style={{color:'#223354',fontSize:25,margin:5}}
                    />Home
                  </MenuItem>
                  <MenuItem
                    style={{
                      fontFamily: "Poppins",
                      fontSize: "16px",
                      fontWeight: 500,
                    }}
                    onClick={handleTools}
                    selected={selectedIndex === '/tools'}
                  >
                    <ConstructionIcon
                       style={{color:'#223354',fontSize:25,margin:5}}
                    />
                    Tools
                  </MenuItem>
                  <MenuItem
                    style={{
                      fontFamily: "Poppins",
                      fontSize: "16px",
                      fontWeight: 500,
                    }}
                  >
                    <InfoIcon
                       style={{color:'#223354',fontSize:25,margin:5}}
                    />
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
                <Nav >
                  <Nav.Item icon={<HomeIcon style={{ fontSize: "19px" }} />} onClick={handleHome}>HOME</Nav.Item>
                  <Nav.Item icon={<ToolsIcon style={{ fontSize: "19px" }} />} onClick={handleTools}>TOOLS</Nav.Item>
                  <Nav.Item>ABOUT</Nav.Item>
                </Nav>
              </Navbar>
            </Box>
            <Box sx={{ flexGrow: 0, display: { xs: "none", md: "flex" } }}>
            <span style={{  marginRight: 10, fontSize: 20, fontWeight: 'bold' }}>{userName?.split('@')[0].replace('.', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
            </Box>

            {chackToken != null ? <>
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="User Data">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={userName} style={{width:30,height:30}} src={`${ServerURL}${image}`}/>
                    {/* <AccountCircleIcon style={{fontSize:40,color:"#ffffff"}}/> */}
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {/* <MenuItem
                    style={{
                      fontFamily: "Poppins",
                      fontSize: "16px",
                      fontWeight: 500,
                    }}
                  >
                    <Avatar
                      style={{
                        width: "25px",
                        height: "25px",
                        marginRight: "15px",
                      }}
                      src={`${ServerURL}${image}`}
                    />{userName}
                  </MenuItem> */}
                  <MenuItem
                    style={{
                      fontFamily: "Poppins",
                      fontSize: "16px",
                      fontWeight: 500,
                    }}
                    onClick={() => {
                      navigate("/profile");
                    }}
                  >
                    <Avatar
                      style={{
                        width: "25px",
                        height: "25px",
                        marginRight: "15px",
                      }}
                      src={`${ServerURL}${image}`}
                    />
                    My account
                  </MenuItem>
                  <Divider />
                  <MenuItem
                      style={{
                        fontFamily: "Poppins",
                        fontSize: "16px",
                        fontWeight: 500,
                      }}
                      onClick={() => {
                        navigate("/profileSetting");
                      }}
                    >
                      <ListItemIcon>
                        <Settings fontSize="small" />
                      </ListItemIcon>
                      Profile Settings
                    </MenuItem>
                  <MenuItem
                    style={{
                      fontFamily: "Poppins",
                      fontSize: "16px",
                      fontWeight: 500,
                    }}
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
              </Box></> : <><Box sx={{ display: { xs: "flex", md: "flex" }, marginLeft: "10px" }}>
                <Button variant="contained" color="primary">
                  <span onClick={handleLogin} style={{ textTransform: "none" }}>Login</span>
                </Button>
              </Box></>}
          </Toolbar>
        </Container>
      </AppBar>

    </div>
  );
}

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
// import { useNavigate ,useLocation} from "react-router-dom";
// import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
// import ConstructionIcon from '@mui/icons-material/Construction';
// import { ServerURL } from '../services/FetchNodeServices'
// import InfoIcon from '@mui/icons-material/Info';
// import { getData } from "../services/FetchNodeServices";
// import { getDecreyptedData } from "../utils/localstorage";

// // ── Brand colors ──
// const BRAND_TEAL = "rgb(0, 110, 116)";
// const BRAND_DARK = "#223354";

// // ── Desktop nav is now plain MUI Buttons (no rsuite) so hover/active color is
// // 100% controlled by our own sx — no external stylesheet, no fill-vs-color
// // mismatch on icons, nothing to fight for specificity against.
// const NavButton = ({ icon, label, onClick, active }) => (
//   <Button
//     onClick={onClick}
//     startIcon={icon}
//     disableRipple
//     sx={{
//       color: "#ffffff",
//       textTransform: "none",
//       fontFamily: "Poppins",
//       fontWeight: active ? 700 : 500,
//       fontSize: 15,
//       letterSpacing: ".02em",
//       px: 2,
//       py: 0.9,
//       mx: 0.3,
//       borderRadius: "8px",
//       backgroundColor: active ? "rgba(255,255,255,0.22)" : "transparent",
//       "& .MuiButton-startIcon": {
//         color: "#ffffff",
//       },
//       "&:hover": {
//         backgroundColor: "rgba(255,255,255,0.18)",
//         color: "#ffffff",
//       },
//       "&:hover .MuiButton-startIcon": {
//         color: "#ffffff",
//       },
//       "&:focus-visible": {
//         backgroundColor: "rgba(255,255,255,0.18)",
//         color: "#ffffff",
//         outline: "2px solid rgba(255,255,255,0.7)",
//         outlineOffset: 2,
//       },
//     }}
//   >
//     {label}
//   </Button>
// );

// // ── Shared sx for the mobile-dropdown MenuItems (Home / Tools / About).
// // The icon uses color:"inherit" so it just follows the MenuItem's own `color`
// // via normal CSS inheritance — no fragile descendant-selector fight needed.
// // `.Mui-selected` and `.Mui-selected:hover` are overridden explicitly so MUI's
// // default (blue) primary-tinted selected state can never show through.
// const navMenuItemSx = {
//   fontFamily: "Poppins",
//   fontSize: "16px",
//   fontWeight: 500,
//   color: BRAND_DARK,
//   "& .tool-icon": {
//     color: "inherit",
//     transition: "color .15s ease",
//   },

//   "&:hover": {
//     backgroundColor: `${BRAND_TEAL} !important`,
//     color: "#ffffff !important",
//     fontWeight: 700,
//   },

//   "&.Mui-selected": {
//     backgroundColor: "rgba(0, 110, 116, 0.12)",
//     color: BRAND_DARK,
//   },
//   "&.Mui-selected:hover": {
//     backgroundColor: `${BRAND_TEAL} !important`,
//     color: "#ffffff !important",
//     fontWeight: 700,
//   },
//   "&.Mui-focusVisible": {
//     backgroundColor: `${BRAND_TEAL} !important`,
//     color: "#ffffff !important",
//   },
// };

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
//       <AppBar sx={{ backgroundColor: "rgb(0, 110, 116)" ,height:{xs:50,md:60} }}> 
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

//             <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none",sm:'flex' } }}>

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
//                     selected={selectedIndex === '/'}
//                     onClick={handleHome}
//                     sx={navMenuItemSx}
//                   >
//                     <HomeOutlinedIcon
//                       className="tool-icon"
//                       style={{fontSize:25,margin:5}}
//                     />Home
//                   </MenuItem>
//                   <MenuItem
//                     onClick={handleTools}
//                     selected={selectedIndex === '/tools'}
//                     sx={navMenuItemSx}
//                   >
//                     <ConstructionIcon
//                        className="tool-icon"
//                        style={{fontSize:25,margin:5}}
//                     />
//                     Tools
//                   </MenuItem>
//                   <MenuItem sx={navMenuItemSx}>
//                     <InfoIcon
//                        className="tool-icon"
//                        style={{fontSize:25,margin:5}}
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

//             {/* ── Desktop nav: plain MUI Buttons, no rsuite — full control over hover/active color ── */}
//             <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, alignItems: "center" }}>
//               <NavButton
//                 icon={<HomeOutlinedIcon sx={{ fontSize: 19 }} />}
//                 label="HOME"
//                 onClick={handleHome}
//                 active={selectedIndex === "/"}
//               />
//               <NavButton
//                 icon={<ConstructionIcon sx={{ fontSize: 19 }} />}
//                 label="TOOLS"
//                 onClick={handleTools}
//                 active={selectedIndex === "/tools"}
//               />
//               <NavButton
//                 icon={<InfoIcon sx={{ fontSize: 19 }} />}
//                 label="ABOUT"
//                 onClick={() => {}}
//                 active={false}
//               />
//             </Box>

//             <Box sx={{ flexGrow: 0, display: { xs: "none", md: "flex" } }}>
//             <span style={{  marginRight: 10, fontSize: 20, fontWeight: 'bold' }}>{userName?.split('@')[0].replace('.', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
//             </Box>

//             {chackToken != null ? <>
//               <Box sx={{ flexGrow: 0 }}>
//                 <Tooltip title="User Data">
//                   <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
//                     <Avatar alt={userName} style={{width:30,height:30}} src={`${ServerURL}${image}`}/>
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
//                     <Avatar
//                       style={{
//                         width: "25px",
//                         height: "25px",
//                         marginRight: "15px",
//                       }}
//                       src={`${ServerURL}${image}`}
//                     />
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