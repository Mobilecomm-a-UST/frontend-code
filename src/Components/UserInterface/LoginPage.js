import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import { Grid, Box, Button } from "@mui/material";
import { InputAdornment } from "@mui/material";
// import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import KeyIcon from '@mui/icons-material/Key';
import EyeCloseIcon from '@rsuite/icons/EyeClose';
import VisibleIcon from '@rsuite/icons/Visible';
import Home from "./Home";
import { postDatas, getData } from "../services/FetchNodeServices";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { setEncreptedData,getDecreyptedData } from "../utils/localstorage";
// import axios from "../services/Instance";
// import { Token } from "@mui/icons-material";



export default function LoginPage() {

  const [show, setShow] = useState('password');
  const navigate = useNavigate()
  const listData = useSelector(state => state.linkpage)
  const [page, setPage] = useState('/')
  const tempReduxData = listData.linker
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleCallApp = async () => {
    const responce = await getData('get_user_circle')
    // console.log('user type' , responce)
    setEncreptedData("user_type", responce.user_catagory);
    setEncreptedData("user_circle", responce.circle);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add your registration logic here
    // console.log('Form submitted:', formData);
    const response = await postDatas('trend/api-token-auth/', formData)
    if (response) {
      setEncreptedData("tokenKey", response.token);
      setEncreptedData("userID", formData.username);
      Swal.fire({
        icon: "success",
        title: "Done",
        text: 'Your Login Succesfully',
      });
      handleCallApp();
      navigate(`${page}`);

    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please Check ID and Password!",
      });
    }

    // try {
    //   const response = await axios.post('/accounts/login/', formData);
    //   // Upon successful login, cookies will be automatically stored
    //   console.log('Login successful:', response.data);
    //   // Redirect or do other actions
    // } catch (error) {
    //   console.error('Login failed:', error);
    // }

  };






  useEffect(() => {
    if(getDecreyptedData("tokenKey")){
      navigate('/')
    }
    if (tempReduxData === undefined) {
      setPage('/')
    }
    else {
      setPage(tempReduxData)
    }

    document.title = 'Login Page'

  }, [])
  const handleEyeOpen = () => {
    setShow('text')
  }
  const handleEyeClose = () => {
    setShow('password')
  }
  return (
    <>
      <Box style={{ position: 'static' }}><Home /></Box>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Box
          sx={{
            width: "auto",
            height: "auto",
            borderRadius: { xs: "0px", md: '10px' },
            boxShadow: { xs: 'none', md: "1px 1px 10px 1px black" },
            padding: 5,
            backgroundColor: 'white',
          }}
        >
          <Grid container spacing={4} sx={{ display: "grid", justifyContent: "center", alignItems: "center" }}>
            <Grid item xs={12} >
              <Box
                sx={{
                  fontFamily: "Poppins",
                  fontSize: 30,
                  fontWeight: 600,
                  color: "blue",
                  textAlign: "center",
                }}
              >
                Login
              </Box>
            </Grid>
            {/* <Grid item xs={12}>
            <TextField
              label="User Id"
              required
              type='text'
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutlineIcon style={{ color: "blue" }} />
                  </InputAdornment>
                ),
              }}
              onChange={(event)=>setUserId(event.target.value)}
              variant="outlined"
              placeholder="User Id"
              style={{width:326,marginTop:50}}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Password"
              required
              type={show}
              onChange={(event)=>setLock(event.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <KeyIcon style={{ color: "blue" }} />
                  </InputAdornment>
                ),
                endAdornment:(
                  <InputAdornment position="end">
                     <Box onMouseOver={handleEyeOpen} onMouseLeave={handleEyeClose}>{show=='password'?<EyeCloseIcon  style={{ fontSize: '2em' }} />:<VisibleIcon  style={{ fontSize: '2em' }} />}</Box>
                  </InputAdornment>
                )
              }}

              variant="outlined"
              placeholder="Password"
              style={{width:326}}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" onClick={postUserData} style={{marginTop:20}}><span style={{fontSize:'20px',padding:"5px 115px"}}>Login</span></Button>
          </Grid> */}
            <Grid item xs={12} >
              <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: 20 }}>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      label="User Id"
                      name="username"
                      type="text"
                      value={formData.username}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PermIdentityIcon style={{ color: "blue" }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      label="Password"
                      name="password"
                      type={show}
                      value={formData.password}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <KeyIcon style={{ color: "blue" }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end" style={{ cursor: 'pointer' }}>
                            <Box onMouseOver={handleEyeOpen} onMouseLeave={handleEyeClose}>{show == 'password' ? <EyeCloseIcon style={{ fontSize: '2em' }} /> : <VisibleIcon style={{ fontSize: '2em' }} />}</Box>
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>

                </Grid>

                <Button type="submit" fullWidth variant="contained" color="primary" style={{ marginTop: 20 }}>
                  Submit
                </Button>
              </form>
            </Grid>
          </Grid>
        </Box>
      </div>
    </>
  );
}
