import React, { useState, useEffect } from "react";
import {
    Box, Button, Stack, Breadcrumbs, Link, Typography, Slide,
    FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText,
    OutlinedInput, Chip, Alert,
} from "@mui/material";
import {
    DeleteForever as DeleteForeverIcon,
    DoDisturb as DoDisturbIcon,
    KeyboardArrowRight as KeyboardArrowRightIcon,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { postData, ServerURL } from "../../../services/FetchNodeServices";
import OverAllCss from "../../../csss/OverAllCss";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

// ─────────────────────────────────────────────────────────────────────────────
// API: pending_performance_at_remarks/reset-all-data/
// key:  "tables"  -> appended once per selected table, e.g.
//         formData.append("tables", "4G")
//         formData.append("tables", "5G")
//       Backend reads this as tables_to_delete = ["4G", "5G", ...].
//       If nothing is selected/sent, the backend deletes ALL tables
//       (tables_to_delete defaults to ["4G", "5G", "ACCEPTED"]).
// ─────────────────────────────────────────────────────────────────────────────

const tableArray = [
    { label: "4G", value: "4G" },
    { label: "5G", value: "5G" },
    { label: "Accepted", value: "ACCEPTED" },
];

const DeleteDatabase = () => {
    const { loading, action } = useLoadingDialog();
    const navigate = useNavigate();
    const classes = OverAllCss();

    // Empty array = "not specified" -> backend deletes all tables.
    const [selectedTables, setSelectedTables] = useState([]);

    const handleTablesChange = (event) => {
        const { value } = event.target;
        setSelectedTables(typeof value === "string" ? value.split(",") : value);
    };

    // const performDelete = async () => {
    //     action(true);
    //     const formData = new FormData();
    //     // Only append if the user picked specific tables; leaving this out
    //     // entirely is what tells the backend to delete everything.
    //     selectedTables.forEach((t) => formData.append("tables", t));

    //     const response = await postData("pending_performance_at_remarks/reset-all-data/", formData);
    //     action(false);

    //     if (response?.status) {
    //         Swal.fire({ icon: "success", title: "Deleted", text: response.message || "Data deleted successfully." });
    //         setSelectedTables([]);
    //     } else {
    //         Swal.fire({ icon: "error", title: "Oops...", text: response?.message || "Something went wrong" });
    //     }
    // };

    const performDelete = async () => {
    action(true);

    try {
        const formData = new FormData();

        selectedTables.forEach((t) => {
            formData.append("tables", t);
        });

        const response = await postData(
            "pending_performance_at_remarks/reset-all-data/",
            formData
        );

        action(false);

        if (response?.status) {
            Swal.fire({
                icon: "success",
                title: "Deleted",
                text: response.message || "Data deleted successfully.",
                confirmButtonColor: "#198754",
            });

            setSelectedTables([]);
        } else {
            // Show backend error message
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
            text: error?.message || "Unable to delete data.",
            confirmButtonColor: "#d32f2f",
        });
    }
};

    const handleDeleteClick = () => {
        const scopeText = selectedTables.length > 0
            ? `the ${selectedTables.join(", ")} table(s)`
            : "ALL tables (4G, 5G, Accepted)";

        Swal.fire({
            icon: "warning",
            title: "Are you sure?",
            html: `This will permanently delete data for <b>${scopeText}</b>. This action cannot be undone.`,
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

    const handleCancel = () => {
        setSelectedTables([]);
    };

    useEffect(() => {
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`;
    }, []);

    return (
        <>
            <Box m={1} ml={2}>
                <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />}>
                    <Link underline="hover" onClick={() => navigate("/tools")}>Tools</Link>
                    <Typography color="text.primary">Delete Database</Typography>
                </Breadcrumbs>
            </Box>

            <Slide direction="left" in timeout={1000}>
                <Box>
                    <Box className={classes.main_Box}>
                        <Box className={classes.Back_Box} sx={{ width: { md: "75%", xs: "100%" } }}>
                            <Box className={classes.Box_Hading}>Delete Database</Box>

                            <Stack spacing={2} sx={{ mt: "-40px" }}>
                                <Alert severity="warning" sx={{ fontFamily: "Poppins" }}>
                                    This permanently deletes data and cannot be undone. Leave the table selection
                                    empty to delete <b>all</b> tables (4G, 5G, Accepted).
                                </Alert>

                                <Box className={classes.Front_Box}>
                                    <div className={classes.Front_Box_Hading}>Select Table(s):</div>
                                    <div className={classes.Front_Box_Select_Button}>
                                        <FormControl sx={{ minWidth: 260 }}>
                                            <InputLabel id="tables-to-delete-label">
                                                All Tables (leave empty)
                                            </InputLabel>
                                            <Select
                                                labelId="tables-to-delete-label"
                                                multiple
                                                value={selectedTables}
                                                onChange={handleTablesChange}
                                                input={<OutlinedInput label="All Tables (leave empty)" />}
                                                renderValue={(selected) => (
                                                    <Stack direction="row" spacing={1} flexWrap="wrap">
                                                        {selected.map((value) => (
                                                            <Chip key={value} label={value} size="small" />
                                                        ))}
                                                    </Stack>
                                                )}
                                            >
                                                {tableArray.map((t) => (
                                                    <MenuItem key={t.value} value={t.value}>
                                                        <Checkbox checked={selectedTables.indexOf(t.value) > -1} />
                                                        <ListItemText primary={t.label} />
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                </Box>
                            </Stack>

                            <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-around" mt={2}>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={handleDeleteClick}
                                    endIcon={<DeleteForeverIcon />}
                                >
                                    Delete
                                </Button>
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

export default DeleteDatabase;