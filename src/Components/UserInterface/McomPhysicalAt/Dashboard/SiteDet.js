import React, { useEffect, useState } from 'react'
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Grid, Button, MenuItem } from '@mui/material'
import TextField from '@mui/material/TextField';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Paper from '@mui/material/Paper';

const SiteDet = () => {
  const [expanded, setExpanded] = useState(false);
  const [hardware1, setHardware1] = useState([{id: Date.now(),BBU_Type: "",SM: ""}]);


  const addHardware1 = () => {
    setHardware1([...hardware1, {id: Date.now(),BBU_Type: "",SM: ""}]);
  }
  const handleHardwareChange1 = (id, field, value) => {
    setHardware1(hardware1.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const [isFocused, setIsFocused] = useState(true);

  return (
    <div>
      <div style={{ backgroundColor: '#fdecec', padding: '10px', borderRadius: '8px' }}>
        {/* Activity */}
        <Accordion expanded={expanded === 'activity'} onChange={handleChange('activity')}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Typography sx={{ color: 'red', fontWeight: 'bold' }}>
              Activity*
            </Typography>

          </AccordionSummary>
          <AccordionDetails>
            <Grid container rowSpacing={2} columnSpacing={2} direction={{ xs: "column", sm: "column", md: "row" }} >
              <Grid item xs={4}>
                <TextField label="Activity" variant="outlined" size="small" fullWidth />
              </Grid>
              <Grid item xs={4}>
                <TextField label="Layer planned & offered" variant="outlined" size="small" fullWidth />
              </Grid>
              <Grid item xs={4}>
                <TextField label="Number of Logical cells" variant="outlined" size="small" fullWidth />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
        {/* Hardware */}
        <Accordion expanded={expanded === 'hardware'} onChange={handleChange('hardware')}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2bh-content"
            id="panel2bh-header"
          >
            <Typography sx={{ color: 'black', fontWeight: 'bold' }}>
              Hardware
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div>
              {/* BBU Type Section */}
              <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid black', marginBottom: '10px' }}>
                <thead>
                  <tr>
                    <th style={{ backgroundColor: '#f8d7da', color: 'brown', fontWeight: 'bold', padding: '3px', border: '1px solid black', textAlign: 'left' }}>BBU Type</th>
                    <th style={{ backgroundColor: '#f8d7da', color: 'brown', fontWeight: 'bold', padding: '3px', border: '1px solid black', textAlign: 'left' }}>System Module</th>
                    <th style={{ backgroundColor: '#f8d7da', color: 'brown', fontWeight: 'bold', padding: '3px', border: '1px solid black', textAlign: 'left' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ backgroundColor: '#eaf2b5', height: '20px', padding: '3px', border: '1px solid black', textAlign: 'left' }}></td>
                    <td style={{ backgroundColor: '#eaf2b5', height: '20px', padding: '3px', border: '1px solid black', textAlign: 'left' }}></td>
                    <td style={{ backgroundColor: '#eaf2b5', height: '20px', padding: '3px', border: '1px solid black', textAlign: 'left' }}>
                      <IconButton color="error" size='small' aria-label="delete" title='Delete'>
                        <DeleteIcon />
                      </IconButton></td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', border: '1px solid black' }}>
                      <TextField
                        variant="outlined"
                        size="small"
                        fullWidth
                        placeholder="Select"
                        select
                        // onChange={(e) => handleInputChange( 'bbuType', e.target.value)}
                      >
                        <MenuItem value="Indoor">Indoor</MenuItem>
                        <MenuItem value="Outdoor">Outdoor</MenuItem>
                        <MenuItem value="Split Version">Split Version</MenuItem>
                        <MenuItem value="Small Cell">Small Cell</MenuItem>
                        <MenuItem value="NA">NA</MenuItem>
                      </TextField>
                    </td>
                    <td style={{ padding: '8px', border: '1px solid black' }}>
                      <TextField
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                    </td>
                    <td style={{ textAlign: 'center', padding: '8px', border: '1px solid black', textAlign: 'left' }}>

                      <IconButton color="error" size='small' aria-label="add" title='Add' onClick={handleHardwareChange1}>
                        <AddIcon />
                      </IconButton>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* RRU Type Section */}
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ backgroundColor: '#f8d7da', color: 'brown', fontWeight: 'bold', padding: '8px', border: '1px solid #ddd' }}>RRU Type (Model -Band)</th>
                    <th style={{ backgroundColor: '#f8d7da', color: 'brown', fontWeight: 'bold', padding: '8px', border: '1px solid #ddd' }}>MMIMO Power configuration</th>
                    <th style={{ backgroundColor: '#f8d7da', color: 'brown', fontWeight: 'bold', padding: '8px', border: '1px solid #ddd' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="2" style={{ backgroundColor: '#eaf2b5', height: '20px', border: '1px solid #ddd' }}></td>
                    <td style={{ backgroundColor: '#eaf2b5', height: '20px', border: '1px solid #ddd' }}></td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                      <TextField
                        variant="outlined"
                        size="small"
                        fullWidth
                        placeholder="Select"
                      />
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                      <TextField
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                    </td>
                    <td style={{ textAlign: 'center', padding: '8px', border: '1px solid #ddd' }}>
                      <IconButton color="error" aria-label="delete">
                        <DeleteIcon />
                      </IconButton>
                      <IconButton color="error" aria-label="add">
                        <AddIcon />
                      </IconButton>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </AccordionDetails>
        </Accordion>
        {/* Media */}
        <Accordion expanded={expanded === 'Media'} onChange={handleChange('Media')}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3bh-content"
            id="panel3bh-header"
          >
            <Typography sx={{ color: 'red', fontWeight: 'bold' }}>
              Media*
            </Typography>

          </AccordionSummary>
          <AccordionDetails>
            <Grid container rowSpacing={2} columnSpacing={2} direction={{ xs: "column", sm: "column", md: "row" }} >
              <Grid item xs={3}>
                <TextField label="Type of Media" variant="outlined" size="small" fullWidth select>
                  <MenuItem value="Fiber">Fiber</MenuItem>
                  <MenuItem value="MW">MW</MenuItem>
                  <MenuItem value="FTTH">FTTH</MenuItem>
                  <MenuItem value="Copper">Copper</MenuItem>
                  <MenuItem value="Iwan">Iwan</MenuItem>
                  <MenuItem value="UBR">UBR</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={3}>
                <TextField label="MW Link Id" variant="outlined" size="small" fullWidth />
              </Grid>
              <Grid item xs={3}>
                <TextField label="Media RA Number" variant="outlined" size="small" fullWidth />
              </Grid>
              <Grid item xs={3}>
                <TextField label="MW Link AT Status" variant="outlined" size="small" fullWidth select>
                  <MenuItem value="Operational">Operational</MenuItem>
                  <MenuItem value="Project">Project</MenuItem>
                  <MenuItem value="NA">NA</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
        {/* Power and Tower */}
        <Accordion expanded={expanded === 'power'} onChange={handleChange('power')}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel4bh-content"
            id="panel4bh-header"
          >
            <Typography sx={{ color: 'red', fontWeight: 'bold' }}>
              Power and Tower*
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container rowSpacing={2} columnSpacing={2} direction={{ xs: "column", sm: "column", md: "row" }} >
              <Grid item xs={3}>
                <TextField label="EB Availablity" variant="outlined" size="small" fullWidth select>
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={3}>
                <TextField label="DG Availablity" variant="outlined" size="small" fullWidth select>
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={3}>
                <TextField label="Tower Type" variant="outlined" size="small" fullWidth select>
                  <MenuItem value="GBT">GBT</MenuItem>
                  <MenuItem value="RTT">RTT</MenuItem>
                  <MenuItem value="RTB">RTB</MenuItem>
                  <MenuItem value="IBM">IBM</MenuItem>
                  <MenuItem value="GBM">GBM</MenuItem>
                  <MenuItem value="ECOLITE">ECOLITE</MenuItem>
                  <MenuItem value="MONOPOLE">MONOPOLE</MenuItem>
                  <MenuItem value="COW">COW</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={3}>
                <TextField label="Tower Height" variant="outlined" size="small" fullWidth />
              </Grid>
              <Grid item xs={3}>
                <TextField label="Building Height" variant="outlined" size="small" fullWidth />
              </Grid> <Grid item xs={3}>
                <TextField label="Invertor Make and Model" variant="outlined" size="small" fullWidth />
              </Grid>
              <Grid item xs={3}>
                <TextField label="RFI_check_status" variant="outlined" size="small" fullWidth select>
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                  <MenuItem value="Accepted">Accepted</MenuItem>
                  <MenuItem value="Accepted with punch point">Accepted with punch point</MenuItem>
                  <MenuItem value="Rejected">Rejected</MenuItem>
                  <MenuItem value="NA">NA</MenuItem>
                </TextField>
              </Grid>

            </Grid>
          </AccordionDetails>
        </Accordion>

        <div style={{ marginTop: '10px', padding: '10px' }}>
          <Grid container rowSpacing={2} columnSpacing={2} direction={{ xs: "column", sm: "column", md: "row" }} >
            <Grid item xs={3}>
              <TextField label="Date of AT Offered / Reoffered" variant="outlined" type='date' size="small" fullWidth
                autoFocus

              />
            </Grid>
            <Grid item xs={3}>
              <TextField label="Name" variant="outlined" type='text' size="small" fullWidth required />
            </Grid>
            <Grid item xs={3}>
              <TextField label="Email" variant="outlined" type='email' size="small" fullWidth required />
            </Grid>
            <Grid item xs={3}>
              <TextField label="Contact Number" variant="outlined" type='number' size="small" fullWidth required />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Remarks" variant="outlined" type='text' size="small" fullWidth multiline />
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  )
}

export default SiteDet