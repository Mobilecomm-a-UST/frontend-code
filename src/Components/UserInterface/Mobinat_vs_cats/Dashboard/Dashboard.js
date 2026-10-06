import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
  Alert,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Chip,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';
import { Breadcrumbs, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [apiType, setApiType] = useState('count');
  const navigate = useNavigate();

  // API URLs
  const APIs = {
    summary: 'https://commtoolapi.mcpspmis.com/mobinate_vs_cats/reverse_reconciliation_circle_wise_summary_report/',
    count: 'https://commtoolapi.mcpspmis.com/mobinate_vs_cats/reverse_reconciliation_circle_wise_count_summary_report/',
  };

  // Teal color scheme matching sidebar
  const TEAL_COLOR = '#00897B';
  const LIGHT_TEAL = '#E0F2F1';
  const DARK_TEAL = '#004D40';

  // Fetch data from API
  const fetchData = async (type = apiType) => {
    setLoading(true);
    setError(null);
    setPage(0);
    try {
      const response = await fetch(APIs[type], {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const dataArray = Array.isArray(result) ? result : result.data || [];

      setData(dataArray);
      setFilteredData(dataArray);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  // Fetch data on component mount and when API type changes
  useEffect(() => {
    fetchData(apiType);
  }, [apiType]);

  // Handle search/filter
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    setPage(0);

    const filtered = data.filter((item) => {
      return Object.values(item).some((val) =>
        String(val).toLowerCase().includes(value)
      );
    });

    setFilteredData(filtered);
  };

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle API type change
  const handleApiTypeChange = (event, newType) => {
    if (newType !== null) {
      setApiType(newType);
    }
  };

  // Get table headers from first data object
  const getTableHeaders = () => {
    if (data.length === 0) return [];
    return Object.keys(data[0]);
  };

  // Download data as CSV
  const downloadCSV = () => {
    if (filteredData.length === 0) {
      alert('No data to download');
      return;
    }

    const headers = getTableHeaders();
    const csvContent = [
      headers.join(','),
      ...filteredData.map((row) =>
        headers.map((header) => {
          const value = row[header];
          const stringValue = String(value);
          return stringValue.includes(',') ? `"${stringValue}"` : stringValue;
        }).join(',')
      ),
    ].join('\n');

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent));
    element.setAttribute('download', `${apiType}-report-${new Date().toISOString().split('T')[0]}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Render loading state
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{ backgroundColor: '#f5f5f5' }}
      >
        <CircularProgress sx={{ color: TEAL_COLOR }} />
      </Box>
    );
  }

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>

      <div style={{ margin: 5, marginLeft: 10 }}>
                    <Breadcrumbs
                        aria-label="breadcrumb"
                        itemsBeforeCollapse={2}
                        maxItems={3}
                        separator={<KeyboardArrowRightIcon fontSize="small" />}
                    >
                        <Link underline="hover" onClick={() => navigate("/tools")} sx={{ cursor: "pointer" }}>
                            Tools
                        </Link>
                        <Link underline="hover" onClick={() => navigate("/tools/material_management")} sx={{ cursor: "pointer" }}>
                            Material Management
                        </Link>
                        <Typography color="text.primary">RECO DB Dashboard</Typography>
                    </Breadcrumbs>
                </div>
    
    <Container maxWidth="lg" sx={{ py: 4, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 'bold', color: DARK_TEAL }}
        >
          Reverse Reconciliation Report
        </Typography>

        {/* API Type Toggle */}
        <Box sx={{ mt: 2, mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, color: '#666' }}>
            Select Report Type:
          </Typography>
          <ToggleButtonGroup
            value={apiType}
            exclusive
            onChange={handleApiTypeChange}
            aria-label="api type"
          >

             <ToggleButton
              value="count"
              sx={{
                '&.Mui-selected': {
                  backgroundColor: TEAL_COLOR,
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: DARK_TEAL,
                  },
                },
              }}
            >
              Circle Wise Count Summary
            </ToggleButton>
            <ToggleButton
              value="summary"
              sx={{
                '&.Mui-selected': {
                  backgroundColor: TEAL_COLOR,
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: DARK_TEAL,
                  },
                },
              }}
            >
              Circle Wise Summary
            </ToggleButton>
           
          </ToggleButtonGroup>
        </Box>
      </Box>

      {/* Stats Cards */}
      {data.length > 0 && (
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {/* <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: LIGHT_TEAL, border: `2px solid ${TEAL_COLOR}` }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Total Records
                </Typography>
                <Typography variant="h4" sx={{ color: TEAL_COLOR, fontWeight: 'bold' }}>
                  {data.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid> */}
          {/* <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: LIGHT_TEAL, border: `2px solid ${TEAL_COLOR}` }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Total Columns
                </Typography>
                <Typography variant="h4" sx={{ color: TEAL_COLOR, fontWeight: 'bold' }}>
                  {getTableHeaders().length}
                </Typography>
              </CardContent>
            </Card>
          </Grid> */}
          {/* <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: LIGHT_TEAL, border: `2px solid ${TEAL_COLOR}` }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Filtered Records
                </Typography>
                <Typography variant="h4" sx={{ color: TEAL_COLOR, fontWeight: 'bold' }}>
                  {filteredData.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid> */}
          {/* <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: LIGHT_TEAL, border: `2px solid ${TEAL_COLOR}` }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Report Type
                </Typography>
                <Chip
                  label={apiType === 'summary' ? 'Summary' : 'Count'}
                  sx={{
                    backgroundColor: TEAL_COLOR,
                    color: '#fff',
                    fontWeight: 'bold',
                    marginTop: '8px',
                  }}
                />
              </CardContent>
            </Card>
          </Grid> */}
        </Grid>
      )}

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            Error Loading Data
          </Typography>
          {error}
        </Alert>
      )}

      {/* Search and Refresh */}
      <Paper sx={{ p: 3, mb: 3, backgroundColor: '#fff' }}>
        <Box display="flex" gap={2} sx={{ flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search data..."
            value={searchTerm}
            onChange={handleSearch}
            variant="outlined"
            size="small"
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: TEAL_COLOR,
                },
                '&.Mui-focused fieldset': {
                  borderColor: TEAL_COLOR,
                },
              },
            }}
          />
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={() => fetchData(apiType)}
            sx={{
              backgroundColor: TEAL_COLOR,
              '&:hover': {
                backgroundColor: DARK_TEAL,
              },
            }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={downloadCSV}
            sx={{
              backgroundColor: 'TEAL_COLOR',
              '&:hover': {
                backgroundColor: 'TEAL_COLOR',
              },
            }}
          >
            Download
          </Button>
        </Box>
      </Paper>

      {/* Data Table */}
      {filteredData.length > 0 ? (
        <Paper sx={{ boxShadow: 2 }}>
          <TableContainer>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow sx={{ backgroundColor: TEAL_COLOR }}>
                  <TableCell
                    sx={{
                      fontWeight: 'bold',
                      backgroundColor: TEAL_COLOR,
                      color: '#fff',
                    }}
                  >
                    #
                  </TableCell>
                  {getTableHeaders().map((header) => (
                    <TableCell
                      key={header}
                      sx={{
                        fontWeight: 'bold',
                        backgroundColor: TEAL_COLOR,
                        color: '#fff',
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      '&:nth-of-type(odd)': {
                        backgroundColor: '#f9f9f9',
                      },
                      '&:hover': {
                        backgroundColor: LIGHT_TEAL,
                      },
                    }}
                  >
                    <TableCell sx={{ fontWeight: 'bold', color: TEAL_COLOR }}>
                      {page * rowsPerPage + index + 1}
                    </TableCell>
                    {getTableHeaders().map((header) => (
                      <TableCell key={`${index}-${header}`}>
                        {typeof row[header] === 'object'
                          ? JSON.stringify(row[header])
                          : String(row[header])}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              '& .MuiTablePagination-select': {
                color: TEAL_COLOR,
              },
              '& .MuiIconButton-root': {
                color: TEAL_COLOR,
              },
            }}
          />
        </Paper>
      ) : (
        <Alert severity="info">No data available</Alert>
      )}

      {/* Results Info */}
      {filteredData.length > 0 && (
        <Box sx={{ mt: 3, textAlign: 'right' }}>
          <Typography variant="body2" color="textSecondary">
            Showing {paginatedData.length} of {filteredData.length} records
            {filteredData.length !== data.length && ` (filtered from ${data.length})`}
          </Typography>
        </Box>
      )}
    </Container>
    </>
  );
};

export default Dashboard;