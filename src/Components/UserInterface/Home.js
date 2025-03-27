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


  return (
    <div>
      <AppBar sx={{ backgroundColor: "#223354",height:{xs:50,md:60} }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="http://localhost:3000/"
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
