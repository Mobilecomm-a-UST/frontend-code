import React from "react";
import {Drawer, Box, Typography, IconButton, Chip, Grid, Card, CardContent, Divider} from "@mui/material";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { LinearProgress, Stack } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import PaidIcon from "@mui/icons-material/Paid";
import SavingsIcon from "@mui/icons-material/Savings";
import { Weight } from "@hugeicons/core-free-icons";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register( ArcElement, Tooltip, Legend,ChartDataLabels);

const formatAmount = (value) => Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });

export default function AnalyticsDrawer({ open, onClose, data }) {
    if (!data) return null;

    const getStatus = (gp) => {

        if (gp >= 30)
            return {
                text: "Excellent",
                color: "success"
            };

        if (gp >= 20)
            return {
                text: "Good",
                color: "primary"
            };

        if (gp >= 10)
            return {
                text: "Average",
                color: "warning"
            };

        return {
            text: "Critical",
            color: "error"
        };

    };

    const status = getStatus(data.gpPercent);
    const salary = Number(data.salary || 0);
    const vendor = Number(data.vendor || 0);
    const expense = Number(data.expense || 0);
    const fixed = Number(data.fixed || 0);
    const totalCostBreakdown = salary + vendor + expense + fixed;

    const getPercentage = (value) => {
        if (totalCostBreakdown === 0) return 0;

        return Math.round( (value / totalCostBreakdown) * 100 );
    };

    const pieData = {
        labels: [ "Resource Salary", "Vendor Cost", "Expense", "Fixed Cost" ],
        datasets: [
            {
                data: [ salary, vendor, expense, fixed ],
                backgroundColor: [ "#1976d2", "#43a047", "#ff9800", "#e53935" ],
                borderColor: "#ffffff",
                borderWidth: 3,
                hoverOffset: 8
            }
        ]
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "62%",
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    padding: 15,
                    usePointStyle: true,
                    font: {
                        size: 10,
                        weight:"600"
                    },
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const value = context.raw;
                        const percentage = totalCostBreakdown === 0 ? 0 : ((value / totalCostBreakdown) * 100).toFixed(1);
                        return ` ₹ ${formatAmount(value)} (${percentage}%)`;
                    }

                }

            },
            datalabels: {
                formatter: (value) => {
                    const percentage =
                        totalCostBreakdown === 0
                            ? 0
                            : ((value / totalCostBreakdown) * 100).toFixed(0);

                    return `${percentage}%`;
                },
                color: "#fff",
                font: {
                    size: 11,
                    weight: "bold",
                },
                textAlign: "center",
            },

        }
    };

    return (

        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: 470,
                    background: "#f5f7fb"
                }
            }}
        >


            {/* ================= Header ================= */}

            <Box
                sx={{
                    background: "linear-gradient(135deg,#1565c0,#42a5f5)",
                    color: "#fff",
                    p: 1
                }}
            >

                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >

                    <Box>

                        <Typography
                            variant="h5"
                            fontWeight="bold"
                        >
                            {data.customer}-{data.circle}-{data.project}
                        </Typography>

                        {/* <Typography
                            variant="body1"
                            sx={{
                                opacity: .9
                            }}
                        >
                            {data.circle}
                        </Typography> */}

                    </Box>

                    <IconButton
                        onClick={onClose}
                        sx={{
                            color: "#fff"
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                </Box>

                {/* <Box
                    mt={2}
                >

                    <Chip
                        label={status.text}
                        color={status.color}
                    />

                </Box> */}

            </Box>

            {/* ================= KPI ================= */}

            <Box p={2}>

                <Grid
                    container
                    spacing={2}
                >

                    <Grid item xs={6}>

                        <Card
                            sx={{
                                borderRadius: 3,
                                boxShadow: 3
                            }}
                        >

                            <CardContent>

                                {/* <CurrencyRupeeIcon
                                    color="primary"
                                /> */}

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Revenue
                                </Typography>

                                <Typography
                                    variant="h6"
                                    fontWeight="bold"
                                >
                                    ₹ {formatAmount(data.revenue)}
                                </Typography>

                            </CardContent>

                        </Card>

                    </Grid>

                    <Grid item xs={6}>

                        <Card
                            sx={{
                                borderRadius: 3,
                                boxShadow: 3
                            }}
                        >

                            <CardContent>

                                {/* <PaidIcon
                                    color="error"
                                /> */}

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Total Cost
                                </Typography>

                                <Typography
                                    variant="h6"
                                    fontWeight="bold"
                                >
                                    ₹ {formatAmount(data.totalCost)}
                                </Typography>

                            </CardContent>

                        </Card>

                    </Grid>

                    <Grid item xs={6}>

                        <Card
                            sx={{
                                borderRadius: 3,
                                boxShadow: 3
                            }}
                        >

                            <CardContent>

                                {/* <SavingsIcon
                                    color="success"
                                /> */}

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Gross Profit
                                </Typography>

                                <Typography
                                    variant="h6"
                                    fontWeight="bold"
                                >
                                    ₹ {formatAmount(data.gp)}
                                </Typography>

                            </CardContent>

                        </Card>

                    </Grid>

                    <Grid item xs={6}>

                        <Card sx={{ borderRadius: 3, boxShadow: 3 }} >

                            <CardContent>

                                {/* <TrendingUpIcon
                                    color="success"
                                /> */}

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    GP %
                                </Typography>

                                <Typography
                                    variant="h6"
                                    fontWeight="bold"
                                >
                                     {data.gpPercent.toFixed(2)}%
                                </Typography>

                            </CardContent>

                        </Card>

                    </Grid>

                </Grid>

                <Divider
                    sx={{
                        my: 1
                    }}
                />

                {/* ================= Cost Distribution ================= */}

                <Box
                    sx={{
                        background: "#ffffff",
                        borderRadius: 3,
                        p: 2,
                        boxShadow: "0 3px 12px rgba(0,0,0,0.08)"
                    }}
                >

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{
                            color: "#17406d",
                            mb: 2
                        }}
                    >
                        Cost Distribution
                    </Typography>

                    <Box
                        sx={{
                            height: 250,
                            display: "flex",
                            justifyContent: "center"
                        }}
                    >

                        <Doughnut
                            data={pieData}
                            options={pieOptions}
                        />

                    </Box>

                </Box>

                {/* ================= Cost Breakdown ================= */}

                <Box
                    sx={{
                        mt: 2,
                        background: "#ffffff",
                        borderRadius: 3,
                        p: 2,
                        boxShadow: "0 3px 12px rgba(0,0,0,0.08)"
                    }}
                >

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{
                            color: "#17406d",
                            mb: 2
                        }}
                    >
                        Cost Breakdown
                    </Typography>


                    {/* Resource Salary */}

                    <Box sx={{ mb: 2.5 }}>

                        <Box
                            display="flex"
                            justifyContent="space-between"
                            mb={0.7}
                        >

                            <Typography variant="body2" fontWeight="600">
                                Resource Salary
                            </Typography>

                            <Typography variant="body2" fontWeight="bold">
                                ₹ {formatAmount(salary)}
                            </Typography>

                        </Box>

                        <LinearProgress
                            variant="determinate"
                            value={getPercentage(salary)}
                            sx={{
                                height: 9,
                                borderRadius: 5,

                                backgroundColor: "#e3f2fd",

                                "& .MuiLinearProgress-bar": {
                                    backgroundColor: "#1976d2",
                                    borderRadius: 5
                                }
                            }}
                        />

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            {getPercentage(salary)}% of total cost
                        </Typography>

                    </Box>


                    {/* Vendor Cost */}

                    <Box sx={{ mb: 2.5 }}>

                        <Box
                            display="flex"
                            justifyContent="space-between"
                            mb={0.7}
                        >

                            <Typography variant="body2" fontWeight="600">
                                Vendor Cost
                            </Typography>

                            <Typography variant="body2" fontWeight="bold">
                                ₹ {formatAmount(vendor)}
                            </Typography>

                        </Box>

                        <LinearProgress
                            variant="determinate"
                            value={getPercentage(vendor)}
                            sx={{
                                height: 9,
                                borderRadius: 5,

                                backgroundColor: "#e8f5e9",

                                "& .MuiLinearProgress-bar": {
                                    backgroundColor: "#43a047",
                                    borderRadius: 5
                                }
                            }}
                        />

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            {getPercentage(vendor)}% of total cost
                        </Typography>

                    </Box>


                    {/* Expense */}

                    <Box sx={{ mb: 2.5 }}>

                        <Box
                            display="flex"
                            justifyContent="space-between"
                            mb={0.7}
                        >

                            <Typography variant="body2" fontWeight="600">
                                Expense
                            </Typography>

                            <Typography variant="body2" fontWeight="bold">
                                ₹ {formatAmount(expense)}
                            </Typography>

                        </Box>

                        <LinearProgress
                            variant="determinate"
                            value={getPercentage(expense)}
                            sx={{
                                height: 9,
                                borderRadius: 5,

                                backgroundColor: "#fff3e0",

                                "& .MuiLinearProgress-bar": {
                                    backgroundColor: "#ff9800",
                                    borderRadius: 5
                                }
                            }}
                        />

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            {getPercentage(expense)}% of total cost
                        </Typography>

                    </Box>


                    {/* Fixed Cost */}

                    <Box>

                        <Box
                            display="flex"
                            justifyContent="space-between"
                            mb={0.7}
                        >

                            <Typography variant="body2" fontWeight="600">
                                Fixed Cost
                            </Typography>

                            <Typography variant="body2" fontWeight="bold">
                                ₹ {formatAmount(fixed)}
                            </Typography>

                        </Box>

                        <LinearProgress
                            variant="determinate"
                            value={getPercentage(fixed)}
                            sx={{
                                height: 9,
                                borderRadius: 5,

                                backgroundColor: "#ffebee",

                                "& .MuiLinearProgress-bar": {
                                    backgroundColor: "#e53935",
                                    borderRadius: 5
                                }
                            }}
                        />

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            {getPercentage(fixed)}% of total cost
                        </Typography>

                    </Box>

                </Box>






                
                


            </Box>
        </Drawer>
    );
}