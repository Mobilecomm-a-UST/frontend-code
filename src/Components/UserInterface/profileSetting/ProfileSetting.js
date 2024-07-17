import React, { useEffect, useState } from "react";
import Home from "../Home";
import "./ProfileSetting.css";
// import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Content, Grid } from "rsuite";
import { ServerURL, getData, postData } from "../../services/FetchNodeServices";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { Form, useNavigate } from "react-router-dom";
import swal from "sweetalert2";


const ProfileSetting = () => {
  const [gender, setGender] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [empCode, setEmpCode] = useState("");
  const [email, setEmail] = useState("");
  const [designation, setDesignation] = useState("");
  const [contact, setContact] = useState("");
  const [officeAddress, setOfficeAddress] = useState("");
  const [homeAddress, setHomeAddress] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [image, setImage] = useState("");
  const [photo, setPhoto] = useState(true);
  const [backendUpload, setBackendUpload] = useState();
  const navigate = useNavigate();
  //   const [profileData, setProfileData] = useState();
  const userName = JSON.parse(localStorage.getItem("userID"));

  const handleChange = (event) => {
    setGender(event.target.value);
  };

  const handleImages = (event) => {
    console.log(event);
    setPhoto(false);
    setImage(URL.createObjectURL(event.target.files[0]));
    setBackendUpload(event.target.files[0]);
  };

  const SaveProileData = async () => {
    let form = new FormData();

    form.append("Employee_Name", employeeName);
    form.append("Employee_Code", empCode);
    form.append("Email", email);
    form.append("Designation", designation);
    form.append("Contact", contact);
    form.append("Office_Address", officeAddress);
    form.append("Home_Address", homeAddress);
    form.append("COUNTRY", country);
    form.append("State", state);
    form.append("Gender", gender);

    if (backendUpload) {
      form.append("Image", backendUpload);
    } else {
      // If no new image is selected, you can add the existing image URL to the form
      form.append("ExistingImage", image);
    }

    const response = await postData(`profileSetting/${userName}/`, form);

    console.log(response);
    if (response.status) {
      swal.fire({
        icon: "success",
        title: "Done",
        text: `${response.message}`,
      });
    } else {
      swal.fire({
        icon: "error",
        title: "Oops....",
        text: `${response.message}`,
      });
    }

    navigate("/profile");
  };

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const fetchProfileData = async () => {
    const response = await getData(`profile/${userName}/`);

    // setProfileData(response.data);
    console.log("11111111", response);
    setEmployeeName(response.data[0].Employee_Name);
    setEmpCode(response.data[0].Employee_Code);
    setEmail(response.data[0].Email);
    setContact(response.data[0].Contact);
    setOfficeAddress(response.data[0].Office_Address);
    setHomeAddress(response.data[0].Home_Address);
    setCountry(response.data[0].COUNTRY);
    setState(response.data[0].STATE);
    setDesignation(response.data[0].Designation);
    setGender(response.data[0].Gender);
    setImage(response.data[0].Image);
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  return (
    <>
    <script>
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-alpha1/dist/css/bootstrap.min.css"
    />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-alpha1/dist/js/bootstrap.bundle.min.js"
    />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"
    />
    </script>
      <div>
        <Home />
      </div>
      <div className="container rounded bg-white mt-5 mb-5">
        <div className="row">
          <div className="col-md-3 border-right mt-3">
            <div className="d-flex flex-column align-items-center text-center p-3 py-5 z-1 shadow p-3 mb-5 bg-white rounded  ">
              <img
                className="rounded-circle mt-5"
                width="150px"
                // src={`${ServerURL}${data[0].Image}`}
                src={photo ? `${ServerURL}${image}` : `${image}`}
                style={{ objectFit: "cover" }}
              />
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
                sx={{
                  marginBottom: "10px",
                  marginTop: "10px",
                }}
              >
                Change Photo
                <VisuallyHiddenInput type="file" onChange={handleImages} />
              </Button>

              <span className="font-weight-bold">{employeeName}</span>
              <span className="text-black-50">{email}</span>
              <span> </span>
            </div>
          </div>
          <div className="col-md-5 border-right mt-2">
            <div className="p-3 py-5 shadow p-3 mb-5 bg-white rounded">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="text-right">Profile Settings</h4>
              </div>
              <div className="row mt-2">
                <Box
                  component="form"
                  sx={{
                    "& > :not(style)": { m: 1, width: "100%" },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    id="outlined-basic"
                    label="Employee Name"
                    variant="outlined"
                    value={employeeName}
                    onChange={(e) => setEmployeeName(e.target.value)}
                  />
                </Box>
              </div>
              <div className="row mt-3">
                <Box
                  component="form"
                  sx={{
                    "& > :not(style)": { m: 1, width: "100%" },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    id="outlined-basic"
                    label="Employee Code"
                    variant="outlined"
                    value={empCode}
                    onChange={(e) => setEmpCode(e.target.value)}
                  />
                </Box>
                <Box
                  component="form"
                  sx={{
                    "& > :not(style)": { m: 1, width: "100%" },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    id="outlined-basic"
                    label="Email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Box>
                <Box
                  component="form"
                  sx={{
                    "& > :not(style)": { m: 1, width: "100%" },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    id="outlined-basic"
                    label="Mobile Number"
                    variant="outlined"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                  />
                </Box>
                <Box
                  component="form"
                  sx={{
                    "& > :not(style)": { m: 1, width: "100%" },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    id="outlined-basic"
                    label="Office Address"
                    variant="outlined"
                    value={officeAddress}
                    onChange={(e) => setOfficeAddress(e.target.value)}
                  />
                </Box>
                <Box
                  component="form"
                  sx={{
                    "& > :not(style)": { m: 1, width: "100%" },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    id="outlined-basic"
                    label="Home Address"
                    variant="outlined"
                    value={homeAddress}
                    onChange={(e) => setHomeAddress(e.target.value)}
                  />
                </Box>
              </div>
              <div className="row mt-3">
                <Box
                  component="form"
                  sx={{
                    "& .MuiTextField-root": { m: 1, width: "30ch" },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <div>
                    <TextField
                      id="outlined-multiline-flexible"
                      label="Country"
                      multiline
                      maxRows={4}
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    />
                    <TextField
                      id="outlined-textarea"
                      label="State"
                      value={state}
                      placeholder="Placeholder"
                      multiline
                      onChange={(e) => setState(e.target.value)}
                    />
                  </div>
                </Box>
              </div>
              <div className="mt-5 text-center">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    SaveProileData();
                  }}
                >
                  Save Profile
                </Button>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-3 py-5 shadow p-3 mb-5 bg-white rounded">
              <div className="d-flex justify-content-between align-items-center experience">
                <span>Edit Designation</span>
                <span className="border px-3 p-1 add-experience">
                  <i className="fa fa-plus" />
                  &nbsp;Designation
                </span>
              </div>
              <br />
              <div className="col-md-12">
                <Box
                  component="form"
                  sx={{
                    "& > :not(style)": { m: 1, width: "100%" },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    id="outlined-basic"
                    label="Designation"
                    value={designation}
                    variant="outlined"
                    onChange={(e) => setDesignation(e.target.value)}
                  />
                </Box>
              </div>{" "}
              <br />
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">GENDER</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={gender}
                    label="GENDER"
                    onChange={handleChange}
                  >
                    <MenuItem value={"Male"}>MALE</MenuItem>
                    <MenuItem value={"Female"}>FEMALE</MenuItem>
                    <MenuItem value={"Others"}>OTHERS</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileSetting;
