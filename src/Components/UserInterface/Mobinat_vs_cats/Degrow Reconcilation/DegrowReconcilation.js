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
import TopicIcon from '@mui/icons-material/Topic';
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { postData, getData, ServerURL } from "../../../services/FetchNodeServices";
import OverAllCss from "../../../csss/OverAllCss";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

const DegrowReconciliation = () => {
  // Only two user-selected uploads on this screen: Degrow Report File and
  // Hardware File. Manual File has been removed entirely (not needed here).
  const [degrowFile, setDegrowFile] = useState({ filename: "", bytes: "" });
  const [hardWareFile, setHardWareFile] = useState({ filename: "", bytes: "" });
  const [fileData, setFileData] = useState();
  const [fileData1, setFileData1] = useState(); // ✅ NEW: RSF MS-MF report (download_url1)
  const [download, setDownload] = useState(false);
  // showFiles carries the read-only lists shown on the page (RFS, MS-MF,
  // Locator, MO VS CAP).
  const [showFiles, setShoweFiles] = useState({
    locator: [],
    stock: [],
    msmf: [],
    rfs: [],
    moVsCap: [],
  });

  const [showError, setShowError] = useState({
    degrow: false,
    hardware: false,
  });

  const { loading, action } = useLoadingDialog();
  const navigate = useNavigate();
  const classes = OverAllCss();

  const link = `${ServerURL}${fileData}`;
  const link1 = `${ServerURL}${fileData1}`; // ✅ NEW

  const updateFile = (event, setFileState, errorKey) => {
    const file = event.target.files[0];
    if (file) {
      setShowError((prev) => ({ ...prev, [errorKey]: false }));
      setFileState({ filename: file.name, bytes: file });
    }
  };

  const fetchMobinetFileData = async () => {
    action(true)

    const response1 = await getData('mobinate_vs_cats/rfs/');
    const response2 = await getData('mobinate_vs_cats/msmf/');
    const response3 = await getData('mobinate_vs_cats/stock/');
    const response4 = await getData('mobinate_vs_cats/locator/');
    const response6 = await getData('mobinate_vs_cats/mo_vs_cap/');

    action(false);
    setShoweFiles({
      locator: response4?.files ? response4?.files : [],
      stock: response3?.files ? response3?.files : [],
      msmf: response2?.files ? response2?.files : [],
      rfs: response1?.files ? response1?.files : [],
      moVsCap: response6?.files ? response6?.files : [],
    })
  }

  const handleSubmit = async () => {
    const isValid =
      degrowFile.filename &&
      hardWareFile.filename;

    if (!isValid) {
      setShowError({
        degrow: !degrowFile.filename,
        hardware: !hardWareFile.filename,
      });
      return;
    }

    action(true);
    const formData = new FormData();
    formData.append("deg_file", degrowFile.bytes);
    formData.append("hw_file", hardWareFile.bytes);

    const response = await postData("mobinate_vs_cats/degrow_dismental/", formData);
    action(false);

    if (response.status) {
      setDownload(true);
      setFileData(response.download_url);
      setFileData1(response.download_url1); // ✅ NEW: RSF MS-MF Report
      Swal.fire({ icon: "success", title: "Done", text: response.message });
    } else {
      Swal.fire({ icon: "error", title: "Oops...", text: response.message });
    }
  };

  const handleCancel = () => {
    setDegrowFile({ filename: "", bytes: "" });
    setHardWareFile({ filename: "", bytes: "" });
    setDownload(false);
    setFileData(); // ✅ NEW
    setFileData1(); // ✅ NEW
    setShowError({ degrow: false, hardware: false });
  };

  useEffect(() => {
    const title = window.location.pathname
      .slice(1)
      .replaceAll("_", " ")
      .replaceAll("/", " | ")
      .toUpperCase();
    document.title = title;
    fetchMobinetFileData()
  }, []);
  return (
    <>
      <Box m={1} ml={2}>
        <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />}>
          <Link underline="hover" onClick={() => navigate("/tools")}>Tools</Link>
          <Link underline="hover" onClick={() => navigate("/tools/mobinet_vs_cats")}>Mobinet Vs CATS</Link>
          <Typography color="text.primary">Degrow Reconcilation</Typography>
        </Breadcrumbs>
      </Box>

      <Slide direction="left" in timeout={1000}>
        <Box>
          <Box className={classes.main_Box}>
            <Box className={classes.Back_Box} sx={{ width: { md: "75%", xs: "100%" } }}>
              <Box className={classes.Box_Hading}>Degrow Reconcilation</Box>

              <Stack spacing={2} sx={{ mt: "-40px" }}>
                {/* Degrow Report File */}
                <UploadSection
                  label="Select Degrow Report File"
                  color={degrowFile.filename ? "warning" : "primary"}
                  onChange={(e) => updateFile(e, setDegrowFile, "degrow")}
                  error={showError.degrow}
                  selectedText={degrowFile.filename}
                />

                {/* Hardware File */}
                <UploadSection
                  label="Select Hardware File"
                  color={hardWareFile.filename ? "warning" : "primary"}
                  onChange={(e) => updateFile(e, setHardWareFile, "hardware")}
                  error={showError.hardware}
                  selectedText={hardWareFile.filename}
                />

                {/* RFS File (read-only list) */}
                <Box className={OverAllCss().Front_Box}>
                  <div className={OverAllCss().Front_Box_Hading}>RFS File :</div>
                  <div className={OverAllCss().Front_Box_Select_Button}>
                    <Grid container rowSpacing={1} columnSpacing={1} direction={{ xs: "column", sm: "column", md: "row" }}>
                      {showFiles?.rfs.map((item, index) => (
                        <Grid item xs={6} key={index}>
                          <Box key={item} sx={{ display: "flex", justifyContent: 'flex-start', alignItems: 'center', fontWeight: 'bold' }}>
                            <TopicIcon sx={{ color: '#FEA405' }} />{item}
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </div>
                </Box>

                {/* MS-MF File (read-only list) */}
                <Box className={OverAllCss().Front_Box}>
                  <div className={OverAllCss().Front_Box_Hading}>MS-MF File :</div>
                  <div className={OverAllCss().Front_Box_Select_Button}>
                    <Grid container rowSpacing={1} columnSpacing={1} direction={{ xs: "column", sm: "column", md: "row" }}>
                      {showFiles?.msmf.map((item, index) => (
                        <Grid item xs={6} key={index}>
                          <Box key={item} sx={{ display: "flex", justifyContent: 'flex-start', alignItems: 'center', fontWeight: 'bold' }}>
                            <TopicIcon sx={{ color: '#FEA405' }} />{item}
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </div>
                </Box>

                {/* Locator Files (read-only list) */}
                <Box className={OverAllCss().Front_Box}>
                  <div className={OverAllCss().Front_Box_Hading}>Locator Files :</div>
                  <div className={OverAllCss().Front_Box_Select_Button}>
                    <Grid container rowSpacing={1} columnSpacing={1} direction={{ xs: "column", sm: "column", md: "row" }}>
                      {showFiles?.locator.map((item, index) => (
                        <Grid item xs={6} key={index}>
                          <Box key={item} sx={{ display: "flex", justifyContent: 'flex-start', alignItems: 'center', fontWeight: 'bold' }}>
                            <TopicIcon sx={{ color: '#FEA405' }} />{item}
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </div>
                </Box>

                {/* MO VS CAP File (read-only list) */}
                <Box className={OverAllCss().Front_Box}>
                  <div className={OverAllCss().Front_Box_Hading}>MO VS CAP File :</div>
                  <div className={OverAllCss().Front_Box_Select_Button}>
                    {showFiles?.moVsCap.length > 0 ? (
                      <Grid container rowSpacing={1} columnSpacing={1} direction={{ xs: "column", sm: "column", md: "row" }}>
                        {showFiles?.moVsCap.map((item, index) => (
                          <Grid item xs={6} key={index}>
                            <Box key={item} sx={{ display: "flex", justifyContent: 'flex-start', alignItems: 'center', fontWeight: 'bold' }}>
                              <TopicIcon sx={{ color: '#FEA405' }} />{item}
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    ) : (
                      <Typography color="gray" fontSize={14}>No files found.</Typography>
                    )}
                  </div>
                </Box>
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

          {/* ✅ Two report links: Reco Summary Report (download_url) + RSF MS-MF Report (download_url1) */}
          {download && (
            <Box textAlign="center">
              <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="center" alignItems="center" mt={2}>

                {fileData && (
                  <a href={fileData} download>
                    <Button
                      variant="outlined"
                      startIcon={<FileDownloadIcon sx={{ fontSize: 30, color: "green" }} />}
                      sx={{ textTransform: "none", fontWeight: 800, fontSize: "22px", fontFamily: "Poppins" }}
                    >
                      Degrow Reco Report
                    </Button>
                  </a>
                )}

                {/* {fileData1 && (
                  <a href={fileData1} download>
                    <Button
                      variant="outlined"
                      startIcon={<FileDownloadIcon sx={{ fontSize: 30, color: "green" }} />}
                      sx={{ textTransform: "none", fontWeight: 800, fontSize: "22px", fontFamily: "Poppins" }}
                    >
                      RSF MS-MF Report
                    </Button>
                  </a>
                )} */}

              </Stack>
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

export default DegrowReconciliation