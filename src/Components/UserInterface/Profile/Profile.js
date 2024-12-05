import React, { useEffect, useState } from "react";
import "./Profile.css";
import Home from "../Home";
import { ServerURL, getData } from "../../services/FetchNodeServices";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";

const Profile = () => {
  const userName = JSON.parse(localStorage.getItem("userID"));
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

  const navigate = useNavigate();

  const fetchProfileData = async () => {
    const response = await getData(`profile/${userName}/`);

    // setProfileData(response.data);
    // console.log("11111111", response.data[0].Image);
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
      <div className="mt-5">
        <Home />
      </div>
      <div className="container emp-profile ">
        <form method="post">
          <div className="row">
            <div className="col-md-4">
              <div className="profile-img">
                <img
                  style={{ borderRadius: "50%" }}
                  src={`${ServerURL}${image}`}
                  alt=""
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="profile-head">
                <Typography variant="h5" color="success">
                  {employeeName}
                </Typography>
                <Typography variant="h5" color="primary">
                  {designation}
                </Typography>
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                  <li className="nav-item">
                    <Typography variant="h3" color="primary" fontWeight="bold">
                      <span style={{ color: "orange" }}>Mobile</span>
                      <span style={{ color: "gray" }}>Comm</span>
                    </Typography>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col">
              <Button
                variant="contained"
                color="success"
                onClick={() => {
                  navigate("/profileSetting");
                }}
                startIcon={<EditIcon />}
              >
                Edit Profile
              </Button>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4"></div>
            <div className="col-md-8">
              <div className="tab-content profile-tab" id="myTabContent">
                <div
                  className="tab-pane fade show active"
                  id="home"
                  role="tabpanel"
                  aria-labelledby="home-tab"
                >
                  <div className="row">
                    <div className="col-md-6">
                      <label>Employee Code</label>
                    </div>
                    <div className="col-md-6">
                      <p>{empCode}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <label>Employee Name</label>
                    </div>
                    <div className="col-md-6">
                      <p>{employeeName}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <label>Email</label>
                    </div>
                    <div className="col-md-6">
                      <p>{email}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <label>Phone</label>
                    </div>
                    <div className="col-md-6">
                      <p>{contact}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <label>Profession</label>
                    </div>
                    <div className="col-md-6">
                      <p>{designation}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <label>Country</label>
                    </div>
                    <div className="col-md-6">
                      <p>{country}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <label>State</label>
                    </div>
                    <div className="col-md-6">
                      <p>{state}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <label>Office Address</label>
                    </div>
                    <div className="col-md-6">
                      <p>{officeAddress}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <label>Home Address</label>
                    </div>
                    <div className="col-md-6">
                      <p>{homeAddress}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <label>Gender</label>
                    </div>
                    <div className="col-md-6">
                      <p>{gender}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Profile;
