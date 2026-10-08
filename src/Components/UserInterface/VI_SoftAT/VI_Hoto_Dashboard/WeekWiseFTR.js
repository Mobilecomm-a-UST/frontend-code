import React, { useState, useEffect, useCallback, useRef } from "react";

import {
  Box,
  Paper,
  Typography,
  Stack,
  TextField,
  CircularProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Tabs,
  Tab,
  MenuItem,
} from "@mui/material";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import InboxIcon from "@mui/icons-material/Inbox";
import TableChartIcon from "@mui/icons-material/TableChart";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";

import { ServerURL } from "../../../services/FetchNodeServices";

/* =========================================================
   API CONFIG
========================================================= */

const API_PATH = "/ix_tracker_vi/HOTO_dashboard/";

/* =========================================================
   COLORS
========================================================= */

const C = {
  corner: "#004d52",
  headerBg: "#00838f",
  labelOdd: "#dbf2f2",
  labelEven: "#eef9f9",
  valueText: "#0d3a3c",
  zeroText: "#b7bfc9",
  border: "#c3cbd6",
  green: "#28a745",
};

const HEADER_GRADIENT =
  "linear-gradient(90deg, #004d52 0%, #006e74 55%, #4fa3a8 100%)";

/* =========================================================
   DEFAULT MONTH
========================================================= */

const defaultMonth = () => {
  return "";
};

/* =========================================================
   DEFAULT YEAR
========================================================= */

const defaultYear = () => {
  return String(new Date().getFullYear());
};

/* =========================================================
   MONTH NAME
========================================================= */

const getMonthName = (month) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return months[Number(month) - 1] || "";
};

/* =========================================================
   PARSE PERCENT
========================================================= */

const parsePercent = (value) => {
  if (value == null) {
    return 0;
  }

  if (typeof value === "string") {
    const number = parseFloat(value.replace("%", ""));

    return Number.isNaN(number) ? 0 : number;
  }

  return Number(value) || 0;
};

/* =========================================================
   GET ALL WEEK COLUMNS
========================================================= */

const getWeekColumns = (rows) => {
  if (!Array.isArray(rows) || rows.length === 0) {
    return [];
  }

  const weeks = new Set();

  rows.forEach((row) => {
    Object.keys(row || {}).forEach((key) => {
      if (key.startsWith("WK-")) {
        weeks.add(key);
      }
    });
  });

  return Array.from(weeks).sort((a, b) => {
    const weekA = Number(a.replace("WK-", ""));

    const weekB = Number(b.replace("WK-", ""));

    return weekA - weekB;
  });
};

/* =========================================================
   NO DATA
========================================================= */

function NoData({ label = "No data found" }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        py: 8,
        color: "#94a3b8",
      }}
    >
      <InboxIcon
        sx={{
          fontSize: 42,
        }}
      />

      <Typography
        variant="body2"
        sx={{
          fontWeight: 600,
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}

/* =========================================================
   CUSTOM TOOLTIP
========================================================= */

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <Paper
      elevation={4}
      sx={{
        p: 1.5,
        borderRadius: 2,
        border: `1px solid ${C.border}`,
      }}
    >
      <Typography
        sx={{
          fontWeight: 800,
          color: C.corner,
          mb: 1,
        }}
      >
        {label}
      </Typography>

      {payload.map((item, index) => (
        <Typography
          key={`${item.name}-${index}`}
          variant="body2"
          sx={{
            color: item.color,
            fontWeight: 600,
          }}
        >
          {item.name}: {item.value}%
        </Typography>
      ))}
    </Paper>
  );
}

/* =========================================================
   TAB 1
   CIRCLE VS WEEK TABLE

   Circle rows
   Week columns
========================================================= */

function CircleVsWeekChart({ rows }) {
  const hasData = Array.isArray(rows) && rows.length > 0;

  if (!hasData) {
    return (
      <Paper
        elevation={2}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          border: `1px solid ${C.border}`,
        }}
      >
        <NoData label="No Circle VS Week chart data found" />
      </Paper>
    );
  }

  const weekColumns = getWeekColumns(rows);

  if (weekColumns.length === 0) {
    return (
      <Paper
        elevation={2}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          border: `1px solid ${C.border}`,
        }}
      >
        <NoData label="No week data found" />
      </Paper>
    );
  }

  /*
    Convert backend data to:

    [
      {
        week: "WK-01",
        BIH: 80,
        KK: 75,
        UPE: 90
      },
      {
        week: "WK-02",
        BIH: 85,
        KK: 82,
        UPE: 88
      }
    ]
  */

  const chartData = weekColumns.map((week) => {
    const weekItem = {
      week,
    };

    rows.forEach((row) => {
      const circle = row["Circle"];

      if (!circle) {
        return;
      }

      const weekData = row[week] || {};

      const offered = Number(weekData["Offered"]) || 0;

      const ftrCount = Number(weekData["FTR Count"]) || 0;

      /*
        Calculate again instead of depending only
        on backend "FTR %" string.
      */

      const ftrPercent =
        offered > 0 ? Math.round((ftrCount / offered) * 100) : 0;

      weekItem[circle] = ftrPercent;
    });

    return weekItem;
  });

  console.log("Circle VS Week Line Chart Data:", chartData);

  const colors = [
    "#00838f",
    "#28a745",
    "#ff9800",
    "#0288d1",
    "#7b1fa2",
    "#d32f2f",
    "#5d4037",
    "#455a64",
    "#c2185b",
    "#00796b",
  ];

  const CustomCircleTooltip = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) {
      return null;
    }

    return (
      <Paper
        elevation={5}
        sx={{
          p: 1.5,
          borderRadius: 2,
          border: `1px solid ${C.border}`,
          minWidth: 150,
        }}
      >
        <Typography
          sx={{
            fontWeight: 800,
            color: C.corner,
            mb: 1,
          }}
        >
          {label}
        </Typography>

        {payload.map((item, index) => (
          <Typography
            key={`${item.name}-${index}`}
            variant="body2"
            sx={{
              color: item.color,
              fontWeight: 700,
              mb: 0.4,
            }}
          >
            {item.name}: {item.value}%
          </Typography>
        ))}
      </Paper>
    );
  };

  return (
    <Paper
      elevation={2}
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        border: `1px solid ${C.border}`,
      }}
    >
      {/* HEADER */}

      <Box
        sx={{
          px: 2,
          py: 1.4,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: HEADER_GRADIENT,
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <TrendingUpIcon
            sx={{
              color: "#bfe9e9",
              fontSize: 20,
            }}
          />

          <Typography
            variant="subtitle2"
            sx={{
              color: "#fff",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 0.4,
            }}
          >
            Circle VS Week - FTR % Trend
          </Typography>
        </Stack>

        <Typography
          variant="caption"
          sx={{
            color: "rgba(255,255,255,0.8)",
            fontWeight: 500,
          }}
        >
          Circle Wise Performance
        </Typography>
      </Box>

      {/* LINE CHART */}

      <Box
        sx={{
          width: "100%",
          height: 430,
          p: {
            xs: 1,
            md: 2.5,
          },
          bgcolor: "#fff",
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 10,
              bottom: 10,
            }}
          >
            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke="#e7ecef"
            />

            <XAxis
              dataKey="week"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: C.corner,
                fontSize: 12,
                fontWeight: 700,
              }}
              dy={8}
            />

            <YAxis
              domain={[0, 100]}
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#64748b",
                fontSize: 12,
              }}
              tickFormatter={(value) => `${value}%`}
            />

            <RechartsTooltip
              content={<CustomCircleTooltip />}
              cursor={{
                stroke: "#94a3b8",
                strokeDasharray: "3 3",
              }}
            />

            <Legend
              wrapperStyle={{
                paddingTop: 15,
              }}
            />

            {rows.map((row, index) => {
              const circle = row["Circle"];

              if (!circle) {
                return null;
              }

              const color = colors[index % colors.length];

              return (
                <Line
                  key={`${circle}-${index}`}
                  type="monotone"
                  dataKey={circle}
                  name={circle}
                  stroke={color}
                  strokeWidth={3}
                  connectNulls
                  dot={{
                    r: 5,
                    fill: "#fff",
                    stroke: color,
                    strokeWidth: 3,
                  }}
                  activeDot={{
                    r: 7,
                    fill: color,
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}

function CircleVsWeekTable({ rows }) {
  const hasData = Array.isArray(rows) && rows.length > 0;

  if (!hasData) {
    return (
      <Paper
        elevation={2}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          border: `1px solid ${C.border}`,
        }}
      >
        <NoData label="No Circle VS Week data found" />
      </Paper>
    );
  }

  const weekColumns = getWeekColumns(rows);

  if (weekColumns.length === 0) {
    return (
      <Paper
        elevation={2}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          border: `1px solid ${C.border}`,
        }}
      >
        <NoData label="No week data found" />
      </Paper>
    );
  }

  return (
    <Paper
      elevation={2}
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        border: `1px solid ${C.border}`,
      }}
    >
      {/* HEADER */}

      <Box
        sx={{
          px: 2,
          py: 1.25,
          display: "flex",
          alignItems: "center",
          gap: 1,
          background: HEADER_GRADIENT,
        }}
      >
        <TableChartIcon
          sx={{
            color: "#bfe9e9",
            fontSize: 20,
          }}
        />

        <Typography
          variant="subtitle2"
          sx={{
            color: "#fff",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 0.4,
          }}
        >
          Circle VS Week
        </Typography>
      </Box>

      {/* TABLE */}

      <TableContainer
        sx={{
          maxHeight: 550,
          overflowX: "auto",
        }}
      >
        <Table
          size="small"
          stickyHeader
          sx={{
            minWidth: 1000,
            borderCollapse: "separate",

            "& .MuiTableCell-root": {
              border: `1px solid ${C.border}`,
            },
          }}
        >
          <TableHead>
            {/* HEADER ROW 1 */}

            <TableRow>
              <TableCell
                rowSpan={2}
                align="center"
                sx={{
                  position: "sticky",
                  left: 0,
                  top: 0,
                  zIndex: 10,
                  bgcolor: C.corner,
                  color: "#fff",
                  fontWeight: 800,
                  minWidth: 110,
                }}
              >
                Circle
              </TableCell>

              {weekColumns.map((week) => (
                <TableCell
                  key={week}
                  colSpan={3}
                  align="center"
                  sx={{
                    bgcolor: C.corner,
                    color: "#fff",
                    fontWeight: 800,
                    minWidth: 270,
                  }}
                >
                  {week}
                </TableCell>
              ))}
            </TableRow>

            {/* HEADER ROW 2 */}

            <TableRow>
              {weekColumns.map((week) => (
                <React.Fragment key={week}>
                  <TableCell
                    align="center"
                    sx={{
                      bgcolor: C.headerBg,
                      color: "#fff",
                      fontWeight: 700,
                      minWidth: 90,
                    }}
                  >
                    Offered
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{
                      bgcolor: C.headerBg,
                      color: "#fff",
                      fontWeight: 700,
                      minWidth: 90,
                    }}
                  >
                    FTR Count
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{
                      bgcolor: C.headerBg,
                      color: "#fff",
                      fontWeight: 700,
                      minWidth: 90,
                    }}
                  >
                    FTR %
                  </TableCell>
                </React.Fragment>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row, rowIndex) => {
              const circle = row["Circle"];

              const labelBg = rowIndex % 2 === 0 ? C.labelOdd : C.labelEven;

              return (
                <TableRow key={`${circle}-${rowIndex}`}>
                  {/* CIRCLE */}

                  <TableCell
                    align="center"
                    sx={{
                      position: "sticky",
                      left: 0,
                      zIndex: 3,
                      bgcolor: labelBg,
                      color: C.corner,
                      fontWeight: 800,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {circle}
                  </TableCell>

                  {/* EACH WEEK */}

                  {weekColumns.map((week) => {
                    const weekData = row[week] || {};

                    const offered = Number(weekData["Offered"]) || 0;

                    const ftrCount = Number(weekData["FTR Count"]) || 0;

                    const ftrPercent = weekData["FTR %"] || "0%";

                    const percentage = parsePercent(ftrPercent);

                    return (
                      <React.Fragment key={`${circle}-${week}`}>
                        {/* OFFERED */}

                        <TableCell
                          align="center"
                          sx={{
                            bgcolor: "#fff",

                            color: offered === 0 ? C.zeroText : C.valueText,

                            fontWeight: offered === 0 ? 400 : 700,

                            fontVariantNumeric: "tabular-nums",
                          }}
                        >
                          {offered}
                        </TableCell>

                        {/* FTR COUNT */}

                        <TableCell
                          align="center"
                          sx={{
                            bgcolor: "#fff",

                            color: ftrCount === 0 ? C.zeroText : C.green,

                            fontWeight: ftrCount === 0 ? 400 : 700,

                            fontVariantNumeric: "tabular-nums",
                          }}
                        >
                          {ftrCount}
                        </TableCell>

                        {/* FTR % */}

                        <TableCell
                          align="center"
                          sx={{
                            bgcolor: labelBg,
                          }}
                        >
                          <Chip
                            label={ftrPercent}
                            size="small"
                            sx={{
                              minWidth: 55,

                              fontWeight: 800,

                              bgcolor: percentage > 0 ? "#e4f6e8" : "#f1f5f9",

                              color: percentage > 0 ? "#137333" : C.zeroText,
                            }}
                          />
                        </TableCell>
                      </React.Fragment>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

/* =========================================================
   TAB 2
   WEEK WISE FTR CHART
========================================================= */

function WeekWiseFTRChart({ rows }) {
  const hasData = Array.isArray(rows) && rows.length > 0;

  if (!hasData) {
    return (
      <Paper
        elevation={2}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          border: `1px solid ${C.border}`,
        }}
      >
        <NoData label="No Week Wise FTR chart data found" />
      </Paper>
    );
  }

  const weekColumns = getWeekColumns(rows);

  if (weekColumns.length === 0) {
    return (
      <Paper
        elevation={2}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          border: `1px solid ${C.border}`,
        }}
      >
        <NoData label="No week data found for chart" />
      </Paper>
    );
  }

  /*
    Convert API data:

    {
      Circle: "BIH",
      WK-01: {
        Offered: 100,
        "FTR Count": 80,
        "FTR %": "80%"
      }
    }

    Into:

    {
      week: "WK-01",
      Offered: 100,
      FTR: 80,
      percentage: 80
    }
  */

  const chartData = weekColumns.map((week) => {
    let totalOffered = 0;
    let totalFTR = 0;

    rows.forEach((row) => {
      const weekData = row?.[week] || {};

      const offered = Number(weekData["Offered"]) || 0;

      const ftr = Number(weekData["FTR Count"]) || 0;

      totalOffered += offered;
      totalFTR += ftr;
    });

    const percentage =
      totalOffered > 0 ? Math.round((totalFTR / totalOffered) * 100) : 0;

    return {
      week,
      Offered: totalOffered,
      FTR: totalFTR,
      percentage,
    };
  });

  console.log("Week Wise FTR Chart Data:", chartData);

  const CustomBarTooltip = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) {
      return null;
    }

    const data = payload[0]?.payload || {};

    return (
      <Paper
        elevation={5}
        sx={{
          p: 2,
          borderRadius: 2,
          border: `1px solid ${C.border}`,
          minWidth: 170,
        }}
      >
        <Typography
          sx={{
            fontWeight: 800,
            color: C.corner,
            mb: 1,
          }}
        >
          {label}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "#00838f",
            fontWeight: 700,
            mb: 0.5,
          }}
        >
          Offered: {data.Offered ?? 0}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: C.green,
            fontWeight: 700,
            mb: 0.5,
          }}
        >
          FTR Count: {data.FTR ?? 0}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "#7b1fa2",
            fontWeight: 800,
          }}
        >
          FTR %: {data.percentage ?? 0}%
        </Typography>
      </Paper>
    );
  };

  return (
    <Paper
      elevation={2}
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        border: `1px solid ${C.border}`,
      }}
    >
      {/* HEADER */}

      <Box
        sx={{
          px: 2,
          py: 1.4,

          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",

          background: HEADER_GRADIENT,
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <TrendingUpIcon
            sx={{
              color: "#bfe9e9",
              fontSize: 20,
            }}
          />

          <Typography
            variant="subtitle2"
            sx={{
              color: "#fff",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 0.4,
            }}
          >
            Week Wise FTR Performance
          </Typography>
        </Stack>

        <Typography
          variant="caption"
          sx={{
            color: "rgba(255,255,255,0.8)",
            fontWeight: 500,
          }}
        >
          Offered VS FTR
        </Typography>
      </Box>

      {/* CHART */}

      <Box
        sx={{
          width: "100%",
          height: 430,
          p: {
            xs: 1,
            md: 2.5,
          },
          bgcolor: "#fff",
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 30,
              right: 30,
              left: 5,
              bottom: 10,
            }}
            barGap={8}
          >
            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke="#e7ecef"
            />

            <XAxis
              dataKey="week"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: C.corner,
                fontSize: 12,
                fontWeight: 700,
              }}
              dy={8}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              tick={{
                fill: "#64748b",
                fontSize: 12,
              }}
            />

            <RechartsTooltip
              content={<CustomBarTooltip />}
              cursor={{
                fill: "rgba(0, 110, 116, 0.05)",
              }}
            />

            <Legend
              wrapperStyle={{
                paddingTop: 15,
              }}
            />

            {/* OFFERED BAR */}

            <Bar
              dataKey="Offered"
              name="Offered"
              fill="#00838f"
              radius={[6, 6, 0, 0]}
              maxBarSize={55}
            >
              <LabelList
                dataKey="Offered"
                position="top"
                style={{
                  fill: "#00838f",
                  fontSize: 11,
                  fontWeight: 700,
                }}
              />
            </Bar>

            {/* FTR BAR */}

            <Bar
              dataKey="FTR"
              name="FTR Count"
              fill="#28a745"
              radius={[6, 6, 0, 0]}
              maxBarSize={55}
            >
              <LabelList
                dataKey="FTR"
                position="top"
                style={{
                  fill: "#137333",
                  fontSize: 11,
                  fontWeight: 700,
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>

      {/* PERCENTAGE SUMMARY */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: 1.5,

          px: 2,
          pb: 2,
        }}
      >
        {chartData.map((item) => (
          <Paper
            key={item.week}
            elevation={0}
            sx={{
              px: 2,
              py: 1,

              borderRadius: 2,

              bgcolor: "#f8fafc",

              border: "1px solid #e2e8f0",

              textAlign: "center",

              minWidth: 100,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                display: "block",
                color: "#64748b",
                fontWeight: 700,
              }}
            >
              {item.week}
            </Typography>

            <Typography
              sx={{
                color: item.percentage > 0 ? C.green : C.zeroText,

                fontWeight: 900,

                fontSize: 18,
              }}
            >
              {item.percentage}%
            </Typography>
          </Paper>
        ))}
      </Box>
    </Paper>
  );
}

/* =========================================================
   TAB 2
   WEEK WISE FTR TABLE

   Week rows
   Circle columns
========================================================= */

function WeekWiseFTRTable({ rows }) {
  const hasData = Array.isArray(rows) && rows.length > 0;

  if (!hasData) {
    return (
      <Paper
        elevation={2}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          border: `1px solid ${C.border}`,
        }}
      >
        <NoData label="No Week Wise FTR data found" />
      </Paper>
    );
  }

  const weekColumns = getWeekColumns(rows);

  if (weekColumns.length === 0) {
    return (
      <Paper
        elevation={2}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          border: `1px solid ${C.border}`,
        }}
      >
        <NoData label="No week data found" />
      </Paper>
    );
  }

  return (
    <Paper
      elevation={2}
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        border: `1px solid ${C.border}`,
      }}
    >
      {/* HEADER */}

      <Box
        sx={{
          px: 2,
          py: 1.25,
          display: "flex",
          alignItems: "center",
          gap: 1,
          background: HEADER_GRADIENT,
        }}
      >
        <TableChartIcon
          sx={{
            color: "#bfe9e9",
            fontSize: 20,
          }}
        />

        <Typography
          variant="subtitle2"
          sx={{
            color: "#fff",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 0.4,
          }}
        >
          Week Wise FTR
        </Typography>
      </Box>

      {/* TABLE */}

      <TableContainer
        sx={{
          maxHeight: 550,
          overflowX: "auto",
        }}
      >
        <Table
          size="small"
          stickyHeader
          sx={{
            minWidth: 1000,
            borderCollapse: "separate",

            "& .MuiTableCell-root": {
              border: `1px solid ${C.border}`,
            },
          }}
        >
          <TableHead>
            {/* FIRST HEADER */}

            <TableRow>
              <TableCell
                rowSpan={2}
                align="center"
                sx={{
                  position: "sticky",
                  left: 0,
                  top: 0,
                  zIndex: 10,
                  bgcolor: C.corner,
                  color: "#fff",
                  fontWeight: 800,
                  minWidth: 100,
                }}
              >
                Week
              </TableCell>

              {rows.map((row, index) => (
                <TableCell
                  key={`${row["Circle"]}-${index}`}
                  colSpan={3}
                  align="center"
                  sx={{
                    bgcolor: C.corner,
                    color: "#fff",
                    fontWeight: 800,
                    minWidth: 270,
                  }}
                >
                  {row["Circle"]}
                </TableCell>
              ))}
            </TableRow>

            {/* SECOND HEADER */}

            <TableRow>
              {rows.map((row, index) => (
                <React.Fragment key={`${row["Circle"]}-${index}`}>
                  <TableCell
                    align="center"
                    sx={{
                      bgcolor: C.headerBg,
                      color: "#fff",
                      fontWeight: 700,
                      minWidth: 90,
                    }}
                  >
                    Offered
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{
                      bgcolor: C.headerBg,
                      color: "#fff",
                      fontWeight: 700,
                      minWidth: 90,
                    }}
                  >
                    FTR Count
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{
                      bgcolor: C.headerBg,
                      color: "#fff",
                      fontWeight: 700,
                      minWidth: 90,
                    }}
                  >
                    FTR %
                  </TableCell>
                </React.Fragment>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {weekColumns.map((week, weekIndex) => {
              const labelBg = weekIndex % 2 === 0 ? C.labelOdd : C.labelEven;

              return (
                <TableRow key={week}>
                  {/* WEEK */}

                  <TableCell
                    align="center"
                    sx={{
                      position: "sticky",
                      left: 0,
                      zIndex: 3,
                      bgcolor: labelBg,
                      color: C.corner,
                      fontWeight: 800,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {week}
                  </TableCell>

                  {/* EACH CIRCLE */}

                  {rows.map((row, rowIndex) => {
                    const weekData = row[week] || {};

                    const offered = Number(weekData["Offered"]) || 0;

                    const ftrCount = Number(weekData["FTR Count"]) || 0;

                    const ftrPercent = weekData["FTR %"] || "0%";

                    const percentage = parsePercent(ftrPercent);

                    return (
                      <React.Fragment
                        key={`${week}-${row["Circle"]}-${rowIndex}`}
                      >
                        {/* OFFERED */}

                        <TableCell
                          align="center"
                          sx={{
                            bgcolor: "#fff",

                            color: offered === 0 ? C.zeroText : C.valueText,

                            fontWeight: offered === 0 ? 400 : 700,

                            fontVariantNumeric: "tabular-nums",
                          }}
                        >
                          {offered}
                        </TableCell>

                        {/* FTR COUNT */}

                        <TableCell
                          align="center"
                          sx={{
                            bgcolor: "#fff",

                            color: ftrCount === 0 ? C.zeroText : C.green,

                            fontWeight: ftrCount === 0 ? 400 : 700,

                            fontVariantNumeric: "tabular-nums",
                          }}
                        >
                          {ftrCount}
                        </TableCell>

                        {/* FTR % */}

                        <TableCell
                          align="center"
                          sx={{
                            bgcolor: labelBg,
                          }}
                        >
                          <Chip
                            label={ftrPercent}
                            size="small"
                            sx={{
                              minWidth: 55,

                              fontWeight: 800,

                              bgcolor: percentage > 0 ? "#e4f6e8" : "#f1f5f9",

                              color: percentage > 0 ? "#137333" : C.zeroText,
                            }}
                          />
                        </TableCell>
                      </React.Fragment>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

function WeekWiseFTR() {
  /* =======================================================
     TAB STATE

     0 = Circle VS Week
     1 = Week Wise FTR
  ======================================================= */

  const [tab, setTab] = useState(0);

  /* =======================================================
     FILTER STATE
  ======================================================= */

  const [month, setMonth] = useState(defaultMonth());

  const [year, setYear] = useState(defaultYear());

  /* =======================================================
     DATA STATE
  ======================================================= */

  const [rows, setRows] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(false);

  /* =======================================================
     REQUEST REFS
  ======================================================= */

  const abortControllerRef = useRef(null);

  const requestIdRef = useRef(0);

  /* =======================================================
     API CALL
  ======================================================= */

  const fetchWeekWiseFTR = useCallback(async () => {
    /* Cancel old request */
    // if (!month) {
    //   setRows([]);
    //   setLoading(false);
    //   setError(false);
    //   return;
    // }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();

    abortControllerRef.current = controller;

    const thisRequestId = ++requestIdRef.current;

    setLoading(true);

    setError(false);

    try {
      /* QUERY PARAMS */

      const params = new URLSearchParams();

      if (month) {
        params.append("month", month);
      }

      if (year) {
        params.append("year", year);
      }

      /* URL */

      const url = `${ServerURL}${API_PATH}?${params.toString()}`;

      console.log("Week Wise FTR API URL:", url);

      /* FETCH */

      const response = await fetch(url, {
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}`);
      }

      /* JSON */

      const json = await response.json();

      console.log("FULL HOTO API RESPONSE:", json);

      console.log(
        "FTR Week Wise:",
        json?.dashboard?.["FTR Week Wise Dashboard"],
      );

      /* Ignore previous request response */

      if (thisRequestId !== requestIdRef.current) {
        return;
      }

      /* GET DATA */

      const weekWiseData = json?.dashboard?.["FTR Week Wise Dashboard"] || [];

      console.log("Week Wise FTR API Data:", weekWiseData);

      /* SAVE DATA */

      if (Array.isArray(weekWiseData)) {
        setRows(weekWiseData);
      } else {
        setRows([]);
      }
    } catch (err) {
      /* Ignore Abort Error */

      if (err.name === "AbortError") {
        return;
      }

      console.error("WeekWiseFTR fetch error:", err);

      if (thisRequestId === requestIdRef.current) {
        setError(true);

        setRows([]);
      }
    } finally {
      if (thisRequestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [month, year]);

  /* =======================================================
     USE EFFECT
  ======================================================= */

  useEffect(() => {
    fetchWeekWiseFTR();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchWeekWiseFTR]);

  /* =======================================================
     FILTER STYLE
  ======================================================= */

  const controlSx = {
    bgcolor: "rgba(255,255,255,0.08)",

    borderRadius: 1,

    "& .MuiOutlinedInput-root": {
      color: "#fff",

      "& fieldset": {
        borderColor: "rgba(255,255,255,0.35)",
      },

      "&:hover fieldset": {
        borderColor: "rgba(255,255,255,0.55)",
      },

      "&.Mui-focused fieldset": {
        borderColor: "#bfe9e9",
      },
    },

    "& .MuiInputLabel-root": {
      color: "rgba(255,255,255,0.85)",
    },

    "& .MuiSvgIcon-root": {
      color: "#fff",
    },
  };

  /* =======================================================
     RETURN
  ======================================================= */

  return (
    <Box
      sx={{
        width: "100%",

        minHeight: "100%",

        px: {
          xs: 2,
          sm: 3,
          md: 4,
        },

        py: 3,
      }}
    >
      {/* ===================================================
          TABS
      =================================================== */}

      <Box
        sx={{
          mb: 3,

          display: "flex",

          gap: 1.5,
        }}
      >
        <Tabs
          value={tab}
          onChange={(event, newValue) => {
            setTab(newValue);
          }}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            backgroundColor: "#fff",

            borderRadius: 10,

            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",

            "& .MuiTab-root": {
              textTransform: "none",

              fontWeight: 600,

              fontSize: "14px",

              color: C.corner,

              borderRadius: "30px",

              mx: 0.5,

              px: 2.5,

              py: 1,

              "&.Mui-selected": {
                color: "#fff",

                backgroundColor: C.corner,
              },
            },

            "& .MuiTabs-indicator": {
              display: "none",
            },
          }}
        >
          <Tab
            icon={<TableChartIcon />}
            iconPosition="start"
            label="Circle VS Week"
          />

          <Tab
            icon={<TrendingUpIcon />}
            iconPosition="start"
            label="Week Wise FTR"
          />
        </Tabs>
      </Box>

      {/* ===================================================
          TOP HEADER
      =================================================== */}

      <Paper
        elevation={3}
        sx={{
          borderRadius: 2,

          px: 2.5,

          py: 2,

          mb: 3,

          background: HEADER_GRADIENT,

          display: "flex",

          alignItems: "center",

          justifyContent: "space-between",

          gap: 2,

          flexWrap: "wrap",
        }}
      >
        {/* TITLE */}

        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar
            sx={{
              bgcolor: "rgba(255,255,255,0.12)",

              width: 42,

              height: 42,
            }}
          >
            {tab === 0 ? (
              <TableChartIcon
                sx={{
                  color: "#bfe9e9",
                }}
              />
            ) : (
              <TrendingUpIcon
                sx={{
                  color: "#bfe9e9",
                }}
              />
            )}
          </Avatar>

          <Box>
            <Typography
              variant="subtitle1"
              sx={{
                color: "#fff",

                fontWeight: 800,

                letterSpacing: 0.3,
              }}
            >
              {tab === 0 ? "Circle VS Week" : "Week Wise FTR Dashboard"}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "rgba(255,255,255,0.82)",

                fontSize: "12px",
              }}
            >
              {getMonthName(month)} {year}
            </Typography>
          </Box>
        </Stack>

        {/* =================================================
            FILTERS
        ================================================= */}

        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          flexWrap="wrap"
        >
          {/* MONTH */}
          <TextField
            select
            size="small"
            label="Month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            SelectProps={{
              displayEmpty: true,

              renderValue: (selected) => {
                if (selected === "") {
                  return "All Months";
                }

                return getMonthName(selected);
              },

              MenuProps: {
                PaperProps: {
                  sx: {
                    mt: 0.5,

                    backgroundColor: "rgba(255, 255, 255, 0.65)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",

                    border: "1px solid rgba(0, 110, 116, 0.18)",
                    borderRadius: 2,

                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",

                    maxHeight: 350,

                    "& .MuiMenuItem-root": {
                      color: "#004d52",
                      fontWeight: 600,
                      backgroundColor: "transparent",

                      "&:hover": {
                        backgroundColor: "rgba(0,110,116,0.10)",
                      },

                      "&.Mui-selected": {
                        backgroundColor: "rgba(0,110,116,0.15)",
                        color: "#004d52",
                        fontWeight: 800,
                      },

                      "&.Mui-selected:hover": {
                        backgroundColor: "rgba(0,110,116,0.20)",
                      },
                    },
                  },
                },
              },
            }}
            sx={{
              width: 140,
              ...controlSx,
            }}
          >
            <MenuItem value="">All Months</MenuItem>

            <MenuItem value="1">January</MenuItem>
            <MenuItem value="2">February</MenuItem>
            <MenuItem value="3">March</MenuItem>
            <MenuItem value="4">April</MenuItem>
            <MenuItem value="5">May</MenuItem>
            <MenuItem value="6">June</MenuItem>
            <MenuItem value="7">July</MenuItem>
            <MenuItem value="8">August</MenuItem>
            <MenuItem value="9">September</MenuItem>
            <MenuItem value="10">October</MenuItem>
            <MenuItem value="11">November</MenuItem>
            <MenuItem value="12">December</MenuItem>
          </TextField>

          {/* <TextField
            select
            SelectProps={{
              native: true,
            }}
            size="small"
            label="Month"
            value={month}
            onChange={(e) => {
              setMonth(e.target.value);
            }}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              width: 140,
              ...controlSx,
              "& option": {
color: "#0d3a3c",
backgroundColor: "#ffffff",
},
            }}
          >
            <option value="">All Month</option>
            <option value="1">January</option>

            <option value="2">February</option>

            <option value="3">March</option>

            <option value="4">April</option>

            <option value="5">May</option>

            <option value="6">June</option>

            <option value="7">July</option>

            <option value="8">August</option>

            <option value="9">September</option>

            <option value="10">October</option>

            <option value="11">November</option>

            <option value="12">December</option>
          </TextField> */}

          {/* YEAR */}

          <TextField
            type="number"
            size="small"
            label="Year"
            value={year}
            onChange={(e) => {
              setYear(e.target.value);
            }}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              width: 110,

              ...controlSx,
              "& option": {
                color: "#0d3a3c",
                backgroundColor: "#ffffff",
              },
            }}
          />
        </Stack>
      </Paper>

      {/* ===================================================
          LOADING
      =================================================== */}

      {loading && (
        <Box
          sx={{
            display: "flex",

            justifyContent: "center",

            alignItems: "center",

            py: 10,
          }}
        >
          <CircularProgress
            size={36}
            sx={{
              color: C.corner,
            }}
          />
        </Box>
      )}

      {/* ===================================================
          ERROR
      =================================================== */}

      {!loading && error && (
        <Paper
          elevation={1}
          sx={{
            borderRadius: 2,
          }}
        >
          <NoData label="Could not load Week Wise FTR data" />
        </Paper>
      )}

      {/* ===================================================
          NO DATA
      =================================================== */}

      {!loading && !error && rows.length === 0 && (
        <Paper
          elevation={1}
          sx={{
            borderRadius: 2,
          }}
        >
          <NoData
            label={`No Week Wise FTR data found for ${getMonthName(
              month,
            )} ${year}`}
          />
        </Paper>
      )}

      {/* ===================================================
          TAB CONTENT
      =================================================== */}

      {!loading && !error && rows.length > 0 && (
        <>
          {/* ===============================================
                TAB 1
                CIRCLE VS WEEK
            =============================================== */}

          {tab === 0 && (
            <Stack spacing={3}>
              <CircleVsWeekChart rows={rows} />
               
              <CircleVsWeekTable rows={rows} />
            </Stack>
          )}

          {/* ===============================================
                TAB 2
                WEEK WISE FTR
            =============================================== */}

          {tab === 1 && (
            <Stack spacing={3}>
              <WeekWiseFTRChart rows={rows} />

              <WeekWiseFTRTable rows={rows} />
            </Stack>
          )}
        </>
      )}
    </Box>
  );
}

export default WeekWiseFTR;
// import React, { useState, useEffect, useCallback, useRef } from "react";
// import {
//   Box,
//   Paper,
//   Typography,
//   Stack,
//   TextField,
//   CircularProgress,
//   Chip,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Avatar,
// } from "@mui/material";

// import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
// import TrendingUpIcon from "@mui/icons-material/TrendingUp";
// import InboxIcon from "@mui/icons-material/Inbox";

// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip as RechartsTooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// import { ServerURL } from "../../../services/FetchNodeServices";

// const API_PATH = "/ix_tracker_vi/HOTO_dashboard/";

// const C = {
//   corner: "#004d52",
//   headerBg: "#00838f",
//   labelOdd: "#dbf2f2",
//   labelEven: "#eef9f9",
//   valueText: "#0d3a3c",
//   zeroText: "#b7bfc9",
//   border: "#c3cbd6",
//   green: "#28a745",
// };

// const HEADER_GRADIENT =
//   "linear-gradient(90deg, #004d52 0%, #006e74 55%, #4fa3a8 100%)";

// /* =========================================================
//    HELPERS
// ========================================================= */

// const defaultMonth = () => String(new Date().getMonth() + 1);

// const defaultYear = () => String(new Date().getFullYear());

// const getMonthName = (month) => {
//   const months = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];

//   return months[Number(month) - 1] || "";
// };

// const parsePercent = (value) => {
//   if (value == null) return 0;

//   if (typeof value === "string") {
//     const n = parseFloat(value.replace("%", ""));
//     return Number.isNaN(n) ? 0 : n;
//   }

//   return Number(value) || 0;
// };

// const getWeekColumns = (rows) => {
//   if (!Array.isArray(rows) || rows.length === 0) {
//     return [];
//   }

//   const weekSet = new Set();

//   rows.forEach((row) => {
//     Object.keys(row || {}).forEach((key) => {
//       if (key.startsWith("WK-")) {
//         weekSet.add(key);
//       }
//     });
//   });

//   return Array.from(weekSet).sort((a, b) => {
//     const aNum = Number(a.replace("WK-", ""));
//     const bNum = Number(b.replace("WK-", ""));

//     return aNum - bNum;
//   });
// };

// /* =========================================================
//    NO DATA
// ========================================================= */

// function NoData({ label = "No data found" }) {
//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         gap: 1,
//         py: 8,
//         color: "#94a3b8",
//       }}
//     >
//       <InboxIcon sx={{ fontSize: 42 }} />

//       <Typography variant="body2" sx={{ fontWeight: 600 }}>
//         {label}
//       </Typography>
//     </Box>
//   );
// }

// /* =========================================================
//    CUSTOM CHART TOOLTIP
// ========================================================= */

// function CustomTooltip({ active, payload, label }) {
//   if (!active || !payload || payload.length === 0) {
//     return null;
//   }

//   return (
//     <Paper
//       elevation={4}
//       sx={{
//         p: 1.5,
//         borderRadius: 2,
//         border: `1px solid ${C.border}`,
//       }}
//     >
//       <Typography
//         sx={{
//           fontWeight: 800,
//           color: C.corner,
//           mb: 1,
//         }}
//       >
//         {label}
//       </Typography>

//       {payload.map((item, index) => (
//         <Typography
//           key={`${item.name}-${index}`}
//           variant="body2"
//           sx={{
//             color: item.color,
//             fontWeight: 600,
//           }}
//         >
//           {item.name}: {item.value}%
//         </Typography>
//       ))}
//     </Paper>
//   );
// }

// /* =========================================================
//    WEEK WISE FTR CHART
// ========================================================= */

// function WeekWiseFTRChart({ rows }) {
//   if (!Array.isArray(rows) || rows.length === 0) {
//     return null;
//   }

//   const weekColumns = getWeekColumns(rows);

//   if (weekColumns.length === 0) {
//     return null;
//   }

//   const chartData = weekColumns.map((week) => {
//     const item = {
//       week,
//     };

//     rows.forEach((row) => {
//       const circle = row["Circle"];

//       if (circle) {
//         item[circle] = parsePercent(row[week]?.["FTR %"]);
//       }
//     });

//     return item;
//   });

//   const colors = [
//     "#00838f",
//     "#28a745",
//     "#ff9800",
//     "#0288d1",
//     "#7b1fa2",
//     "#d32f2f",
//     "#5d4037",
//     "#455a64",
//     "#c2185b",
//     "#00796b",
//   ];

//   return (
//     <Paper
//       elevation={2}
//       sx={{
//         borderRadius: 2,
//         overflow: "hidden",
//         border: `1px solid ${C.border}`,
//       }}
//     >
//       <Box
//         sx={{
//           px: 2,
//           py: 1.25,
//           display: "flex",
//           alignItems: "center",
//           gap: 1,
//           background: HEADER_GRADIENT,
//         }}
//       >
//         <TrendingUpIcon
//           sx={{
//             color: "#bfe9e9",
//             fontSize: 20,
//           }}
//         />

//         <Typography
//           variant="subtitle2"
//           sx={{
//             color: "#fff",
//             fontWeight: 700,
//             textTransform: "uppercase",
//             letterSpacing: 0.4,
//           }}
//         >
//           Week Wise FTR %
//         </Typography>
//       </Box>

//       <Box
//         sx={{
//           height: 380,
//           width: "100%",
//           p: 2,
//         }}
//       >
//         <ResponsiveContainer width="100%" height="100%">
//           <LineChart data={chartData}>
//             <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />

//             <XAxis dataKey="week" stroke={C.corner} />

//             <YAxis
//               stroke={C.corner}
//               domain={[0, 100]}
//               tickFormatter={(value) => `${value}%`}
//             />

//             <RechartsTooltip content={<CustomTooltip />} />

//             <Legend />

//             {rows.map((row, index) => {
//               const circle = row["Circle"];

//               if (!circle) {
//                 return null;
//               }

//               const color = colors[index % colors.length];

//               return (
//                 <Line
//                   key={`${circle}-${index}`}
//                   type="monotone"
//                   dataKey={circle}
//                   name={circle}
//                   stroke={color}
//                   strokeWidth={2}
//                   dot={{
//                     r: 4,
//                     fill: color,
//                   }}
//                   activeDot={{
//                     r: 6,
//                   }}
//                   connectNulls
//                 />
//               );
//             })}
//           </LineChart>
//         </ResponsiveContainer>
//       </Box>
//     </Paper>
//   );
// }

// /* =========================================================
//    WEEK WISE FTR TABLE
// ========================================================= */

// function WeekWiseFTRTable({ rows }) {
//   if (!Array.isArray(rows) || rows.length === 0) {
//     return (
//       <Paper
//         elevation={2}
//         sx={{
//           borderRadius: 2,
//           overflow: "hidden",
//           border: `1px solid ${C.border}`,
//         }}
//       >
//         <NoData label="No Week Wise FTR data found" />
//       </Paper>
//     );
//   }

//   const weekColumns = getWeekColumns(rows);

//   if (weekColumns.length === 0) {
//     return (
//       <Paper
//         elevation={2}
//         sx={{
//           borderRadius: 2,
//           overflow: "hidden",
//           border: `1px solid ${C.border}`,
//         }}
//       >
//         <NoData label="No week data found" />
//       </Paper>
//     );
//   }

//   return (
//     <Paper
//       elevation={2}
//       sx={{
//         borderRadius: 2,
//         overflow: "hidden",
//         border: `1px solid ${C.border}`,
//       }}
//     >
//       {/* TABLE TITLE */}

//       <Box
//         sx={{
//           px: 2,
//           py: 1.25,
//           display: "flex",
//           alignItems: "center",
//           gap: 1,
//           background: HEADER_GRADIENT,
//         }}
//       >
//         <CalendarMonthIcon
//           sx={{
//             color: "#bfe9e9",
//             fontSize: 20,
//           }}
//         />

//         <Typography
//           variant="subtitle2"
//           sx={{
//             color: "#fff",
//             fontWeight: 700,
//             textTransform: "uppercase",
//             letterSpacing: 0.4,
//           }}
//         >
//           Week Wise FTR - Circle VS Week
//         </Typography>
//       </Box>

//       {/* TABLE */}

//       <TableContainer
//         sx={{
//           maxHeight: 550,
//           overflowX: "auto",
//         }}
//       >
//         <Table
//           size="small"
//           stickyHeader
//           sx={{
//             minWidth: 1000,
//             borderCollapse: "separate",

//             "& .MuiTableCell-root": {
//               border: `1px solid ${C.border}`,
//             },
//           }}
//         >
//           <TableHead>
//             {/* FIRST HEADER ROW */}

//             <TableRow>
//               <TableCell
//                 rowSpan={2}
//                 align="center"
//                 sx={{
//                   position: "sticky",
//                   left: 0,
//                   top: 0,
//                   zIndex: 10,
//                   bgcolor: C.corner,
//                   color: "#fff",
//                   fontWeight: 800,
//                   minWidth: 100,
//                 }}
//               >
//                 Circle
//               </TableCell>

//               {weekColumns.map((week) => (
//                 <TableCell
//                   key={week}
//                   colSpan={3}
//                   align="center"
//                   sx={{
//                     bgcolor: C.corner,
//                     color: "#fff",
//                     fontWeight: 800,
//                     minWidth: 270,
//                   }}
//                 >
//                   {week}
//                 </TableCell>
//               ))}
//             </TableRow>

//             {/* SECOND HEADER ROW */}

//             <TableRow>
//               {weekColumns.map((week) => (
//                 <React.Fragment key={week}>
//                   <TableCell
//                     align="center"
//                     sx={{
//                       bgcolor: C.headerBg,
//                       color: "#fff",
//                       fontWeight: 700,
//                       minWidth: 90,
//                     }}
//                   >
//                     Offered
//                   </TableCell>

//                   <TableCell
//                     align="center"
//                     sx={{
//                       bgcolor: C.headerBg,
//                       color: "#fff",
//                       fontWeight: 700,
//                       minWidth: 90,
//                     }}
//                   >
//                     FTR Count
//                   </TableCell>

//                   <TableCell
//                     align="center"
//                     sx={{
//                       bgcolor: C.headerBg,
//                       color: "#fff",
//                       fontWeight: 700,
//                       minWidth: 90,
//                     }}
//                   >
//                     FTR %
//                   </TableCell>
//                 </React.Fragment>
//               ))}
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {rows.map((row, rowIndex) => {
//               const circle = row["Circle"];

//               const labelBg =
//                 rowIndex % 2 === 0
//                   ? C.labelOdd
//                   : C.labelEven;

//               return (
//                 <TableRow key={`${circle}-${rowIndex}`}>
//                   {/* CIRCLE */}

//                   <TableCell
//                     align="center"
//                     sx={{
//                       position: "sticky",
//                       left: 0,
//                       zIndex: 3,
//                       bgcolor: labelBg,
//                       color: C.corner,
//                       fontWeight: 800,
//                       whiteSpace: "nowrap",
//                     }}
//                   >
//                     {circle}
//                   </TableCell>

//                   {/* WEEK VALUES */}

//                   {weekColumns.map((week) => {
//                     const weekData = row[week] || {};

//                     const offered =
//                       Number(weekData["Offered"]) || 0;

//                     const ftrCount =
//                       Number(weekData["FTR Count"]) || 0;

//                     const ftrPercent =
//                       weekData["FTR %"] || "0%";

//                     const percentage =
//                       parsePercent(ftrPercent);

//                     return (
//                       <React.Fragment
//                         key={`${circle}-${week}`}
//                       >
//                         {/* OFFERED */}

//                         <TableCell
//                           align="center"
//                           sx={{
//                             bgcolor: "#fff",
//                             color:
//                               offered === 0
//                                 ? C.zeroText
//                                 : C.valueText,
//                             fontWeight:
//                               offered === 0
//                                 ? 400
//                                 : 700,
//                             fontVariantNumeric:
//                               "tabular-nums",
//                           }}
//                         >
//                           {offered}
//                         </TableCell>

//                         {/* FTR COUNT */}

//                         <TableCell
//                           align="center"
//                           sx={{
//                             bgcolor: "#fff",
//                             color:
//                               ftrCount === 0
//                                 ? C.zeroText
//                                 : C.green,
//                             fontWeight:
//                               ftrCount === 0
//                                 ? 400
//                                 : 700,
//                             fontVariantNumeric:
//                               "tabular-nums",
//                           }}
//                         >
//                           {ftrCount}
//                         </TableCell>

//                         {/* FTR PERCENT */}

//                         <TableCell
//                           align="center"
//                           sx={{
//                             bgcolor: labelBg,
//                           }}
//                         >
//                           <Chip
//                             label={ftrPercent}
//                             size="small"
//                             sx={{
//                               minWidth: 55,
//                               fontWeight: 800,

//                               bgcolor:
//                                 percentage > 0
//                                   ? "#e4f6e8"
//                                   : "#f1f5f9",

//                               color:
//                                 percentage > 0
//                                   ? "#137333"
//                                   : C.zeroText,
//                             }}
//                           />
//                         </TableCell>
//                       </React.Fragment>
//                     );
//                   })}
//                 </TableRow>
//               );
//             })}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Paper>
//   );
// }

// /* =========================================================
//    MAIN COMPONENT
// ========================================================= */

// function WeekWiseFTR() {
//   const [month, setMonth] = useState(defaultMonth());
//   const [year, setYear] = useState(defaultYear());

//   const [rows, setRows] = useState([]);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(false);

//   const abortControllerRef = useRef(null);
//   const requestIdRef = useRef(0);

//   /* =========================================================
//      API CALL
//   ========================================================= */

//   const fetchWeekWiseFTR = useCallback(async () => {
//     if (abortControllerRef.current) {
//       abortControllerRef.current.abort();
//     }

//     const controller = new AbortController();

//     abortControllerRef.current = controller;

//     const thisRequestId = ++requestIdRef.current;

//     setLoading(true);
//     setError(false);

//     try {
//       const params = new URLSearchParams();

//       if (month) {
//         params.append("month", month);
//       }

//       if (year) {
//         params.append("year", year);
//       }

//       const url =
//         `${ServerURL}${API_PATH}?${params.toString()}`;

//       console.log(
//         "Week Wise FTR API URL:",
//         url
//       );

//       const response = await fetch(url, {
//         signal: controller.signal,
//       });

//       if (!response.ok) {
//         throw new Error(
//           `HTTP Error ${response.status}`
//         );
//       }

//       const json = await response.json();

//       console.log(
//         "FULL HOTO API RESPONSE:",
//         json
//       );

//       console.log(
//         "FTR Week Wise:",
//         json?.dashboard?.[
//           "FTR Week Wise Dashboard"
//         ]
//       );

//       if (
//         thisRequestId !== requestIdRef.current
//       ) {
//         return;
//       }

//       const weekWiseData =
//         json?.dashboard?.[
//           "FTR Week Wise Dashboard"
//         ] || [];

//       console.log(
//         "Week Wise FTR API Data:",
//         weekWiseData
//       );

//       setRows(
//         Array.isArray(weekWiseData)
//           ? weekWiseData
//           : []
//       );
//     } catch (err) {
//       if (err.name === "AbortError") {
//         return;
//       }

//       console.error(
//         "WeekWiseFTR fetch error:",
//         err
//       );

//       if (
//         thisRequestId === requestIdRef.current
//       ) {
//         setError(true);
//         setRows([]);
//       }
//     } finally {
//       if (
//         thisRequestId === requestIdRef.current
//       ) {
//         setLoading(false);
//       }
//     }
//   }, [month, year]);

//   /* =========================================================
//      USE EFFECT
//   ========================================================= */

//   useEffect(() => {
//     fetchWeekWiseFTR();

//     return () => {
//       if (abortControllerRef.current) {
//         abortControllerRef.current.abort();
//       }
//     };
//   }, [fetchWeekWiseFTR]);

//   /* =========================================================
//      FILTER STYLE
//   ========================================================= */

//   const controlSx = {
//     bgcolor: "rgba(255,255,255,0.08)",
//     borderRadius: 1,

//     "& .MuiOutlinedInput-root": {
//       color: "#fff",

//       "& fieldset": {
//         borderColor:
//           "rgba(255,255,255,0.35)",
//       },

//       "&:hover fieldset": {
//         borderColor:
//           "rgba(255,255,255,0.55)",
//       },

//       "&.Mui-focused fieldset": {
//         borderColor: "#bfe9e9",
//       },
//     },

//     "& .MuiInputLabel-root": {
//       color:
//         "rgba(255,255,255,0.85)",
//     },

//     "& .MuiSvgIcon-root": {
//       color: "#fff",
//     },
//   };

//   /* =========================================================
//      JSX
//   ========================================================= */

//   return (
//     <Box
//       sx={{
//         width: "100%",
//         minHeight: "100%",
//         px: {
//           xs: 2,
//           sm: 3,
//           md: 4,
//         },
//         py: 3,
//       }}
//     >
//       {/* =====================================================
//           TOP HEADER
//       ===================================================== */}

//       <Paper
//         elevation={3}
//         sx={{
//           borderRadius: 2,
//           px: 2.5,
//           py: 2,
//           mb: 3,
//           background: HEADER_GRADIENT,

//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",

//           gap: 2,
//           flexWrap: "wrap",
//         }}
//       >
//         {/* TITLE */}

//         <Stack
//           direction="row"
//           spacing={1.5}
//           alignItems="center"
//         >
//           <Avatar
//             sx={{
//               bgcolor:
//                 "rgba(255,255,255,0.12)",
//               width: 42,
//               height: 42,
//             }}
//           >
//             <CalendarMonthIcon
//               sx={{
//                 color: "#bfe9e9",
//               }}
//             />
//           </Avatar>

//           <Box>
//             <Typography
//               variant="subtitle1"
//               sx={{
//                 color: "#fff",
//                 fontWeight: 800,
//                 letterSpacing: 0.3,
//               }}
//             >
//               Week Wise FTR Dashboard
//             </Typography>

//             <Typography
//               variant="body2"
//               sx={{
//                 color:
//                   "rgba(255,255,255,0.82)",
//                 fontSize: "12px",
//               }}
//             >
//               Circle VS Week |{" "}
//               {getMonthName(month)} {year}
//             </Typography>
//           </Box>
//         </Stack>

//         {/* ===================================================
//             MONTH + YEAR FILTER
//         =================================================== */}

//         <Stack
//           direction="row"
//           spacing={1.5}
//           alignItems="center"
//           flexWrap="wrap"
//         >
//           {/* MONTH */}

//           <TextField
//             select
//             SelectProps={{
//               native: true,
//             }}
//             size="small"
//             label="Month"
//             value={month}
//             onChange={(e) =>
//               setMonth(e.target.value)
//             }
//             InputLabelProps={{
//               shrink: true,
//             }}
//             sx={{
//               width: 140,
//               ...controlSx,
//             }}
//           >
//             <option value="1">
//               January
//             </option>

//             <option value="2">
//               February
//             </option>

//             <option value="3">
//               March
//             </option>

//             <option value="4">
//               April
//             </option>

//             <option value="5">
//               May
//             </option>

//             <option value="6">
//               June
//             </option>

//             <option value="7">
//               July
//             </option>

//             <option value="8">
//               August
//             </option>

//             <option value="9">
//               September
//             </option>

//             <option value="10">
//               October
//             </option>

//             <option value="11">
//               November
//             </option>

//             <option value="12">
//               December
//             </option>
//           </TextField>

//           {/* YEAR */}

//           <TextField
//             type="number"
//             size="small"
//             label="Year"
//             value={year}
//             onChange={(e) =>
//               setYear(e.target.value)
//             }
//             InputLabelProps={{
//               shrink: true,
//             }}
//             sx={{
//               width: 110,
//               ...controlSx,
//             }}
//           />
//         </Stack>
//       </Paper>

//       {/* =====================================================
//           LOADING
//       ===================================================== */}

//       {loading && (
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             py: 10,
//           }}
//         >
//           <CircularProgress
//             size={36}
//             sx={{
//               color: C.corner,
//             }}
//           />
//         </Box>
//       )}

//       {/* =====================================================
//           ERROR
//       ===================================================== */}

//       {!loading && error && (
//         <Paper
//           elevation={1}
//           sx={{
//             borderRadius: 2,
//           }}
//         >
//           <NoData
//             label="Could not load Week Wise FTR data"
//           />
//         </Paper>
//       )}

//       {/* =====================================================
//           NO DATA
//       ===================================================== */}

//       {!loading &&
//         !error &&
//         rows.length === 0 && (
//           <Paper
//             elevation={1}
//             sx={{
//               borderRadius: 2,
//             }}
//           >
//             <NoData
//               label={`No Week Wise FTR data found for ${getMonthName(
//                 month
//               )} ${year}`}
//             />
//           </Paper>
//         )}

//       {/* =====================================================
//           CHART + TABLE
//       ===================================================== */}

//       {!loading &&
//         !error &&
//         rows.length > 0 && (
//           <Stack spacing={3}>
//             <WeekWiseFTRChart
//               rows={rows}
//             />

//             <WeekWiseFTRTable
//               rows={rows}
//             />
//           </Stack>
//         )}
//     </Box>
//   );
// }

// export default WeekWiseFTR;
// import React, { useState, useEffect, useCallback, useRef } from "react";

// import {
//   Box,
//   Paper,
//   Typography,
//   Stack,
//   TextField,
//   CircularProgress,
//   Chip,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Avatar,
// } from "@mui/material";

// import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
// import TrendingUpIcon from "@mui/icons-material/TrendingUp";
// import InboxIcon from "@mui/icons-material/Inbox";

// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip as RechartsTooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// import { ServerURL } from "../../../services/FetchNodeServices";

// /* =========================================================
//    API
// ========================================================= */

// const API_PATH = "/ix_tracker_vi/HOTO_dashboard/";

// /* =========================================================
//    COLORS
// ========================================================= */

// const C = {
//   corner: "#004d52",
//   headerBg: "#00838f",

//   labelOdd: "#dbf2f2",
//   labelEven: "#eef9f9",

//   valueText: "#0d3a3c",
//   zeroText: "#b7bfc9",

//   border: "#c3cbd6",

//   green: "#28a745",
//   orange: "#ff9800",
//   blue: "#0288d1",
// };

// const HEADER_GRADIENT =
//   "linear-gradient(90deg, #004d52 0%, #006e74 55%, #4fa3a8 100%)";

// /* =========================================================
//    DEFAULT MONTH / YEAR
// ========================================================= */

// const defaultMonth = () => {
//   return String(new Date().getMonth() + 1);
// };

// const defaultYear = () => {
//   return String(new Date().getFullYear());
// };

// /* =========================================================
//    MONTH NAME
// ========================================================= */

// const getMonthName = (month) => {
//   const months = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];

//   return months[Number(month) - 1] || "";
// };

// /* =========================================================
//    PERCENT HELPER
// ========================================================= */

// const parsePercent = (value) => {
//   if (value == null) return 0;

//   if (typeof value === "string") {
//     const number = parseFloat(value.replace("%", ""));

//     return Number.isNaN(number) ? 0 : number;
//   }

//   return Number(value) || 0;
// };

// /* =========================================================
//    NO DATA
// ========================================================= */

// function NoData({ label = "No data found" }) {
//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "center",
//         alignItems: "center",
//         py: 8,
//         color: "#94a3b8",
//         gap: 1,
//       }}
//     >
//       <InboxIcon
//         sx={{
//           fontSize: 42,
//         }}
//       />

//       <Typography
//         variant="body2"
//         sx={{
//           fontWeight: 600,
//         }}
//       >
//         {label}
//       </Typography>
//     </Box>
//   );
// }

// /* =========================================================
//    CHART TOOLTIP
// ========================================================= */

// const CustomTooltip = ({ active, payload, label }) => {
//   if (!active || !payload || !payload.length) {
//     return null;
//   }

//   return (
//     <Paper
//       elevation={4}
//       sx={{
//         p: 1.5,
//         borderRadius: 2,
//         border: `1px solid ${C.border}`,
//       }}
//     >
//       <Typography
//         sx={{
//           fontWeight: 800,
//           color: C.corner,
//           mb: 1,
//         }}
//       >
//         {label}
//       </Typography>

//       {payload.map((item, index) => (
//         <Typography
//           key={index}
//           variant="body2"
//           sx={{
//             color: item.color,
//             fontWeight: 600,
//           }}
//         >
//           {item.name}: {item.value}%
//         </Typography>
//       ))}
//     </Paper>
//   );
// };

// /* =========================================================
//    WEEK WISE FTR TABLE
// ========================================================= */

// function WeekWiseFTRTable({ rows }) {
//   const hasData = Array.isArray(rows) && rows.length > 0;

//   if (!hasData) {
//     return (
//       <Paper
//         elevation={2}
//         sx={{
//           borderRadius: 2,
//           overflow: "hidden",
//           border: `1px solid ${C.border}`,
//         }}
//       >
//         <NoData />
//       </Paper>
//     );
//   }

//   /* ---------------------------------------------------------
//      Get WK-01, WK-02, WK-03...
//   --------------------------------------------------------- */

//   const weekColumns = Object.keys(rows[0])
//     .filter((key) => key.startsWith("WK-"))
//     .sort((a, b) => {
//       const weekA = Number(a.replace("WK-", ""));
//       const weekB = Number(b.replace("WK-", ""));

//       return weekA - weekB;
//     });

//   return (
//     <Paper
//       elevation={2}
//       sx={{
//         borderRadius: 2,
//         overflow: "hidden",
//         border: `1px solid ${C.border}`,
//       }}
//     >
//       {/* HEADER */}

//       <Box
//         sx={{
//           px: 2,
//           py: 1.25,
//           display: "flex",
//           alignItems: "center",
//           gap: 1,
//           background: HEADER_GRADIENT,
//         }}
//       >
//         <CalendarMonthIcon
//           sx={{
//             color: "#bfe9e9",
//             fontSize: 20,
//           }}
//         />

//         <Typography
//           variant="subtitle2"
//           sx={{
//             color: "#fff",
//             fontWeight: 700,
//             textTransform: "uppercase",
//             letterSpacing: 0.4,
//           }}
//         >
//           Circle VS Week
//         </Typography>
//       </Box>

//       {/* TABLE */}

//       <TableContainer
//         sx={{
//           overflowX: "auto",
//           maxHeight: 550,
//         }}
//       >
//         <Table
//           size="small"
//           stickyHeader
//           sx={{
//             minWidth: 900,

//             "& .MuiTableCell-root": {
//               border: `1px solid ${C.border}`,
//             },
//           }}
//         >
//           <TableHead>
//             <TableRow>
//               {/* CIRCLE */}

//               <TableCell
//                 sx={{
//                   position: "sticky",
//                   left: 0,
//                   top: 0,
//                   zIndex: 6,

//                   bgcolor: C.corner,
//                   color: "#fff",

//                   fontWeight: 800,

//                   minWidth: 110,
//                 }}
//               >
//                 Circle
//               </TableCell>

//               {/* WEEKS */}

//               {weekColumns.map((week) => (
//                 <TableCell
//                   key={week}
//                   align="center"
//                   sx={{
//                     bgcolor: C.headerBg,
//                     color: "#fff",

//                     fontWeight: 800,

//                     minWidth: 150,
//                   }}
//                 >
//                   {week}
//                 </TableCell>
//               ))}
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {rows.map((row, rowIndex) => {
//               const circle = row["Circle"];

//               const rowBg = rowIndex % 2 === 0 ? C.labelOdd : C.labelEven;

//               return (
//                 <TableRow key={`${circle}-${rowIndex}`}>
//                   {/* CIRCLE */}

//                   <TableCell
//                     sx={{
//                       position: "sticky",
//                       left: 0,
//                       zIndex: 2,

//                       bgcolor: rowBg,

//                       fontWeight: 800,
//                       color: C.corner,

//                       whiteSpace: "nowrap",
//                     }}
//                   >
//                     {circle}
//                   </TableCell>

//                   {/* WEEK DATA */}

//                   {weekColumns.map((week) => {
//                     const weekData = row[week] || {};

//                     const offered = Number(weekData["Offered"]) || 0;

//                     const ftrCount = Number(weekData["FTR Count"]) || 0;

//                     const ftrPercent = weekData["FTR %"] || "0%";

//                     return (
//                       <TableCell
//                         key={week}
//                         align="center"
//                         sx={{
//                           bgcolor: "#fff",
//                           py: 1,
//                         }}
//                       >
//                         <Stack spacing={0.3} alignItems="center">
//                           {/* FTR % */}

//                           <Chip
//                             label={ftrPercent}
//                             size="small"
//                             sx={{
//                               bgcolor:
//                                 parsePercent(ftrPercent) > 0
//                                   ? "#e4f6e8"
//                                   : "#f1f5f9",

//                               color:
//                                 parsePercent(ftrPercent) > 0
//                                   ? "#137333"
//                                   : C.zeroText,

//                               fontWeight: 800,

//                               minWidth: 55,
//                             }}
//                           />

//                           {/* FTR */}

//                           <Typography
//                             variant="caption"
//                             sx={{
//                               color: C.green,
//                               fontWeight: 700,
//                               lineHeight: 1.3,
//                             }}
//                           >
//                             FTR: {ftrCount}
//                           </Typography>

//                           {/* OFFERED */}

//                           <Typography
//                             variant="caption"
//                             sx={{
//                               color: "#64748b",
//                               fontWeight: 600,
//                               lineHeight: 1.3,
//                             }}
//                           >
//                             Offered: {offered}
//                           </Typography>
//                         </Stack>
//                       </TableCell>
//                     );
//                   })}
//                 </TableRow>
//               );
//             })}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Paper>
//   );
// }

// /* =========================================================
//    FTR % CHART
// ========================================================= */

// function WeekWiseFTRChart({ rows }) {
//   const hasData = Array.isArray(rows) && rows.length > 0;

//   if (!hasData) {
//     return null;
//   }

//   const weekColumns = Object.keys(rows[0])
//     .filter((key) => key.startsWith("WK-"))
//     .sort((a, b) => {
//       return Number(a.replace("WK-", "")) - Number(b.replace("WK-", ""));
//     });

//   /*
//       Transform:

//       [
//         {
//           week: "WK-01",
//           BIH: 80,
//           KK: 85
//         }
//       ]
//   */

//   const chartData = weekColumns.map((week) => {
//     const item = {
//       week,
//     };

//     rows.forEach((row) => {
//       item[row["Circle"]] = parsePercent(row[week]?.["FTR %"]);
//     });

//     return item;
//   });

//   const colors = [
//     "#00838f",
//     "#28a745",
//     "#ff9800",
//     "#0288d1",
//     "#7b1fa2",
//     "#d32f2f",
//     "#5d4037",
//     "#455a64",
//     "#c2185b",
//     "#00796b",
//   ];

//   return (
//     <Paper
//       elevation={2}
//       sx={{
//         borderRadius: 2,
//         overflow: "hidden",
//         border: `1px solid ${C.border}`,
//       }}
//     >
//       {/* CHART HEADER */}

//       <Box
//         sx={{
//           px: 2,
//           py: 1.25,

//           display: "flex",
//           alignItems: "center",

//           gap: 1,

//           background: HEADER_GRADIENT,
//         }}
//       >
//         <TrendingUpIcon
//           sx={{
//             color: "#bfe9e9",
//             fontSize: 20,
//           }}
//         />

//         <Typography
//           variant="subtitle2"
//           sx={{
//             color: "#fff",
//             fontWeight: 700,
//             textTransform: "uppercase",
//             letterSpacing: 0.4,
//           }}
//         >
//           Week Wise FTR %
//         </Typography>
//       </Box>

//       <Box
//         sx={{
//           p: 2,
//           height: 380,
//         }}
//       >
//         <ResponsiveContainer width="100%" height="100%">
//           <LineChart data={chartData}>
//             <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />

//             <XAxis dataKey="week" stroke={C.corner} />

//             <YAxis
//               stroke={C.corner}
//               domain={[0, 100]}
//               tickFormatter={(value) => `${value}%`}
//             />

//             <RechartsTooltip content={<CustomTooltip />} />

//             <Legend />

//             {rows.map((row, index) => (
//               <Line
//                 key={row["Circle"]}
//                 type="monotone"
//                 dataKey={row["Circle"]}
//                 name={row["Circle"]}
//                 stroke={colors[index % colors.length]}
//                 strokeWidth={2}
//                 dot={{
//                   r: 4,
//                   fill: colors[index % colors.length],
//                 }}
//                 activeDot={{
//                   r: 6,
//                 }}
//               />
//             ))}
//           </LineChart>
//         </ResponsiveContainer>
//       </Box>
//     </Paper>
//   );
// }

// /* =========================================================
//    MAIN COMPONENT
// ========================================================= */

// function WeekWiseFTR() {
//   const [month, setMonth] = useState(defaultMonth());

//   const [year, setYear] = useState(defaultYear());

//   const [rows, setRows] = useState([]);

//   const [loading, setLoading] = useState(true);

//   const [error, setError] = useState(false);

//   /* ---------------------------------------------------------
//      Request guards
//   --------------------------------------------------------- */

//   const abortControllerRef = useRef(null);
//   const requestIdRef = useRef(0);

//   /* =========================================================
//      FETCH DATA
//   ========================================================= */

//   const fetchWeekWiseFTR = useCallback(async () => {
//     if (abortControllerRef.current) {
//       abortControllerRef.current.abort();
//     }

//     const controller = new AbortController();

//     abortControllerRef.current = controller;

//     const thisRequestId = ++requestIdRef.current;

//     setLoading(true);
//     setError(false);

//     try {
//       const params = new URLSearchParams();

//       if (month) {
//         params.append("month", month);
//       }

//       if (year) {
//         params.append("year", year);
//       }

//       const url = `${ServerURL}${API_PATH}?${params.toString()}`;

//       const response = await fetch(url, {
//         signal: controller.signal,
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP Error ${response.status}`);
//       }

//       const json = await response.json();

//       console.log("FULL HOTO API RESPONSE:", json);
//       console.log("DASHBOARD:", json?.dashboard);
//       console.log(
//         "FTR Week Wise:",
//         json?.dashboard?.["FTR Week Wise Dashboard"],
//       );

//       if (thisRequestId !== requestIdRef.current) {
//         return;
//       }

//       /*
//           Supports:

//           dashboard["FTR Week Wise Dashboard"]

//           OR

//           dashboard["FTR Sub-Module"]["week_wise_ftr"]
//         */

//       const weekWiseData =
//         json?.dashboard?.["FTR Week Wise Dashboard"] ??
//         json?.dashboard?.["FTR Sub-Module"]?.["week_wise_ftr"] ??
//         [];

//       console.log("Week Wise FTR API Data:", weekWiseData);

//       setRows(Array.isArray(weekWiseData) ? weekWiseData : []);
//     } catch (err) {
//       if (err.name === "AbortError") {
//         return;
//       }

//       console.error("WeekWiseFTR Error:", err);

//       if (thisRequestId === requestIdRef.current) {
//         setError(true);
//         setRows([]);
//       }
//     } finally {
//       if (thisRequestId === requestIdRef.current) {
//         setLoading(false);
//       }
//     }
//   }, [month, year]);

//   /* =========================================================
//      LOAD
//   ========================================================= */

//   useEffect(() => {
//     fetchWeekWiseFTR();

//     return () => {
//       if (abortControllerRef.current) {
//         abortControllerRef.current.abort();
//       }
//     };
//   }, [fetchWeekWiseFTR]);

//   /* =========================================================
//      FILTER STYLE
//   ========================================================= */

//   const controlSx = {
//     bgcolor: "rgba(255,255,255,0.08)",

//     borderRadius: 1,

//     "& .MuiOutlinedInput-root": {
//       color: "#fff",

//       "& fieldset": {
//         borderColor: "rgba(255,255,255,0.35)",
//       },

//       "&:hover fieldset": {
//         borderColor: "rgba(255,255,255,0.55)",
//       },

//       "&.Mui-focused fieldset": {
//         borderColor: "#bfe9e9",
//       },
//     },

//     "& .MuiInputLabel-root": {
//       color: "rgba(255,255,255,0.85)",
//     },
//   };

//   /* =========================================================
//      JSX
//   ========================================================= */

//   return (
//     <Box
//       sx={{
//         width: "100%",
//         minHeight: "100%",
//         px: {
//           xs: 2,
//           sm: 3,
//           md: 4,
//         },
//         py: 3,
//       }}
//     >
//       {/* =====================================================
//           HEADER + FILTER
//       ===================================================== */}

//       <Paper
//         elevation={3}
//         sx={{
//           borderRadius: 2,

//           px: 2.5,
//           py: 2,

//           mb: 3,

//           background: HEADER_GRADIENT,

//           display: "flex",

//           alignItems: "center",
//           justifyContent: "space-between",

//           gap: 2,

//           flexWrap: "wrap",
//         }}
//       >
//         {/* TITLE */}

//         <Stack direction="row" spacing={1.5} alignItems="center">
//           <Avatar
//             sx={{
//               bgcolor: "rgba(255,255,255,0.12)",

//               width: 42,
//               height: 42,
//             }}
//           >
//             <CalendarMonthIcon
//               sx={{
//                 color: "#bfe9e9",
//               }}
//             />
//           </Avatar>

//           <Box>
//             <Typography
//               variant="subtitle1"
//               sx={{
//                 color: "#fff",
//                 fontWeight: 800,
//                 letterSpacing: 0.3,
//               }}
//             >
//               Week Wise FTR Dashboard
//             </Typography>

//             <Typography
//               variant="body2"
//               sx={{
//                 color: "rgba(255,255,255,0.82)",

//                 fontSize: "12px",
//               }}
//             >
//               Circle VS Week | {getMonthName(month)} {year}
//             </Typography>
//           </Box>
//         </Stack>

//         {/* FILTER */}

//         <Stack direction="row" spacing={1.5} alignItems="center">
//           {/* MONTH */}

//           <TextField
//             select
//             SelectProps={{
//               native: true,
//             }}
//             size="small"
//             label="Month"
//             value={month}
//             onChange={(e) => setMonth(e.target.value)}
//             InputLabelProps={{
//               shrink: true,
//             }}
//             sx={{
//               width: 140,
//               ...controlSx,
//             }}
//           >
//             <option value="1">January</option>

//             <option value="2">February</option>

//             <option value="3">March</option>

//             <option value="4">April</option>

//             <option value="5">May</option>

//             <option value="6">June</option>

//             <option value="7">July</option>

//             <option value="8">August</option>

//             <option value="9">September</option>

//             <option value="10">October</option>

//             <option value="11">November</option>

//             <option value="12">December</option>
//           </TextField>

//           {/* YEAR */}

//           <TextField
//             type="number"
//             size="small"
//             label="Year"
//             value={year}
//             onChange={(e) => setYear(e.target.value)}
//             InputLabelProps={{
//               shrink: true,
//             }}
//             sx={{
//               width: 110,
//               ...controlSx,
//             }}
//           />
//         </Stack>
//       </Paper>

//       {/* =====================================================
//           LOADING
//       ===================================================== */}

//       {loading && (
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "center",
//             py: 10,
//           }}
//         >
//           <CircularProgress
//             size={36}
//             sx={{
//               color: C.corner,
//             }}
//           />
//         </Box>
//       )}

//       {/* =====================================================
//           ERROR
//       ===================================================== */}

//       {!loading && error && (
//         <Paper
//           elevation={1}
//           sx={{
//             borderRadius: 2,
//           }}
//         >
//           <NoData label="Could not load Week Wise FTR data" />
//         </Paper>
//       )}

//       {/* =====================================================
//           NO DATA
//       ===================================================== */}

//       {!loading && !error && rows.length === 0 && (
//         <Paper
//           elevation={1}
//           sx={{
//             borderRadius: 2,
//           }}
//         >
//           <NoData
//             label={`No Week Wise FTR data found for ${getMonthName(
//               month,
//             )} ${year}`}
//           />
//         </Paper>
//       )}

//       {/* =====================================================
//           DASHBOARD
//       ===================================================== */}

//       {!loading && !error && rows.length > 0 && (
//         <Stack spacing={3}>
//           {/* CHART */}

//           <WeekWiseFTRChart rows={rows} />

//           {/* TABLE */}

//           <WeekWiseFTRTable rows={rows} />
//         </Stack>
//       )}
//     </Box>
//   );
// }

// export default WeekWiseFTR;
