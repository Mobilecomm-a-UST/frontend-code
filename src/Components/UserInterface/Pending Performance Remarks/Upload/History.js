import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Alert,
  CircularProgress,
  Stack,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  Button,
  InputAdornment,
  Pagination,
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SearchIcon from '@mui/icons-material/Search';
import { postData } from "../../../services/FetchNodeServices";

const HistoryComponentFixed = () => {
  // Teal color matching sidebar
  const TEAL_PRIMARY = '#008080';
  const TEAL_DARK = '#005555';
  const TEAL_LIGHT = '#00a6a6';

  // API Configuration - POST method endpoint
  const API_HISTORY_ENDPOINT = 'pending_performance_at_remarks/history/';

  // State
  const [searchAtRefNo, setSearchAtRefNo] = useState('');
  const [historyData, setHistoryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ✅ Group history by timestamp
  const groupHistoryByTimestamp = (history) => {
    const grouped = {};
    history.forEach((item) => {
      if (!grouped[item.updated_at]) {
        grouped[item.updated_at] = [];
      }
      grouped[item.updated_at].push(item.field);
    });
    return Object.entries(grouped)
      .map(([timestamp, fields]) => ({
        updated_at: timestamp,
        fields: fields,
        field_count: fields.length,
      }))
      .reverse(); // Most recent first
  };

  // ✅ Fetch data from API using postData with at_ref_no in body
  const handleSearch = async () => {
    const trimmedRef = searchAtRefNo.trim().toUpperCase();

    if (!trimmedRef) {
      setErrorMessage('Please enter an At Reference No.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSearchAttempted(true);
    setCurrentPage(1); // Reset pagination

    try {
      // ✅ POST request using postData function with at_ref_no in request body
      const requestBody = {
        at_ref_no: trimmedRef,
      };

      const data = await postData(API_HISTORY_ENDPOINT, requestBody);

      // Check if data exists and status is true
      if (data && data.status) {
        setHistoryData(data);
        setErrorMessage('');
      } else {
        setErrorMessage(`No data found for reference number: ${trimmedRef}`);
        setHistoryData(null);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
      setErrorMessage(
        error.message === 'Failed to fetch'
          ? 'Unable to connect to the server. Please check your API endpoint.'
          : `Error: ${error.message}`
      );
      setHistoryData(null);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle pagination
  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ✅ Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // ✅ Handle Clear
  const handleClear = () => {
    setSearchAtRefNo('');
    setHistoryData(null);
    setErrorMessage('');
    setSearchAttempted(false);
    setCurrentPage(1);
  };

  // ✅ Get paginated data
  const getPaginatedHistory = () => {
    if (!historyData || !historyData.history) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    return historyData.history.slice(startIndex, startIndex + itemsPerPage);
  };

  // ✅ Calculate total pages
  const totalPages = historyData
    ? Math.ceil(historyData.history.length / itemsPerPage)
    : 0;

  const paginatedData = getPaginatedHistory();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        {/* Header */}
        <Paper elevation={0} sx={{ p: 3, bgcolor: '#f5f5f5', borderRadius: 2 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: 600, mb: 1, color: TEAL_DARK }}
          >
            <HistoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Update History
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Search and view detailed update history for any At Reference Number
          </Typography>
        </Paper>

        {/* Search Card */}
        <Card elevation={2} sx={{ borderRadius: 2, borderTop: `4px solid ${TEAL_PRIMARY}` }}>
          <CardHeader
            title="Search by At Reference No"
            subtitle="Enter an At Reference No. to view its update history"
            sx={{
              borderBottom: `1px solid #eee`,
              '& .MuiCardHeader-title': {
                color: TEAL_DARK,
              },
            }}
          />
          <CardContent>
            <Stack spacing={2}>
              {/* Search Input */}
              <TextField
                fullWidth
                label="At Reference No"
                placeholder="e.g., AT-290474"
                value={searchAtRefNo}
                onChange={(e) => setSearchAtRefNo(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: TEAL_PRIMARY }} />
                    </InputAdornment>
                  ),
                }}
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

              {/* Buttons */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <Button
                  variant="contained"
                  onClick={handleSearch}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
                  sx={{
                    bgcolor: TEAL_PRIMARY,
                    '&:hover': {
                      bgcolor: TEAL_DARK,
                    },
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  {loading ? 'Searching...' : 'Search'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleClear}
                  disabled={loading || !searchAttempted}
                  sx={{
                    borderColor: TEAL_PRIMARY,
                    color: TEAL_PRIMARY,
                    '&:hover': {
                      borderColor: TEAL_DARK,
                      bgcolor: `${TEAL_PRIMARY}08`,
                    },
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Clear
                </Button>
              </Stack>

              {/* Info Box */}
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: `${TEAL_LIGHT}15`,
                  borderLeft: `3px solid ${TEAL_LIGHT}`,
                  borderRadius: 1,
                }}
              >
                <Typography variant="body2" sx={{ color: TEAL_DARK, fontSize: '0.9rem' }}>
                  <strong>💡 Example:</strong> Enter AT-290474 to fetch its update history
                </Typography>
              </Paper>
            </Stack>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <Stack alignItems="center" spacing={2}>
              <CircularProgress sx={{ color: TEAL_PRIMARY }} />
              <Typography color="text.secondary">Loading history data...</Typography>
            </Stack>
          </Box>
        )}

        {/* Error Alert */}
        {errorMessage && !loading && (
          <Alert severity="error" onClose={() => setErrorMessage('')}>
            {errorMessage}
          </Alert>
        )}

        {/* Results Section */}
        {historyData && !loading && searchAttempted && (
          <Stack spacing={2.5}>
            {/* Summary Card */}
            <Card
              elevation={2}
              sx={{
                borderRadius: 2,
                borderLeft: `4px solid ${TEAL_PRIMARY}`,
                background: `linear-gradient(135deg, ${TEAL_LIGHT}20 0%, transparent 100%)`,
              }}
            >
              <CardContent>
                <Grid container spacing={3}>
                  {/* Reference Number */}
                  <Grid item xs={12} sm={6} md={3}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                        Reference Number
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: TEAL_DARK,
                          mt: 0.5,
                          fontFamily: 'monospace',
                        }}
                      >
                        {historyData.at_ref_no}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Total Updates */}
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircleIcon sx={{ color: TEAL_PRIMARY, fontSize: '2rem' }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                          Total Updates
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: TEAL_DARK,
                            mt: 0.5,
                          }}
                        >
                          {historyData.total_updates || 0}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Fields Tracked */}
                  <Grid item xs={12} sm={6} md={3}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                        Fields Tracked
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: TEAL_DARK,
                          mt: 0.5,
                        }}
                      >
                        {historyData.history ? new Set(historyData.history.map(h => h.field)).size : 0}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Date Range */}
                  <Grid item xs={12} sm={6} md={3}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                        Latest Update
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: TEAL_DARK,
                          mt: 0.5,
                          fontSize: '0.9rem',
                        }}
                      >
                        {historyData.history && historyData.history.length > 0
                          ? historyData.history[0].updated_at
                          : 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* History Table with Pagination */}
            <Card
              elevation={2}
              sx={{
                borderRadius: 2,
                borderTop: `4px solid ${TEAL_PRIMARY}`,
              }}
            >
              <CardHeader
                title="Update History"
                subtitle={`Showing ${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(currentPage * itemsPerPage, historyData.total_updates)} of ${historyData.total_updates} updates`}
                sx={{
                  borderBottom: `1px solid #eee`,
                  '& .MuiCardHeader-title': {
                    color: TEAL_DARK,
                  },
                }}
              />
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: `${TEAL_PRIMARY}15` }}>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          color: TEAL_DARK,
                          borderColor: `${TEAL_PRIMARY}40`,
                        }}
                      >
                        #
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          color: TEAL_DARK,
                          borderColor: `${TEAL_PRIMARY}40`,
                        }}
                      >
                        Field
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          color: TEAL_DARK,
                          borderColor: `${TEAL_PRIMARY}40`,
                        }}
                        align="right"
                      >
                        Last Updated
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedData && paginatedData.length > 0 ? (
                      paginatedData.map((item, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            '&:hover': {
                              backgroundColor: `${TEAL_PRIMARY}08`,
                            },
                            '&:last-child td, &:last-child th': {
                              border: 0,
                            },
                          }}
                        >
                          <TableCell
                            sx={{
                              fontWeight: 600,
                              color: TEAL_PRIMARY,
                              borderColor: `${TEAL_PRIMARY}20`,
                              width: '40px',
                            }}
                          >
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 500,
                              color: '#333',
                              borderColor: `${TEAL_PRIMARY}20`,
                            }}
                          >
                            <Chip
                              label={item.field}
                              size="small"
                              sx={{
                                bgcolor: `${TEAL_PRIMARY}20`,
                                color: TEAL_DARK,
                                fontWeight: 500,
                              }}
                            />
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              color: '#666',
                              fontFamily: 'monospace',
                              fontSize: '0.9rem',
                              borderColor: `${TEAL_PRIMARY}20`,
                            }}
                          >
                            {item.updated_at}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                          <Typography color="text.secondary">
                            No update history found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        color: TEAL_PRIMARY,
                      },
                      '& .MuiPaginationItem-page.Mui-selected': {
                        backgroundColor: TEAL_PRIMARY,
                        color: '#fff',
                      },
                    }}
                  />
                </Box>
              )}
            </Card>

            {/* Grouped Timeline View */}
            {historyData.history && historyData.history.length > 0 && (
              <Card
                elevation={2}
                sx={{
                  borderRadius: 2,
                  borderLeft: `4px solid ${TEAL_LIGHT}`,
                }}
              >
                <CardHeader
                  title="Timeline View"
                  subtitle="Updates grouped by timestamp"
                  sx={{
                    borderBottom: `1px solid #eee`,
                    '& .MuiCardHeader-title': {
                      color: TEAL_DARK,
                    },
                  }}
                />
                <CardContent>
                  <Stack spacing={2.5}>
                    {groupHistoryByTimestamp(historyData.history).map((group, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          gap: 2,
                          pb: 2,
                          borderBottom:
                            index < groupHistoryByTimestamp(historyData.history).length - 1
                              ? `1px solid #eee`
                              : 'none',
                        }}
                      >
                        {/* Timeline dot */}
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            backgroundColor: TEAL_PRIMARY,
                            mt: 0.5,
                            flexShrink: 0,
                            border: `3px solid white`,
                            boxShadow: `0 0 0 2px ${TEAL_PRIMARY}`,
                          }}
                        />

                        {/* Content */}
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: TEAL_DARK,
                              mb: 1,
                            }}
                          >
                            {group.updated_at}
                          </Typography>
                          <Stack direction="row" spacing={0.75} sx={{ flexWrap: 'wrap' }}>
                            {group.fields.map((field, idx) => (
                              <Chip
                                key={idx}
                                label={field}
                                size="small"
                                sx={{
                                  bgcolor: `${TEAL_LIGHT}30`,
                                  color: TEAL_DARK,
                                  fontWeight: 500,
                                  mb: 0.5,
                                }}
                              />
                            ))}
                          </Stack>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              display: 'block',
                              mt: 1,
                            }}
                          >
                            {group.field_count} field(s) updated
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            )}

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
              <Stack direction="row" spacing={1} alignItems="flex-start">
                <CheckCircleIcon sx={{ color: TEAL_PRIMARY, mt: 0.3, flexShrink: 0 }} />
                <Box>
                  <Typography variant="body2" sx={{ color: TEAL_DARK }}>
                    <strong>Info:</strong> Complete update history for reference number{' '}
                    <strong>{historyData.at_ref_no}</strong>. Total of{' '}
                    <strong>{historyData.total_updates}</strong> updates across{' '}
                    <strong>{historyData.history ? new Set(historyData.history.map(h => h.field)).size : 0}</strong>{' '}
                    fields.
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Stack>
        )}

        {/* Empty State */}
        {!historyData && !loading && searchAttempted && !errorMessage && (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: 'center',
              bgcolor: `${TEAL_PRIMARY}08`,
              borderRadius: 2,
              borderLeft: `4px solid ${TEAL_PRIMARY}`,
            }}
          >
            <HistoryIcon
              sx={{
                fontSize: '3rem',
                color: TEAL_LIGHT,
                mb: 1,
              }}
            />
            <Typography variant="h6" sx={{ color: TEAL_DARK, mb: 1 }}>
              No History Found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              No update history available for the searched reference number.
            </Typography>
          </Paper>
        )}
      </Stack>
    </Container>
  );
};

export default HistoryComponentFixed;