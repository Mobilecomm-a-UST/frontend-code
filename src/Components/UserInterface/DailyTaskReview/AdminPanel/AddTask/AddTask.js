// import React, { useEffect, useState } from "react";
// import {
//     Box,
//     TextField,
//     Chip,
//     Typography,
//     Paper,
//     Tooltip,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import Swal from "sweetalert2";
// import { postData, getData } from "../../../../services/FetchNodeServices";
// import Breadcrumbs from "@mui/material/Breadcrumbs";
// import Link from "@mui/material/Link";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// import { useNavigate } from "react-router-dom";

// // ── API base paths ────────────────────────────────────────────────────────────
// const API = {
// CREATE : "dailytask_review/tasks/create/",
// GET_ALL: "dailytask_review/tasks/",
// UPDATE : (pk) => `dailytask_review/tasks/update/${pk}/`,
// DELETE : (pk) => `dailytask_review/tasks/delete/${pk}/`,
// };

// const AddTask = () => {
//     const navigate = useNavigate();

//     const [modules, setModules] = useState([]);   // [{ id, name, ... }]
//     const [input,   setInput]   = useState("");
//     const [error,   setError]   = useState("");
//     const [loading, setLoading] = useState(false);

//     // ── Fetch all tasks ───────────────────────────────────────────────────
//     const fetchModules = async () => {
//         try {
//             const res = await getData(API.GET_ALL);
//             console.log("GET tasks/:", res);
//             // Supports both { data: [...] } and plain array responses
//             setModules(Array.isArray(res) ? res : res?.data || []);
//         } catch (err) {
//             console.error("fetchModules error:", err);
//         }
//     };

//     useEffect(() => {
//         fetchModules();
//     }, []);

//     // ── Create task ───────────────────────────────────────────────────────
//     const handleAdd = async () => {
//         const trimmed = input.trim();

//         if (!trimmed) {
//             setError("Task cannot be empty ❌");
//             return;
//         }

//         // Duplicate check against already-fetched modules
//         const isDuplicate = modules.some(
//             (m) => String(m?.name || m?.model_name || "").toLowerCase() === trimmed.toLowerCase()
//         );
//         if (isDuplicate) {
//             setError("Already added ⚠️");
//             return;
//         }

//         try {
//             setLoading(true);
//             const formData = new FormData();
//             formData.append("name", trimmed);       // ← field expected by tasks/create/

//             const res = await postData(API.CREATE, formData);
//             console.log("POST tasks/create/:", res);

//             setInput("");
//             setError("");
//             await fetchModules();           // re-fetch to get latest list with IDs
//         } catch (err) {
//             console.error("handleAdd error:", err);
//             setError("Failed to add module ❌");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // ── Delete task ───────────────────────────────────────────────────────
//     const handleDelete = (item) => {
//         const pk   = item?.id;
//         const name = item?.name || item?.model_name || item;

//         if (!pk) {
//             console.error("Delete failed — no ID found on item:", item);
//             return;
//         }

//         Swal.fire({
//             title:             "Delete?",
//             text:              `Remove "${name}"?`,
//             icon:              "warning",
//             showCancelButton:  true,
//             confirmButtonText: "Yes, delete",
//             cancelButtonText:  "Cancel",
//         }).then(async (result) => {
//             if (result.isConfirmed) {
//                 try {
//                     const res = await getData(API.DELETE(pk));   // uses DELETE under hood
//                     console.log(`DELETE tasks/delete/${pk}/`, res);
//                     await fetchModules();
//                 } catch (err) {
//                     console.error("handleDelete error:", err);
//                     Swal.fire("Error", "Failed to delete task.", "error");
//                 }
//             }
//         });
//     };

//     // ── Update task (inline edit on double-click) ─────────────────────────
//     const handleUpdate = (item) => {
//         const pk      = item?.id;
//         const current = item?.name || item?.model_name || "";

//         if (!pk) return;

//         Swal.fire({
//             title:       "Update Task",
//             input:       "text",
//             inputValue:  current,
//             showCancelButton: true,
//             confirmButtonText: "Update",
//             inputValidator: (value) => {
//                 if (!value.trim()) return "Name cannot be empty!";
//             },
//         }).then(async (result) => {
//             if (result.isConfirmed) {
//                 try {
//                     const formData = new FormData();
//                     formData.append("name", result.value.trim());

//                     const res = await postData(API.UPDATE(pk), formData);
//                     console.log(`PATCH tasks/update/${pk}/`, res);
//                     await fetchModules();
//                 } catch (err) {
//                     console.error("handleUpdate error:", err);
//                     Swal.fire("Error", "Failed to update task.", "error");
//                 }
//             }
//         });
//     };

//     // ── Resolve display label from various possible key names ─────────────
//     const getLabel = (item) =>
//         item?.name || item?.model_name || item?.title || String(item);

//     return (
//         <Box sx={{ p: 3 }}>
//             {/* Breadcrumb */}
//             <Box m={1} ml={2}>
//                 <div style={{ margin: 10, marginLeft: -20, marginTop: -20 }}>
//                     <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />}>
//                         <Link underline="hover" onClick={() => navigate("/tools")}>
//                             Tools
//                         </Link>
//                         <Link underline="hover" onClick={() => navigate("/tools/daily_task_review")}>
//                             Add Task
//                         </Link>
//                         <Typography color="text.primary">Add Task</Typography>
//                     </Breadcrumbs>
//                 </div>
//             </Box>

//             {/* Heading */}
//             <Typography sx={{ fontWeight: "bold", mb: 1 }}>
//                 Add Task:
//             </Typography>

//             {/* Outlook-style chip + input box */}
//             <Paper
//                 sx={{
//                     p:           1,
//                     minHeight:   "60px",
//                     display:     "flex",
//                     alignItems:  "center",
//                     flexWrap:    "wrap",
//                     gap:         1,
//                     border:      "1px solid #ccc",
//                     borderRadius:"8px",
//                     cursor:      "text",
//                 }}
//                 onClick={(e) => {
//                     // Focus input when clicking anywhere in the box
//                     const inp = e.currentTarget.querySelector("input");
//                     if (inp) inp.focus();
//                 }}
//             >
//                 {/* Chips — one per task from GET tasks/ */}
//                 {modules.map((item, i) => (
//                     <Tooltip
//                         key={item?.id ?? i}
//                         title="Double-click to edit"
//                         placement="top"
//                         arrow
//                     >
//                         <Chip
//                             label={getLabel(item)}
//                             onDelete={() => handleDelete(item)}
//                             onDoubleClick={() => handleUpdate(item)}
//                             deleteIcon={<CloseIcon />}
//                             sx={{
//                                 bgcolor:    "#e3f2fd",
//                                 fontWeight: 500,
//                                 cursor:     "pointer",
//                                 "&:hover":  { bgcolor: "#bbdefb" },
//                             }}
//                         />
//                     </Tooltip>
//                 ))}

//                 {/* Inline text input */}
//                 <TextField
//                     variant="standard"
//                     placeholder={loading ? "Adding..." : "Enter Task and press Enter…"}
//                     value={input}
//                     disabled={loading}
//                     onChange={(e) => {
//                         setInput(e.target.value);
//                         setError("");
//                     }}
//                     onKeyDown={(e) => {
//                         if (e.key === "Enter") {
//                             e.preventDefault();
//                             handleAdd();
//                         }
//                         // Backspace on empty input — delete last chip
//                         if (e.key === "Backspace" && !input && modules.length > 0) {
//                             handleDelete(modules[modules.length - 1]);
//                         }
//                     }}
//                     InputProps={{ disableUnderline: true }}
//                     sx={{ flex: 1, minWidth: "200px" }}
//                 />
//             </Paper>

//             {/* Helper text */}
//             <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
//                 Press <strong>Enter</strong> to add · <strong>Double-click</strong> a chip to edit · <strong>✕</strong> to delete
//             </Typography>

//             {/* Error */}
//             {error && (
//                 <Typography sx={{ color: "red", mt: 1, fontSize: 13 }}>
//                     {error}
//                 </Typography>
//             )}
//         </Box>
//     );
// };

// export default AddTask;

// import React, { useEffect, useState } from "react";
// import {
//     Box,
//     TextField,
//     Chip,
//     Typography,
//     Paper,
//     Tooltip,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import Swal from "sweetalert2";
// import {  postData, getData,ServerURL } from "../../../../services/FetchNodeServices";
// import Breadcrumbs from "@mui/material/Breadcrumbs";
// import Link from "@mui/material/Link";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// // ── API base paths ────────────────────────────────────────────────────────────
// const API = {
//     CREATE: "dailytask_review/tasks/create/",
//     GET_ALL: "dailytask_review/tasks/",
//     UPDATE: (pk) => `dailytask_review/tasks/update/${pk}/`,
//     DELETE: (pk) => `dailytask_review/tasks/delete/${pk}/`,
// };

// const AddTask = () => {
//     const navigate = useNavigate();

//     const [modules, setModules] = useState([]);   // [{ id, task, ... }]
//     const [input, setInput] = useState("");
//     const [error, setError] = useState("");
//     const [loading, setLoading] = useState(false);

//     // ── Fetch all tasks ───────────────────────────────────────────────────
//     const fetchModules = async () => {
//         try {
//             const res = await getData(API.GET_ALL);
//             console.log("GET tasks/:", res);
//             setModules(Array.isArray(res) ? res : res?.data || []);
//         } catch (err) {
//             console.error("fetchModules error:", err);
//         }
//     };

//     useEffect(() => {
//         fetchModules();
//     }, []);

//     // ── Create task ───────────────────────────────────────────────────────
//     const handleAdd = async () => {
//         const trimmed = input.trim();

//         if (!trimmed) {
//             setError("Task cannot be empty ❌");
//             return;
//         }

//         // Duplicate check using "task" key
//         const isDuplicate = modules.some(
//             (m) => String(m?.task || "").toLowerCase() === trimmed.toLowerCase()
//         );
//         if (isDuplicate) {
//             setError("Already added ⚠️");
//             return;
//         }

//         try {
//             setLoading(true);
//             const formData = new FormData();
//             formData.append("task", trimmed);   // ← backend field is "task"

//             const res = await postData(API.CREATE, formData);
//             console.log("POST tasks/create/:", res);

//             setInput("");
//             setError("");
//             await fetchModules();
//         } catch (err) {
//             console.error("handleAdd error:", err);
//             setError("Failed to add task ❌");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // ── Delete task ───────────────────────────────────────────────────────
//     const handleDelete = (item) => {
//         const pk = item?.id;
//         const name = item?.task || "";

//         if (!pk) {
//             console.error("Delete failed — no ID found on item:", item);
//             return;
//         }

//         Swal.fire({
//             title: "Delete?",
//             text: `Remove "${name}"?`,
//             icon: "warning",
//             showCancelButton: true,
//             confirmButtonText: "Yes, delete",
//             cancelButtonText: "Cancel",
//         }).then(async (result) => {
//             if (result.isConfirmed) {
//                 try {
//                     const formData = new FormData();
//                     formData.append("id", pk);
//                 //    const res = await axios.delete(API.DELETE(pk));
//                     // const res = await postData(API.DELETE(pk), formData);

//                     const res = await fetch(`${ServerURL}${API.DELETE(pk)}`, {
//                         method: "DELETE",
//                         headers: { "Accept": "application/json" },
//                     });
//                     console.log(`DELETE dailytask_review/tasks/delete/${pk}/`, res);
//                     await fetchModules();
//                 } catch (err) {
//                     console.error("handleDelete error:", err);
//                     Swal.fire("Error", "Failed to delete task.", "error");
//                 }
//             }
//         });
//     };

//     // ── Update task (double-click chip) ───────────────────────────────────
//     const handleUpdate = (item) => {
//         const pk = item?.id;
//         const current = item?.task || "";

//         if (!pk) return;

//         Swal.fire({
//             title: "Update Task",
//             input: "text",
//             inputValue: current,
//             showCancelButton: true,
//             confirmButtonText: "Update",
//             inputValidator: (value) => {
//                 if (!value.trim()) return "Task cannot be empty!";
//             },
//         }).then(async (result) => {
//             if (result.isConfirmed) {
//                 try {
//                     const formData = new FormData();
//                     formData.append("task", result.value.trim()); // ← backend field is "task"

//                     const res = await postData(API.UPDATE(pk), formData);
//                     console.log(`PATCH dailytask_review/tasks/update/${pk}/`, res);
//                     await fetchModules();
//                 } catch (err) {
//                     console.error("handleUpdate error:", err);
//                     Swal.fire("Error", "Failed to update task.", "error");
//                 }
//             }
//         });
//     };

//     // ── Resolve display label — "task" is the API key ─────────────────────
//     const getLabel = (item) => {
//     if (typeof item === "string") return item;
//     return item?.task ?? item?.name ?? item?.title ?? JSON.stringify(item);
// };

//     return (
//         <Box sx={{ p: 3 }}>
//             {/* Breadcrumb */}
//             <Box m={1} ml={2}>
//                 <div style={{ margin: 10, marginLeft: -20, marginTop: -20 }}>
//                     <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />}>
//                         <Link underline="hover" onClick={() => navigate("/tools")}>
//                             Tools
//                         </Link>
//                         <Link underline="hover" onClick={() => navigate("/tools/daily_task_review")}>
//                             Daily Task Review
//                         </Link>
//                         <Typography color="text.primary">Add Task</Typography>
//                     </Breadcrumbs>
//                 </div>
//             </Box>

//             {/* Heading */}
//             <Typography sx={{ fontWeight: "bold", mb: 1 }}>
//                 Add Task:
//             </Typography>

//             {/* Outlook-style chip + input box */}
//             <Paper
//                 sx={{
//                     p: 1,
//                     minHeight: "60px",
//                     display: "flex",
//                     alignItems: "center",
//                     flexWrap: "wrap",
//                     gap: 1,
//                     border: "1px solid #ccc",
//                     borderRadius: "8px",
//                     cursor: "text",
//                 }}
//                 onClick={(e) => {
//                     const inp = e.currentTarget.querySelector("input");
//                     if (inp) inp.focus();
//                 }}
//             >
//                 {/* Chips — one per task */}
//                 {modules.map((item, i) => (
//                     <Tooltip
//                         key={item?.id ?? i}
//                         title="Double-click to edit"
//                         placement="top"
//                         arrow
//                     >
//                         <Chip
//                             label={getLabel(item)}
//                             onDelete={() => handleDelete(item)}
//                             onDoubleClick={() => handleUpdate(item)}
//                             deleteIcon={<CloseIcon />}
//                             sx={{
//                                 bgcolor: "#e3f2fd",
//                                 fontWeight: 500,
//                                 cursor: "pointer",
//                                 "&:hover": { bgcolor: "#bbdefb" },
//                             }}
//                         />
//                     </Tooltip>
//                 ))}

//                 {/* Inline text input */}
//                 <TextField
//                     variant="standard"
//                     placeholder={loading ? "Adding..." : "Enter Task and press Enter…"}
//                     value={input}
//                     disabled={loading}
//                     onChange={(e) => {
//                         setInput(e.target.value);
//                         setError("");
//                     }}
//                     onKeyDown={(e) => {
//                         if (e.key === "Enter") {
//                             e.preventDefault();
//                             handleAdd();
//                         }
//                         // Backspace on empty input — delete last chip
//                         if (e.key === "Backspace" && !input && modules.length > 0) {
//                             handleDelete(modules[modules.length - 1]);
//                         }
//                     }}
//                     InputProps={{ disableUnderline: true }}
//                     sx={{ flex: 1, minWidth: "200px" }}
//                 />
//             </Paper>

//             {/* Helper text */}
//             <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
//                 Press <strong>Enter</strong> to add · <strong>Double-click</strong> a chip to edit · <strong>✕</strong> to delete
//             </Typography>

//             {/* Error */}
//             {error && (
//                 <Typography sx={{ color: "red", mt: 1, fontSize: 13 }}>
//                     {error}
//                 </Typography>
//             )}
//         </Box>
//     );
// };

// export default AddTask;

import React, { useEffect, useState } from "react";
import {
    Box,
    TextField,
    Chip,
    Typography,
    Paper,
    Tooltip,
    Breadcrumbs,
    Link,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { getDecreyptedData } from "../../../../utils/localstorage";

import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";


import {
    postData,
    getData,
    deleteData,
    putData,
    ServerURL,
} from "../../../../services/FetchNodeServices";

// ─────────────────────────────────────────────────────────────
// API ENDPOINTS
// ─────────────────────────────────────────────────────────────
const API = {
    CREATE: "dailytask_review/add-task/",
    GET_ALL: "dailytask_review/get-task/",
    UPDATE: (pk) => `dailytask_review/update-task/${pk}/`,
    DELETE: (pk) => `dailytask_review/delete-task/${pk}/`,
};

const AddTask = () => {
    const navigate = useNavigate();

    // ─────────────────────────────────────────────────────────
    // STATES
    // ─────────────────────────────────────────────────────────
    const [modules, setModules] = useState([]);
    const [input, setInput] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const userName = getDecreyptedData("userID")

    // ─────────────────────────────────────────────────────────
    // FETCH ALL TASKS
    // ─────────────────────────────────────────────────────────
    const fetchModules = async () => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("userID", userName);
            const res = await postData(API.GET_ALL, formData);

            console.log("GET TASK RESPONSE:", res);

            if (Array.isArray(res)) {
                setLoading(false);
                setModules(res);
            } else if (Array.isArray(res?.data)) {
                setLoading(false);
                setModules(res.data);
            } else {
                setLoading(false);
                setModules([]);
            }
        } catch (err) {
            setLoading(false);
            console.error("FETCH ERROR:", err);
        }
    };

    useEffect(() => {
        fetchModules();
    }, []);

    // ─────────────────────────────────────────────────────────
    // ADD TASK
    // ─────────────────────────────────────────────────────────
    const handleAdd = async () => {
        const trimmed = input.trim();

        // Empty validation
        if (!trimmed) {
            setError("Task cannot be empty ❌");
            return;
        }

        // Duplicate validation
        const isDuplicate = modules.some(
            (item) =>
                String(item?.task || "")
                    .toLowerCase()
                    .trim() === trimmed.toLowerCase()
        );

        if (isDuplicate) {
            setError("Task already exists ⚠️");
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("task", trimmed);
            formData.append("userID", userName);

            const res = await postData(API.CREATE, formData);

            console.log("CREATE RESPONSE:", res);

            setInput("");
            setError("");

            await fetchModules();
        } catch (err) {
            console.error("ADD ERROR:", err);
            setError("Failed to add task ❌");
        } finally {
            setLoading(false);
        }
    };

    // ─────────────────────────────────────────────────────────
    // DELETE TASK
    // ─────────────────────────────────────────────────────────
    const handleDelete = (item) => {
        const pk = item?.id;

        if (!pk) {
            console.error("No ID found");
            return;
        }

        Swal.fire({
            title: "Delete Task?",
            text: `Remove "${item?.task}" ?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "Cancel",
        }).then(async (result) => {

            if (result.isConfirmed) {

                try {

                    const res = await deleteData(
                        API.DELETE(pk)
                    );

                    console.log("DELETE RESPONSE:", res);

                    Swal.fire(
                        "Deleted!",
                        "Task deleted successfully.",
                        "success"
                    );

                    await fetchModules();

                } catch (err) {

                    console.error("DELETE ERROR:", err);

                    Swal.fire(
                        "Error",
                        "Failed to delete task.",
                        "error"
                    );
                }
            }
        });
    };

    // ─────────────────────────────────────────────────────────
    // UPDATE TASK
    // ─────────────────────────────────────────────────────────
    const handleUpdate = (item) => {

        const pk = item?.id;

        if (!pk) return;

        Swal.fire({
            title: "Update Task",
            input: "text",
            inputValue: item?.task || "",
            showCancelButton: true,
            confirmButtonText: "Update",

            inputValidator: (value) => {

                if (!value.trim()) {
                    return "Task cannot be empty!";
                }
            },

        }).then(async (result) => {

            if (result.isConfirmed) {

                try {

                    const formData = new FormData();

                    formData.append(
                        "task",
                        result.value.trim()
                    );

                    const res = await putData(
                        API.UPDATE(pk),
                        formData
                    );

                    console.log("UPDATE RESPONSE:", res);

                    Swal.fire(
                        "Updated!",
                        "Task updated successfully.",
                        "success"
                    );

                    await fetchModules();

                } catch (err) {

                    console.error("UPDATE ERROR:", err);

                    Swal.fire(
                        "Error",
                        "Failed to update task.",
                        "error"
                    );
                }
            }
        });
    };

    // ─────────────────────────────────────────────────────────
    // LABEL
    // ─────────────────────────────────────────────────────────
    const getLabel = (item) => {
        if (typeof item === "string") return item;

        return (
            item?.task ||
            item?.name ||
            item?.title ||
            "Task"
        );
    };

    // ─────────────────────────────────────────────────────────
    // UI
    // ─────────────────────────────────────────────────────────
    return (
        <Box sx={{ p: 3 }}>
            {/* Breadcrumb */}
            <Box m={1} ml={2}>
                <div
                    style={{
                        margin: 10,
                        marginLeft: -20,
                        marginTop: -20,
                    }}
                >
                    <Breadcrumbs
                        separator={
                            <KeyboardArrowRightIcon fontSize="small" />
                        }
                    >
                        <Link
                            underline="hover"
                            sx={{ cursor: "pointer" }}
                            onClick={() => navigate("/tools")}
                        >
                            Tools
                        </Link>

                        <Link
                            underline="hover"
                            sx={{ cursor: "pointer" }}
                            onClick={() =>
                                navigate("/tools/daily_task_review")
                            }
                        >
                            Daily Task Review
                        </Link>

                        <Typography color="text.primary">
                            Add Task
                        </Typography>
                    </Breadcrumbs>
                </div>
            </Box>

            {/* Heading */}
            <Typography
                sx={{
                    fontWeight: "bold",
                    mb: 1,
                }}
            >
                Add Task:
            </Typography>

            {/* Main Input Box */}
            <Paper
                sx={{
                    p: 1,
                    minHeight: "60px",
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 1,
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    cursor: "text",
                }}
                onClick={(e) => {
                    const inp =
                        e.currentTarget.querySelector("input");

                    if (inp) inp.focus();
                }}
            >
                {/* Chips */}
                {modules.map((item, index) => (
                    <Tooltip
                        key={item?.id || index}
                        title="Double-click to edit"
                        arrow
                    >
                        <Chip
                            label={getLabel(item)}
                            onDelete={() =>
                                handleDelete(item)
                            }
                            onDoubleClick={() =>
                                handleUpdate(item)
                            }
                            deleteIcon={<CloseIcon />}
                            sx={{
                                bgcolor: "#e3f2fd",
                                fontWeight: 500,
                                cursor: "pointer",

                                "&:hover": {
                                    bgcolor: "#bbdefb",
                                },
                            }}
                        />
                    </Tooltip>
                ))}

                {/* Input */}
                <TextField
                    variant="standard"
                    placeholder={
                        loading
                            ? "Adding..."
                            : "Enter Task and press Enter..."
                    }
                    value={input}
                    disabled={loading}
                    onChange={(e) => {
                        setInput(e.target.value);
                        setError("");
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            handleAdd();
                        }

                        // Backspace delete last chip
                        if (
                            e.key === "Backspace" &&
                            !input &&
                            modules.length > 0
                        ) {
                            handleDelete(
                                modules[modules.length - 1]
                            );
                        }
                    }}
                    InputProps={{
                        disableUnderline: true,
                    }}
                    sx={{
                        flex: 1,
                        minWidth: "220px",
                    }}
                />
            </Paper>

            {/* Helper Text */}
            <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                    mt: 1,
                    display: "block",
                }}
            >
                Press <strong>Enter</strong> to add ·{" "}
                <strong>Double-click</strong> a chip to edit ·{" "}
                <strong>✕</strong> to delete
            </Typography>

            {/* Error */}
            {error && (
                <Typography
                    sx={{
                        color: "red",
                        mt: 1,
                        fontSize: 13,
                    }}
                >
                    {error}
                </Typography>
            )}
        </Box>
    );
};

export default AddTask;