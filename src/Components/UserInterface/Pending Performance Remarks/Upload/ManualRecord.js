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

    try {
      const requestBody = {
        site_id: formData.site_id.trim(),
        at_ref_no: formData.at_ref_no.trim(),
        remark: formData.remark.trim(),
      };

      const data = await postData(MANUAL_RECORD_ENDPOINT, requestBody);

      // Check if response was successful
      if (data && data.status) {
        // Clear form
        setFormData({
          site_id: '',
          at_ref_no: '',
          remark: '',
        });

        let successText = data.message || 'Record added successfully!';
        if (data.created_by) {
          successText += ` (Created by: ${data.created_by})`;
        }

        setSuccessMessage(successText);

        // Clear success message after 4 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 4000);
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

  // Handle report download action using the manual-record endpoint
  const handleDownloadClick = async () => {
    setDownloading(true);
    setErrorMessage('');
    try {
      window.open(MANUAL_RECORD_ENDPOINT, '_blank');
      setSuccessMessage('Download started successfully!');
    } catch (e) {
      console.error('Error downloading report:', e);
      setErrorMessage('Failed to download report. Please try again.');
    } finally {
      setDownloading(false);
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
              Skipped Items
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ color: 'text.secondary', mt: 0.5 }}
            >
              Record manually skipped items with their status and reason
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="medium"
            startIcon={downloading ? <CircularProgress size={18} color="inherit" /> : <CloudDownloadIcon />}
            onClick={handleDownloadClick}
            disabled={downloading}
            sx={{ 
              bgcolor: TEAL_PRIMARY,
              color: 'white',
              fontWeight: 600,
              px: 3,
              py: 1,
              '&:hover': {
                bgcolor: TEAL_DARK,
              },
              '&:disabled': {
                bgcolor: '#e0e0e0',
                color: '#9e9e9e',
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
                        },
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
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
};

export default Skipped;