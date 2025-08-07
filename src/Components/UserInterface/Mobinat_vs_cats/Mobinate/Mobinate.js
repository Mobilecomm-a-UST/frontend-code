import React, { useState, useEffect, useCallback } from "react";
import {
  Box, Button, Stack, Breadcrumbs, Link, Typography, Slide,Grid
} from "@mui/material";
import {
  Upload as UploadIcon,
  DoDisturb as DoDisturbIcon,
  FileDownload as FileDownloadIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import TopicIcon from '@mui/icons-material/Topic';
import { postData, ServerURL } from "../../../services/FetchNodeServices";
import OverAllCss from "../../../csss/OverAllCss";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";
import { getData } from "../../../services/FetchNodeServices";

const Mobinate = () => {
  // const [mobinateDump, setMobinateDump] = useState([]);
  const [siteList, setSiteList] = useState({ filename: "", bytes: "" });
  const [hardWareFile, setHardWareFile] = useState({ filename: "", bytes: "" });
  const [fileData, setFileData] = useState();
  const [download, setDownload] = useState(false);
  const [showFiles, setShoweFiles] = useState([])
  const [showError, setShowError] = useState({
    // mobinate: false,
    siteList: false,
    hardware: false,
  });

  const { loading, action } = useLoadingDialog();
  const navigate = useNavigate();
  const classes = OverAllCss();

  const link = `${ServerURL}${fileData}`;


  const fetchMobinetFileData = async () => {
    action(true)

    const response = await getData('mobinate_vs_cats/mobinet_dump/');

    if (response.status) {
      action(false);
      setShoweFiles(response.files);

    }
    // console.log('mobinate dump file ' , response)
  }

  const updateFile = (event, setFileState, errorKey) => {
    const file = event.target.files[0];
    if (file) {
      setShowError((prev) => ({ ...prev, [errorKey]: false }));
      setFileState({ filename: file.name, bytes: file });
    }
  };

  const handleSubmit = async () => {
    const isValid =
      // mobinateDump.length > 0 &&
      siteList.filename ;

    if (!isValid) {
      setShowError({
        // mobinate: mobinateDump.length === 0,
        siteList: !siteList.filename,
      });
      return;
    }

    action(true);
    const formData = new FormData();
    // Array.from(mobinateDump).forEach((file) => {
    //   formData.append("log_files", file);
    // });
    formData.append("site_list", siteList.bytes);
    formData.append("hw_file", hardWareFile.bytes);

    const response = await postData("mobinate_vs_cats/mobinate/", formData);
    action(false);

    if (response.status) {
      setDownload(true);
      setFileData(response.download_url);
      Swal.fire({ icon: "success", title: "Done", text: response.message });
    } else {
      Swal.fire({ icon: "error", title: "Oops...", text: response.message });
    }
  };

  const handleCancel = () => {
    // setMobinateDump([]);
    setSiteList({ filename: "", bytes: "" });
    setHardWareFile({ filename: "", bytes: "" });
    setDownload(false);
    setShowError({ siteList: false, hardware: false });
  };

  useEffect(() => {
    const title = window.location.pathname
      .slice(1)
      .replaceAll("_", " ")
      .replaceAll("/", " | ")
      .toUpperCase();
    document.title = title;

    fetchMobinetFileData();
  }, []);

  return (
    <>
      <Box m={1} ml={2}>
        <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />}>
          <Link underline="hover" onClick={() => navigate("/tools")}>Tools</Link>
          <Link underline="hover" onClick={() => navigate("/tools/mobinet_vs_cats")}>Mobinet Vs CATS</Link>
          <Typography color="text.primary">Mobinet</Typography>
        </Breadcrumbs>
      </Box>

      <Slide direction="left" in timeout={1000}>
        <Box>
          <Box className={classes.main_Box}>
            <Box className={classes.Back_Box} sx={{ width: { md: "75%", xs: "100%" } }}>
              <Box className={classes.Box_Hading}>Make Mobinet Summary</Box>

              <Stack spacing={2} sx={{ mt: "-40px" }}>
                {/* Mobinate Dump */}
                {/* <UploadSection
                  label="Select Mobinet Dump Files"
                  color={mobinateDump.length > 0 ? "warning" : "primary"}
                  multiple
                  onChange={(e) => {
                    setMobinateDump(Array.from(e.target.files))
                    setShowError((prev) => ({ ...prev, mobinate: false }));
                  }}
                  error={showError.mobinate}
                  selectedText={mobinateDump.length > 0 ? `Selected File(s): ${mobinateDump.length}` : ""}
                /> */}
                <Box className={OverAllCss().Front_Box}>
                  <div className={OverAllCss().Front_Box_Hading}>Mobinet Dump Files:</div>
                  <div className={OverAllCss().Front_Box_Select_Button}>
                      <Grid container rowSpacing={1} columnSpacing={1} direction={{ xs: "column", sm: "column", md: "row" }}>
                            {showFiles.map((item, index) => (
                                <Grid item xs={6} key={index}>
                                    <Box key={item} sx={{ display: "flex", justifyContent: 'flex-start', alignItems: 'center',fontWeight:'bold' }}>
                                        <TopicIcon sx={{ color: '#FEA405' }} />{item}
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
               
                  </div>
                </Box>

                {/* Site List */}
                <UploadSection
                  label="Select Site List File"
                  color={siteList.filename ? "warning" : "primary"}
                  onChange={(e) => updateFile(e, setSiteList, "siteList")}
                  error={showError.siteList}
                  selectedText={siteList.filename}
                />

                {/* Hardware File */}
                <UploadSection
                  label="Select Hardware File"
                  color={hardWareFile.filename ? "warning" : "primary"}
                  onChange={(e) => updateFile(e, setHardWareFile, "hardware")}
                  error={showError.hardware}
                  selectedText={hardWareFile.filename}
                />
              </Stack>

              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                justifyContent="space-around"
                mt={2}
              >
                <Button variant="contained" color="success" onClick={handleSubmit} endIcon={<UploadIcon />}>Submit</Button>
                <Button variant="contained" onClick={handleCancel} sx={{ backgroundColor: "red", color: "white" }} endIcon={<DoDisturbIcon />}>Cancel</Button>
              </Stack>
            </Box>
          </Box>

          {download && (
            <Box textAlign="center">
              <a href={fileData} download>
                <Button
                  variant="outlined"
                  startIcon={<FileDownloadIcon sx={{ fontSize: 30, color: "green" }} />}
                  sx={{ mt: 2, textTransform: "none", fontWeight: 800, fontSize: "22px", fontFamily: "Poppins" }}
                >
                  Mobinet Report
                </Button>
              </a>
            </Box>
          )}
        </Box>
      </Slide>

      {loading}
    </>
  );
};

const UploadSection = ({ label, color, onChange, error, multiple = false, selectedText }) => {
  return (
    <Box className={OverAllCss().Front_Box}>
      <div className={OverAllCss().Front_Box_Hading}>{label}:</div>
      <div className={OverAllCss().Front_Box_Select_Button}>
        <Button variant="contained" component="label" color={color}>
          Select File
          <input
            hidden
            required
            type="file"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            multiple={multiple}
            onChange={onChange}
          />
        </Button>
        {selectedText && (
          <span style={{ color: "green", fontSize: 18, fontWeight: 600, marginLeft: 10 }}>
            {selectedText}
          </span>
        )}
        {error && (
          <div>
            <span style={{ color: "red", fontSize: 18, fontWeight: 600 }}>This Field Is Required!</span>
          </div>
        )}
      </div>
    </Box>
  );
};

export default Mobinate;
