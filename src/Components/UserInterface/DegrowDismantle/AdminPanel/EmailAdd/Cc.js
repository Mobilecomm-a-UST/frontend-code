// import React, { useState } from "react";
// import {
//     Box, Button, Dialog, DialogTitle, DialogContent,
//     DialogActions, TextField, IconButton, Chip, Stack, Typography
// } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import CloseIcon from "@mui/icons-material/Close";
// import { postData, getData } from "../../../../services/FetchNodeServices";
// import Swal from "sweetalert2";
// import { useEffect } from "react";

// const Cc = () => {
//     const [open, setOpen] = useState(false);

//     const [emails, setEmails] = useState([]);
//     const [tempEmails, setTempEmails] = useState([]);
//     const [input, setInput] = useState("");
//     const [error, setError] = useState("");

//     const fetchCcEmails = async () => {
//         try {
//             const response = await getData('degrow_dismental/get_cc_mails/')
//             console.log('Cc Emails response', response)
//             setEmails(response.data || []);
//         } catch (error) {
//             console.log('Error in fetching Cc emails', error)
//         }
//     }


//     const AddMailAPI = async () => {
//         try {
//             let formData = new FormData();
//             formData.append('mail_type', 'CC')
//             formData.append('mailid', tempEmails?.join(','))
//             const response = await postData('degrow_dismental/add_mail/', formData)
//             console.log('AddMailAPI response', response.data)
//             if (response) {
//                 Swal.fire({
//                     icon: "success",
//                     title: "Success",
//                     text: "Email added successfully.",
//                 });
//             }
//             fetchCcEmails();
//             setTempEmails([]);
//             setInput("");
//             setOpen(false);
//         } catch (error) {
//             Swal.fire({
//                 icon: "error",
//                 title: "Error",
//                 text: `Failed to update data: ${error.response?.data?.error || error.message}`,
//             });
//         }
//     }

//     const deleteAPIData = async (mailid) => {
//         try {
//             let formData = new FormData();
//             formData.append('mailid', mailid)
//             const response = await postData('degrow_dismental/delete_mail/', formData)
//             console.log('DeleteAPI response', response.data)
//             if (response) {
//                 Swal.fire({
//                     icon: "success",
//                     title: "Success",
//                     text: "Email deleted successfully.",
//                 });
//             }
//             fetchCcEmails();

//         } catch (error) {
//             Swal.fire({
//                 icon: "error",
//                 title: "Error",
//                 text: `Failed to delete email: ${error.response?.data?.error || error.message}`,
//             });
//         }

//     }




//     const isValid = (email) => {
//         const trimmed = email.trim();

     
//         if (trimmed.includes(" ")) return false;

        
//         const regex = /^[a-zA-Z0-9._%+-]+@(ust\.com|airtel\.com)$/;

//         return regex.test(trimmed);
//     };



//     const handleAdd = () => {
//         const trimmed = input.trim();

//         if (trimmed.includes(" ")) {
//             setError("Spaces are not allowed ❌");
//             return;
//         }

//         if (!isValid(trimmed)) {
//             setError("Only @ust.com or @airtel.com emails allowed ❌");
//             return;
//         }

//         if (tempEmails.includes(trimmed)) {
//             setError("Email already added ⚠️");
//             return;
//         }

//         setTempEmails([...tempEmails, trimmed]);
//         setInput("");
//         setError("");
//     };

//     const handleSave = () => {
//         setEmails([...emails, ...tempEmails]);
        
//     };

//     const handleCancel = () => {
//         setTempEmails([]);
//         setInput("");
//         setOpen(false);
//     };
//     useEffect(() => {
//         fetchCcEmails()
//     }, [])


//     return (
//         <>
//             <h5>
//                 <Box
//                     sx={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         alignItems: "center",
//                         mb: 2
//                     }}
//                 >
//                     <Typography variant="h6" sx={{ fontWeight: "bold" }}>
//                         Cc Emails:
//                     </Typography>

//                     <Button
//                         startIcon={<AddIcon />}
//                         variant="contained"
//                         onClick={() => setOpen(true)}
//                         sx={{
//                             textTransform: "none",
//                             borderRadius: "8px",
//                             px: 2,
//                              background: "linear-gradient(135deg, #1c6b64 0%, #16897a 100%)",
//                             color: "#fff",
//                             boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
//                             "&:hover": {
//                                 background: "linear-gradient(135deg, #16897a 0%, #1c6b64 100%)"
//                             }
//                         }}
//                     >
//                         Add Cc Mail
//                     </Button>
//                 </Box>

//                 <Box
//                     sx={{
//                         p: 4,
//                         bgcolor: "#ffffff",
//                         borderRadius: 3,
//                         boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
//                         border: "1px solid #eee"
//                     }}
//                 >
                  
//                     <Stack
//                         direction="row"
//                         spacing={1}
//                         flexWrap="wrap"
//                         sx={{ gap: 1 }}
//                     >
//                         {emails.map((item, i) => (
//                             <Chip
//                                 key={i}
//                                 label={item.email}
//                                 onDelete={() => deleteAPIData(item.email)}
//                                 deleteIcon={<CloseIcon />}
//                                 sx={{
//                                     bgcolor: "#e3f2fd",
//                                     fontWeight: 500,
//                                     borderRadius: "6px",
//                                     "& .MuiChip-deleteIcon": {
//                                         color: "#d32f2f"
//                                     }
//                                 }}
//                             />
//                         ))}
//                     </Stack>

                   
//                     <Dialog
//                         open={open}
//                         onClose={handleCancel}
//                         maxWidth="sm"
//                         fullWidth
//                         PaperProps={{
//                             sx: {
//                                 borderRadius: 3,
//                                 p: 1,
//                                 boxShadow: "0px 6px 20px rgba(0,0,0,0.2)"
//                             }
//                         }}
//                     >
//                         <DialogTitle
//                             sx={{
//                                 fontWeight: "bold",
//                                 fontSize: "20px",
//                                 textAlign: "center",
//                                 pb: 1
//                             }}
//                         >
//                             Add Cc Email
//                         </DialogTitle>

//                         <DialogContent sx={{ px: 3, py: 2 }}>
                           
//                             <Box
//                                 sx={{
//                                     display: "flex",
//                                     gap: 1,
//                                     alignItems: "center",
//                                     bgcolor: "#f9f9f9",
//                                     p: 1.5,
//                                     borderRadius: 2,
//                                     border: "1px solid #ddd"
//                                 }}
//                             >
//                                 <TextField
//                                     fullWidth
//                                     size="small"
//                                     value={input}
//                                     onChange={(e) => {
//                                         setInput(e.target.value);
//                                         setError("");
//                                     }}
//                                     placeholder="Type Cc email"
//                                     error={!!error}
//                                     helperText={error}
//                                     sx={{
//                                         bgcolor: "#fff",
//                                         borderRadius: 1
//                                     }}
//                                 />

//                                 <IconButton
//                                     onClick={handleAdd}
//                                     sx={{
//                                         bgcolor: "#1976d2",
//                                         color: "#fff",
//                                         "&:hover": {
//                                             bgcolor: "#115293"
//                                         }
//                                     }}
//                                 >
//                                     <AddIcon />
//                                 </IconButton>
//                             </Box>

                           
//                             <Stack
//                                 direction="row"
//                                 spacing={1}
//                                 flexWrap="wrap"
//                                 sx={{
//                                     mt: 3,
//                                     minHeight: "60px",
//                                     border: "1px dashed #ccc",
//                                     p: 2,
//                                     borderRadius: 2,
//                                     gap: 1,
//                                     bgcolor: "#fafafa"
//                                 }}
//                             >
//                                 {tempEmails.length === 0 ? (
//                                     <Typography sx={{ color: "#888" }}>
//                                         No emails added
//                                     </Typography>
//                                 ) : (
//                                     tempEmails.map((mail, i) => (
//                                         <Chip
//                                             key={i}
//                                             label={mail}
//                                             onDelete={() =>
//                                                 setTempEmails(tempEmails.filter(e => e !== mail))
//                                             }
//                                             sx={{
//                                                 bgcolor: "#e3f2fd",
//                                                 fontWeight: 500,
//                                                 "& .MuiChip-deleteIcon": {
//                                                     color: "#d32f2f"
//                                                 }
//                                             }}
//                                         />
//                                     ))
//                                 )}
//                             </Stack>
//                         </DialogContent>

//                         <DialogActions
//                             sx={{
//                                 px: 3,
//                                 pb: 2,
//                                 justifyContent: "space-between"
//                             }}
//                         >
//                             <Button
//                                 onClick={handleCancel}
//                                 sx={{
//                                     color: "red",
//                                     fontWeight: "bold",
//                                     textTransform: "none"
//                                 }}
//                             >
//                                 Cancel
//                             </Button>

//                             <Button
//                                 variant="contained"
//                                 onClick={AddMailAPI}
//                                 sx={{
//                                     px: 3,
//                                     borderRadius: 2,
//                                     textTransform: "none",
//                                     bgcolor: "#1976d2",
//                                     "&:hover": { bgcolor: "#115293" }
//                                 }}
//                             >
//                                 Save
//                             </Button>
//                         </DialogActions>
//                     </Dialog>
//                 </Box>
//             </h5>
//         </>

//     );
// };

// export default Cc;
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