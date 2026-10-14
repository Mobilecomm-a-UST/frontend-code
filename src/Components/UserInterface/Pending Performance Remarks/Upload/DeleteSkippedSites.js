
import React, { useState, useEffect } from "react";
import {
    Box, Button, Stack, Breadcrumbs, Link, Typography, Slide,
    TextField,
} from "@mui/material";
import {
    DeleteForever as DeleteForeverIcon,
    DoDisturb as DoDisturbIcon,
    KeyboardArrowRight as KeyboardArrowRightIcon,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ServerURL } from "../../../services/FetchNodeServices";
import OverAllCss from "../../../csss/OverAllCss";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";
import { getDecreyptedData } from "../../../utils/localstorage";

const deleteData = async (url, payload = {}) => {
    try {
        var response = await axios.delete(`${ServerURL}/${url}`, {
            headers: { Authorization: `token ${getDecreyptedData("tokenKey")}` },
            ...payload
        });
        var result = await response.data;
        return (result);
    } catch (e) {
        console.log(e);
        return (null);
    }
};

const DeleteSkippedSites = () => {
    const { loading, action } = useLoadingDialog();
    const navigate = useNavigate();
    const classes = OverAllCss();

    // ======== STATE MANAGEMENT ========
    const [siteIds, setSiteIds] = useState("");
    const [atRefNos, setAtRefNos] = useState("");

    // ======== PERFORM DELETE ========
    const performDelete = async () => {
        action(true);

        try {
            const siteIdsArray = siteIds
                .split(/[\n,]+/)
                .map((s) => s.trim())
                .filter(Boolean);

            const atRefNosArray = atRefNos
                .split(/[\n,]+/)
                .map((s) => s.trim())
                .filter(Boolean);

            const requestData = {};

            if (siteIdsArray.length > 0) {
                requestData.site_id = siteIdsArray;
            }

            if (atRefNosArray.length > 0) {
                requestData.at_ref_no = atRefNosArray;
            }

            const response = await deleteData("pending_performance_at_remarks/deletess/", {
                data: requestData
            });

            action(false);

            if (response?.status) {
                Swal.fire({
                    icon: "success",
                    title: "Deleted",
                    text: response.message || "Records deleted successfully.",
                    confirmButtonColor: "#198754",
                });

                setSiteIds("");
                setAtRefNos("");
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: response?.message || "Something went wrong.",
                    confirmButtonColor: "#d32f2f",
                });
            }

        } catch (error) {
            action(false);

            Swal.fire({
                icon: "error",
                title: "Error",
                text: error?.message || "Unable to delete records.",
                confirmButtonColor: "#d32f2f",
            });
        }
    };

    // ======== HANDLE DELETE CLICK ========
    const handleDeleteClick = () => {
        if (!siteIds.trim() && !atRefNos.trim()) {
            Swal.fire({
                icon: "warning",
                title: "No Data Entered",
                text: "Please enter at least one Site ID or AT Reference No to delete.",
                confirmButtonColor: "#ffc107",
            });
            return;
        }

        Swal.fire({
            icon: "warning",
            title: "Are you sure?",
            html: `This will permanently delete the matched skipped records. This action cannot be undone.`,
            showCancelButton: true,
            confirmButtonText: "Yes, delete it",
            confirmButtonColor: "#d32f2f",
            cancelButtonText: "Cancel",
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                performDelete();
            }
        });
    };

    // ======== HANDLE CANCEL ========
    const handleCancel = () => {
        setSiteIds("");
        setAtRefNos("");
    };

    useEffect(() => {
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`;
    }, []);

    return (
        <>
            <Box m={1} ml={2}>
                <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />}>
                    <Link underline="hover" onClick={() => navigate("/tools")}>Tools</Link>
                    <Typography color="text.primary">Delete Skipped Sites</Typography>
                </Breadcrumbs>
            </Box>

            <Slide direction="left" in timeout={1000}>
                <Box>
                    <Box className={classes.main_Box}>
                        <Box className={classes.Back_Box} sx={{ width: { md: "75%", xs: "100%" } }}>
                            <Box className={classes.Box_Hading}>Delete Skipped Sites</Box>

                            <Stack spacing={2} sx={{ mt: "-40px" }}>

                                 <Box className={classes.Front_Box}>
                                    <div className={classes.Front_Box_Hading}>Enter AT Reference No(s):</div>
                                    <div className={classes.Front_Box_Select_Button}>
                                        <TextField
                                            multiline
                                            rows={3}
                                            placeholder="Enter AT reference numbers separated by commas or new lines (e.g., AT-01, AT-02)"
                                            value={atRefNos}
                                            onChange={(e) => setAtRefNos(e.target.value)}
                                            sx={{ width: "100%", bgcolor: "#fff" }}
                                        />
                                    </div>
                                </Box>

                                {/* ====== SITE ID SECTION ====== */}
                                <Box className={classes.Front_Box}>
                                    <div className={classes.Front_Box_Hading}>Enter Site ID(s):</div>
                                    <div className={classes.Front_Box_Select_Button}>
                                        <TextField
                                            multiline
                                            rows={3}
                                            placeholder="Enter site IDs separated by commas or new lines (e.g., SITE01, SITE02)"
                                            value={siteIds}
                                            onChange={(e) => setSiteIds(e.target.value)}
                                            sx={{ width: "100%", bgcolor: "#fff" }}
                                        />
                                    </div>
                                </Box>

                                {/* ====== AT REFERENCE NO SECTION ====== */}
                               

                                {/* ====== DELETE BUTTON ====== */}
                                <Box sx={{ ml: 2 }}>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={handleDeleteClick}
                                        endIcon={<DeleteForeverIcon />}
                                    >
                                        Delete Records
                                    </Button>
                                </Box>
                            </Stack>

                            {/* ====== CANCEL BUTTON ====== */}
                            <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="center" mt={3}>
                                <Button
                                    variant="contained"
                                    onClick={handleCancel}
                                    sx={{ backgroundColor: "grey.500", color: "white" }}
                                    endIcon={<DoDisturbIcon />}
                                >
                                    Cancel
                                </Button>
                            </Stack>
                        </Box>
                    </Box>
                </Box>
            </Slide>

            {loading}
        </>
    );
};

export default DeleteSkippedSites;