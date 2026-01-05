import React, { useState, useEffect, useCallback } from "react";
import {
  Box, Button, Stack, Breadcrumbs, Link, Typography, Slide, Grid
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

const MicrowaveAVIATUpload = () => {
   // const [mobinateDump, setMobinateDump] = useState([]);
    const [budget_File, setBudget_File] = useState({ filename: "", bytes: "" });
    const [report_File, setReport_File] = useState({ filename: "", bytes: "" });
    const [radio_File, setRadio_File] = useState({ filename: "", bytes: "" });
    
    const [fileData, setFileData] = useState();
    const [download, setDownload] = useState(false);
    const [showFiles, setShoweFiles] = useState([])
    const [showError, setShowError] = useState({
      // mobinate: false,
      budget: false,
      report: false,
      radio: false,
    });

    const { loading, action } = useLoadingDialog();
    const navigate = useNavigate();
    const classes = OverAllCss();
  
    const link = `${ServerURL}${fileData}`;
  
  
    const updateFile = (event, setFileState, errorKey) => {
      const file = event.target.files;
      console.log('file length ',  file, file.length)
      if (file) {
        setShowError((prev) => ({ ...prev, [errorKey]: false }));
        setFileState({ filename: file.length, bytes: file });
      }
    };
  
    const handleSubmit = async () => {
      const isValid =  budget_File.filename && report_File.filename && radio_File.filename;

      if (!isValid) {
        setShowError({
          // mobinate: mobinateDump.length === 0,
          budget: !budget_File.filename,
          report: !report_File.filename,
          radio: !radio_File.filename,
        });
        return;
      }
  
      action(true);
      const formData = new FormData();
      // Array.from(mobinateDump).forEach((file) => {
      //   formData.append("log_files", file);
      // });
       for (let i = 0; i < budget_File.bytes.length; i++) {
            formData.append("link_buget_file", budget_File.bytes[i]);
       }
       for(let j=0;j<report_File.bytes.length;j++){
              formData.append("link_report_file", report_File.bytes[j]);
       }
       for(let k=0;k<radio_File.bytes.length;k++){
        
        formData.append("radio_report_file", radio_File.bytes[k]);
       }

  


      const response = await postData("mw_app/microwave/", formData);
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
      setBudget_File({ filename: "", bytes: "" });
      setReport_File({ filename: "", bytes: "" });
      setRadio_File({ filename: "", bytes: "" });
      setDownload(false);
      setShowError({ budget: false, report: false, radio: false });
    };
  
    useEffect(() => {
      const title = window.location.pathname
        .slice(1)
        .replaceAll("_", " ")
        .replaceAll("/", " | ")
        .toUpperCase();
      document.title = title;
  
    }, []);
  return (
    <>
      <Box m={1} ml={2}>
        <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />}>
          <Link underline="hover" onClick={() => navigate("/tools")}>Tools</Link>
          <Link underline="hover" onClick={() => navigate("/tools/microwave_soft_at")}>Microwave Soft_At</Link>
          <Typography color="text.primary">Microwave(AVIAT)</Typography>
        </Breadcrumbs>
      </Box>

      <Slide direction="left" in timeout={1000}>
        <Box>
          <Box className={classes.main_Box}>
            <Box className={classes.Back_Box} sx={{ width: { md: "75%", xs: "100%" } }}>
              <Box className={classes.Box_Hading}>Make Microwave(AVIAT) Summary</Box>

              <Stack spacing={2} sx={{ mt: "-40px" }}>
  

                {/* Budget file */}
                <UploadSection
                  label="Select Budget File"
                  color={budget_File.filename ? "warning" : "primary"}
                  onChange={(e) => updateFile(e, setBudget_File, "budget")}
                  error={showError.budget}
                  selectedText={budget_File.filename}
                />

                {/* Report File */}
                <UploadSection
                  label="Select Report File"
                  color={report_File.filename ? "warning" : "primary"}
                  onChange={(e) => updateFile(e, setReport_File, "report")}
                  error={showError.report}
                  selectedText={report_File.filename}
                />

                {/* Radio File */}
                <UploadSection
                  label="Select Radio File"
                  color={radio_File.filename ? "warning" : "primary"}
                  onChange={(e) => updateFile(e, setRadio_File, "radio")}
                  error={showError.radio}
                  selectedText={radio_File.filename}
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
                 Download Microwave(AVIAT) Report
                </Button>
              </a>
            </Box>
          )}
        </Box>
      </Slide>

      {loading}
    </>
  )
}

const UploadSection = ({ label, color, onChange, error, multiple = true, selectedText }) => {
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
          No. of Files  {selectedText}
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

export default MicrowaveAVIATUpload;
