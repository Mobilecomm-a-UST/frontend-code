// import React from "react";
import { useState,useEffect } from "react";
import MaterialTable from "@material-table/core";
import { Avatar, TextField, Grid } from "@mui/material";
import { getData,postData,ServerURL } from "../../services/FetchNodeServices";
import { useStyles } from "./DisplayAllVehicleCss";
import { Button } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Swal from "sweetalert2";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useNavigate } from "react-router-dom";


export default function ViewSite(props){
    const classes = useStyles();
    const navigate = useNavigate();
    const [vehicle,setVehicle]=useState([]);
    const[vehicleId,setVehicleId]=useState('');
    const [companyList,setCompanyList]=useState([]);
  const [companyId,setCompanyId]=useState('')
  const [categoryList,setCategoryList]=useState([]);
  const [categoryId,setCategoryId]=useState('')
  const [subcategoryList,setSubcategoryList]=useState([]);
  const [subcategoryId,setSubcategoryId]=useState('')
  const[modelId,setModelId]=useState('')
  const [modelList,setModelList]=useState([])
  const [vendorId,setVendorId]=useState('')
  const [registrationNo,setRegistrationNo]=useState('')
  const [color,setColor]=useState('')
  const [fuelType,setFuelType]=useState('')
  const [rating,setRating]=useState('')
  const [average,setAverage]=useState('')
  const [remarks,setRemarks]=useState('')
  const [capacity,setCapacity]=useState('')
  const [status,setStatus]=useState('')
  const [feature,setFeature]=useState('')
  const [open, setOpen] = useState(false);
  const [pictureButton,setPictureButton]=useState({update:true})
 const [oldPicture, setOldPicture] = useState("");
 const [oldImage,setOldImage] = useState("");

  const[image,setImage]=useState({ filename: "/assets/car.png", bytes: "" });



    const FetchAllVehicle=async()=>
    {
        const response = await getData('vehicle/display_all_vehicle')
        setVehicle(response.result)
    }
    useEffect(function () {
        FetchAllVehicle();
      }, []);





    const  handleSetDataForDialog=(rowData)=>
    {
        setVehicleId(rowData.vehicleid)
        setCategoryId(rowData.categoryid)
        setSubcategoryId(rowData.subcategoryid)
        setCompanyId(rowData.companyid)
        setModelId(rowData.modelid)
        setVendorId(rowData.vendorid)
        setRegistrationNo(rowData.resistrationno)
        setColor(rowData.color)
        setFuelType(rowData.fueltype)
        setRating(rowData.rating)
        setAverage(rowData.average)
        setRemarks(rowData.remarks)
        setCapacity(rowData.capacity)
        setStatus(rowData.status)
        setFeature(rowData.feature)
        setImage({ filename: `${ServerURL}/images/${rowData.image}`, bytes: "" });
    setOldPicture(`${ServerURL}/images/${rowData.image}`);
    setOldImage(rowData.image);
    setOpen(true);
    fetchAllSubcategoryIdByCategory(rowData.categoryid)
    fetchAllCompanyIdBySubcategory(rowData.subcategoryid)
    fetchAllModelIdByCompany(rowData.companyid)


    }

//********************(T A B L E)********************** */
      function DisplayVehicleTable() {
        return (
          <MaterialTable
            title="Display All Vehicle List"
            columns={[
              { title: 'Vehicle ID', field: 'vehicleid' },
              { title: 'Categor', field: 'categoryname' },
              { title: 'Subcategory', field: 'subcategoryname' },
              { title: 'Company', field: 'companyname' },
              { title: 'Model', field: 'modelname' },
              { title: 'Vendor ID', field: 'vendorid' },
              { title: 'Resistration NO.', field: 'resistrationno' },
              { title: 'Color', field: 'color' },
              { title: 'Fueltype', field: 'fueltype' },
              { title: 'Rating', field: 'rating' },
              { title: 'Average', field: 'average' },
              { title: 'Remarks', field: 'remarks' },
              { title: 'Capacity', field: 'capacity' },
              { title: 'Status', field: 'status' },
              { title: 'Feature', field: 'feature' },
              {
                title: "Image",
                field: "image",
                render: (rowData) => (
                  <Avatar
                    src={`${ServerURL}/images/${rowData.image}`}
                    style={{ width: 80, height: 60 }}
                    variant="rounded"
                  />
                ),
              },

            ]}
            data={vehicle}
            actions={[
              {
                icon: 'edit',
                tooltip: 'Edit Vehicle',
                onClick: (event, rowData) => handleSetDataForDialog(rowData),
              },
              {
                icon: 'add',
                tooltip: 'Add Subcategory',
                isFreeAction: true,
                onClick: (event) => navigate('/dashbord/vehicle')
              },
            ]}
            style={{ backgroundColor: "#D0ECE7" }}
          />
        )
      }


        //////////fill CATEGORY DROPDOWN////////////
  const fetchAllCategory=async()=>{
    var result = await getData("category/Display_All_Data")
    setCategoryList(result.data)
  }
  useEffect(function () {
    fetchAllCategory();
  }, []);
  const fillCategoryDropdown = () => {
    return categoryList.map((item) => {
      return (

          <MenuItem value={item.categoryid}>{item.categoryname}</MenuItem>

      );
    });
  };

  const handleChangeCategory=(event)=> {
    setCategoryId(event.target.value);
    fetchAllSubcategoryIdByCategory(event.target.value);
    // alert(categoryId);
  };
  //==============END fill CATEGORY DROPDOWN////////////=============================


  //****************FETCH ALL SUBCATEGORY BY CATEGORY************/
  const fetchAllSubcategoryIdByCategory=async(category_Id)=>
  {
    var formdata={categoryid:category_Id}
    const response = await postData('subcategory/fetch_all_subcategory_by_category',formdata)
    setSubcategoryList(response.result)
  }
  // useEffect(function () {
  //   fetchAllSubcategoryIdByCategory();
  // }, []);

  const fillSubcategoryDropdown = () => {
    return subcategoryList.map((item) => {
      return (

          <MenuItem value={item.subcategoryid}>{item.subcategoryname}</MenuItem>

      );
    });
  };
  const handleChangeSubcategory=(event)=> {
    setSubcategoryId(event.target.value);
    fetchAllCompanyIdBySubcategory(event.target.value)

    alert(event.target.value);
  };
  // *******************END FETCH ALL SUBCATEGORY BY CATEGORY***************************

   //////////fill COMPANY DROPDOWN////////////
   const fetchAllCompanyIdBySubcategory=async(subcategory_Id)=>
   {
     var formdata={subcategoryid:subcategory_Id}
     const response = await postData('company/fetch_all_company_by_subcategory',formdata)
     setCompanyList(response.result)
   }

  const fillCompanyDropdown = () => {
    return companyList.map((item) => {
      return (

          <MenuItem value={item.companyid}>{item.companyname}</MenuItem>

      );
    });
  };

  const handleChangeCompany=(event)=> {
    setCompanyId(event.target.value);
    fetchAllModelIdByCompany(event.target.value)
  };
  // *******************END FETCH ALL COMPANY BY SUBCATEGORY***************************
   //////////fill MODEL DROPDOWN////////////
   const fetchAllModelIdByCompany=async(company_Id)=>
   {
     var formdata={companyid:company_Id}
     const response = await postData('model/fetch_all_model_by_company',formdata)
     setModelList(response.result)
   }

  const fillModelDropdown = () => {
    return modelList.map((item) => {
      return (

          <MenuItem value={item.modelid}>{item.modelname}</MenuItem>

      );
    });
  };

  const handleChangeModel=(event)=> {
    setModelId(event.target.value);
    alert(event.target.value)

  };
  // *******************END FETCH ALL Model BY company***************************


  ////////////////( SELECT COLOR )////////////////////////
  const handleChangeColor=(event)=>{
    setColor(event.target.value)
  }

////////////////( SELECT FUEL TYPE )////////////////////////
  const handleChangeFuel=(event)=>
  {
    setFuelType(event.target.value)
  }

////////////////( SELECT RATING )////////////////////////
  const handleChangeRating=(event)=>
  {
    setRating(event.target.value)
  }
////////////////( SELECT CAPACITY )////////////////////////
  const handleChangeCapacity=(event)=>
  {
    setCapacity(event.target.value)
  }
////////////////( SELECT STATUS )////////////////////////
  const handleChangeStatus=(event)=>
  {
    setStatus(event.target.value)
  }


  const handlePicture = (event) => {
    setImage({
      filename: URL.createObjectURL(event.target.files[0]),
      bytes: event.target.files[0],
    });
    // setPictureButton({update:false})
    setPictureButton({ update: false });
  };

  const handleDiscard = () =>
  {
    setImage({filename: oldPicture,bytes:''})
    setPictureButton({ update: true });
  }

  const handleSave=async()=>
  {
    var formData=new FormData();
    formData.append('vehicleid',vehicleId);
    formData.append('image',image.bytes);
    formData.append("oldimage",oldImage);

  var response = await postData('vehicle/edit_picture',formData)
  if (response.status) {
    Swal.fire({
      icon: "success",
      title: "Down",
      text: "Image Update Successfully",
    });
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Something went wrong!",
    });
  }
  setOpen(false);
  setPictureButton({ update: true });
  FetchAllVehicle();
  }



  /////////////////( SAVE AND DISCARD BUTTON )/////////////////////////
  const handleSaveDiscardButton = () => {
    return (
      <div>
        {pictureButton.update ? (
          <>
            <Button fullWidth variant="contained" component="label">
              Upload
              <input
                hidden
                accept="image/*"
                multiple
                type="file"
                onChange={handlePicture}
              />
            </Button>
          </>
        ) : (
          <>
            <Button color="primary" Click={handleSave}>

              Save
            </Button>
            <Button color="secondary" onClick={handleDiscard}>

              Discard
            </Button>
          </>
        )}
      </div>
    );
  };


  /////////////(     DELETE BUTTON    )////////////////
  const handleDelete=async()=>
  {
    var body  = ({vehicleid:vehicleId,oldimage:oldImage});

    var response = await postData("vehicle/delete_data", body);
    if (response.status) {
      Swal.fire({
        icon: "success",
        title: "Down",
        text: "Delete Row Successfully",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
    setOpen(false);

    FetchAllVehicle();

  }


/////////////(     EDIT BUTTON    )////////////////
const handleEdit=async()=>
{
    var body={categoryid:categoryId,subcategoryid:subcategoryId,companyid:companyId,modelid:modelId,vendorid:vendorId,resistrationno:registrationNo,color:color,fueltype:fuelType,rating:rating,average:average,remarks:remarks,capacity:capacity,status:status,feature:feature,vehicleid
    :vehicleId}

    var response=await postData('vehicle/edit_data',body)

    if (response.status) {
      Swal.fire({
        icon: "success",
        title: "Down",
        text: "Edit Data Successfully",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
    setOpen(false);

    FetchAllVehicle();
}


  const handleClose = () => {
    setOpen(false);
  };


//******************(D I L O G -- B O X)************************** */
       function showDialog()
       {
        return (
            <div>

              <Dialog
                open={open}
                // TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                style={{ borderRadius: 20 }}
              >
                <DialogContent style={{ backgroundColor:"#D0ECE2" }}>
                <div >
                <div >
                 <div >
        <Grid container spacing={2}>
          <Grid item xs={12} className={classes.heading}>

            <h2>

              Vehicle Interface
            </h2>
          </Grid>

          <Grid item xs={3}>                  {/* ===>>>>( CATEGORY DROPDOWN ) */}
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Select Category
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={categoryId}
                label="Select Category"
                onChange={handleChangeCategory}
              >
                {fillCategoryDropdown()}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={3}>              {/* ===>>>>( SUBCATEGORY DROPDOWN ) */}
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Select Subcategory
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={subcategoryId}
                label="Select Subcategory"
                onChange={handleChangeSubcategory}
              >
                {fillSubcategoryDropdown()}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={3}>        {/* ===>>>>( COMPANY DROPDOWN ) */}
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Select Company
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={companyId}
                label="Select Company"
                onChange={handleChangeCompany}
              >
                {fillCompanyDropdown()}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3}>        {/* ===>>>>( MODEL DROPDOWN ) */}
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Select Model
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={modelId}
                label="Select Model"
                onChange={handleChangeModel}
              >
                {fillModelDropdown()}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>  {/*===> ( Vendor Id TEXT FIELD ) */}

          <TextField value={vendorId} label="Vendor Id" fullWidth onChange={(event)=>setVendorId(event.target.value)}/>
          </Grid>
          <Grid item xs={6}>  {/*===> ( Registration No. TEXT FIELD ) */}
          <TextField  value={registrationNo} label="Registration No." fullWidth onChange={(event)=>setRegistrationNo(event.target.value)}/>

          </Grid>
          <Grid item xs={4}>  {/*===> ( Color SELECT ) */}
          <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Select Color</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={color}
                    label="Select Color"
                    onChange={handleChangeColor}
                  >
                    <MenuItem value={'Black'}>Black</MenuItem>
                    <MenuItem value={'white'}>White</MenuItem>
                    <MenuItem value={'Blue'}>Blue</MenuItem>
                    <MenuItem value={'Red'}>Rad</MenuItem>
                    <MenuItem value={'Yellow'}>Yellow</MenuItem>
                  </Select>
                </FormControl>

          </Grid>
          <Grid item xs={4}>  {/*===> ( Fuel Type SELECT) */}
          <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Select Fuel</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={fuelType}
                    label="Select Fuel"
                    onChange={handleChangeFuel}
                  >
                    <MenuItem value={'electric'} style={{color:'green',fontSize:'20px'}} >Electric</MenuItem>
                    <MenuItem value={'petrol'}>Petrol</MenuItem>
                    <MenuItem value={'diesel'}>Diesel</MenuItem>
                    <MenuItem value={'CNG'}>CNG</MenuItem>

                  </Select>
                </FormControl>

          </Grid>
          <Grid item xs={4}>  {/*===> ( Rating SELECTER ) */}

          <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Select Rating</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={rating}
                    label="Select Rating"
                    onChange={handleChangeRating}
                  >
                    <MenuItem value={1}>&#9733;</MenuItem>
                    <MenuItem value={2}>&#9733;&#9733;</MenuItem>
                    <MenuItem value={3}>&#9733;&#9733;&#9733;</MenuItem>
                    <MenuItem value={4}>&#9733;&#9733;&#9733;&#9733;</MenuItem>
                    <MenuItem value={5}>&#11088;&#11088;&#11088;&#11088;&#11088;</MenuItem>

                  </Select>
                </FormControl>
          </Grid>

          <Grid item xs={4}>  {/*===> ( CAPACITY SELECT) */}
          <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Select Capacity</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={capacity}
                    label="Select Capacity"
                    onChange={handleChangeCapacity}
                  >
                    <MenuItem value={2} >2 Seater</MenuItem>
                    <MenuItem value={4}>4 Seater</MenuItem>
                    <MenuItem value={6}>6 Seater</MenuItem>
                    <MenuItem value={7}> 7 Seater</MenuItem>

                  </Select>
                </FormControl>

          </Grid>
          <Grid item xs={4}>  {/*===> ( STATUS SELECT) */}
          <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Select Status</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={status}
                    label="Select Status"
                    onChange={handleChangeStatus}
                  >
                    <MenuItem value={1} >Available</MenuItem>
                    <MenuItem value={0}>Unavailable</MenuItem>
                  </Select>
                </FormControl>

          </Grid>
          <Grid item xs={4}>  {/*===> ( FEATURE TEXT FIELD ) */}

          <TextField  value={feature} label="Feature" fullWidth onChange={(event)=>setFeature(event.target.value)}/>
          </Grid>

          <Grid item xs={6}>  {/*===> ( Average TEXT FIELD ) */}

          <TextField  value={average} label="Average" fullWidth onChange={(event)=>setAverage(event.target.value)}/>
          </Grid>
          <Grid item xs={6}>  {/*===> ( Remark TEXT FIELD ) */}

          <TextField value={remarks}  label="Remarke" fullWidth onChange={(event)=>setRemarks(event.target.value)}/>
          </Grid>

          <Grid item xs={6} className={classes.center}>{/*===> ( UPLOAD BUTTON ) */}

            {handleSaveDiscardButton()}

          </Grid>
          <Grid item xs={6} className={classes.center}>
            {" "}
            {/*===> ( SHOW IMAGE ICON ) */}
            <Avatar
              variant="rounded"
              alt="model icon"
              src={image.filename}
              sx={{ width: 70, height: 66 }}
            />
          </Grid>

          <Grid item xs={6}>
            <Button variant="contained"  fullWidth onClick={handleEdit}>

              Edit
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button  variant="contained" fullWidth onClick={handleDelete}>

              Delete
            </Button>
          </Grid>
        </Grid>
      </div>
    </div>
    </div>

    </DialogContent>
              </Dialog>
            </div>
          );
       }


      return (
        <>
        {/* <div><Home/></div> */}
        <div className={classes.center}>
          <div className={classes.display_box}>
            {showDialog()}
            {DisplayVehicleTable()}
          </div>
        </div>
        </>
      );


}