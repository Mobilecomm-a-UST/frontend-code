// import React, { useState, useEffect } from "react";
// import {
//     Box, Button, Stack, Breadcrumbs, Link, Typography, Slide,
//     FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText,
//     OutlinedInput, Chip, Alert,
// } from "@mui/material";
// import {
//     DeleteForever as DeleteForeverIcon,
//     DoDisturb as DoDisturbIcon,
//     KeyboardArrowRight as KeyboardArrowRightIcon,
// } from "@mui/icons-material";
// import Swal from "sweetalert2";
// import { useNavigate } from "react-router-dom";
// import { postDataa, ServerURL } from "../../../services/FetchNodeServices";
// import OverAllCss from "../../../csss/OverAllCss";
// import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

// // ─────────────────────────────────────────────────────────────────────────────
// // API: pending_performance_at_remarks/reset-all-data/
// // key:  "tables"  -> appended once per selected table, e.g.
// //         formData.append("tables", "4G")
// //         formData.append("tables", "5G")
// //       Backend reads this as tables_to_delete = ["4G", "5G", ...].
// //       If nothing is selected/sent, the backend deletes ALL tables
// //       (tables_to_delete defaults to ["4G", "5G", "ACCEPTED"]).
// // ─────────────────────────────────────────────────────────────────────────────

// const tableArray = [
//     { label: "4G", value: "4G" },
//     { label: "5G", value: "5G" },
//     { label: "Accepted", value: "ACCEPTED" },
// ];



// const DeleteDatabase = () => {
//     const { loading, action } = useLoadingDialog();
//     const navigate = useNavigate();
//     const classes = OverAllCss();

//     // Empty array = "not specified" -> backend deletes all tables.
//     const [selectedTables, setSelectedTables] = useState([]);

//     const handleTablesChange = (event) => {
//         const { value } = event.target;
//         setSelectedTables(typeof value === "string" ? value.split(",") : value);
//     };

//     // const performDelete = async () => {
//     //     action(true);
//     //     const formData = new FormData();
//     //     // Only append if the user picked specific tables; leaving this out
//     //     // entirely is what tells the backend to delete everything.
//     //     selectedTables.forEach((t) => formData.append("tables", t));

//     //     const response = await postData("pending_performance_at_remarks/reset-all-data/", formData);
//     //     action(false);

//     //     if (response?.status) {
//     //         Swal.fire({ icon: "success", title: "Deleted", text: response.message || "Data deleted successfully." });
//     //         setSelectedTables([]);
//     //     } else {
//     //         Swal.fire({ icon: "error", title: "Oops...", text: response?.message || "Something went wrong" });
//     //     }
//     // };

//     const performDelete = async () => {
//     action(true);

//     try {
//         const formData = new FormData();

//         selectedTables.forEach((t) => {
//             formData.append("tables", t);
//         });

//         const response = await postDataa(
//             "pending_performance_at_remarks/reset-all-data/",
//             formData
//         );

//         action(false);

//         if (response?.status) {
//             Swal.fire({
//                 icon: "success",
//                 title: "Deleted",
//                 text: response.message || "Data deleted successfully.",
//                 confirmButtonColor: "#198754",
//             });

//             setSelectedTables([]);
//         } else {
//             // Show backend error message
//             Swal.fire({
//                 icon: "error",
//                 title: "Error",
//                 text: response?.message || "Something went wrong.",
//                 confirmButtonColor: "#d32f2f",
//             });
//         }

//     } catch (error) {
//         action(false);

//         Swal.fire({
//             icon: "error",
//             title: "Error",
//             text: error?.message || "Unable to delete data.",
//             confirmButtonColor: "#d32f2f",
//         });
//     }
// };

//     const handleDeleteClick = () => {
//         const scopeText = selectedTables.length > 0
//             ? `the ${selectedTables.join(", ")} table(s)`
//             : "ALL tables (4G, 5G, Accepted)";

//         Swal.fire({
//             icon: "warning",
//             title: "Are you sure?",
//             html: `This will permanently delete data for <b>${scopeText}</b>. This action cannot be undone.`,
//             showCancelButton: true,
//             confirmButtonText: "Yes, delete it",
//             confirmButtonColor: "#d32f2f",
//             cancelButtonText: "Cancel",
//             reverseButtons: true,
//         }).then((result) => {
//             if (result.isConfirmed) {
//                 performDelete();
//             }
//         });
//     };

//     const handleCancel = () => {
//         setSelectedTables([]);
//     };

//     useEffect(() => {
//         document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`;
//     }, []);

//     return (
//         <>
//             <Box m={1} ml={2}>
//                 <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />}>
//                     <Link underline="hover" onClick={() => navigate("/tools")}>Tools</Link>
//                     <Typography color="text.primary">Delete Database</Typography>
//                 </Breadcrumbs>
//             </Box>

//             <Slide direction="left" in timeout={1000}>
//                 <Box>
//                     <Box className={classes.main_Box}>
//                         <Box className={classes.Back_Box} sx={{ width: { md: "75%", xs: "100%" } }}>
//                             <Box className={classes.Box_Hading}>Delete Database</Box>

//                             <Stack spacing={2} sx={{ mt: "-40px" }}>
//                                 <Alert severity="warning" sx={{ fontFamily: "Poppins" }}>
//                                     This permanently deletes data and cannot be undone. Leave the table selection
//                                     empty to delete <b>all</b> tables (4G, 5G, Accepted).
//                                 </Alert>

//                                 <Box className={classes.Front_Box}>
//                                     <div className={classes.Front_Box_Hading}>Select Table(s):</div>
//                                     <div className={classes.Front_Box_Select_Button}>
//                                         <FormControl sx={{ minWidth: 260 }}>
//                                             <InputLabel id="tables-to-delete-label">
//                                                 All Tables (leave empty)
//                                             </InputLabel>
//                                             <Select
//                                                 labelId="tables-to-delete-label"
//                                                 multiple
//                                                 value={selectedTables}
//                                                 onChange={handleTablesChange}
//                                                 input={<OutlinedInput label="All Tables (leave empty)" />}
//                                                 renderValue={(selected) => (
//                                                     <Stack direction="row" spacing={1} flexWrap="wrap">
//                                                         {selected.map((value) => (
//                                                             <Chip key={value} label={value} size="small" />
//                                                         ))}
//                                                     </Stack>
//                                                 )}
//                                             >
//                                                 {tableArray.map((t) => (
//                                                     <MenuItem key={t.value} value={t.value}>
//                                                         <Checkbox checked={selectedTables.indexOf(t.value) > -1} />
//                                                         <ListItemText primary={t.label} />
//                                                     </MenuItem>
//                                                 ))}
//                                             </Select>
//                                         </FormControl>
//                                     </div>
//                                 </Box>
//                             </Stack>

//                             <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-around" mt={2}>
//                                 <Button
//                                     variant="contained"
//                                     color="error"
//                                     onClick={handleDeleteClick}
//                                     endIcon={<DeleteForeverIcon />}
//                                 >
//                                     Delete
//                                 </Button>
//                                 <Button
//                                     variant="contained"
//                                     onClick={handleCancel}
//                                     sx={{ backgroundColor: "grey.500", color: "white" }}
//                                     endIcon={<DoDisturbIcon />}
//                                 >
//                                     Cancel
//                                 </Button>
//                             </Stack>
//                         </Box>
//                     </Box>
//                 </Box>
//             </Slide>

//             {loading}
//         </>
//     );
// };

// export default DeleteDatabase;


// // import React, { useState, useEffect } from "react";
// // import {
// //     Box, Button, Stack, Breadcrumbs, Link, Typography, Slide,
// //     FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText,
// //     OutlinedInput, Chip, Alert,
// // } from "@mui/material";
// // import {
// //     DeleteForever as DeleteForeverIcon,
// //     DoDisturb as DoDisturbIcon,
// //     KeyboardArrowRight as KeyboardArrowRightIcon,
// // } from "@mui/icons-material";
// // import Swal from "sweetalert2";
// // import { useNavigate } from "react-router-dom";
// // import { postData, ServerURL } from "../../../services/FetchNodeServices";
// // import OverAllCss from "../../../csss/OverAllCss";
// // import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

// // const tableArray = [
// //     { label: "4G", value: "4G" },
// //     { label: "5G", value: "5G" },
// //     { label: "Accepted", value: "ACCEPTED" },
// // ];

// // const DeleteDatabase = () => {
// //     const { loading, action } = useLoadingDialog();
// //     const navigate = useNavigate();
// //     const classes = OverAllCss();

// //     const [selectedTables, setSelectedTables] = useState([]);

// //     const handleTablesChange = (event) => {
// //         const { value } = event.target;
// //         setSelectedTables(typeof value === "string" ? value.split(",") : value);
// //     };

// //     const performDelete = async () => {
// //         action(true);

// //         try {
// //             const formData = new FormData();

// //             selectedTables.forEach((t) => {
// //                 formData.append("tables", t);
// //             });

// //             const response = await postData(
// //                 "pending_performance_at_remarks/reset-all-data/",
// //                 formData
// //             );

// //             action(false);

// //             if (response?.status === true) {
// //                 Swal.fire({
// //                     icon: "success",
// //                     title: "Success",
// //                     text: response.message || "Data deleted successfully.",
// //                     confirmButtonColor: "#198754",
// //                 });

// //                 setSelectedTables([]);
// //             } else {
// //                 // Extract error message
// //                 const errorMessage = response?.message || " Not unauthorized to delete this data";

// //                 // Check if it's an authentication or authorization error
// //                 const isAuthError = 
// //                     errorMessage.toLowerCase().includes("not authenticated") ||
// //                     errorMessage.toLowerCase().includes("not authorized") ||
// //                     errorMessage.toLowerCase().includes("permission") ||
// //                     errorMessage.toLowerCase().includes("unauthorized") ||
// //                     errorMessage.toLowerCase().includes("403") ||
// //                     errorMessage.toLowerCase().includes("401");

// //                 if (isAuthError) {
// //                     Swal.fire({
// //                         icon: "error",
// //                         title: "Access Denied",
// //                         html: `
// //                             <div style="text-align: center; padding: 20px;">
// //                                 <div style="margin-bottom: 15px;">
// //                                     <p style="font-size: 18px; font-weight: 600; color: #d32f2f; margin: 0;">
// //                                         You are not authorized to delete this data.
// //                                     </p>
// //                                 </div>
// //                                 <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; border-left: 4px solid #d32f2f;">
// //                                     <p style="font-size: 14px; color: #666; margin: 0; word-wrap: break-word;">
// //                                         <strong>Error Details:</strong>
// //                                     </p>
// //                                     <p style="font-size: 13px; color: #d32f2f; margin: 8px 0 0 0; word-wrap: break-word;">
// //                                         ${errorMessage}
// //                                     </p>
// //                                 </div>
// //                             </div>
// //                         `,
// //                         confirmButtonColor: "#d32f2f",
// //                         confirmButtonText: "OK",
// //                         allowOutsideClick: false,
// //                         didOpen: (modal) => {
// //                             modal.classList.add('swal-error-modal');
// //                         }
// //                     });
// //                 } else {
// //                     Swal.fire({
// //                         icon: "error",
// //                         title: "Failed to Delete Data",
// //                         html: `
// //                             <div style="text-align: center; padding: 20px;">
// //                                 <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; border-left: 4px solid #d32f2f;">
// //                                     <p style="font-size: 14px; color: #666; margin: 0; word-wrap: break-word;">
// //                                         ${errorMessage}
// //                                     </p>
// //                                 </div>
// //                             </div>
// //                         `,
// //                         confirmButtonColor: "#d32f2f",
// //                         confirmButtonText: "OK",
// //                         allowOutsideClick: false,
// //                     });
// //                 }
// //             }

// //         } catch (error) {
// //             action(false);

// //             const errorMessage = error?.message || "Unable to delete data.";

// //             Swal.fire({
// //                 icon: "error",
// //                 title: "Error",
// //                 html: `
// //                     <div style="text-align: center; padding: 20px;">
// //                         <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; border-left: 4px solid #d32f2f;">
// //                             <p style="font-size: 14px; color: #666; margin: 0; word-wrap: break-word;">
// //                                 ${errorMessage}
// //                             </p>
// //                         </div>
// //                     </div>
// //                 `,
// //                 confirmButtonColor: "#d32f2f",
// //                 confirmButtonText: "OK",
// //                 allowOutsideClick: false,
// //             });
// //         }
// //     };

// //     const handleDeleteClick = () => {
// //         const scopeText = selectedTables.length > 0
// //             ? `the ${selectedTables.join(", ")} table(s)`
// //             : "ALL tables (4G, 5G, Accepted)";

// //         Swal.fire({
// //             icon: "warning",
// //             title: "Are you sure?",
// //             html: `<b>This will permanently delete data for ${scopeText}.</b><br/>This action cannot be undone.`,
// //             showCancelButton: true,
// //             confirmButtonText: "Yes, delete it",
// //             confirmButtonColor: "#d32f2f",
// //             cancelButtonText: "Cancel",
// //             reverseButtons: true,
// //         }).then((result) => {
// //             if (result.isConfirmed) {
// //                 performDelete();
// //             }
// //         });
// //     };

// //     const handleCancel = () => {
// //         setSelectedTables([]);
// //     };

// //     useEffect(() => {
// //         document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`;
// //     }, []);

// //     return (
// //         <>
// //             <Box m={1} ml={2}>
// //                 <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />}>
// //                     <Link underline="hover" onClick={() => navigate("/tools")} sx={{ cursor: 'pointer' }}>
// //                         Tools
// //                     </Link>
// //                     <Typography color="text.primary">Delete Database</Typography>
// //                 </Breadcrumbs>
// //             </Box>

// //             <Slide direction="left" in timeout={1000}>
// //                 <Box>
// //                     <Box className={classes.main_Box}>
// //                         <Box className={classes.Back_Box} sx={{ width: { md: "75%", xs: "100%" } }}>
// //                             <Box className={classes.Box_Hading}>Delete Database</Box>

// //                             <Stack spacing={2} sx={{ mt: "-40px" }}>
// //                                 <Alert severity="warning" sx={{ fontFamily: "Poppins" }}>
// //                                     This permanently deletes data and cannot be undone. Leave the table selection
// //                                     empty to delete <b>all</b> tables (4G, 5G, Accepted).
// //                                 </Alert>

// //                                 <Box className={classes.Front_Box}>
// //                                     <div className={classes.Front_Box_Hading}>Select Table(s):</div>
// //                                     <div className={classes.Front_Box_Select_Button}>
// //                                         <FormControl sx={{ minWidth: 260 }}>
// //                                             <InputLabel id="tables-to-delete-label">
// //                                                 All Tables (leave empty)
// //                                             </InputLabel>
// //                                             <Select
// //                                                 labelId="tables-to-delete-label"
// //                                                 multiple
// //                                                 value={selectedTables}
// //                                                 onChange={handleTablesChange}
// //                                                 input={<OutlinedInput label="All Tables (leave empty)" />}
// //                                                 renderValue={(selected) => (
// //                                                     <Stack direction="row" spacing={1} flexWrap="wrap">
// //                                                         {selected.map((value) => (
// //                                                             <Chip key={value} label={value} size="small" />
// //                                                         ))}
// //                                                     </Stack>
// //                                                 )}
// //                                             >
// //                                                 {tableArray.map((t) => (
// //                                                     <MenuItem key={t.value} value={t.value}>
// //                                                         <Checkbox checked={selectedTables.indexOf(t.value) > -1} />
// //                                                         <ListItemText primary={t.label} />
// //                                                     </MenuItem>
// //                                                 ))}
// //                                             </Select>
// //                                         </FormControl>
// //                                     </div>
// //                                 </Box>
// //                             </Stack>

// //                             <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-around" mt={2}>
// //                                 <Button
// //                                     variant="contained"
// //                                     color="error"
// //                                     onClick={handleDeleteClick}
// //                                     endIcon={<DeleteForeverIcon />}
// //                                 >
// //                                     Delete
// //                                 </Button>
// //                                 <Button
// //                                     variant="contained"
// //                                     onClick={handleCancel}
// //                                     sx={{ backgroundColor: "grey.500", color: "white" }}
// //                                     endIcon={<DoDisturbIcon />}
// //                                 >
// //                                     Cancel
// //                                 </Button>
// //                             </Stack>
// //                         </Box>
// //                     </Box>
// //                 </Box>
// //             </Slide>

// //             {loading}
// //         </>
// //     );
// // };

// // export default DeleteDatabase;



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
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { postDataa, ServerURL } from "../../../services/FetchNodeServices";
import OverAllCss from "../../../csss/OverAllCss";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";
import { getDecreyptedData } from "../../../utils/localstorage";

// ─────────────────────────────────────────────────────────────────────────────
// API: pending_performance_at_remarks/reset-all-data/
// key:  "tables"  -> appended once per selected table
//
// API: delete/ (for archives)
// Key: "month", "delete", "circle" (optional)
// ─────────────────────────────────────────────────────────────────────────────

const tableArray = [
    { label: "4G", value: "4G" },
    { label: "5G", value: "5G" },
    { label: "Accepted", value: "ACCEPTED" },
];

// ======== CIRCLES (OPTIONAL) ========
const circleArray = ['AP', 'DL', 'TNCH', 'NESA', 'RJ', 'JK', 'BR', 'MH', 'MP', 'MU', 'JRK', 'KK', 'UE', 'UW', 'HPHP', 'OR', 'WB/KOL']

const DeleteDatabase = () => {
    const { loading, action } = useLoadingDialog();
    const navigate = useNavigate();
    const classes = OverAllCss();

    // ======== GET USER TYPES ========
    const userTypeString = getDecreyptedData('user_type');
    const userTypes = userTypeString ? userTypeString.split(",") : [];
    const hasArchiveAccess = userTypes.includes('QT_AR');

    // ======== STATE MANAGEMENT ========
    const [selectedTables, setSelectedTables] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedCircle, setSelectedCircle] = useState("");

    // ======== HANDLERS ========
    const handleTablesChange = (event) => {
        const { value } = event.target;
        setSelectedTables(typeof value === "string" ? value.split(",") : value);
    };

    const handleMonthChange = (newDate) => {
        setSelectedMonth(newDate);
    };

    const handleCircleChange = (event) => {
        const { value } = event.target;
        setSelectedCircle(value);
    };

    // ======== PERFORM TABLE DELETE ========
    const performTableDelete = async () => {
        action(true);

        try {
            const formData = new FormData();

            selectedTables.forEach((t) => {
                formData.append("tables", t);
            });

            const response = await postDataa(
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

    // ======== PERFORM ARCHIVE DELETE ========
    const performArchiveDelete = async () => {
        action(true);

        try {
            const formData = new FormData();

            // Format: "Mon-YYYY" (e.g., "Jan-2000")
            const monthString = selectedMonth.format("MMM-YYYY");

            formData.append("month", monthString);
            formData.append("delete", "true");

            if (selectedCircle) {
                formData.append("circle", selectedCircle);
            }

            const response = await postDataa("delete/", formData);

            action(false);

            if (response?.status) {
                Swal.fire({
                    icon: "success",
                    title: "Deleted",
                    text: response.message || "Archive deleted successfully.",
                    confirmButtonColor: "#198754",
                });

                setSelectedMonth(null);
                setSelectedCircle("");
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
                text: error?.message || "Unable to delete archive.",
                confirmButtonColor: "#d32f2f",
            });
        }
    };

    // ======== HANDLE TABLE DELETE ========
    const handleTableDelete = () => {
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
                performTableDelete();
            }
        });
    };

    // ======== HANDLE ARCHIVE DELETE ========
    const handleArchiveDelete = () => {
        if (!selectedMonth) {
            Swal.fire({
                icon: "warning",
                title: "No Month Selected",
                text: "Please select a month to delete.",
                confirmButtonColor: "#ffc107",
            });
            return;
        }

        const monthString = selectedMonth.format("MMM-YYYY");
        let confirmMessage = `This will permanently delete archive for <b>${monthString}</b>`;
        if (selectedCircle) {
            confirmMessage += ` in circle <b>${selectedCircle}</b>`;
        }
        confirmMessage += `. This action cannot be undone.`;

        Swal.fire({
            icon: "warning",
            title: "Are you sure?",
            html: confirmMessage,
            showCancelButton: true,
            confirmButtonText: "Yes, delete it",
            confirmButtonColor: "#d32f2f",
            cancelButtonText: "Cancel",
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                performArchiveDelete();
            }
        });
    };

    // ======== HANDLE CANCEL ========
    const handleCancel = () => {
        setSelectedTables([]);
        setSelectedMonth(null);
        setSelectedCircle("");
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

                                {/* ====== SELECT TABLES ====== */}
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

                                {/* ====== DELETE TABLES BUTTON ====== */}
                                <Box sx={{ ml: 2 }}>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={handleTableDelete}
                                        endIcon={<DeleteForeverIcon />}
                                    >
                                        Delete Tables
                                    </Button>
                                </Box>

                                {/* ====== SELECT ARCHIVE (VISIBLE ONLY TO QT_AR USERS) ====== */}
                                {hasArchiveAccess && (
                                    <>
                                        <Box className={classes.Front_Box}>
                                            <div className={classes.Front_Box_Hading}>Select Archive:</div>
                                            <div className={classes.Front_Box_Select_Button}>
                                                <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ alignItems: "flex-start" }}>
                                                    {/* Month Calendar Picker */}
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <DatePicker
                                                            label="Select Month"
                                                            value={selectedMonth}
                                                            onChange={(newValue) => {
                                                                setSelectedMonth(newValue);
                                                            }}
                                                            views={["year", "month"]}
                                                            openTo="month"
                                                            format="MMMM YYYY"
                                                            closeOnSelect={true}
                                                            slotProps={{
                                                                textField: {
                                                                    size: "small",
                                                                    placeholder: "Select Month",
                                                                    sx: {
                                                                        width: 220,
                                                                        "& .MuiInputBase-root": {
                                                                            height: 40,
                                                                        },
                                                                    },
                                                                },
                                                                toolbar: {
                                                                    hidden: false,
                                                                },
                                                            }}
                                                        />
                                                    </LocalizationProvider>
                                                    {/* Circle Dropdown (Optional) */}
                                                    <FormControl sx={{ minWidth: 180 , minHeight: 20}}>
                                                        <InputLabel id="circle-to-delete-label">
                                                            Circle (Optional)
                                                        </InputLabel>

                                                        <Select
                                                            labelId="circle-to-delete-label"
                                                            value={selectedCircle}
                                                            onChange={handleCircleChange}
                                                            input={<OutlinedInput label="Circle (Optional)" />}
                                                        >
                                                            <MenuItem value="">
                                                                <em>All Circles</em>
                                                            </MenuItem>

                                                            {circleArray.map((circle) => (
                                                                <MenuItem key={circle} value={circle}>
                                                                    {circle}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Stack>
                                            </div>
                                        </Box>

                                        {/* ====== DELETE ARCHIVE BUTTON ====== */}
                                        <Box sx={{ ml: 2 }}>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                onClick={handleArchiveDelete}
                                                endIcon={<DeleteForeverIcon />}
                                            >
                                                Delete Archive
                                            </Button>
                                        </Box>
                                    </>
                                )}
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

export default DeleteDatabase;