import React, { useState, useRef, useMemo, useCallback } from 'react'
import Upload from './photo/Upload'
import AddWatermark from './photo/AddWatermark';
import { Box, Button, CardActions, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, MenuItem,Select } from '@mui/material';
import Slide from '@mui/material/Slide';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import CellTowerIcon from '@mui/icons-material/CellTower';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import UploadImageDialogBox from './photo/UploadImageDialogBox';
import _ from 'lodash'
import { usePost } from '../../../Hooks/PostApis';




const ImageShort = [
  { id: 1, Ishort: 'S1', title: 'Cabinet is properly mounted & secured on wall/pole and acceciable to technician.' },
  { id: 2, Ishort: 'S2', title: 'IP 55 Cabinet Filter( whereever appicable) are in place and properly cleaned.' },
  { id: 3, Ishort: 'S3', title: 'Base Station is securely installed & is perfect at Horizontal/vertical position.' },
  { id: 4, Ishort: 'S4', title: 'IP seals /plugs must be installed in all module.' },
  { id: 5, Ishort: 'S5', title: 'RRU Installation Showing GND Jumper Clamping Weather Proofing & Labeling.' },
  { id: 6, Ishort: 'S6', title: ' BBU and DCDU are grounded to EGB or Tower leg ' },
  { id: 7, Ishort: 'S7', title: ' 1st sector RRU is grounded and the grounding cable of RRUs...' },
  { id: 8, Ishort: 'S8', title: ' RRU power cables are arranged in neat and straight way without any crossing.' },
  { id: 9, Ishort: 'S9', title: ' CPRI - FO Cable looped in ring at least 2-3 times at RRU end.' },
  { id: 10, Ishort: 'S10', title: 'CPRI/eCPRI - All FO Cable extra length kept/fixed safely (Sector wise) ' },
  { id: 11, Ishort: 'S11', title: 'CPRI/eCPRI Routing at AMOB/ACOC end (Labelling should be clearly Visible) ' },
  { id: 12, Ishort: 'S12', title: ' CPRI/eCPRI connectivity at ABIx end in AMOB/AMIA' },
  { id: 13, Ishort: 'S13', title: ' Invertor Make and Model (Small Cell)' },
  { id: 14, Ishort: 'S14', title: ' The Optical / Ethernet Lan cables are routed and connected securely at BBU ' },
  { id: 15, Ishort: 'S15', title: ' sector RRU are arranged in neat and straight way...' },
  { id: 16, Ishort: 'S16', title: ' Cables are routed properly inside and outside the cabinet and bound with ties with uniform spacing & moderate tightness ' },
  { id: 17, Ishort: 'S17', title: ' Conduit used for Fiber cable properly ' },
  { id: 18, Ishort: 'S18', title: ' GPS antenna and cable installed properly.' },
  { id: 19, Ishort: 'S19', title: ' TMA/Combiner/Duplexer/Triplexer' },
  { id: 20, Ishort: 'S20', title: ' Obstructions if any ( Optimization purpose) Antenna Clamp should not be blocked to allow Antenna for proper optimization (+/-30 Degree) ' },
  { id: 21, Ishort: 'S21', title: ' GGSM Installation Showing Jumper Weather Proofing & Labeling ' },
  { id: 22, Ishort: 'S22', title: ' Site access is safe and as per OHS.' },
  { id: 23, Ishort: 'S23', title: ' EMF Signage Board' },
  { id: 24, Ishort: 'S24', title: ' Site Clean' },
  { id: 25, Ishort: 'S25', title: ' Complete Site View' },
  { id: 26, Ishort: 'S26', title: ' Submit Photograph of Alarm patch panel showing alarm extension ( Both cable from BTS and INFRA and interconnection) and labelling on both side in Physical AT' },
  { id: 27, Ishort: 'S27', title: ' 1st Sector GSM Installation Make and Model' },
  { id: 28, Ishort: 'S28', title: 'Cable entry FODA end (Closed View Labelling should be clearly Visible)' },
  { id: 29, Ishort: 'S29', title: ' Cable connectivity inside FODA (Open View) ' },


]

const testingData = {
  "S1": [
    {
      "key": "S1_1",
      "data": null,
      "block": "S1",
      "sector": "",
      "number": "1",
      "Path": "/i/common1/iDeploy_Data/Physical_AT_Prod/images/SRNO/AT-89860/S1_1.jpeg"
    }
  ],
  "S2": [
    {
      "data": null,
      "block": "",
      "sector": "",
      "number": "",
      "Path": ""
    }
  ],
  "S3": [
    {
      "key": "S3_1",
      "data": null,
      "block": "S3",
      "sector": "",
      "number": "1",
      "Path": "/i/common1/iDeploy_Data/Physical_AT_Prod/images/SRNO/AT-89860/S3_1.jpeg"
    },
    {
      "key": "S3_2",
      "data": null,
      "block": "S3",
      "sector": "",
      "number": "2",
      "Path": "/i/common1/iDeploy_Data/Physical_AT_Prod/images/SRNO/AT-89860/S3_2.jpeg"
    }
  ],
  "S4": [
    {
      "key": "S4_1",
      "data": null,
      "block": "S4",
      "sector": "",
      "number": "1",
      "Path": "/i/common1/iDeploy_Data/Physical_AT_Prod/images/SRNO/AT-89860/S4_1.jpeg"
    }
  ],
  "S5": [
    {
      "key": "S5_a_1",
      "data": null,
      "block": "S5",
      "sector": "a",
      "number": "1",
      "Path": "/i/common1/iDeploy_Data/Physical_AT_Prod/images/SRNO/AT-89860/S5_a_1.jpeg"
    },
    {
      "key": "S5_a_2",
      "data": null,
      "block": "S5",
      "sector": "a",
      "number": "2",
      "Path": "/i/common1/iDeploy_Data/Physical_AT_Prod/images/SRNO/AT-89860/S5_a_2.jpeg"
    },
    {
      "key": "S5_a_3",
      "data": null,
      "block": "S5",
      "sector": "a",
      "number": "3",
      "Path": "/i/common1/iDeploy_Data/Physical_AT_Prod/images/SRNO/AT-89860/S5_a_3.jpeg"
    },
    {
      "key": "S5_b_1",
      "data": null,
      "block": "S5",
      "sector": "b",
      "number": "1",
      "Path": "/i/common1/iDeploy_Data/Physical_AT_Prod/images/SRNO/AT-89860/S5_b_1.jpeg"
    },
    {
      "key": "S5_b_2",
      "data": null,
      "block": "S5",
      "sector": "b",
      "number": "2",
      "Path": "/i/common1/iDeploy_Data/Physical_AT_Prod/images/SRNO/AT-89860/S5_b_2.jpeg"
    },
    {
      "key": "S5_b_3",
      "data": null,
      "block": "S5",
      "sector": "b",
      "number": "3",
      "Path": "/i/common1/iDeploy_Data/Physical_AT_Prod/images/SRNO/AT-89860/S5_b_3.jpeg"
    },
    {
      "key": "S5_c_1",
      "data": null,
      "block": "S5",
      "sector": "c",
      "number": "1",
      "Path": "/i/common1/iDeploy_Data/Physical_AT_Prod/images/SRNO/AT-89860/S5_c_1.jpeg"
    },
    {
      "key": "S5_c_2",
      "data": null,
      "block": "S5",
      "sector": "c",
      "number": "2",
      "Path": "/i/common1/iDeploy_Data/Physical_AT_Prod/images/SRNO/AT-89860/S5_c_2.jpeg"
    },
    {
      "key": "S5_c_3",
      "data": null,
      "block": "S5",
      "sector": "c",
      "number": "3",
      "Path": "/i/common1/iDeploy_Data/Physical_AT_Prod/images/SRNO/AT-89860/S5_c_3.jpeg"
    }
  ],
  "S6": [
    {
      "key": "S6_1",
      "data": null,
      "block": "S6",
      "sector": "",
      "number": "1",
      "Path": "/i/common1/iDeploy_Data/Physical_AT_Prod/images/SRNO/AT-89860/S6_1.jpeg"
    },
    {
      "key": "S6_2",
      "data": null,
      "block": "S6",
      "sector": "",
      "number": "2",
      "Path": "/i/common1/iDeploy_Data/Physical_AT_Prod/images/SRNO/AT-89860/S6_2.jpeg"
    }
  ],
  "S7": [
    {
      "key": "S7_a_1",
      "data": null,
      "block": "S7",
      "sector": "a",
      "number": "1",
      "Path": "/i/common1/iDeploy_Data/Physical_AT_Prod/images/SRNO/AT-89860/S7_a_1.jpeg"
    },
    {
      "key": "S7_a_2",
      "data": null,
      "block": "S7",
      "sector": "a",
      "number": "2",
      "Path": "/i/common1/iDeploy_Data/Physical_AT_Prod/images/SRNO/AT-89860/S7_a_2.jpeg"
    },
    {
      "key": "S7_a_3",
      "data": null,
      "block": "S7",
      "sector": "a",
      "number": "3",
      "Path": "/i/common1/iDeploy_Data/Physical_AT_Prod/images/SRNO/AT-89860/S7_a_3.jpeg"
    },
    {
      "key": "S7_b_1",
      "data": null,
      "block": "S7",
      "sector": "b",
      "number": "1",
      "Path": "/i/common1/iDeploy_Data/Physical_AT_Prod/images/SRNO/AT-89860/S7_b_1.jpeg"
    },
    {
      "key": "S7_b_2",
      "data": null,
      "block": "S7",
      "sector": "b",
      "number": "2",
      "Path": "/i/common1/iDeploy_Data/Physical_AT_Prod/images/SRNO/AT-89860/S7_b_2.jpeg"
    },
    {
      "key": "S7_b_3",
      "data": null,
      "block": "S7",
      "sector": "b",
      "number": "3",
      "Path": "/i/common1/iDeploy_Data/Physical_AT_Prod/images/SRNO/AT-89860/S7_b_3.jpeg"
    },
    {
      "key": "S7_c_1",
      "data": null,
      "block": "S7",
      "sector": "c",
      "number": "1",
      "Path": "/i/common1/iDeploy_Data/Physical_AT_Prod/images/SRNO/AT-89860/S7_c_1.jpeg"
    },
    {
      "key": "S7_c_2",
      "data": null,
      "block": "S7",
      "sector": "c",
      "number": "2",
      "Path": "/i/common1/iDeploy_Data/Physical_AT_Prod/images/SRNO/AT-89860/S7_c_2.jpeg"
    },
    {
      "key": "S7_c_3",
      "data": null,
      "block": "S7",
      "sector": "c",
      "number": "3",
      "Path": "/i/common1/iDeploy_Data/Physical_AT_Prod/images/SRNO/AT-89860/S7_c_3.jpeg"
    }
  ],
  "S8": [
    {
      "key": "S8_a_1",
      "data": null,
      "block": "S8",
      "sector": "a",
      "number": "1",
      "Path": "/i/common1/iDeploy_Data/Physical_AT_Prod/images/SRNO/AT-89860/S8_a_1.jpeg"
    }
  ],
  "S9": [
    {
      "key": "S9_a_1",
      "data": null,
      "block": "S9",
      "sector": "a",
      "number": "1",
      "Path": "/i/common1/iDeploy_Data/Physical_AT_Prod/images/SRNO/AT-89860/S9_a_1.jpeg"
    },
    {
      "key": "S9_a_2",
      "data": null,
      "block": "S9",
      "sector": "a",
      "number": "2",
      "Path": "/i/common1/iDeploy_Data/Physical_AT_Prod/images/SRNO/AT-89860/S9_a_2.jpeg"
    },
    {
      "key": "S9_a_3",
      "data": null,
      "block": "S9",
      "sector": "a",
      "number": "3",
      "Path": "/i/common1/iDeploy_Data/Physical_AT_Prod/images/SRNO/AT-89860/S9_a_3.jpeg"
    },
    {
      "key": "S9_b_1",
      "data": null,
      "block": "S9",
      "sector": "b",
      "number": "1",
      "Path": "/i/common1/iDeploy_Data/Physical_AT_Prod/images/SRNO/AT-89860/S9_b_1.jpeg"
    },
    {
      "key": "S9_b_2",
      "data": null,
      "block": "S9",
      "sector": "b",
      "number": "2",
      "Path": "/i/common1/iDeploy_Data/Physical_AT_Prod/images/SRNO/AT-89860/S9_b_2.jpeg"
    },
    {
      "key": "S9_b_3",
      "data": null,
      "block": "S9",
      "sector": "b",
      "number": "3",
      "Path": "/i/common1/iDeploy_Data/Physical_AT_Prod/images/SRNO/AT-89860/S9_b_3.jpeg"
    },
    {
      "key": "S9_c_1",
      "data": null,
      "block": "S9",
      "sector": "c",
      "number": "1",
      "Path": "/i/common1/iDeploy_Data/Physical_AT_Prod/images/SRNO/AT-89860/S9_c_1.jpeg"
    },
    {
      "key": "S9_c_2",
      "data": null,
      "block": "S9",
      "sector": "c",
      "number": "2",
      "Path": "/i/common1/iDeploy_Data/Physical_AT_Prod/images/SRNO/AT-89860/S9_c_2.jpeg"
    },
    {
      "key": "S9_c_3",
      "data": null,
      "block": "S9",
      "sector": "c",
      "number": "3",
      "Path": "/i/common1/iDeploy_Data/Physical_AT_Prod/images/SRNO/AT-89860/S9_c_3.jpeg"
    }
  ],
  "S10": [
    {
      "data": null,
      "block": "",
      "sector": "",
      "number": "",
      "Path": ""
    }
  ],
  "S11": [
    {
      "data": null,
      "block": "",
      "sector": "",
      "number": "",
      "Path": ""
    }
  ],
  "S12": [
    {
      "data": null,
      "block": "",
      "sector": "",
      "number": "",
      "Path": ""
    }
  ],
  "S13": [
    {
      "key": "S13",
      "data": null,
      "block": "S13",
      "sector": "",
      "number": "",
      "Path": "/i/common1/iDeploy_Data/Physical_AT_Prod/images/SRNO/AT-89860/S13.jpeg"
    }
  ],
  "S14": [
    {
      "key": "S14",
      "data": null,
      "block": "S14",
      "sector": "",
      "number": "",
      "Path": "/i/common1/iDeploy_Data/Physical_AT_Prod/images/SRNO/AT-89860/S14.jpeg"
    }
  ],
  "S15": [
    {
      "key": "S15_a_1",
      "data": null,
      "block": "S15",
      "sector": "a",
      "number": "1",
      "Path": "/i/common1/iDeploy_Data/Physical_AT_Prod/images/SRNO/AT-89860/S15_a_1.jpeg"
    },
    {
      "key": "S15_b_1",
      "data": null,
      "block": "S15",
      "sector": "b",
      "number": "1",
      "Path": "/i/common1/iDeploy_Data/Physical_AT_Prod/images/SRNO/AT-89860/S15_b_1.jpeg"
    },
    {
      "key": "S15_c_1",
      "data": null,
      "block": "S15",
      "sector": "c",
      "number": "1",
      "Path": "/i/common1/iDeploy_Data/Physical_AT_Prod/images/SRNO/AT-89860/S15_c_1.jpeg"
    }
  ],
  "S16": [
    {
      "key": "S16_1",
      "data": null,
      "block": "S16",
      "sector": "",
      "number": "1",
      "Path": "/i/common1/iDeploy_Data/Physical_AT_Prod/images/SRNO/AT-89860/S16_1.jpeg"
    },
    {
      "key": "S16_2",
      "data": null,
      "block": "S16",
      "sector": "",
      "number": "2",
      "Path": "/i/common1/iDeploy_Data/Physical_AT_Prod/images/SRNO/AT-89860/S16_2.jpeg"
    }
  ],
  "S17": [
    {
      "data": null,
      "block": "",
      "sector": "",
      "number": "",
      "Path": ""
    }
  ],
  "S18": [
    {
      "key": "S18_1",
      "data": null,
      "block": "S18",
      "sector": "",
      "number": "1",
      "Path": "/i/common1/iDeploy_Data/Physical_AT_Prod/images/SRNO/AT-89860/S18_1.jpeg"
    }
  ],
  "S19": [
    {
      "data": null,
      "block": "",
      "sector": "",
      "number": "",
      "Path": ""
    }
  ],
  "S20": [
    {
      "key": "S20_a_1",
      "data": null,
      "block": "S20",
      "sector": "a",
      "number": "1",
      "Path": "/i/common1/iDeploy_Data/Physical_AT_Prod/images/SRNO/AT-89860/S20_a_1.jpeg"
    },
    {
      "key": "S20_b_1",
      "data": null,
      "block": "S20",
      "sector": "b",
      "number": "1",
      "Path": "/i/common1/iDeploy_Data/Physical_AT_Prod/images/SRNO/AT-89860/S20_b_1.jpeg"
    },
    {
      "key": "S20_c_1",
      "data": null,
      "block": "S20",
      "sector": "c",
      "number": "1",
      "Path": "/i/common1/iDeploy_Data/Physical_AT_Prod/images/SRNO/AT-89860/S20_c_1.jpeg"
    }
  ],
  "S21": [
    {
      "key": "S21_a_1",
      "data": null,
      "block": "S21",
      "sector": "a",
      "number": "1",
      "Path": "/i/common1/iDeploy_Data/Physical_AT_Prod/images/SRNO/AT-89860/S21_a_1.jpeg"
    },
    {
      "key": "S21_a_2",
      "data": null,
      "block": "S21",
      "sector": "a",
      "number": "2",
      "Path": "/i/common1/iDeploy_Data/Physical_AT_Prod/images/SRNO/AT-89860/S21_a_2.jpeg"
    },
    {
      "key": "S21_b_1",
      "data": null,
      "block": "S21",
      "sector": "b",
      "number": "1",
      "Path": "/i/common1/iDeploy_Data/Physical_AT_Prod/images/SRNO/AT-89860/S21_b_1.jpeg"
    },
    {
      "key": "S21_b_2",
      "data": null,
      "block": "S21",
      "sector": "b",
      "number": "2",
      "Path": "/i/common1/iDeploy_Data/Physical_AT_Prod/images/SRNO/AT-89860/S21_b_2.jpeg"
    },
    {
      "key": "S21_c_1",
      "data": null,
      "block": "S21",
      "sector": "c",
      "number": "1",
      "Path": "/i/common1/iDeploy_Data/Physical_AT_Prod/images/SRNO/AT-89860/S21_c_1.jpeg"
    },
    {
      "key": "S21_c_2",
      "data": null,
      "block": "S21",
      "sector": "c",
      "number": "2",
      "Path": "/i/common1/iDeploy_Data/Physical_AT_Prod/images/SRNO/AT-89860/S21_c_2.jpeg"
    }
  ],
  "S22": [
    {
      "data": null,
      "block": "",
      "sector": "",
      "number": "",
      "Path": ""
    }
  ],
  "S23": [
    {
      "data": null,
      "block": "",
      "sector": "",
      "number": "",
      "Path": ""
    }
  ],
  "S24": [
    {
      "data": null,
      "block": "",
      "sector": "",
      "number": "",
      "Path": ""
    }
  ],
  "S25": [
    {
      "data": null,
      "block": "",
      "sector": "",
      "number": "",
      "Path": ""
    }
  ],
  "S26": [
    {
      "data": null,
      "block": "",
      "sector": "",
      "number": "",
      "Path": ""
    }
  ],
  "S27": [
    {
      "data": null,
      "block": "",
      "sector": "",
      "number": "",
      "Path": ""
    }
  ],
  "S28": [
    {
      "data": null,
      "block": "",
      "sector": "",
      "number": "",
      "Path": ""
    }
  ],
  "S29": [
    {
      "data": null,
      "block": "",
      "sector": "",
      "number": "",
      "Path": ""
    }
  ]
}


const Photograph = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [showImages, setShowImages] = useState(false)
  const [selectedType, setSelectedType] = useState(null);
  const { makePostRequest } = usePost()
  const [formDatas, setFormDatas] = useState({
    sr_no: 'AT-89348',
    image_key: 'S1_1',
    path: {},
    number: '',
    sector: '',
    block: 'S1',
    data: ''
  })
  const [images, setImages] = useState({ filename: "", bytes: "" });
  const [noImages, setNoImages] = useState('');
  const containerRef = useRef(null);


  console.log('error solvingf data' , formDatas)


 const handleImageData = (e)=>{
  setImages({
    filename: e.target.files[0].name,
    bytes: e.target.files[0],
    state: true

  })
 }

  const handleSubmit = async (e) => {
    e.preventDefault();

    let formData = new FormData();
    formData.append('sr_no', formData.sr_no);
    formData.append('image_key', formData.image_key);
    formData.append('path', images.bytes);
    formData.append('number', noImages);
    formData.append('sector', formData.sector);
    formData.append('block', formData.block);
    formData.append('data', formData.data);

    const response = await makePostRequest('Physical_At/add-image-data/', formData)
    console.log('responce', response)

  }

  const handleChange = (e) => {
    const { name, value } = e.target;

      setFormDatas({
        ...formDatas,
        [name]: value,
      });

  }



  



  const handleImages = (type) => {
    console.log('Selected type:', type);
    if (
      ['S1', 'S3', 'S4', 'S6', 'S11', 'S16', 'S18', 'S26'].includes(type.Ishort)
    ) {
      return (<>
        <Dialog
          open={showImages}
          fullWidth
          maxWidth='md'
          BackdropProps={{
            style: { backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(3px)' },
          }}
        >
          <DialogTitle>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h3>{type.Ishort}</h3>
              <div>
                <IconButton aria-label="delete" size="small" title="Close" onClick={() => { handleClose(); }}>
                  <CloseIcon fontSize="inherit" />
                </IconButton></div>
            </div>
          </DialogTitle>
          <DialogContent>
            ifdsdhhsdiufhisdhfiuhi
          </DialogContent>
          <DialogActions style={{ display: 'flex', justifyContent: 'center' }}>
            <form onSubmit={handleSubmit}>
              <Box style={{ display: "flex", gap: '10px', }}>
                <TextField size='small' variant='outlined' required name='path' onChange={handleImageData} type='file' label='Select Image' fullWidth InputLabelProps={{ shrink: true }} />
                <Select size='small' variant='outlined' required name='number' onChange={(e)=>{setNoImages(e.target.value)}} label='Image No.' fullWidth>
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
                <Button type='submit' variant='contained' size='small' style={{ padding: '0px 50px' }}>upload</Button>
              </Box>
            </form>

          </DialogActions>
        </Dialog>
      </>)
    } else if (
      ['S2', 'S12', 'S13', 'S14', 'S17', 'S19', 'S23', 'S24', 'S25', 'S28', 'S29'].includes(type.Ishort)
    ) {
      return (<>
        <Dialog
          open={showImages}
          fullWidth
          maxWidth='md'
          BackdropProps={{
            style: { backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(3px)' },
          }}
        >
          <DialogTitle>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h3>{type.Ishort}</h3>
              <div>
                <IconButton aria-label="delete" size="small" title="Close" onClick={() => { handleClose(); }}>
                  <CloseIcon fontSize="inherit" />
                </IconButton></div>
            </div>
          </DialogTitle>
          <DialogContent>
            ifdsdhhsdiufhisdhfiuhi
          </DialogContent>
        </Dialog>
      </>)
    } else {
      return (<>
        <Dialog
          open={showImages}
          fullWidth
          maxWidth='md'
          BackdropProps={{
            style: { backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(3px)' },
          }}
        >
          <DialogTitle>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h3>{type.Ishort}</h3>
              <div>
                <IconButton aria-label="delete" size="small" title="Close" onClick={() => { handleClose(); }}>
                  <CloseIcon fontSize="inherit" />
                </IconButton></div>
            </div>
          </DialogTitle>
          <DialogContent>
            ifdsdhhsdiufhisdhfiuhi
          </DialogContent>
        </Dialog>
      </>)
    }
  };

  const handleClose = () => {
    setShowImages(false)
    setSelectedType(null)
  }


  React.useEffect(() => {
    // Debugging to check if ref is working
    console.log('containerRef:', containerRef.current);
  }, [containerRef]);

  return (
    <>
      <Box ref={containerRef}>
        {/* <Slide direction="left" in={!showImages} mountOnEnter unmountOnExit style={{ transformOrigin: '0 0 0' }} timeout={1000} container={containerRef.current || document.body}> */}
        <Grid container rowSpacing={2} columnSpacing={2} direction={{ xs: "column", sm: "column", md: "row" }} >
          {ImageShort.map((item, index) => {
            let block = _.get(testingData, item.Ishort, []);
            // console.log('testing data', block);

            return (
              <React.Fragment key={index}>
                {/* Render the main ImageShort item */}
                <Grid item xs={3}>
                  <Card
                    sx={{ maxWidth: 345 }}
                    onClick={(e) => {
                      setShowImages(true);
                      setSelectedType(item);
                    }}
                  >
                    <CardActionArea>
                      <div style={{ textAlign: 'center' }}>
                        <AddPhotoAlternateIcon title='Add New Image' style={{ fontSize: '80px' }} />
                      </div>
                      <CardContent style={{ height: 140, overflow: 'hidden' }}>
                        <Typography gutterBottom variant="h5" component="div">
                          {item.Ishort}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: 'text.secondary' }}
                        >
                          {item.title}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>

                {/* Render the nested block items */}
                {block.map((blockItem, blockIndex) => (
                  <Grid item xs={3} key={`${index}-${blockIndex}`}>
                    <Card
                      sx={{ maxWidth: 345 }}
                    >

                      <CellTowerIcon />
                      <CardContent style={{ height: 140, overflow: 'hidden' }}>
                        <Typography gutterBottom variant="h5" component="div">

                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: 'text.secondary' }}
                        >
                          {blockItem.block}: {blockItem.sector ? `Sector ${blockItem.sector}.` : ''} {blockItem.number ? `Image No. ${blockItem.number}-` : ''} {item.title}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <IconButton title='Accepted'><ThumbUpOffAltIcon style={{ color: 'green' }} /></IconButton>
                        <IconButton title='Rejected'><ThumbDownOffAltIcon style={{ color: 'red' }} /></IconButton>
                      </CardActions>

                    </Card>
                  </Grid>
                ))}
              </React.Fragment>
            );
          })}
        </Grid>
        {/* </Slide> */}

        {/* <Slide in={showImages} direction="right" mountOnEnter unmountOnExit style={{ transformOrigin: '0 0 0' }} timeout={1000} container={containerRef.current || document.body}>
          <Box> */}
        {/* {selectedType && handleImages(selectedType)} */}
        {showImages && <UploadImageDialogBox showImages={showImages} selectedType={selectedType} closeDialog={handleClose} />}
        
        {/* </Box>
        </Slide> */}
      </Box>
    </>

  )
}

export default Photograph