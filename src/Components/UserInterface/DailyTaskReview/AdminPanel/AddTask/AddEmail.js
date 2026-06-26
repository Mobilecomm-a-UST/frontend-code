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
    deleteData,
    putData,
} from "../../../../services/FetchNodeServices";

// ─────────────────────────────────────────────────────────────
// ALLOWED EMAIL DOMAINS
// ─────────────────────────────────────────────────────────────
const ALLOWED_DOMAINS = ["ust.com","gmail.com"];

// ─────────────────────────────────────────────────────────────
// API ENDPOINTS
// ─────────────────────────────────────────────────────────────
const API = {
    CREATE: "dailytask_review/reporting-email-hierarchy/create/",
    GET_ALL: "dailytask_review/reporting-email-hierarchy/get/",
    UPDATE: (pk) => `dailytask_review/reporting-email-hierarchy/update/${pk}/`,
    DELETE: (pk) => `dailytask_review/reporting-email-hierarchy/delete/${pk}/`,
};

const AddEmail = () => {
    const navigate = useNavigate();

    // ─────────────────────────────────────────────────────────
    // STATES
    // ─────────────────────────────────────────────────────────
    const [emails, setEmails] = useState([]);
    const [input, setInput] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const userName = getDecreyptedData("userID");

    // ─────────────────────────────────────────────────────────
    // EMAIL VALIDATION
    // ─────────────────────────────────────────────────────────
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return "Invalid email format ❌";
        }
        const domain = email.split("@")[1]?.toLowerCase();
        if (!ALLOWED_DOMAINS.includes(domain)) {
            return `Only ${ALLOWED_DOMAINS.join(", ")} emails are allowed ❌`;
        }
        return null; // valid
    };

    // ─────────────────────────────────────────────────────────
    // FETCH ALL EMAILS
    // ─────────────────────────────────────────────────────────
    const fetchEmails = async () => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("userID", userName);
            const res = await postData(API.GET_ALL, formData);
            console.log("GET EMAIL RESPONSE:", res);

            if (Array.isArray(res)) {
                setEmails(res);
            } else if (Array.isArray(res?.data)) {
                setEmails(res.data);
            } else {
                setEmails([]);
            }
        } catch (err) {
            console.error("FETCH ERROR:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmails();
    }, []);

    // ─────────────────────────────────────────────────────────
    // ADD EMAIL
    // ─────────────────────────────────────────────────────────
    const handleAdd = async () => {
        const trimmed = input.trim().toLowerCase();

        if (!trimmed) {
            setError("Email cannot be empty ❌");
            return;
        }

        const validationError = validateEmail(trimmed);
        if (validationError) {
            setError(validationError);
            return;
        }

        // Duplicate validation
        const isDuplicate = emails.some(
            (item) =>
                String(item?.assigned_to || "")
                    .toLowerCase()
                    .trim() === trimmed
        );

        if (isDuplicate) {
            setError("Email already exists ⚠️");
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("userID", userName);
            formData.append("assigned_to", trimmed);
            const res = await postData(API.CREATE, formData);

            console.log("CREATE RESPONSE:", res);

            setInput("");
            setError("");
            await fetchEmails();
        } catch (err) {
            console.error("ADD ERROR:", err);
            setError("Failed to add email ❌");
        } finally {
            setLoading(false);
        }
    };

    // ─────────────────────────────────────────────────────────
    // DELETE EMAIL
    // ─────────────────────────────────────────────────────────
    const handleDelete = (item) => {
        const pk = item?.id;

        if (!pk) {
            console.error("No ID found");
            return;
        }

        Swal.fire({
            title: "Delete Email?",
            text: `Remove "${item?.assigned_to}" ?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "Cancel",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await deleteData(API.DELETE(pk));
                    console.log("DELETE RESPONSE:", res);

                    Swal.fire("Deleted!", "Email deleted successfully.", "success");
                    await fetchEmails();
                } catch (err) {
                    console.error("DELETE ERROR:", err);
                    Swal.fire("Error", "Failed to delete email.", "error");
                }
            }
        });
    };

    // ─────────────────────────────────────────────────────────
    // UPDATE EMAIL
    // ─────────────────────────────────────────────────────────
    const handleUpdate = (item) => {
        const pk = item?.id;
        if (!pk) return;

        Swal.fire({
            title: "Update Email",
            input: "text",
            inputValue: item?.assigned_to || "",
            showCancelButton: true,
            confirmButtonText: "Update",
            inputValidator: (value) => {
                if (!value.trim()) return "Email cannot be empty!";
                const err = validateEmail(value.trim().toLowerCase());
                if (err) return err;
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const formData = new FormData();
                    formData.append("assigned_to", result.value.trim().toLowerCase());

                    const res = await putData(API.UPDATE(pk), formData);
                    console.log("UPDATE RESPONSE:", res);

                    Swal.fire("Updated!", "Email updated successfully.", "success");
                    await fetchEmails();
                } catch (err) {
                    console.error("UPDATE ERROR:", err);
                    Swal.fire("Error", "Failed to update email.", "error");
                }
            }
        });
    };

    // ─────────────────────────────────────────────────────────
    // LABEL
    // ─────────────────────────────────────────────────────────
    const getLabel = (item) => {
        if (typeof item === "string") return item;
        return item?.assigned_to || item?.email || "Email";
    };

    // ─────────────────────────────────────────────────────────
    // UI
    // ─────────────────────────────────────────────────────────
    return (
        <Box sx={{ p: 3 }}>
            {/* Breadcrumb */}
            <Box m={1} ml={2}>
                <div style={{ margin: 10, marginLeft: -20, marginTop: -20 }}>
                    <Breadcrumbs
                        separator={<KeyboardArrowRightIcon fontSize="small" />}
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
                            onClick={() => navigate("/tools/daily_task_review")}
                        >
                            Daily Task Review
                        </Link>

                        <Typography color="text.primary">
                            Add Email
                        </Typography>
                    </Breadcrumbs>
                </div>
            </Box>

            {/* Heading */}
            <Typography sx={{ fontWeight: "bold", mb: 1 }}>
                Add Reporting Email:
            </Typography>

            {/* Allowed domains hint */}
            <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mb: 1, display: "block" }}
            >
                Allowed domains:{" "}
                {ALLOWED_DOMAINS.map((d, i) => (
                    <strong key={d}>
                        @{d}{i < ALLOWED_DOMAINS.length - 1 ? ", " : ""}
                    </strong>
                ))}
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
                    const inp = e.currentTarget.querySelector("input");
                    if (inp) inp.focus();
                }}
            >
                {/* Chips */}
                {emails.map((item, index) => (
                    <Tooltip
                        key={item?.id || index}
                        title="Double-click to edit"
                        arrow
                    >
                        <Chip
                            label={getLabel(item)}
                            onDelete={() => handleDelete(item)}
                            onDoubleClick={() => handleUpdate(item)}
                            deleteIcon={<CloseIcon />}
                            sx={{
                                bgcolor: "#e8f5e9",
                                fontWeight: 500,
                                cursor: "pointer",
                                "&:hover": { bgcolor: "#c8e6c9" },
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
                            : "Enter email and press Enter..."
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
                            emails.length > 0
                        ) {
                            handleDelete(emails[emails.length - 1]);
                        }
                    }}
                    InputProps={{ disableUnderline: true }}
                    sx={{ flex: 1, minWidth: "260px" }}
                />
            </Paper>

            {/* Helper Text */}
            <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, display: "block" }}
            >
                Press <strong>Enter</strong> to add ·{" "}
                <strong>Double-click</strong> a chip to edit ·{" "}
                <strong>✕</strong> to delete
            </Typography>

            {/* Error */}
            {error && (
                <Typography sx={{ color: "red", mt: 1, fontSize: 13 }}>
                    {error}
                </Typography>
            )}
        </Box>
    );
};

export default AddEmail;