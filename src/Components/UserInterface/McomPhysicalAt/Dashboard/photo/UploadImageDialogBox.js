import React, { useEffect, useRef, useState } from "react";
import { Box, Button, CardActions, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, MenuItem, Select } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { usePost } from "../../../../Hooks/PostApis";

const UploadImageDialogBox = (type) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [watermarkedImage, setWatermarkedImage] = useState(null);
  const [watermarkedFile, setWatermarkedFile] = useState(null);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [imgNo, setImgNo] = useState('');
  const [sector, setSector] = useState('');
  const canvasRef = useRef(null);
  const {makePostRequest} =  usePost()


  console.log('type', type, watermarkedFile);


  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    console.log('file', file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result); // Set selected image
        addWatermark(e.target.result);    // Add watermark automatically
      };
      reader.readAsDataURL(file);
    }
  };

  const dataURLToBlob = (dataURL) => {
    const parts = dataURL.split(',');
    const mime = parts[0].match(/:(.*?);/)[1];
    const bstr = atob(parts[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const addWatermark = (imageSrc) => {
    if (!imageSrc) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      // Set canvas size to match the image
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the original image on the canvas
      ctx.drawImage(img, 0, 0);

      // Define watermark details
      const today = new Date().toLocaleString();

      // Set watermark text styles
      ctx.font = "22px Arial";
      ctx.fillStyle = "rgba(255, 255, 255, 1)"; // White color
      ctx.textAlign = "right";

      // Add watermark text to bottom-right corner
      const margin = 10;
      const x = canvas.width - margin;
      const y = canvas.height - margin;

      ctx.fillText(latitude, x, y - 60); // Add latitude
      ctx.fillText(longitude, x, y - 30); // Add longitude
      ctx.fillText(today, x, y); // Add today's date

      const quality = 0.8; // Compression quality (0.0 to 1.0)
      let dataURL = canvas.toDataURL("image/jpeg", quality);

      // Ensure the size is under 2MB
      while (dataURL.length > 2 * 1024 * 1024) {
        dataURL = canvas.toDataURL("image/jpeg", quality - 0.1);
      }

      // Convert the dataURL to a File object
      const blob = dataURLToBlob(dataURL);
      const file = new File([blob], "watermarked-image.jpg", { type: "image/jpeg" });
      setWatermarkedFile(file); // Store the file for backend upload

      // Get the watermarked image as a data URL
      const watermarkedDataURL = canvas.toDataURL("image/jpeg", 0.8); // Adjust quality if needed
      setWatermarkedImage(watermarkedDataURL);
    };

    img.src = imageSrc;
  };

  const handleClose = () => {

  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (['S1', 'S3', 'S4', 'S6', 'S11', 'S16', 'S18', 'S26'].includes(type?.selectedType?.Ishort)) {
      if (imgNo && watermarkedFile) {
        let formData = new FormData();
        formData.append('sr_no', '123456789');
        formData.append('image_key', `${type?.selectedType?.Ishort}_${imgNo}`);
        formData.append('path',watermarkedFile);
        formData.append('number', imgNo);
        formData.append('sector',sector );
        formData.append('block', type?.selectedType?.Ishort);
        formData.append('data', '');

        const response = await makePostRequest('Physical_At/add-image-data/', formData)
        console.log('responce', response)


      }else{
        alert('Please fill all the fields')
      }

    } else if (['S2', 'S12', 'S13', 'S14', 'S17', 'S19', 'S23', 'S24', 'S25', 'S28', 'S29'].includes(type?.selectedType?.Ishort)) {
      
    }
    else {
      if (imgNo && watermarkedFile && sector) {
        let formData = new FormData();
        formData.append('sr_no', '123456789');
        formData.append('image_key', `${type?.selectedType?.Ishort}_${sector}_${imgNo}`);
        formData.append('path',watermarkedFile);
        formData.append('number', imgNo);
        formData.append('sector',sector );
        formData.append('block',  type?.selectedType?.Ishort);
        formData.append('data', '');

        const response = await makePostRequest('Physical_At/add-image-data/', formData)
        console.log('responce', response)


      }else{
        alert('Please fill all the fields')
      }

    }
  };

  const handleChange = (event) => {

  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLatitude(`Latitude: ${position.coords.latitude.toFixed(4)}°`);
      setLongitude(`Longitude: ${position.coords.longitude.toFixed(4)}°`);
    });

    return () => {
      console.log("Component unmounted");
      setWatermarkedImage(null);
      setWatermarkedFile(null);
    };

  }, []);


  if (
    ['S1', 'S3', 'S4', 'S6', 'S11', 'S16', 'S18', 'S26'].includes(type?.selectedType?.Ishort)
  ) {
    return (<>
      <Dialog
        open={type.showImages}
        fullWidth
        maxWidth='md'
        BackdropProps={{
          style: { backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(3px)' },
        }}
      >
        <DialogTitle>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3>{type?.selectedType?.Ishort}</h3><p style={{ fontSize: '16px', paddingLeft: '10px', paddingRight: '10px' }}>{type?.selectedType?.title}</p>
            <div>
              <IconButton aria-label="delete" size="small" title="Close" onClick={type?.closeDialog}>
                <CloseIcon fontSize="inherit" />
              </IconButton></div>
          </div>
        </DialogTitle>
        <DialogContent>
          {watermarkedImage && (
            <>
              {/* <h3>Watermarked Image:</h3> */}
              <img
                src={watermarkedImage}
                alt="Watermarked"
                style={{ maxWidth: "700px", marginTop: "10px", textAlign: 'center' }}
              />
              {/* <a href={watermarkedImage} download="watermarked-image.png">
                        Download Image
                    </a> */}
            </>
          )}
        </DialogContent>
        <DialogActions style={{ display: 'flex', justifyContent: 'center' }}>
          <form onSubmit={handleSubmit}>
            <Box style={{ display: "flex", gap: '10px', }}>

              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Image No.</InputLabel>
                <Select size='small' variant='outlined' required name='number' label='Image No.' fullWidth onChange={(event)=>{setImgNo(event.target.value)}}>
                  <MenuItem value='1' >1</MenuItem>
                  <MenuItem value='2' >2</MenuItem>
                  <MenuItem value='3' >3</MenuItem>
                  <MenuItem value='4' >4</MenuItem>
                  <MenuItem value='5' >5</MenuItem>
                  <MenuItem value='6' >6</MenuItem>
                  <MenuItem value='7' >7</MenuItem>
                  <MenuItem value='8' >8</MenuItem>
                  <MenuItem value='9' >9</MenuItem>
                  <MenuItem value='10' >10</MenuItem>
                </Select>
              </FormControl>
              <TextField size='small' variant='outlined' required name='path' type='file' label='Select Image' accept="image/*" onChange={handleImageUpload} fullWidth InputLabelProps={{ shrink: true }} />
              <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

              <Button type='submit' variant='contained' size='small' style={{ padding: '0px 50px' }}>upload</Button>
            </Box>
          </form>

        </DialogActions>
      </Dialog>
    </>)
  } else if (
    ['S2', 'S12', 'S13', 'S14', 'S17', 'S19', 'S23', 'S24', 'S25', 'S28', 'S29'].includes(type?.selectedType?.Ishort)
  ) {
    return (<>
      <Dialog
        open={type.showImages}
        fullWidth
        maxWidth='md'
        BackdropProps={{
          style: { backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(3px)' },
        }}
      >
        <DialogTitle>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3>{type?.selectedType?.Ishort}</h3><p style={{ fontSize: '16px', paddingLeft: '10px', paddingRight: '10px' }}>{type?.selectedType?.title}</p>
            <div>
              <IconButton aria-label="delete" size="small" title="Close" onClick={type?.closeDialog}>
                <CloseIcon fontSize="inherit" />
              </IconButton></div>
          </div>
        </DialogTitle>
        <DialogContent>
          {watermarkedImage && (
            <>
              {/* <h3>Watermarked Image:</h3> */}
              <img
                src={watermarkedImage}
                alt="Watermarked"
                style={{ maxWidth: "700px", marginTop: "10px", textAlign: 'center' }}
              />
              {/* <a href={watermarkedImage} download="watermarked-image.png">
                        Download Image
                    </a> */}
            </>
          )}
        </DialogContent>
        <DialogActions style={{ display: 'flex', justifyContent: 'center' }}>
          <form onSubmit={handleSubmit}>
            <Box style={{ display: "flex", gap: '10px', }}>
              <TextField size='small' variant='outlined' required name='path' type='file' label='Select Image' accept="image/*" onChange={handleImageUpload} fullWidth InputLabelProps={{ shrink: true }} />
              <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
              <Button type='submit' variant='contained' size='small' style={{ padding: '0px 50px' }}>upload</Button>
            </Box>
          </form>

        </DialogActions>
      </Dialog>
    </>)
  } else {
    return (<>
      <Dialog
        open={type.showImages}
        fullWidth
        maxWidth='md'
        BackdropProps={{
          style: { backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(3px)' },
        }}
      >
        <DialogTitle>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3>{type?.selectedType?.Ishort}</h3><p style={{ fontSize: '16px', paddingLeft: '10px', paddingRight: '10px' }}>{type?.selectedType?.title}</p>
            <div>
              <IconButton aria-label="delete" size="small" title="Close" onClick={type?.closeDialog}>
                <CloseIcon fontSize="inherit" />
              </IconButton></div>
          </div>
        </DialogTitle>
        <DialogContent>
          {watermarkedImage && (
            <>
              {/* <h3>Watermarked Image:</h3> */}
              <img
                src={watermarkedImage}
                alt="Watermarked"
                style={{ maxWidth: "700px", marginTop: "10px", textAlign: 'center' }}
              />
              {/* <a href={watermarkedImage} download="watermarked-image.png">
                        Download Image
                    </a> */}
            </>
          )}
        </DialogContent>
        <DialogActions style={{ display: 'flex', justifyContent: 'center' }}>
          <form onSubmit={handleSubmit}>
            <Box style={{ display: "flex", gap: '10px', }}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Sector</InputLabel>
                <Select size='small' variant='outlined' required name='number' onChange={(event)=>{setSector(event.target.value)}} label='Sector' fullWidth>
                  <MenuItem value='a' >1</MenuItem>
                  <MenuItem value='b' >2</MenuItem>
                  <MenuItem value='c' >3</MenuItem>
                  <MenuItem value='d' >4</MenuItem>
                  <MenuItem value='e' >5</MenuItem>
                  <MenuItem value='f' >6</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Image No.</InputLabel>
                <Select size='small' variant='outlined' required name='number' label='Image No.' onChange={(event)=>{setImgNo(event.target.value)}} fullWidth>
                  <MenuItem value='1' >1</MenuItem>
                  <MenuItem value='2' >2</MenuItem>
                  <MenuItem value='3' >3</MenuItem>
                  <MenuItem value='4' >4</MenuItem>
                  <MenuItem value='5' >5</MenuItem>
                  <MenuItem value='6' >6</MenuItem>
                  <MenuItem value='7' >7</MenuItem>
                  <MenuItem value='8' >8</MenuItem>
                  <MenuItem value='9' >9</MenuItem>
                  <MenuItem value='10' >10</MenuItem>
                </Select>
              </FormControl>
              <TextField size='small' variant='outlined' required name='path' type='file' label='Select Image' accept="image/*" onChange={handleImageUpload} fullWidth InputLabelProps={{ shrink: true }} />
              <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
            

              <Button type='submit' variant='contained' size='small' style={{ padding: '0px 50px' }}>upload</Button>
            </Box>
          </form>

        </DialogActions>
      </Dialog>
    </>)
  }
}

export default React.memo(UploadImageDialogBox)