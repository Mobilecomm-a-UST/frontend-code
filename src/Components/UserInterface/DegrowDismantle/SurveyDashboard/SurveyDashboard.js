import React, { useMemo, useState } from "react";
import {
  Box,
  Breadcrumbs,
  Link,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useStyles } from '../../ToolsCss'
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import _ from "lodash";

const SurveyDashboard = () => {
  const classes = useStyles()

  const [data, setData] = useState([
    {
      "id": 9,
      "Circle": "BR",
      "Site ID": "BHUSX-01",
      "Partner Code": null,
      "Partner": null,
      "Is Approved": "03-Mar-26",
      "Is Surveyed": "03-Mar-26",
      "Is SRN Done": null,
      "Remarks": "Survey done"
    },
    {
      "id": 8,
      "Circle": "BR",
      "Site ID": "BADHA-18",
      "Partner Code": null,
      "Partner": null,
      "Is Approved": "02-Mar-26",
      "Is Surveyed": "03-Mar-26",
      "Is SRN Done": null,
      "Remarks": "Survey done"
    },
    {
      "id": 11,
      "Circle": "BR",
      "Site ID": "JHTIL-04",
      "Partner Code": null,
      "Partner": null,
      "Is Approved": "03-Mar-26",
      "Is Surveyed": "03-Mar-26",
      "Is SRN Done": null,
      "Remarks": "Survey done"
    },
    {
      "id": 10,
      "Circle": "BR",
      "Site ID": "BHBBA-22",
      "Partner Code": null,
      "Partner": null,
      "Is Approved": "03-Mar-26",
      "Is Surveyed": "03-Mar-26",
      "Is SRN Done": null,
      "Remarks": "Survey done"
    },
    {
      "id": 14,
      "Circle": "DL",
      "Site ID": "DEL28493",
      "Partner Code": "qwer",
      "Partner": "123",
      "Is Approved": "06-Mar-26",
      "Is Surveyed": "06-Mar-26",
      "Is SRN Done": null,
      "Remarks": "Survey done"
    },
    {
      "id": 15,
      "Circle": "DL",
      "Site ID": "DEL28439",
      "Partner Code": "6767",
      "Partner": "vbnn",
      "Is Approved": "06-Mar-26",
      "Is Surveyed": "06-Mar-26",
      "Is SRN Done": null,
      "Remarks": "Survey done"
    },
    {
      "id": 12,
      "Circle": "BR",
      "Site ID": "JHMKU-01",
      "Partner Code": null,
      "Partner": null,
      "Is Approved": "05-Mar-26",
      "Is Surveyed": "06-Mar-26",
      "Is SRN Done": null,
      "Remarks": "Survey done"
    },
    {
      "id": 13,
      "Circle": "BR",
      "Site ID": "BHUFQ-02",
      "Partner Code": "12345",
      "Partner": "vnbvnnnbv",
      "Is Approved": "05-Mar-26",
      "Is Surveyed": "06-Mar-26",
      "Is SRN Done": null,
      "Remarks": "SRN Pending"
    },
    {
      "id": 16,
      "Circle": "DL",
      "Site ID": "23208",
      "Partner Code": "456",
      "Partner": "DDT",
      "Is Approved": "06-Mar-26",
      "Is Surveyed": "06-Mar-26",
      "Is SRN Done": "06-Mar-26",
      "Remarks": "SRN Done"
    },
    {
      "id": 17,
      "Circle": "DL",
      "Site ID": "11488",
      "Partner Code": "1234",
      "Partner": "test1",
      "Is Approved": "06-Mar-26",
      "Is Surveyed": "06-Mar-26",
      "Is SRN Done": null,
      "Remarks": "SRN Pending"
    }
  ])

  const navigate = useNavigate();

  /* ---------- SUMMARY ---------- */

  const summary = useMemo(() => {

    return {
      totalCircles: _.uniq(_.map(data, "Circle")).length,
      totalSites: data.length,
      totalPartners: _.uniq(_.map(data, "Partner Code").filter(Boolean)).length,

      surveyDone: _.filter(data, { Remarks: "Survey done" }).length,

      surveyPending: _.filter(data, (d) => !d["Is Surveyed"]).length,

      srnDone: _.filter(data, { Remarks: "SRN Done" }).length,

      srnPending: _.filter(data, { Remarks: "SRN Pending" }).length
    };

  }, [data]);



  /* ---------- CIRCLE WISE ---------- */

  const circleWise = useMemo(() => {

    const grouped = _.groupBy(data, "Circle");

    return _.map(grouped, (items, circle) => ({
      circle,
      siteCount: items.length,

      partnerCount: _.uniq(_.map(items, "Partner Code").filter(Boolean)).length,

      surveyDone: _.filter(items, { Remarks: "Survey done" }).length,

      surveyPending: _.filter(items, (d) => !d["Is Surveyed"]).length,

      srnDone: _.filter(items, { Remarks: "SRN Done" }).length,

      srnPending: _.filter(items, { Remarks: "SRN Pending" }).length
    }));

  }, [data]);



  /* ---------- STAT CARD ---------- */

  const StatCard = ({ title, value, color }) => (
    <Grid item xs={12} md={3} lg={2}>
      <Paper
        elevation={3}
        sx={{
          p: 1,
          textAlign: "center",
          backgroundColor: color,
          color: "white",
          borderRadius: 2,
          fontWeight: 600
        }}
      >
        <Typography variant="subtitle2" fontWeight="bold" fontSize="2" >{title}</Typography>
        <Typography variant="h4" fontWeight="bold">
          {value}
        </Typography>
      </Paper>
    </Grid>
  );



  return (
    <>
      <style>{"th{border:1px solid black;}"}</style>
      <Box m={1} ml={2}>
        <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />}>
          <Link underline="hover" onClick={() => navigate("/tools")}>
            Tools
          </Link>

          <Link
            underline="hover"
            onClick={() => navigate("/tools/full_site_dismantle")}
          >
            Full Site Dismantle
          </Link>

          <Typography color="text.primary">
            Survey Dashboard
          </Typography>
        </Breadcrumbs>
      </Box>


      {/* ---------- SUMMARY ---------- */}
      <Box p={2}>
        <Grid container spacing={2}>
          <StatCard title="Total Circles" value={summary.totalCircles} color="#1976d2" />
          <StatCard title="Total Sites" value={summary.totalSites} color="#6a1b9a" />
          <StatCard title="Total Partners" value={summary.totalPartners} color="#00897b" />
          <StatCard title="Survey Done" value={summary.surveyDone} color="#2e7d32" />
          <StatCard title="Survey Pending" value={summary.surveyPending} color="#ed6c02" />
          <StatCard title="SRN Done" value={summary.srnDone} color="#0288d1" />
          <StatCard title="SRN Pending" value={summary.srnPending} color="#d32f2f" />
        </Grid>
      </Box>



      {/* ---------- TABLE ---------- */}

      {/* <Box p={2}>
        <TableContainer component={Paper}>
          <Table>

            <TableHead>
              <TableRow>
                <TableCell><b>Circle</b></TableCell>
                <TableCell><b>Site Count</b></TableCell>
                <TableCell><b>Partner Count</b></TableCell>
                <TableCell><b>Survey Done</b></TableCell>
                <TableCell><b>Survey Pending</b></TableCell>
                <TableCell><b>SRN Done</b></TableCell>
                <TableCell><b>SRN Pending</b></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {circleWise.map((row) => (
                <TableRow key={row.circle}>
                  <TableCell>{row.circle}</TableCell>
                  <TableCell>{row.siteCount}</TableCell>
                  <TableCell>{row.partnerCount}</TableCell>
                  <TableCell>{row.surveyDone}</TableCell>
                  <TableCell>{row.surveyPending}</TableCell>
                  <TableCell>{row.srnDone}</TableCell>
                  <TableCell>{row.srnPending}</TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>
        </TableContainer>
      </Box> */}

      <Box sx={{ m: 1, ml: 1, width: '98%' }}>
        <TableContainer sx={{ maxHeight: '58vh', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper}>
          <table style={{ width: "100%", border: "1px solid black", borderCollapse: 'collapse', overflow: 'auto' }} >
            <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
              <tr style={{ fontSize: 15, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>
                <th style={{ padding: '5px 10px', whiteSpace: 'nowrap', position: 'sticky', left: 0, top: 0, backgroundColor: '#006e74' }}>
                  Circle
                </th>
                <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#CBCBCB', color: 'black' }}>
                  Site Count
                </th>
                <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#CBCBCB', color: 'black' }}>
                  Partner Count
                </th>
                <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#CBCBCB', color: 'black' }}>
                  Survey Done
                </th>
                <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#CBCBCB', color: 'black' }}>
                  Survey Pending
                </th>
                <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#CBCBCB', color: 'black' }}>
                  SRN Done
                </th>
                <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#CBCBCB', color: 'black' }}>
                  SRN Pending
                </th>

              </tr>
            </thead>
            <tbody>
              {circleWise?.map((row, index) => {
                return (
                  <tr className={classes.hoverRT} style={{ textAlign: "center", fontWeight: 700 }} key={index}>
                    <th style={{ backgroundColor: '#CBCBCB', color: 'black' }}>{row.circle}</th>
                    <th style={{ color: 'black' }} >{row.siteCount}</th>
                    <th style={{ color: 'black' }}>{row.partnerCount}</th>
                    <th style={{ color: 'black' }}>{row.surveyDone}</th>
                    <th style={{ color: 'black' }}>{row.surveyPending}</th>
                    <th style={{ color: 'black' }}>{row.srnDone}</th>
                    <th style={{ color: 'black' }}>{row.srnPending}</th>

                  </tr>
                )
              })}
            </tbody>
          </table>
        </TableContainer>
      </Box>
    </>
  );
};

export default SurveyDashboard;