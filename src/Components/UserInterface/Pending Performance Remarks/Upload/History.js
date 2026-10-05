// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Card,
//   CardContent,
//   CardHeader,
//   Container,
//   Grid,
//   Alert,
//   CircularProgress,
//   Stack,
//   Paper,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Chip,
// } from '@mui/material';
// import HistoryIcon from '@mui/icons-material/History';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// const History = ({ atRefNo = 'AT-290474' }) => {
//   // Teal color matching sidebar
//   const TEAL_PRIMARY = '#008080';
//   const TEAL_DARK = '#005555';
//   const TEAL_LIGHT = '#00a6a6';

//   // History data state
//   const [historyData, setHistoryData] = useState(null);

//   // UI state
//   const [loading, setLoading] = useState(true);
//   const [errorMessage, setErrorMessage] = useState('');

//   // Fetch data on component mount or when atRefNo changes
//   useEffect(() => {
//     fetchHistoryData();
//   }, [atRefNo]);

//   // Fetch history data
//   const fetchHistoryData = async () => {
//     setLoading(true);
//     setErrorMessage('');

//     try {
//       // Make API call to backend using at_ref_no as key
//       const response = await fetch(`/api/history/${atRefNo}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`API error: ${response.statusText}`);
//       }

//       const data = await response.json();

//       if (!data.status) {
//         setErrorMessage(data.message || 'No data found for this reference number');
//         setHistoryData(null);
//         return;
//       }

//       setHistoryData(data);
//       setErrorMessage('');
//     } catch (error) {
//       console.error('Error fetching history:', error);
//       setErrorMessage(
//         error.message || 'Failed to fetch history. Please try again.'
//       );
//       setHistoryData(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Container maxWidth="lg" sx={{ py: 4 }}>
//       <Stack spacing={3}>
//         {/* Header */}
//         <Paper elevation={0} sx={{ p: 3, bgcolor: '#f5f5f5', borderRadius: 2 }}>
//           <Typography
//             variant="h4"
//             component="h1"
//             sx={{ fontWeight: 600, mb: 1, color: TEAL_DARK }}
//           >
//             <HistoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
//             Update History
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             Detailed update history for At Reference No: <strong>{atRefNo}</strong>
//           </Typography>
//         </Paper>

//         {/* Loading State */}
//         {loading && (
//           <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
//             <Stack alignItems="center" spacing={2}>
//               <CircularProgress sx={{ color: TEAL_PRIMARY }} />
//               <Typography color="text.secondary">Loading history data...</Typography>
//             </Stack>
//           </Box>
//         )}

//         {/* Alert Messages */}
//         {errorMessage && !loading && (
//           <Alert severity="error" onClose={() => setErrorMessage('')}>
//             {errorMessage}
//           </Alert>
//         )}

//         {/* Results Section */}
//         {historyData && !loading && (
//           <Stack spacing={2.5}>
//             {/* Summary Card */}
//             <Card
//               elevation={2}
//               sx={{
//                 borderRadius: 2,
//                 borderLeft: `4px solid ${TEAL_PRIMARY}`,
//               }}
//             >
//               <CardContent>
//                 <Grid container spacing={3}>
//                   {/* Reference Number */}
//                   <Grid item xs={12} sm={6}>
//                     <Box>
//                       <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
//                         Reference Number
//                       </Typography>
//                       <Typography
//                         variant="h6"
//                         sx={{
//                           fontWeight: 600,
//                           color: TEAL_DARK,
//                           mt: 0.5,
//                           fontFamily: 'monospace',
//                         }}
//                       >
//                         {historyData.at_ref_no}
//                       </Typography>
//                     </Box>
//                   </Grid>

//                   {/* Total Updates */}
//                   <Grid item xs={12} sm={6}>
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                       <CheckCircleIcon sx={{ color: TEAL_PRIMARY, fontSize: '2rem' }} />
//                       <Box>
//                         <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
//                           Total Updates
//                         </Typography>
//                         <Typography
//                           variant="h6"
//                           sx={{
//                             fontWeight: 600,
//                             color: TEAL_DARK,
//                             mt: 0.5,
//                           }}
//                         >
//                           {historyData.total_updates}
//                         </Typography>
//                       </Box>
//                     </Box>
//                   </Grid>
//                 </Grid>
//               </CardContent>
//             </Card>

//             {/* History Table */}
//             <Card
//               elevation={2}
//               sx={{
//                 borderRadius: 2,
//                 borderTop: `4px solid ${TEAL_PRIMARY}`,
//               }}
//             >
//               <CardHeader
//                 title="Update Details"
//                 subtitle={`${historyData.history.length} field(s) updated`}
//                 sx={{
//                   borderBottom: `1px solid #eee`,
//                   '& .MuiCardHeader-title': {
//                     color: TEAL_DARK,
//                   },
//                 }}
//               />
//               <TableContainer>
//                 <Table>
//                   <TableHead>
//                     <TableRow sx={{ backgroundColor: `${TEAL_PRIMARY}15` }}>
//                       <TableCell
//                         sx={{
//                           fontWeight: 600,
//                           color: TEAL_DARK,
//                           borderColor: `${TEAL_PRIMARY}40`,
//                         }}
//                       >
//                         Field
//                       </TableCell>
//                       <TableCell
//                         sx={{
//                           fontWeight: 600,
//                           color: TEAL_DARK,
//                           borderColor: `${TEAL_PRIMARY}40`,
//                         }}
//                         align="right"
//                       >
//                         Last Updated
//                       </TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {historyData.history && historyData.history.length > 0 ? (
//                       historyData.history.map((item, index) => (
//                         <TableRow
//                           key={index}
//                           sx={{
//                             '&:hover': {
//                               backgroundColor: `${TEAL_PRIMARY}08`,
//                             },
//                             '&:last-child td, &:last-child th': {
//                               border: 0,
//                             },
//                           }}
//                         >
//                           <TableCell
//                             sx={{
//                               fontWeight: 500,
//                               color: '#333',
//                               borderColor: `${TEAL_PRIMARY}20`,
//                             }}
//                           >
//                             <Chip
//                               label={item.field}
//                               size="small"
//                               sx={{
//                                 bgcolor: `${TEAL_PRIMARY}20`,
//                                 color: TEAL_DARK,
//                                 fontWeight: 500,
//                               }}
//                             />
//                           </TableCell>
//                           <TableCell
//                             align="right"
//                             sx={{
//                               color: '#666',
//                               fontFamily: 'monospace',
//                               fontSize: '0.9rem',
//                               borderColor: `${TEAL_PRIMARY}20`,
//                             }}
//                           >
//                             {item.updated_at}
//                           </TableCell>
//                         </TableRow>
//                       ))
//                     ) : (
//                       <TableRow>
//                         <TableCell colSpan={2} align="center" sx={{ py: 3 }}>
//                           <Typography color="text.secondary">
//                             No update history found
//                           </Typography>
//                         </TableCell>
//                       </TableRow>
//                     )}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             </Card>

//             {/* Timeline View (Alternative) */}
//             <Card
//               elevation={2}
//               sx={{
//                 borderRadius: 2,
//                 borderLeft: `4px solid ${TEAL_LIGHT}`,
//               }}
//             >
//               <CardHeader
//                 title="Timeline View"
//                 sx={{
//                   borderBottom: `1px solid #eee`,
//                   '& .MuiCardHeader-title': {
//                     color: TEAL_DARK,
//                   },
//                 }}
//               />
//               <CardContent>
//                 <Stack spacing={2}>
//                   {historyData.history && historyData.history.length > 0 ? (
//                     historyData.history.map((item, index) => (
//                       <Box
//                         key={index}
//                         sx={{
//                           display: 'flex',
//                           gap: 2,
//                           pb: 2,
//                           borderBottom: index < historyData.history.length - 1 ? `1px solid #eee` : 'none',
//                         }}
//                       >
//                         {/* Timeline dot */}
//                         <Box
//                           sx={{
//                             width: 16,
//                             height: 16,
//                             borderRadius: '50%',
//                             backgroundColor: TEAL_PRIMARY,
//                             mt: 0.5,
//                             flexShrink: 0,
//                             border: `3px solid white`,
//                             boxShadow: `0 0 0 2px ${TEAL_PRIMARY}`,
//                           }}
//                         />

//                         {/* Content */}
//                         <Box sx={{ flex: 1 }}>
//                           <Typography
//                             variant="body2"
//                             sx={{
//                               fontWeight: 600,
//                               color: TEAL_DARK,
//                             }}
//                           >
//                             {item.field}
//                           </Typography>
//                           <Typography
//                             variant="caption"
//                             color="text.secondary"
//                             sx={{
//                               display: 'block',
//                               mt: 0.5,
//                               fontFamily: 'monospace',
//                             }}
//                           >
//                             {item.updated_at}
//                           </Typography>
//                         </Box>
//                       </Box>
//                     ))
//                   ) : (
//                     <Typography color="text.secondary" align="center">
//                       No updates to display
//                     </Typography>
//                   )}
//                 </Stack>
//               </CardContent>
//             </Card>
//           </Stack>
//         )}

//         {/* Empty State */}
//         {!historyData && !loading && !errorMessage && (
//           <Paper
//             elevation={0}
//             sx={{
//               p: 4,
//               textAlign: 'center',
//               bgcolor: `${TEAL_PRIMARY}08`,
//               borderRadius: 2,
//               borderLeft: `4px solid ${TEAL_PRIMARY}`,
//             }}
//           >
//             <HistoryIcon
//               sx={{
//                 fontSize: '3rem',
//                 color: TEAL_LIGHT,
//                 mb: 1,
//               }}
//             />
//             <Typography variant="h6" sx={{ color: TEAL_DARK, mb: 1 }}>
//               No History Found
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               No update history available for reference number: <strong>{atRefNo}</strong>
//             </Typography>
//           </Paper>
//         )}

//         {/* Info Box */}
//         {historyData && !loading && (
//           <Paper
//             elevation={0}
//             sx={{
//               p: 2.5,
//               bgcolor: `${TEAL_PRIMARY}15`,
//               borderLeft: `4px solid ${TEAL_PRIMARY}`,
//               borderRadius: 1,
//             }}
//           >
//             <Stack direction="row" spacing={1} alignItems="flex-start">
//               <CheckCircleIcon sx={{ color: TEAL_PRIMARY, mt: 0.3, flexShrink: 0 }} />
//               <Box>
//                 <Typography variant="body2" sx={{ color: TEAL_DARK }}>
//                   <strong>Reference Information:</strong> This dashboard displays the complete update history for reference number <strong>{atRefNo}</strong>. View all changes in the table or timeline format below.
//                 </Typography>
//               </Box>
//             </Stack>
//           </Paper>
//         )}
//       </Stack>
//     </Container>
//   );
// };

// export default History;

import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// ✅ Mock Data - No API needed
const HISTORY_DATA = {
  'AT-290474': {
    status: true,
    at_ref_no: 'AT-290474',
    total_updates: 27,
    history: [
      { field: 'bucket', updated_at: '02-Oct-26 18:45:26' },
      { field: 'workable_date', updated_at: '02-Oct-26 18:45:26' },
      { field: 'status', updated_at: '02-Oct-26 18:40:15' },
      { field: 'assigned_to', updated_at: '02-Oct-26 18:35:00' },
      { field: 'priority', updated_at: '01-Oct-26 15:20:45' },
      { field: 'description', updated_at: '01-Oct-26 14:10:30' },
      { field: 'category', updated_at: '30-Sep-26 10:05:12' },
      { field: 'band', updated_at: '30-Sep-26 09:20:00' },
      { field: 'circle', updated_at: '29-Sep-26 16:45:30' },
      { field: 'site_id', updated_at: '29-Sep-26 15:30:45' },
    ],
  },
  'AT-290473': {
    status: true,
    at_ref_no: 'AT-290473',
    total_updates: 15,
    history: [
      { field: 'status', updated_at: '02-Oct-26 17:30:00' },
      { field: 'assigned_to', updated_at: '02-Oct-26 16:45:20' },
      { field: 'due_date', updated_at: '01-Oct-26 12:15:40' },
      { field: 'priority', updated_at: '30-Sep-26 09:30:15' },
      { field: 'bucket', updated_at: '29-Sep-26 14:20:00' },
    ],
  },
  'AT-290472': {
    status: true,
    at_ref_no: 'AT-290472',
    total_updates: 8,
    history: [
      { field: 'bucket', updated_at: '02-Oct-26 14:20:00' },
      { field: 'status', updated_at: '02-Oct-26 13:10:25' },
      { field: 'workable_date', updated_at: '01-Oct-26 10:45:00' },
    ],
  },
};

const History = ({ atRefNo = 'AT-290474' }) => {
  // Teal color matching sidebar
  const TEAL_PRIMARY = '#008080';
  const TEAL_DARK = '#005555';
  const TEAL_LIGHT = '#00a6a6';

  // History data state
  const [historyData, setHistoryData] = useState(null);

  // UI state
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch data on component mount or when atRefNo changes
  useEffect(() => {
    fetchHistoryData();
  }, [atRefNo]);

  // ✅ Fetch history data from local mock data (No API call)
  const fetchHistoryData = () => {
    setLoading(true);
    setErrorMessage('');

    try {
      // Simulate async operation
      setTimeout(() => {
        // Look up data in HISTORY_DATA using atRefNo as key
        const data = HISTORY_DATA[atRefNo];

        if (!data) {
          setErrorMessage(`No data found for reference number: ${atRefNo}`);
          setHistoryData(null);
          setLoading(false);
          return;
        }

        // Set the data
        setHistoryData(data);
        setErrorMessage('');
        setLoading(false);
      }, 300); // Simulate small delay for better UX
    } catch (error) {
      console.error('Error fetching history:', error);
      setErrorMessage('Failed to fetch history data');
      setHistoryData(null);
      setLoading(false);
    }
  };

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
            Detailed update history for At Reference No: <strong>{atRefNo}</strong>
          </Typography>
        </Paper>

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <Stack alignItems="center" spacing={2}>
              <CircularProgress sx={{ color: TEAL_PRIMARY }} />
              <Typography color="text.secondary">Loading history data...</Typography>
            </Stack>
          </Box>
        )}

        {/* Alert Messages */}
        {errorMessage && !loading && (
          <Alert severity="error" onClose={() => setErrorMessage('')}>
            {errorMessage}
          </Alert>
        )}

        {/* Results Section */}
        {historyData && !loading && (
          <Stack spacing={2.5}>
            {/* Summary Card */}
            <Card
              elevation={2}
              sx={{
                borderRadius: 2,
                borderLeft: `4px solid ${TEAL_PRIMARY}`,
              }}
            >
              <CardContent>
                <Grid container spacing={3}>
                  {/* Reference Number */}
                  <Grid item xs={12} sm={6}>
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
                  <Grid item xs={12} sm={6}>
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
                          {historyData.total_updates}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* History Table */}
            <Card
              elevation={2}
              sx={{
                borderRadius: 2,
                borderTop: `4px solid ${TEAL_PRIMARY}`,
              }}
            >
              <CardHeader
                title="Update Details"
                subtitle={`${historyData.history.length} field(s) updated`}
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
                    {historyData.history && historyData.history.length > 0 ? (
                      historyData.history.map((item, index) => (
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
                        <TableCell colSpan={2} align="center" sx={{ py: 3 }}>
                          <Typography color="text.secondary">
                            No update history found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>

            {/* Timeline View (Alternative) */}
            <Card
              elevation={2}
              sx={{
                borderRadius: 2,
                borderLeft: `4px solid ${TEAL_LIGHT}`,
              }}
            >
              <CardHeader
                title="Timeline View"
                sx={{
                  borderBottom: `1px solid #eee`,
                  '& .MuiCardHeader-title': {
                    color: TEAL_DARK,
                  },
                }}
              />
              <CardContent>
                <Stack spacing={2}>
                  {historyData.history && historyData.history.length > 0 ? (
                    historyData.history.map((item, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          gap: 2,
                          pb: 2,
                          borderBottom: index < historyData.history.length - 1 ? `1px solid #eee` : 'none',
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
                            }}
                          >
                            {item.field}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              display: 'block',
                              mt: 0.5,
                              fontFamily: 'monospace',
                            }}
                          >
                            {item.updated_at}
                          </Typography>
                        </Box>
                      </Box>
                    ))
                  ) : (
                    <Typography color="text.secondary" align="center">
                      No updates to display
                    </Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        )}

        {/* Empty State */}
        {!historyData && !loading && !errorMessage && (
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
              No update history available for reference number: <strong>{atRefNo}</strong>
            </Typography>
          </Paper>
        )}

        {/* Info Box */}
        {historyData && !loading && (
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
                  <strong>Reference Information:</strong> This dashboard displays the complete update history for reference number <strong>{atRefNo}</strong>. View all changes in the table or timeline format below.
                </Typography>
              </Box>
            </Stack>
          </Paper>
        )}
      </Stack>
    </Container>
  );
};

export default History;