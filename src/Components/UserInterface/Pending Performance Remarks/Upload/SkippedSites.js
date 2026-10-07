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
import { postData } from "../../../services/FetchNodeServices";

const Skipped = () => {
  // Teal color matching sidebar
  const TEAL_PRIMARY = '#008080';
  const TEAL_DARK = '#005555';
  const TEAL_LIGHT = '#00a6a6';

  // API Configuration
  const SUBMIT_ENDPOINT = 'pending_performance_at_remarks/ssites/';
  const DOWNLOAD_ENDPOINT = 'pending_performance_at_remarks/ssites/download/';

  // Form state
  const [formData, setFormData] = useState({
    site: '',
    status: '',
    reason: '',
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // ✅ Use postData function for POST request with authorization
      const requestBody = {
        site: formData.site.trim(),
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
          status: '',
          reason: '',
        });

        setSuccessMessage(
          data.message || 'Data submitted successfully!'
        );

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

  // ✅ UPDATED: Handle download - Only use download_url from response
  const handleDownload = async () => {
    setDownloading(true);
    setErrorMessage('');

    try {
      // Get download URL from API using postData function
      const response = await postData(DOWNLOAD_ENDPOINT, {});

      // Check if response contains download_url
      if (response && response !== false && response.download_url) {
        // ✅ Directly use the download_url from API response
        const downloadUrl = response.download_url;
        
        // Create and trigger download link
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setSuccessMessage('Data downloaded successfully!');
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } else {
        throw new Error('Download URL not found in response. Please try again.');
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      setErrorMessage(
        error.message || 'Failed to download data. Please try again.'
      );
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3}>
        {/* Header */}
        <Paper elevation={0} sx={{ p: 3, bgcolor: '#f5f5f5', borderRadius: 2 }}>
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
            subtitle="Add new skipped item record"
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
                      '& .MuiInputBase-input::placeholder': {
                        color: '#999',
                        opacity: 1,
                      },
                    }}
                    InputLabelProps={{
                      sx: {
                        '&.Mui-focused': {
                          color: TEAL_PRIMARY,
                        },
                      },
                    }}
                  />
                </Grid>

                {/* Status Field - Text Input */}
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
                      '& .MuiInputBase-input::placeholder': {
                        color: '#999',
                        opacity: 1,
                      },
                    }}
                    InputLabelProps={{
                      sx: {
                        '&.Mui-focused': {
                          color: TEAL_PRIMARY,
                        },
                      },
                    }}
                  />
                </Grid>

                {/* Reason Field - Full Width */}
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
                      '& .MuiInputBase-input::placeholder': {
                        color: '#999',
                        opacity: 1,
                      },
                    }}
                    InputLabelProps={{
                      sx: {
                        '&.Mui-focused': {
                          color: TEAL_PRIMARY,
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
                    '&:disabled': {
                      bgcolor: '#ccc',
                    },
                  }}
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  startIcon={
                    downloading ? <CircularProgress size={20} /> : <CloudDownloadIcon />
                  }
                  onClick={handleDownload}
                  disabled={downloading || loading}
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
                  {downloading ? 'Downloading...' : 'Download Excel'}
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>

        {/* Info Box */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            bgcolor: `${TEAL_PRIMARY}15`,
            borderLeft: `4px solid ${TEAL_PRIMARY}`,
            borderRadius: 1,
          }}
        >
          <Typography variant="body2" sx={{ color: TEAL_DARK }}>
            <strong>Note:</strong> All submitted data is stored securely and can be
            downloaded in Excel format at any time using the download button above.
          </Typography>
        </Paper>
      </Stack>
    </Container>
  );
};

export default Skipped;