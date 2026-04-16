import React, { useEffect, useState } from "react";
import {
    Box,
    TextField,
    Chip,
    Typography,
    IconButton,
    Paper
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";
import { postData, getData } from "../../../../services/FetchNodeServices";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useNavigate } from "react-router-dom";

const Module = () => {
    const navigate = useNavigate();
    const [modules, setModules] = useState([]);
    const [input, setInput] = useState("");
    const [error, setError] = useState("");

    // ✅ OPTIONAL: Fetch from backend

    const fetchModules = async () => {
        const res = await getData("degrow_dismental/get_model/");
        console.log(res.data)
        setModules(res.data || []);
    };

    useEffect(() => {
        fetchModules();
    }, []);


    // ✅ Add module
    const handleAdd = async () => {
        const trimmed = input.trim();

        if (!trimmed) {
            setError("Module cannot be empty ❌");
            return;
        }

        if (modules.includes(trimmed)) {
            setError("Already added ⚠️");
            return;
        }

        // 👉 If using backend

        let formData = new FormData();
        formData.append("model", trimmed);
        await postData("degrow_dismental/add_model/", formData);
        fetchModules();


        // 👉 Local state
        setModules([...modules, trimmed]);

        setInput("");
        setError("");
    };

    // ✅ Delete module
    const handleDelete = (item) => {
        Swal.fire({
            title: "Delete?",
            text: "Remove this module?",
            icon: "warning",
            showCancelButton: true,
        }).then(async (res) => {
            if (res.isConfirmed) {
                // 👉 Backend delete (optional)

                let formData = new FormData();
                formData.append("model", item);
                await postData("degrow_dismental/delete_model/", formData);
                fetchModules();


                // 👉 Local delete
                //  setModules(modules.filter((m) => m !== item));
            }
        });
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box m={1} ml={2}>
                <div style={{ margin: 10, marginLeft: -20, marginTop: -20 }}>
                    <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />}>
                        <Link underline="hover" onClick={() => navigate("/tools")}>Tools</Link>
                        <Link underline="hover" onClick={() => navigate("/tools/full_site_dismantle")}>Full Site Dismantle</Link>
                        <Typography color="text.primary">Add Module</Typography>
                    </Breadcrumbs>
                </div>
            </Box>
            {/* Heading */}
            <Typography sx={{ fontWeight: "bold", mb: 1 }}>
                Add Module:
            </Typography>

            {/* Outlook Style Box */}
            <Paper
                sx={{
                    p: 1,
                    minHeight: "60px",
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 1,
                    border: "1px solid #ccc",
                    borderRadius: "8px"
                }}
            >
                {/* Chips */}
                {modules?.map((item, i) => (
                    <Chip
                        key={i}
                        label={item?.model_name}
                        onDelete={() => handleDelete(item?.model_name)}
                        deleteIcon={<CloseIcon />}
                        sx={{
                            bgcolor: "#e3f2fd",
                            fontWeight: 500
                        }}
                    />
                ))}

                {/* Input */}
                <TextField
                    variant="standard"
                    placeholder="Enter module..."
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value);
                        setError("");
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            handleAdd();
                        }
                    }}
                    InputProps={{
                        disableUnderline: true,
                    }}
                    sx={{
                        flex: 1,
                        minWidth: "150px"
                    }}
                />

                {/* Add Button */}
                {/* <IconButton
          onClick={handleAdd}
          sx={{
            background: "linear-gradient(135deg, #1c6b64, #16897a)",
            color: "#fff",
            "&:hover": {
              background: "linear-gradient(135deg, #16897a, #1c6b64)"
            }
          }}
        >
          <AddIcon />
        </IconButton> */}
            </Paper>

            {/* Error */}
            {error && (
                <Typography sx={{ color: "red", mt: 1 }}>
                    {error}
                </Typography>
            )}
        </Box>
    );
};

export default Module;