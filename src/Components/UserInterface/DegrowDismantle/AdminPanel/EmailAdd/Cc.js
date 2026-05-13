
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
import { postData, getData } from "../../../../services/FetchNodeServices";
import Swal from "sweetalert2";

const Cc = () => {
  const [emails, setEmails] = useState([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  // ✅ Fetch CC emails
  const fetchCcEmails = async () => {
    try {
      const res = await getData("degrow_dismental/get_cc_mails/");
      setEmails(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCcEmails();
  }, []);

  // ✅ Validation
  const isValid = (email) => {
    const trimmed = email.trim();
    if (trimmed.includes(" ")) return false;

    const regex = /^[a-zA-Z0-9._%+-]+@(ust\.com|airtel\.com)$/;
    return regex.test(trimmed);
  };

  // ✅ Add CC email
  const handleAdd = async () => {
    const trimmed = input.trim();

    if (!isValid(trimmed)) {
      setError("Invalid email or domain ❌");
      return;
    }

    if (emails.find(e => e.email === trimmed)) {
      setError("Already exists ⚠️");
      return;
    }

    try {
      let formData = new FormData();
      formData.append("mail_type", "CC");
      formData.append("mailid", trimmed);

      await postData("degrow_dismental/add_mail/", formData);

      setInput("");
      setError("");
      fetchCcEmails();
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ Delete CC email
  const handleDelete = (email) => {
    Swal.fire({
      title: "Delete?",
      text: "Remove this email?",
      icon: "warning",
      showCancelButton: true,
    }).then(async (res) => {
      if (res.isConfirmed) {
        let formData = new FormData();
        formData.append("mailid", email);

        await postData("degrow_dismental/delete_mail/", formData);
        fetchCcEmails();
      }
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Title */}
      <Typography sx={{ fontWeight: "bold", mb: 1, fontSize: "18px" }}>
        Cc:
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
        {emails.map((item, i) => (
          <Chip
            key={i}
            label={item.email}
            onDelete={() => handleDelete(item.email)}
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
          placeholder="Enter CC email..."
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

export const MemoCc = React.memo(Cc);