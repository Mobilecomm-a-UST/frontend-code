import React, { useMemo, useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler, } from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register( CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler );

const AdminTableChart = ({ data = [], months = [] }) => {

    const [selectedCircles, setSelectedCircles] = useState([]);

    // ---------------------------------------------------------
    // Available Circles
    // ---------------------------------------------------------
    const circleList = useMemo(() => {
        return [...new Set( data .map(item => item.circle) .filter(Boolean) )].sort();
    }, [data]);


    // ---------------------------------------------------------
    // GP Calculation
    // ---------------------------------------------------------
    const getGP = (monthData, month) => {

        const monthInfo = monthData?.[month];

        // No data for this month
        if (!monthInfo || !monthInfo.costs) {
            return null;
        }

        const costs = monthInfo.costs;

        const revenue = Number(costs.c1 || 0);

        const resourceSalary = Number(costs.c2 || 0);
        const vendorCost = Number(costs.c3 || 0);
        const expense = Number(costs.c4 || 0);
        const fixedCost = Number(costs.c5 || 0);

        // If all cost values are missing/empty,
        // don't treat it as valid zero data.
        const hasAnyData =
            costs.c1 != null ||
            costs.c2 != null ||
            costs.c3 != null ||
            costs.c4 != null ||
            costs.c5 != null;

        if (!hasAnyData) {
            return null;
        }

        const totalCost =
            resourceSalary +
            vendorCost +
            expense +
            fixedCost;

        return revenue - totalCost;
    };


    // ---------------------------------------------------------
    // Format Amount
    // ---------------------------------------------------------
    const formatAmount = (value) => {

        if (value == null) return "-";

        const absValue = Math.abs(value);

        if (absValue >= 10000000) {
            return `₹ ${(value / 10000000).toFixed(2)} Cr`;
        }

        if (absValue >= 100000) {
            return `₹ ${(value / 100000).toFixed(2)} L`;
        }

        if (absValue >= 1000) {
            return `₹ ${(value / 1000).toFixed(1)} K`;
        }

        return `₹ ${value.toFixed(0)}`;
    };


    // ---------------------------------------------------------
    // Color generator
    // ---------------------------------------------------------
    const getCircleColor = (index) => {

        const colors = [
            "#2563eb",
            "#dc2626",
            "#16a34a",
            "#9333ea",
            "#ea580c",
            "#0891b2",
            "#be123c",
            "#4f46e5",
            "#65a30d",
            "#c026d3",
        ];

        return colors[index % colors.length];
    };


    // ---------------------------------------------------------
    // Calculate All Circle GP
    // ---------------------------------------------------------
    const getAllCircleGP = (month) => {

        let totalRevenue = 0;
        let totalCost = 0;

        let hasData = false;

        data.forEach(item => {

            const monthInfo = item.months?.[month];

            if (!monthInfo || !monthInfo.costs) {
                return;
            }

            const costs = monthInfo.costs;

            const revenue = Number(costs.c1 || 0);

            const resourceSalary = Number(costs.c2 || 0);
            const vendorCost = Number(costs.c3 || 0);
            const expense = Number(costs.c4 || 0);
            const fixedCost = Number(costs.c5 || 0);

            const hasAnyData =
                costs.c1 != null ||
                costs.c2 != null ||
                costs.c3 != null ||
                costs.c4 != null ||
                costs.c5 != null;

            if (!hasAnyData) {
                return;
            }

            totalRevenue += revenue;

            totalCost +=
                resourceSalary +
                vendorCost +
                expense +
                fixedCost;

            hasData = true;
        });

        if (!hasData) {
            return null;
        }

        return totalRevenue - totalCost;
    };


    // ---------------------------------------------------------
    // Chart Data
    // ---------------------------------------------------------
    const chartData = useMemo(() => {
        if (selectedCircles.length === 0) {

            return {
                labels: months,
                datasets: [
                    {
                        label: "All Circles",
                        data: months.map(month =>getAllCircleGP(month)),
                        borderColor: "#2563eb",
                        backgroundColor: "rgba(37, 99, 235, 0.10)",
                        borderWidth: 2.5,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        tension: 0.35,
                        fill: true,
                        spanGaps: false,
                    },
                ],
            };

        }


        // -----------------------------------------------------
        // Selected circles
        // -----------------------------------------------------

        const datasets = selectedCircles.map(
            (circle, index) => {
                const circleData = data.filter(item => item.circle === circle);
                return {
                    label: circle,
                    data: months.map(month => {
                        let totalGP = 0;
                        let hasData = false;
                        circleData.forEach(item => {
                            const gp = getGP(item.months,month);
                            if (gp !== null) {
                                totalGP += gp;
                                hasData = true;
                            }

                        });

                        return hasData ? totalGP : null;
                    }),

                    borderColor: getCircleColor(index),
                    backgroundColor: "transparent",
                    borderWidth: 2.5,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    tension: 0.35,
                    fill: false,
                    spanGaps: false,
                };
            }
        );


        return {
            labels: months,
            datasets,
        };

    }, [data, months, selectedCircles]);


    // ---------------------------------------------------------
    // Chart Options
    // ---------------------------------------------------------
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: "index",
            intersect: false,
        },
        plugins: {
            legend: {
                position: "top",
                labels: {
                    usePointStyle: true,
                    padding: 18,
                    font: {
                        size: 11,
                        weight: "600",
                    },
                },
            },

            tooltip: {
                callbacks: {
                    label: (context) => {
                        const value = context.raw;
                        return `${context.dataset.label}: ${formatAmount(value)}`;
                    },
                },
            },
        },

        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    font: {
                        size: 10,
                    },
                },
            },

            y: {
                beginAtZero: false,
                grid: {
                    color: "rgba(0,0,0,0.08)",
                },
                ticks: {
                    font: {
                        size: 10,
                    },
                    callback: (value) => {
                        const absValue = Math.abs(value);
                        if (absValue >= 10000000) {
                            return `₹ ${(value / 10000000).toFixed(1)} Cr`;
                        }

                        if (absValue >= 100000) {
                            return `₹ ${(value / 100000).toFixed(1)} L`;
                        }
                        if (absValue >= 1000) {
                            return `₹ ${(value / 1000).toFixed(0)}K`;
                        }
                        return `₹ ${value}`;
                    },
                },
            },
        },
    };


    // ---------------------------------------------------------
    // Circle Selection
    // ---------------------------------------------------------
    const handleCircleChange = (e) => {
        const options = Array.from(
            e.target.selectedOptions
        );
        const values = options.map(
            option => option.value
        );
        setSelectedCircles(values);
    };


    // ---------------------------------------------------------
    // UI
    // ---------------------------------------------------------
    return (

        <div
            style={{
                width: "100%",
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                padding: "16px 18px 18px",
                boxSizing: "border-box",
            }}
        >

            {/* Header */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 12,
                    gap: 12,
                    flexWrap: "wrap",
                }}
            >

                <div>

                    <div
                        style={{
                            fontSize: 16,
                            fontWeight: 700,
                            color: "#1f2937",
                        }}
                    >
                        Gross Profit Trend
                    </div>

                    <div
                        style={{
                            fontSize: 11,
                            color: "#6b7280",
                            marginTop: 3,
                        }}
                    >
                        Month-wise GP analysis
                    </div>

                </div>


                {/* Circle Filter */}
                <div>

                    <label
                        style={{
                            display: "block",
                            fontSize: 11,
                            fontWeight: 600,
                            color: "#4b5563",
                            marginBottom: 4,
                        }}
                    >
                        Circle
                    </label>

                    <select
                        multiple
                        value={selectedCircles}
                        onChange={handleCircleChange}

                        style={{
                            minWidth: 180,
                            height: 32,

                            border: "1px solid #d1d5db",
                            borderRadius: 6,

                            padding: "4px 8px",

                            fontSize: 12,

                            outline: "none",

                            background: "#fff",
                        }}
                    >

                        {circleList.map(circle => (

                            <option
                                key={circle}
                                value={circle}
                            >
                                {circle}
                            </option>

                        ))}

                    </select>

                </div>

            </div>


            {/* Selected status */}
            <div
                style={{
                    fontSize: 11,
                    color: "#6b7280",
                    marginBottom: 8,
                }}
            >

                {selectedCircles.length === 0
                    ? "Showing combined GP for all circles"
                    : `Showing GP trend for ${selectedCircles.length} selected circle${selectedCircles.length > 1 ? "s" : ""}`
                }

            </div>


            {/* Chart */}
            <div
                style={{
                    width: "100%",
                    height: 360,
                }}
            >

                <Line
                    data={chartData}
                    options={chartOptions}
                />

            </div>

        </div>
    );
};

export default AdminTableChart;