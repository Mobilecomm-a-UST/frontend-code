import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  TextField,
  Alert,
  CircularProgress,
  Stack,
  Paper,
  Typography,
} from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import SendIcon from '@mui/icons-material/Send';
import { postData, ServerURL, getData } from "../../../services/FetchNodeServices";
import axios from 'axios';
import { getDecreyptedData } from '../../../utils/localstorage';

const Skipped = () => {
  // Teal color matching sidebar
  const TEAL_PRIMARY = '#008080';
  const TEAL_DARK = '#005555';
  const TEAL_LIGHT = '#00a6a6';

  // API Endpoints
  const SUBMIT_ENDPOINT = 'pending_performance_at_remarks/ssites/';
  const DOWNLOAD_SKIPPED_ENDPOINT = 'pending_performance_at_remarks/dssites/';

  // Form state
  const [formData, setFormData] = useState({
    site: '',
    at_ref_no: '',
    status: '',
    reason: '',
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Stores the download URL returned directly from the submit/API response
  const [downloadUrl, setDownloadUrl] = useState('');

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    // Clear error messages when user starts typing
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  // Validate form
  const validateForm = () => {
    if (!formData.site.trim()) {
      setErrorMessage('Site field is required');
      return false;
    }
    if (!formData.at_ref_no.trim()) {
      setErrorMessage('AT Reference No field is required');
      return false;
    }
    if (!formData.status.trim()) {
      setErrorMessage('Status field is required');
      return false;
    }
    if (!formData.reason.trim()) {
      setErrorMessage('Reason field is required');
      return false;
    }
    return true;
  };

  // Handle form submission and capture download_url if provided in response
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const requestBody = {
        site: formData.site.trim(),
        at_ref_no: formData.at_ref_no.trim(),
        status: formData.status.trim(),
        reason: formData.reason.trim(),
        timestamp: new Date().toISOString(),
      };

      const data = await postData(SUBMIT_ENDPOINT, requestBody);

      // Check if response was successful
      if (data && data !== false) {
        // Clear form
        setFormData({
          site: '',
          at_ref_no: '',
          status: '',
          reason: '',
        });

        setSuccessMessage(
          data.message || 'Data submitted successfully!'
        );

        // ✅ Extract and store download_url if present in the response
        if (data.download_url) {
          setDownloadUrl(data.download_url);
        }

        // Clear success message after 4 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 4000);
      } else {
        throw new Error('Failed to submit data');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage(
        error.message || 'Failed to submit data. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle download using ONLY the pre-existing download_url from state
  const handleDownloadClick = () => {
    if (!downloadUrl) {
      setErrorMessage('No download URL available yet. Please submit a record first.');
      return;
    }

    // Create and trigger download link
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ✅ Handle direct download for Skipped Sites via dssites/ endpoint
  const handleDownloadSkippedSites = async () => {
    setDownloading(true);
    setErrorMessage('');
    try {
      const response = await axios.post(`${ServerURL}/${DOWNLOAD_SKIPPED_ENDPOINT}`, {
        headers: { Authorization: `token ${getDecreyptedData("tokenKey")}` },
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'Skipped_Sites_Report.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
    } catch (err) {
      console.error('Error downloading skipped sites report:', err);
      // Fallback: try opening standard URL if blob request fails or returns JSON download URL
      try {
        const res = await postData(DOWNLOAD_SKIPPED_ENDPOINT);
        if (res && res.download_url) {
          const link = document.createElement('a');
          link.href = res.download_url;
          link.setAttribute('target', '_blank');
          link.setAttribute('rel', 'noopener noreferrer');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          setErrorMessage('Failed to download skipped sites report.');
        }
      } catch (e) {
        setErrorMessage('Failed to download skipped sites report. Please try again.');
      }
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3}>
        {/* Header with Download Skipped Sites Button on Right */}
        <Paper elevation={0} sx={{ p: 3, bgcolor: '#f5f5f5', borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ fontWeight: 600, mb: 1, color: TEAL_DARK }}
            >
              Skipped Items
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Record manually skipped items with their status and reason
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="medium"
            startIcon={downloading ? <CircularProgress size={18} color="inherit" /> : <CloudDownloadIcon />}
            onClick={handleDownloadSkippedSites}
            disabled={downloading}
            sx={{
              bgcolor: TEAL_PRIMARY,
              color: 'white',
              fontWeight: 600,
              '&:hover': {
                bgcolor: TEAL_DARK,
              },
            }}
          >
            {downloading ? 'Downloading...' : 'Download Skipped Sites Report'}
          </Button>
        </Paper>

        {/* Alert Messages */}
        {successMessage && (
          <Alert severity="success" onClose={() => setSuccessMessage('')}>
            {successMessage}
          </Alert>
        )}

        {errorMessage && (
          <Alert severity="error" onClose={() => setErrorMessage('')}>
            {errorMessage}
          </Alert>
        )}

        {/* Form Card */}
        <Card 
          elevation={2} 
          sx={{ 
            borderRadius: 2,
            borderTop: `4px solid ${TEAL_PRIMARY}`
          }}
        >
          <CardHeader
            title="Manual Entry"
            subheader="Add new skipped item record"
            sx={{ 
              borderBottom: `1px solid #eee`,
              '& .MuiCardHeader-title': {
                color: TEAL_DARK,
              }
            }}
          />
          <CardContent>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
            >
              {/* Grid layout for form fields */}
              <Grid container spacing={2.5}>
                {/* Site Field */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Site"
                    name="site"
                    value={formData.site}
                    onChange={handleInputChange}
                    placeholder="Enter site name or ID"
                    variant="outlined"
                    size="medium"
                    disabled={loading}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: TEAL_PRIMARY,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: TEAL_PRIMARY,
                        },
                      },
                    }}
                  />
                </Grid>

                {/* AT Reference No Field */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="AT Reference No"
                    name="at_ref_no"
                    value={formData.at_ref_no}
                    onChange={handleInputChange}
                    placeholder="Enter AT Reference No"
                    variant="outlined"
                    size="medium"
                    disabled={loading}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: TEAL_PRIMARY,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: TEAL_PRIMARY,
                        },
                      },
                    }}
                  />
                </Grid>

                {/* Status Field */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    placeholder="Enter status (e.g., Pending, In Progress)"
                    variant="outlined"
                    size="medium"
                    disabled={loading}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: TEAL_PRIMARY,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: TEAL_PRIMARY,
                        },
                      },
                    }}
                  />
                </Grid>

                {/* Reason Field */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    placeholder="Explain why this item was skipped"
                    variant="outlined"
                    multiline
                    minRows={4}
                    maxRows={6}
                    disabled={loading}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: TEAL_PRIMARY,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: TEAL_PRIMARY,
                        },
                      },
                    }}
                  />
                </Grid>
              </Grid>

              {/* Action Buttons */}
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{ mt: 1, justifyContent: 'flex-end' }}
              >
                <Button
                  variant="contained"
                  size="large"
                  type="submit"
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                  disabled={loading}
                  sx={{ 
                    minWidth: '140px',
                    bgcolor: TEAL_PRIMARY,
                    color: 'white',
                    '&:hover': {
                      bgcolor: TEAL_DARK,
                    },
                  }}
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<CloudDownloadIcon />}
                  onClick={handleDownloadClick}
                  disabled={loading || !downloadUrl}
                  sx={{ 
                    minWidth: '140px',
                    borderColor: TEAL_PRIMARY,
                    color: TEAL_PRIMARY,
                    '&:hover': {
                      borderColor: TEAL_DARK,
                      color: TEAL_DARK,
                      bgcolor: 'rgba(0, 128, 128, 0.04)',
                    },
                    '&:disabled': {
                      borderColor: '#ccc',
                      color: '#ccc',
                    },
                  }}
                >
                  Download Excel
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
};

export default Skipped;

// import React, { useState } from 'react';
// import {
//   Box,
//   Button,
//   Card,
//   CardContent,
//   CardHeader,
//   Container,
//   Grid,
//   TextField,
//   Alert,
//   CircularProgress,
//   Stack,
//   Paper,
//   Typography,
// } from '@mui/material';
// import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
// import SendIcon from '@mui/icons-material/Send';
// import { postData } from "../../../services/FetchNodeServices";

// const Skipped = () => {
//   // Teal color matching sidebar
//   const TEAL_PRIMARY = '#008080';
//   const TEAL_DARK = '#005555';
//   const TEAL_LIGHT = '#00a6a6';

//   // API Configuration (Only submission endpoint remains)
//   const SUBMIT_ENDPOINT = 'pending_performance_at_remarks/ssites/';

//   // Form state
//   const [formData, setFormData] = useState({
//     site: '',
//     at_ref_no: '',
//     status: '',
//     reason: '',
//   });

//   // UI state
//   const [loading, setLoading] = useState(false);
//   const [successMessage, setSuccessMessage] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
  
//   // Stores the download URL returned directly from the submit/API response
//   const [downloadUrl, setDownloadUrl] = useState('');

//   // Handle input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//     // Clear error messages when user starts typing
//     if (errorMessage) {
//       setErrorMessage('');
//     }
//   };

//   // Validate form
//   const validateForm = () => {
//     if (!formData.site.trim()) {
//       setErrorMessage('Site field is required');
//       return false;
//     }
//     if (!formData.at_ref_no.trim()) {
//       setErrorMessage('AT Reference No field is required');
//       return false;
//     }
//     if (!formData.status.trim()) {
//       setErrorMessage('Status field is required');
//       return false;
//     }
//     if (!formData.reason.trim()) {
//       setErrorMessage('Reason field is required');
//       return false;
//     }
//     return true;
//   };

//   // Handle form submission and capture download_url if provided in response
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     setLoading(true);
//     setErrorMessage('');
//     setSuccessMessage('');

//     try {
//       const requestBody = {
//         site: formData.site.trim(),
//         at_reference_no: formData.at_ref_no.trim(),
//         status: formData.status.trim(),
//         reason: formData.reason.trim(),
//         timestamp: new Date().toISOString(),
//       };

//       const data = await postData(SUBMIT_ENDPOINT, requestBody);

//       // Check if response was successful
//       if (data && data !== false) {
//         // Clear form
//         setFormData({
//           site: '',
//           at_ref_no: '',
//           status: '',
//           reason: '',
//         });

//         setSuccessMessage(
//           data.message || 'Data submitted successfully!'
//         );

//         // ✅ Extract and store download_url if present in the response
//         if (data.download_url) {
//           setDownloadUrl(data.download_url);
//         }

//         // Clear success message after 4 seconds
//         setTimeout(() => {
//           setSuccessMessage('');
//         }, 4000);
//       } else {
//         throw new Error('Failed to submit data');
//       }
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       setErrorMessage(
//         error.message || 'Failed to submit data. Please try again.'
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Handle download using ONLY the pre-existing download_url from state
//   const handleDownloadClick = () => {
//     if (!downloadUrl) {
//       setErrorMessage('No download URL available yet. Please submit a record first.');
//       return;
//     }

//     // Create and trigger download link
//     const link = document.createElement('a');
//     link.href = downloadUrl;
//     link.setAttribute('target', '_blank');
//     link.setAttribute('rel', 'noopener noreferrer');
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <Container maxWidth="md" sx={{ py: 4 }}>
//       <Stack spacing={3}>
//         {/* Header */}
//         <Paper elevation={0} sx={{ p: 3, bgcolor: '#f5f5f5', borderRadius: 2 }}>
//           <Typography 
//             variant="h4" 
//             component="h1" 
//             sx={{ fontWeight: 600, mb: 1, color: TEAL_DARK }}
//           >
//             Skipped Items
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             Record manually skipped items with their status and reason
//           </Typography>
//         </Paper>

//         {/* Alert Messages */}
//         {successMessage && (
//           <Alert severity="success" onClose={() => setSuccessMessage('')}>
//             {successMessage}
//           </Alert>
//         )}

//         {errorMessage && (
//           <Alert severity="error" onClose={() => setErrorMessage('')}>
//             {errorMessage}
//           </Alert>
//         )}

//         {/* Form Card */}
//         <Card 
//           elevation={2} 
//           sx={{ 
//             borderRadius: 2,
//             borderTop: `4px solid ${TEAL_PRIMARY}`
//           }}
//         >
//           <CardHeader
//             title="Manual Entry"
//             subheader="Add new skipped item record"
//             sx={{ 
//               borderBottom: `1px solid #eee`,
//               '& .MuiCardHeader-title': {
//                 color: TEAL_DARK,
//               }
//             }}
//           />
//           <CardContent>
//             <Box
//               component="form"
//               onSubmit={handleSubmit}
//               sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
//             >
//               {/* Grid layout for form fields */}
//               <Grid container spacing={2.5}>
//                 {/* Site Field */}
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     fullWidth
//                     label="Site"
//                     name="site"
//                     value={formData.site}
//                     onChange={handleInputChange}
//                     placeholder="Enter site name or ID"
//                     variant="outlined"
//                     size="medium"
//                     disabled={loading}
//                     sx={{
//                       '& .MuiOutlinedInput-root': {
//                         '&:hover fieldset': {
//                           borderColor: TEAL_PRIMARY,
//                         },
//                         '&.Mui-focused fieldset': {
//                           borderColor: TEAL_PRIMARY,
//                         },
//                       },
//                     }}
//                   />
//                 </Grid>

//                 {/* AT Reference No Field */}
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     fullWidth
//                     label="AT Reference No"
//                     name="at_ref_no"
//                     value={formData.at_ref_no}
//                     onChange={handleInputChange}
//                     placeholder="Enter AT Reference No"
//                     variant="outlined"
//                     size="medium"
//                     disabled={loading}
//                     sx={{
//                       '& .MuiOutlinedInput-root': {
//                         '&:hover fieldset': {
//                           borderColor: TEAL_PRIMARY,
//                         },
//                         '&.Mui-focused fieldset': {
//                           borderColor: TEAL_PRIMARY,
//                         },
//                       },
//                     }}
//                   />
//                 </Grid>

//                 {/* Status Field */}
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     fullWidth
//                     label="Status"
//                     name="status"
//                     value={formData.status}
//                     onChange={handleInputChange}
//                     placeholder="Enter status (e.g., Pending, In Progress)"
//                     variant="outlined"
//                     size="medium"
//                     disabled={loading}
//                     sx={{
//                       '& .MuiOutlinedInput-root': {
//                         '&:hover fieldset': {
//                           borderColor: TEAL_PRIMARY,
//                         },
//                         '&.Mui-focused fieldset': {
//                           borderColor: TEAL_PRIMARY,
//                         },
//                       },
//                     }}
//                   />
//                 </Grid>

//                 {/* Reason Field */}
//                 <Grid item xs={12}>
//                   <TextField
//                     fullWidth
//                     label="Reason"
//                     name="reason"
//                     value={formData.reason}
//                     onChange={handleInputChange}
//                     placeholder="Explain why this item was skipped"
//                     variant="outlined"
//                     multiline
//                     minRows={4}
//                     maxRows={6}
//                     disabled={loading}
//                     sx={{
//                       '& .MuiOutlinedInput-root': {
//                         '&:hover fieldset': {
//                           borderColor: TEAL_PRIMARY,
//                         },
//                         '&.Mui-focused fieldset': {
//                           borderColor: TEAL_PRIMARY,
//                         },
//                       },
//                     }}
//                   />
//                 </Grid>
//               </Grid>

//               {/* Action Buttons */}
//               <Stack
//                 direction={{ xs: 'column', sm: 'row' }}
//                 spacing={2}
//                 sx={{ mt: 1, justifyContent: 'flex-end' }}
//               >
//                 <Button
//                   variant="contained"
//                   size="large"
//                   type="submit"
//                   startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
//                   disabled={loading}
//                   sx={{ 
//                     minWidth: '140px',
//                     bgcolor: TEAL_PRIMARY,
//                     color: 'white',
//                     '&:hover': {
//                       bgcolor: TEAL_DARK,
//                     },
//                   }}
//                 >
//                   {loading ? 'Submitting...' : 'Submit'}
//                 </Button>

//                 <Button
//                   variant="outlined"
//                   size="large"
//                   startIcon={<CloudDownloadIcon />}
//                   onClick={handleDownloadClick}
//                   disabled={loading || !downloadUrl}
//                   sx={{ 
//                     minWidth: '140px',
//                     borderColor: TEAL_PRIMARY,
//                     color: TEAL_PRIMARY,
//                     '&:hover': {
//                       borderColor: TEAL_DARK,
//                       color: TEAL_DARK,
//                       bgcolor: 'rgba(0, 128, 128, 0.04)',
//                     },
//                     '&:disabled': {
//                       borderColor: '#ccc',
//                       color: '#ccc',
//                     },
//                   }}
//                 >
//                   Download Excel
//                 </Button>
//               </Stack>
//             </Box>
//           </CardContent>
//         </Card>
//       </Stack>
//     </Container>
//   );
// };

// export default Skipped;