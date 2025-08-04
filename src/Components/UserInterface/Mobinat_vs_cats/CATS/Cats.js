import React, { useState, useEffect, useCallback } from "react";
import {
  Box, Button, Stack, Breadcrumbs, Link, Typography, Slide
} from "@mui/material";
import {
  Upload as UploadIcon,
  DoDisturb as DoDisturbIcon,
  FileDownload as FileDownloadIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { postData, ServerURL } from "../../../services/FetchNodeServices";
import OverAllCss from "../../../csss/OverAllCss";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

const Cats = () => {
    const [mobinateDump, setMobinateDump] = useState({ filename: "", bytes: "" });
      const [siteList, setSiteList] = useState({ filename: "", bytes: "" });
      const [hardWareFile, setHardWareFile] = useState({ filename: "", bytes: "" });
      const [olmidFile, setOlmidFile] = useState({ filename: "", bytes: "" });
      const [rfsFile , setRfsFile] = useState({ filename: "", bytes: "" });
      const [msmfFile , setMsmfFile] = useState({filename:'' , bytes:''});
      const [stockFile , setStockFile] = useState({filename:'' , bytes:''})
      const [locaterFiles , setLocaterFiles] = useState([])
      const [fileData, setFileData] = useState();
      const [download, setDownload] = useState(false);
    
      const [showError, setShowError] = useState({
        mobinate: false,
        siteList: false,
        hardware: false,
        olmId: false,
        rfs:false,
        msmf:false,
        stock:false,
        locater:false
      });
    
      const { loading, action } = useLoadingDialog();
      const navigate = useNavigate();
      const classes = OverAllCss();
    
      const link = `${ServerURL}${fileData}`;
    
      const updateFile = (event, setFileState, errorKey) => {
        const file = event.target.files[0];
        if (file) {
          setShowError((prev) => ({ ...prev, [errorKey]: false }));
          setFileState({ filename: file.name, bytes: file }); 
        }
      };
    
      const handleSubmit = async () => {
        const isValid =
          mobinateDump.filename &&
          siteList.filename &&
          hardWareFile.filename &&
          olmidFile.filename && 
          rfsFile.filename && 
          msmfFile.filename &&
          stockFile.filename ;
    
        if (!isValid) {
          setShowError({
            // mobinate: mobinateDump.length === 0,
            mobinate: !mobinateDump.filename,
            siteList: !siteList.filename,
            hardware: !hardWareFile.filename,
            olmId: !olmidFile.filename,
            rfs:!rfsFile.filename,
            msmf:!msmfFile.filename,
            stock:!stockFile.filename,
          });
          return;
        }
    
        action(true); 
        const formData = new FormData();
        // locaterFiles.forEach((file) => formData.append("locator_file", file));
           Array.from(locaterFiles).forEach((file) => {
      formData.append("locator_file", file);
    });
        formData.append("mobinet_dump_file",mobinateDump.bytes)
        formData.append("site_list_file", siteList.bytes);
        formData.append("hw_file", hardWareFile.bytes);
        formData.append("olm_id_file", olmidFile.bytes);
        formData.append("rfs_file" ,rfsFile.bytes );
        formData.append("msmf_file" , msmfFile.bytes );
        formData.append("stock_report_file" , stockFile)
    
        const response = await postData("mobinate_vs_cats/cats/", formData);
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
        setMobinateDump({ filename: "", bytes: "" });
        setSiteList({ filename: "", bytes: "" });
        setHardWareFile({ filename: "", bytes: "" });
        setOlmidFile({ filename: "", bytes: "" });
        setRfsFile({ filename: "", bytes: "" });
        setMsmfFile({ filename: "", bytes: "" });
        setStockFile({ filename: "", bytes: "" });
        setDownload(false);
        setShowError({ mobinate: false, siteList: false, hardware: false });
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
            <Link underline="hover" onClick={() => navigate("/tools/mobinate_vs_cats")}>Mobinate Vs CATS</Link>
            <Typography color="text.primary">CATS</Typography>
          </Breadcrumbs>
        </Box>
  
        <Slide direction="left" in timeout={1000}>
          <Box>
            <Box className={classes.main_Box}>
              <Box className={classes.Back_Box} sx={{ width: { md: "75%", xs: "100%" } }}>
                <Box className={classes.Box_Hading}>Make CATS Summary Data</Box>
  
                <Stack spacing={2} sx={{ mt: "-40px" }}>
                  {/* Mobinate Dump */}
                  <UploadSection
                    label="Select Mobinate Tool Files"
                    color={mobinateDump.filename ? "warning" : "primary"}
                    // multiple
                    // onChange={(e) => {
                    //   setMobinateDump(e.target.files[0]);
                    //   setShowError((prev) => ({ ...prev, mobinate: false }));
                    // }}
                    onChange={(e) => updateFile(e, setMobinateDump, "mobinateDump")}
                    error={showError.mobinate}
                    selectedText={mobinateDump.filename}
                  />
  
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

                   {/* OLM ID File */}
                  <UploadSection
                    label="Select OLM ID File"
                    color={olmidFile.filename ? "warning" : "primary"}
                    onChange={(e) => updateFile(e, setOlmidFile, "olmidFile")}
                    error={showError.olmId}
                    selectedText={olmidFile.filename}
                  />

                    {/* RFS File */}
                  <UploadSection
                    label="Select RFS File"
                    color={rfsFile.filename ? "warning" : "primary"}
                    onChange={(e) => updateFile(e, setRfsFile, "rfsFile")}
                    error={showError.olmId}
                    selectedText={rfsFile.filename}
                  />

                  
                    {/* MS-MF File */}
                  <UploadSection
                    label="Select MS-MF File"
                    color={msmfFile.filename ? "warning" : "primary"}
                    onChange={(e) => updateFile(e, setMsmfFile, "msmfFile")}
                    error={showError.olmId}
                    selectedText={msmfFile.filename}
                  />
                    {/* Stock File */}
                  <UploadSection
                    label="Select Stock File"
                    color={stockFile.filename ? "warning" : "primary"}
                    onChange={(e) => updateFile(e, setStockFile, "stockFile")}
                    error={showError.olmId}
                    selectedText={stockFile.filename}
                  />

                   {/* Locater files Dump */}
                <UploadSection
                  label="Select Locator Files"
                  color={locaterFiles.length > 0 ? "warning" : "primary"}
                  multiple
                  onChange={(e) => {
                    // setLocaterFiles(e.target.files);
                    setLocaterFiles(Array.from(e.target.files))
                    setShowError((prev) => ({ ...prev, locater: false }));
                  }}
                  error={showError.mobinate}
                  selectedText={locaterFiles.length > 0 ? `Selected File(s): ${locaterFiles.length}` : ""}
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
                   CATS Overall Summary Report
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

export default Cats