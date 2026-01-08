import React, { useState, useEffect, useCallback } from "react";
import { Box, Button, Stack, Breadcrumbs, Link, Typography, Slide, Grid, } from "@mui/material";
import {
  Upload as UploadIcon, DoDisturb as DoDisturbIcon, FileDownload as FileDownloadIcon, KeyboardArrowRight as KeyboardArrowRightIcon,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { postData, getData,ServerURL } from "../../../services/FetchNodeServices";
import OverAllCss from "../../../csss/OverAllCss";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";
import 'rsuite/dist/rsuite.min.css';
import axios from 'axios';
 
 
const MicrowaveAVIATUpload = () => {
  const classes = OverAllCss();
  const navigate = useNavigate();
  const { loading, action } = useLoadingDialog();
 
 
  const [report_File, setReport_File] = useState({ filename: "", bytes: "" });
  const [radio_File, setRadio_File] = useState({ filename: "", bytes: "" });
 
  const [fileData, setFileData] = useState();
  const [download, setDownload] = useState(false);
 
  const [showError, setShowError] = useState({
    budget: false,
    report: false,
    radio: false,
  });
 
 
  const [linkFiles, setLinkFiles] = useState([]);
  const fetchLinkFiles = useCallback(async () => {
    const res = await getData("mw_app/linkfile/");
    if (res?.status && Array.isArray(res.files)) {
      setLinkFiles(res.files);
    } else {
      setLinkFiles([]);
    }
  }, []);
 
  useEffect(() => {
    fetchLinkFiles();
  }, [fetchLinkFiles]);
 
  const handleLinkFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
 
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("link_buget_file", files[i]);
    }
 
    action(true);
    const res = await postData("mw_app/linkfile/", formData);
    action(false);
 
    if (res.status) {
      Swal.fire("Success", "Files Uploaded", "success");
      fetchLinkFiles();
      setShowError((prev) => ({ ...prev, budget: false }));
    } else {
      Swal.fire("Error", res.message, "error");
    }
  };
 
 
  const handleDeleteLinkFiles = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently  link budget file.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d32f2f",
      cancelButtonColor: "#1976d2",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    });
 
    if (!result.isConfirmed) return;
    action(true);
 
    try {
      const res = await fetch(`${ServerURL}/mw_app/linkfile/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
 
      });
 
      const data = await res.json();
 
      if (res.ok && data.status) {
        Swal.fire("Deleted!", "File(s) deleted successfully.", "success");
        setLinkFiles([]);
      } else {
        Swal.fire("Error", data?.message || "Delete failed", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Something went wrong. Please try again.", "error");
      console.error("Delete error:", error);
    } finally {
      action(false);
    }
  };
 
 
 
 
  const updateFile = (event, setFileState, errorKey) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setShowError((prev) => ({ ...prev, [errorKey]: false }));
      setFileState({
        filename: files.length,
        bytes: files,
      });
    }
  };
 
  const handleSubmit = async () => {
    const isValid =
      linkFiles.length > 0 &&
      report_File.bytes.length &&
      radio_File.bytes.length;
 
    if (!isValid) {
      setShowError({
        budget: !linkFiles.length,
        report: !report_File.bytes.length,
        radio: !radio_File.bytes.length,
      });
      return;
    }
 
    action(true);
    const formData = new FormData();
 
    for (let j = 0; j < report_File.bytes.length; j++) {
      formData.append("link_report_file", report_File.bytes[j]);
    }
 
    for (let k = 0; k < radio_File.bytes.length; k++) {
      formData.append("radio_report_file", radio_File.bytes[k]);
    }
 
    const response = await postData("mw_app/microwave/", formData);
    action(false);
 
    if (response.status) {
      setDownload(true);
      setFileData(response.download_url);
      Swal.fire("Done", response.message, "success");
    } else {
      Swal.fire("Oops...", response.message, "error");
    }
  };
 
  const handleCancel = () => {
    setReport_File({ filename: "", bytes: "" });
    setRadio_File({ filename: "", bytes: "" });
    setDownload(false);
    setShowError({ budget: false, report: false, radio: false });
  };
 
  return (
    <>
      <Box m={1} ml={2}>
        <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />}>
          <Link underline="hover" onClick={() => navigate("/tools")}>
            Tools
          </Link>
          <Link underline="hover" onClick={() => navigate("/tools/microwave_soft_at")}>
            Microwave Soft_At
          </Link>
          <Typography color="text.primary">Microwave(AVIAT)</Typography>
        </Breadcrumbs>
      </Box>
 
      <Slide direction="left" in timeout={1000}>
        <Box>
          <Box className={classes.main_Box}>
            <Box className={classes.Back_Box} sx={{ width: { md: "75%", xs: "100%" } }}>
              <Box className={classes.Box_Hading}>
                Make Microwave(AVIAT) Summary
              </Box>
 
              <Stack spacing={2} sx={{ mt: "-40px" }}>
                {/* -------- LINK BUDGET FILE (MULTIPLE) -------- */}
                <Box className={classes.Front_Box}>
                  <div className={classes.Front_Box_Hading}>
                    Select Link Budget File:
                  </div>
 
                  <Grid container alignItems="center" spacing={2}>
                    {/* LEFT → Upload */}
                    <Grid item>
                      <Button variant="contained" component="label">
                        select file
                        <input
                          hidden
                          type="file"
                          multiple
                          onChange={handleLinkFileUpload}
                        />
                      </Button>
                    </Grid>
 
                    {/* CENTER → FILE NAMES */}
                    <Grid item xs>
                      {linkFiles.length > 0 ? (
                        linkFiles.map((file, index) => (
                          <Typography
                            key={index}
                            fontWeight={600}
                            color="green"
                          >
                            {file}
                          </Typography>
                        ))
                      ) : (
                        <Typography color="gray">
                          No file uploaded.
                        </Typography>
                      )}
                    </Grid>
 
                    {/* RIGHT → DELETE */}
                    <Grid item>
                      <Button
                        variant="contained"
                        sx={{ backgroundColor: "red", color: "white" }}
                        disabled={!linkFiles.length}
                        onClick={handleDeleteLinkFiles}
                      >
                        Delete
                      </Button>
                    </Grid>
                  </Grid>
 
                  {showError.budget && (
                    <Typography color="red" fontWeight={600}>
                      This Field Is Required!
                    </Typography>
                  )}
                </Box>
 
 
                <UploadSection
                  label="Select Report Link File"
                  color={report_File.filename ? "warning" : "primary"}
                  onChange={(e) => updateFile(e, setReport_File, "report")}
                  error={showError.report}
                  selectedText={report_File.filename}
                />
 
                <UploadSection
                  label="Select Radio Report File"
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
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleSubmit}
                  endIcon={<UploadIcon />}
                >
                  Submit
                </Button>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "red", color: "white" }}
                  onClick={handleCancel}
                  endIcon={<DoDisturbIcon />}
                >
                  Cancel
                </Button>
              </Stack>
            </Box>
          </Box>
 
          {download && (
            <Box textAlign="center">
              <a href={fileData} download>
                <Button
                  variant="outlined"
                  startIcon={
                    <FileDownloadIcon sx={{ fontSize: 30, color: "green" }} />
                  }
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
  );
};
 
 
const UploadSection = ({
  label,
  color,
  onChange,
  error,
  multiple = true,
  selectedText,
}) => (
  <Box className={OverAllCss().Front_Box}>
    <div className={OverAllCss().Front_Box_Hading}>{label}:</div>
    <div className={OverAllCss().Front_Box_Select_Button}>
      <Button variant="contained" component="label" color={color}>
        Select File
        <input hidden type="file" multiple={multiple} onChange={onChange} />
      </Button>
      {selectedText && (
        <span style={{ color: "green", fontSize: 18, fontWeight: 600, marginLeft: 10 }}>
          No. of Files {selectedText}
        </span>
      )}
      {error && (
        <span style={{ color: "red", fontSize: 18, fontWeight: 600 }}>
          This Field Is Required!
        </span>
      )}
    </div>
  </Box>
);
 
export default MicrowaveAVIATUpload;