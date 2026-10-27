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
import { postData, ServerURL } from "../../../services/FetchNodeServices";
import { getDecreyptedData } from "../../../utils/localstorage";

const ManualRecord = () => {
  // Teal color matching sidebar
  const TEAL_PRIMARY = '#008080';
  const TEAL_DARK = '#005555';

  // API Endpoint
  const MANUAL_RECORD_ENDPOINT = 'pending_performance_at_remarks/manual-record/';

  // Form state
  const [formData, setFormData] = useState({
    site_id: '',
    at_ref_no: '',
    remark: '',
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
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
    if (!formData.site_id.trim() && !formData.at_ref_no.trim()) {
      setErrorMessage('Please enter either Site ID or AT Reference No.');
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
    setDownloadUrl('');

    try {
      const requestBody = {
        site_id: formData.site_id.trim(),
        at_ref_no: formData.at_ref_no.trim() || null,
        remark: formData.remark.trim(),
        download_url: 'true',
      };

      const data = await postData(MANUAL_RECORD_ENDPOINT, requestBody);

      console.log('Response from API:', data);

      // Check for error response (status: false with message key)
      if (data?.status === false && data?.message) {
        setErrorMessage(data.message);
        return;
      }

      // Check if response has error key
      if (data?.error) {
        setErrorMessage(data.error);
        return;
      }

      // Check if response was successful with message key
      if (data?.message) {
        // Extract download URL if present
        if (data.download_url) {
          setDownloadUrl(data.download_url);
        }

        // Clear form
        setFormData({
          site_id: '',
          at_ref_no: '',
          remark: '',
        });

        setSuccessMessage(data.message);

        // Clear success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
      } else {
        throw new Error(data?.message || 'Failed to submit data');
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

  // Handle report download - Download full report
  const handleDownloadFullReport = async () => {
    setDownloading(true);
    setErrorMessage('');
    try {
      const response = await postData(MANUAL_RECORD_ENDPOINT, {
        download_url: 'true',
      });

      console.log('Download response:', response);

      // Check for error response (status: false with message key)
      if (response?.status === false && response?.message) {
        setErrorMessage(response.message);
        return;
      }

      // Check if response has error key
      if (response?.error) {
        setErrorMessage(response.error);
        return;
      }

      // Check if download URL is available
      if (response?.download_url) {
        // Check if URL is absolute or relative
        const url = response.download_url.startsWith('http') 
          ? response.download_url 
          : `${ServerURL}${response.download_url}`;
        
        window.open(url, '_blank');
        setSuccessMessage('Download started successfully!');
        
        // Clear message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } else {
        // Show message from backend if no download URL
        setErrorMessage(response?.message || 'No download URL available');
      }
    } catch (error) {
      console.error('Error downloading report:', error);
      setErrorMessage(error.message || 'Failed to download report. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  // Handle download from success response
  const handleDownloadFromSuccess = () => {
    if (downloadUrl) {
      const url = downloadUrl.startsWith('http') 
        ? downloadUrl 
        : `${ServerURL}${downloadUrl}`;
      
      window.open(url, '_blank');
      setSuccessMessage('');
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3}>
        {/* Header with Always-Enabled Download Button */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            bgcolor: '#f5f5f5', 
            borderRadius: 2, 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            flexWrap: 'wrap', 
            gap: 2 
          }}
        >
          <Box>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ fontWeight: 600, color: TEAL_DARK }}
            >
              Manual Record
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="medium"
            startIcon={downloading ? <CircularProgress size={18} color="inherit" /> : <CloudDownloadIcon />}
            onClick={handleDownloadFullReport}
            disabled={downloading}
            sx={{ 
              bgcolor: TEAL_PRIMARY,
              color: 'white',
              fontWeight: 600,
              px: 3,
              py: 1,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              boxShadow: '0 4px 12px rgba(0, 128, 128, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: TEAL_DARK,
                boxShadow: '0 6px 20px rgba(0, 128, 128, 0.4)',
                transform: 'translateY(-2px)',
              },
              '&:disabled': {
                bgcolor: '#e0e0e0',
                color: '#9e9e9e',
              },
            }}
          >
            {downloading ? 'Downloading...' : 'Download Report'}
          </Button>
        </Paper>

        {/* Alert Messages */}
        {successMessage && (
          <Alert 
            severity="success" 
            onClose={() => setSuccessMessage('')}
            action={
              downloadUrl && (
                <Button 
                  color="inherit" 
                  size="small" 
                  onClick={handleDownloadFromSuccess}
                  sx={{ fontWeight: 600 }}
                >
                  Download Now
                </Button>
              )
            }
            sx={{
              backgroundColor: '#e8f5e9',
              color: '#2e7d32',
              '& .MuiAlert-icon': {
                color: '#4caf50',
              },
            }}
          >
            {successMessage}
          </Alert>
        )}

        {errorMessage && (
          <Alert 
            severity="error" 
            onClose={() => setErrorMessage('')}
            sx={{
              backgroundColor: '#ffebee',
              color: '#c62828',
              '& .MuiAlert-icon': {
                color: '#f44336',
              },
            }}
          >
            {errorMessage}
          </Alert>
        )}

        {/* Form Card */}
        <Card 
          elevation={2} 
          sx={{ 
            borderRadius: 2,
            borderTop: `4px solid ${TEAL_PRIMARY}`,
            boxShadow: '0 4px 16px rgba(0, 128, 128, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 6px 24px rgba(0, 128, 128, 0.15)',
            },
          }}
        >
          <CardHeader
            title="Manual Entry"
            subheader="Add new skipped item record"
            sx={{ 
              borderBottom: `1px solid #eee`,
              '& .MuiCardHeader-title': {
                color: TEAL_DARK,
                fontWeight: 600,
                letterSpacing: '0.5px',
              },
              '& .MuiCardHeader-subheader': {
                color: '#999',
              },
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
                    label="Site ID"
                    name="site_id"
                    value={formData.site_id}
                    onChange={handleInputChange}
                    placeholder="Enter site ID (e.g., SOWC21)"
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
                          borderWidth: '2px',
                        },
                      },
                      '& .MuiOutlinedInput-input::placeholder': {
                        opacity: 0.7,
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
                    placeholder="Enter AT Reference No (e.g., AT-309603)"
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
                          borderWidth: '2px',
                        },
                      },
                      '& .MuiOutlinedInput-input::placeholder': {
                        opacity: 0.7,
                      },
                    }}
                  />
                </Grid>

                {/* Remark Field */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Remark"
                    name="remark"
                    value={formData.remark}
                    onChange={handleInputChange}
                    placeholder="Enter remark"
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
                          borderWidth: '2px',
                        },
                      },
                      '& .MuiOutlinedInput-input::placeholder': {
                        opacity: 0.7,
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
                    fontWeight: 600,
                    fontSize: '14px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    boxShadow: '0 4px 12px rgba(0, 128, 128, 0.3)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: TEAL_DARK,
                      boxShadow: '0 6px 20px rgba(0, 128, 128, 0.4)',
                      transform: 'translateY(-2px)',
                    },
                    '&:disabled': {
                      bgcolor: '#e0e0e0',
                      color: '#9e9e9e',
                    },
                  }}
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
};

export default ManualRecord;