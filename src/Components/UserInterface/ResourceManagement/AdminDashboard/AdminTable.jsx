// import React, { useState, useEffect, useMemo } from 'react';
// import { getDecreyptedData } from '../../../utils/localstorage';
// import axios from 'axios';
// import ExcelJS from "exceljs";
// import { saveAs } from "file-saver";
// import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler, } from "chart.js";


const CATEGORY_CONFIG = {
    A: {
        label: "A", revenue: ">1 CR",
        costs: [
            { id: "c1", label: "Revenue", value: ">1 Cr" },
            { id: "c2", label: "Resource Salary", value: "24%" },
            { id: "c3", label: "Vendor cost", value: "30%" },
            { id: "c4", label: "Expense", value: "3.00%" },
            { id: "c5", label: "Fixed cost", value: "4.90%" },
            { id: "c6", label: "Total Cost", value: "61.90%" },
            { id: "c7", label: "Gross Profit", value: "38.10%", isTotal: true },
        ],
        resources: [
            { id: "r1", role: "CDH", qty: 1, exp: "13 to 20" },
            { id: "r2", role: "PM", qty: 5, exp: "8 to 12" },
            { id: "r3", role: "Coordinator", qty: 5, exp: "6 to 9" },
            { id: "r4", role: "NPO Lead", qty: 1, exp: "10 to 18" },
            { id: "r5", role: "Jr NPO", qty: 1, exp: "6 to 12" },
            { id: "r6", role: "SCFT Coordinator", qty: 2, exp: "4 to 6" },
            { id: "r7", role: "Ware House Manager", qty: 1, exp: "10 to 20" },
            { id: "r8", role: "Warehouse Coordinator", qty: 3, exp: "3 to 8" },
            { id: "r9", role: "SCM Lead", qty: 1, exp: "6 to 10" },
            { id: "r10", role: "OHS Safety", qty: 1, exp: "5 to 8" },
            { id: "r11", role: "EMF Coordinator", qty: 1, exp: "3 to 7" },
            { id: "r12", role: "RF Survey Coordinator", qty: 1, exp: "3 to 7" },
            { id: "r13", role: "PMIS Lead", qty: 1, exp: "2 to 5" },
            { id: "r14", role: "MS2 Lead", qty: 1, exp: "4 to 8" },
            { id: "r15", role: "Total back end Resources", qty: 25, exp: "" },
        ],
        otherResources: [
            { id: "or1", role: "Field engineer", qty: "", exp: "" },
            { id: "or2", role: "Technician", qty: "", exp: "" },
        ],
    },
    B: {
        label: "B", revenue: "50L to 1CR",
        costs: [
            { id: "c1", label: "Revenue", value: "50L to 1CR" },
            { id: "c2", label: "Resource Salary", value: "25%" },
            { id: "c3", label: "Vendor cost", value: "32%" },
            { id: "c4", label: "Expense", value: "3.30%" },
            { id: "c5", label: "Fixed cost", value: "4.90%" },
            { id: "c6", label: "Total Cost", value: "65.20%" },
            { id: "c7", label: "Gross Profit", value: "34.80%", isTotal: true },
        ],
        resources: [
            { id: "r1", role: "CDH", qty: 1, exp: "13 to 20" },
            { id: "r2", role: "PM", qty: 4, exp: "8 to 12" },
            { id: "r3", role: "Coordinator", qty: 4, exp: "6 to 9" },
            { id: "r4", role: "NPO Lead", qty: 1, exp: "10 to 18" },
            { id: "r5", role: "Jr NPO", qty: 1, exp: "6 to 12" },
            { id: "r6", role: "SCFT Coordinator", qty: 2, exp: "4 to 6" },
            { id: "r7", role: "Ware House Manager", qty: 1, exp: "10 to 20" },
            { id: "r8", role: "Warehouse Coordinator", qty: 2, exp: "3 to 8" },
            { id: "r9", role: "SCM Lead", qty: 1, exp: "6 to 10" },
            { id: "r10", role: "OHS Safety", qty: 1, exp: "5 to 8" },
            { id: "r11", role: "EMF Coordinator", qty: 1, exp: "3 to 7" },
            { id: "r12", role: "RF Survey Coordinator", qty: 1, exp: "3 to 7" },
            { id: "r13", role: "PMIS Lead", qty: 1, exp: "2 to 5" },
            { id: "r14", role: "MS2 Lead", qty: 1, exp: "4 to 8" },
            { id: "r15", role: "Total back end Resources", qty: 22, exp: "" },
        ],
        otherResources: [
            { id: "or1", role: "Field engineer", qty: "", exp: "" },
            { id: "or2", role: "Technician", qty: "", exp: "" },
        ],
    },
    C: {
        label: "C", revenue: "<50L",
        costs: [
            { id: "c1", label: "Revenue", value: "<50L" },
            { id: "c2", label: "Resource Salary", value: "28%" },
            { id: "c3", label: "Vendor cost", value: "33%" },
            { id: "c4", label: "Expense", value: "3.50%" },
            { id: "c5", label: "Fixed cost", value: "5.20%" },
            { id: "c6", label: "Total Cost", value: "69.70%" },
            { id: "c7", label: "Gross Profit", value: "30.30%", isTotal: true },
        ],
        resources: [
            { id: "r1", role: "CDH", qty: 1, exp: "10 to 15" },
            { id: "r2", role: "PM", qty: 3, exp: "6 to 10" },
            { id: "r3", role: "Coordinator", qty: 3, exp: "4 to 6" },
            { id: "r4", role: "NPO Lead", qty: 1, exp: "8 to 14" },
            { id: "r5", role: "Jr NPO", qty: 0, exp: "" },
            { id: "r6", role: "SCFT Coordinator", qty: 1, exp: "4 to 6" },
            { id: "r7", role: "Ware House Manager", qty: 1, exp: "7 to 14" },
            { id: "r8", role: "Warehouse Coordinator", qty: 2, exp: "3 to 8" },
            { id: "r9", role: "SCM Lead", qty: 0, exp: "" },
            { id: "r10", role: "OHS Safety", qty: 0, exp: "" },
            { id: "r11", role: "EMF Coordinator", qty: 1, exp: "3 to 7" },
            { id: "r12", role: "RF Survey Coordinator", qty: 1, exp: "3 to 7" },
            { id: "r13", role: "PMIS Lead", qty: 1, exp: "2 to 5" },
            { id: "r14", role: "MS2 Lead", qty: 1, exp: "4 to 8" },
            { id: "r15", role: "Total back end Resources", qty: 16, exp: "" },
        ],
        otherResources: [
            { id: "or1", role: "Field engineer", qty: "", exp: "" },
            { id: "or2", role: "Technician", qty: "", exp: "" },
        ],
    },
    D: {
        label: "D", revenue: "<10L",
        costs: [
            { id: "c1", label: "Revenue", value: "<10L" },
            { id: "c2", label: "Resource Salary", value: "38%" },
            { id: "c3", label: "Vendor cost", value: "33%" },
            { id: "c4", label: "Expense", value: "4.00%" },
            { id: "c5", label: "Fixed cost", value: "6.20%" },
            { id: "c6", label: "Total Cost", value: "81.20%" },
            { id: "c7", label: "Gross Profit", value: "18.80%", isTotal: true },
        ],
        resources: [
            { id: "r1", role: "CDH", qty: 1, exp: "10 to 15" },
            { id: "r2", role: "PM", qty: 1, exp: "8 to 10" },
            { id: "r3", role: "Coordinator", qty: 1, exp: "4 to 6" },
            { id: "r4", role: "NPO Lead", qty: 0, exp: "10 to 18" },
            { id: "r5", role: "Jr NPO", qty: 0, exp: "6 to 12" },
            { id: "r6", role: "SCFT Coordinator", qty: 0, exp: "4 to 6" },
            { id: "r7", role: "Ware House Manager", qty: 1, exp: "10 to 20" },
            { id: "r8", role: "Warehouse Coordinator", qty: 0, exp: "3 to 8" },
            { id: "r9", role: "SCM Lead", qty: 0, exp: "" },
            { id: "r10", role: "OHS Safety", qty: 0, exp: "" },
            { id: "r11", role: "EMF Coordinator", qty: 0, exp: "3 to 7" },
            { id: "r12", role: "RF Survey Coordinator", qty: 0, exp: "3 to 7" },
            { id: "r13", role: "PMIS Lead", qty: 0, exp: "2 to 5" },
            { id: "r14", role: "MS2 Lead", qty: 0, exp: "4 to 8" },
            { id: "r15", role: "Total back end Resources", qty: 4, exp: "" },
        ],
        otherResources: [
            { id: "or1", role: "Field engineer", qty: "", exp: "" },
            { id: "or2", role: "Technician", qty: "", exp: "" },
        ],
    },
};



import React, { memo, useCallback, useEffect, useMemo, useState, } from "react";
import axios from "axios";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
//   new code
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, } from "chart.js";
import { Line } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
ChartJS.register( CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend,ChartDataLabels);





const MONTHS = [ "Jan-26", "Feb-26", "Mar-26", "Apr-26", "May-26", "Jun-26", "Jul-26"];

const CATEGORY_LIST = [
    { id: "", label: "All" },
    { id: "c1", label: "Revenue" },
    { id: "c2", label: "Resource Salary" },
    { id: "c3", label: "Vendor cost" },
    { id: "c4", label: "Expense" },
    { id: "c5", label: "Fixed cost" },
    { id: "c6", label: "Total Cost" },
    { id: "c7", label: "Gross Profit" },
];

const CATEGORY_COLORS = {
    A: "#1a5c2a",
    B: "#006E74",
    C: "#a85c00",
    D: "#8b1a1a",
};

const BORDER = "0.5px solid #000";

const styles = {
    container: {
        fontFamily: "sans-serif",
        padding: "1.5rem 0 2rem",
    },

    toolbar: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 12,
        padding: "8px 12px",
        background: "#f5f5f0",
        border: "0.5px solid #ddd",
        borderRadius: 8,
    },

    toolbarRight: {
        marginLeft: "auto",
        display: "flex",
        gap: 8,
    },

    select: {
        padding: "6px 8px",
        fontSize: 13,
        borderRadius: 6,
        border: "1px solid #ccc",
        outline: "none",
    },

    exportButton: {
        padding: "6px 8px",
        fontSize: 13,
        borderRadius: 6,
        border: "1px solid #ccc",
        background: "#223354",
        color: "#fff",
        cursor: "pointer",
    },

    tableWrapper: {
        border: BORDER,
        borderRadius: 8,
        overflow: "auto",
        width: "100%",
    },

    table: {
        borderCollapse: "collapse",
        width: "100%",
    },

    cell: {
        border: BORDER,
        padding: "4px 8px",
        fontSize: 12,
        background: "#fff",
        color: "#222",
        whiteSpace: "nowrap",
    },

    subHeader: {
        border: BORDER,
        padding: "3px 4px",
        fontSize: 10,
        textAlign: "center",
        background: "#f0ede0",
        color: "#555",
        whiteSpace: "nowrap",
    },

    emptyHeader: {
        border: "none",
        background: "#f0ede0",
        padding: 0,
    },
};



const toNumber = (value) => {
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
};


const getMonthCosts = (monthData, month) => {
    return monthData?.[month]?.costs || {};
};


const calculateMonthData = (monthData, month) => {

    const costs = getMonthCosts(monthData, month);
    const revenue = toNumber(costs.c1);
    const resourceSalary = toNumber(costs.c2);
    const vendorCost = toNumber(costs.c3);
    const expense = toNumber(costs.c4);
    const fixedCost = toNumber(costs.c5);

    const totalCost = resourceSalary + vendorCost + expense + fixedCost;
    const grossProfit = revenue - totalCost;

    return {
        c1: revenue,
        c2: resourceSalary,
        c3: vendorCost,
        c4: expense,
        c5: fixedCost,
        c6: totalCost,
        c7: grossProfit,

        percentages: {
            c2: revenue
                ? (resourceSalary / revenue) * 100
                : null,

            c3: revenue
                ? (vendorCost / revenue) * 100
                : null,

            c4: revenue
                ? (expense / revenue) * 100
                : null,

            c5: revenue
                ? (fixedCost / revenue) * 100
                : null,

            c6: revenue
                ? (totalCost / revenue) * 100
                : null,

            c7: revenue
                ? (grossProfit / revenue) * 100
                : null,
        },
    };
};


const getDisplayValue = (monthData, month, costId) => {
    const data = monthData?.[month];

    if (!data) {
        return null;
    }

    const value = data[costId];

    if (costId === "c1") {
        return value?.toFixed(0) ?? "0";
    }

    const percentage = data.percentages?.[costId];

    if (percentage == null) {
        return "";
    }

    return `${percentage.toFixed(2)}%`;
};


const getCellBackground = (monthData, month, cost) => {
    if (cost.id === "c1") {
        return "#d8ac46";
    }

    const actual = monthData?.[month]?.percentages?.[cost.id];

    if (actual == null) {
        return undefined;
    }

    const allowed = parseFloat(cost.value);

    if (Number.isNaN(allowed)) {
        return undefined;
    }

    const isGood =
        cost.id === "c7"
            ? actual >= allowed
            : actual <= allowed;

    return isGood
        ? "#94CA98"
        : "#f52c2cbd";
};



const DisplayCell = memo(({ value }) => {
    return (
        <span
            style={{
                display: "block",
                fontSize: 12,
                textAlign: "center",
                padding: "3px 5px",
                color: "#fff",
            }}
        >
            {value !== "" && value != null ? (
                value
            ) : (
                <span style={{ color: "#ccc" }} />
            )}
        </span>
    );
});


const SectionCell = memo(({
    text,
    rowSpan,
}) => {
    return (
        <td
            rowSpan={rowSpan}
            style={{
                border: BORDER,
                background: "#f5cfc0",
                fontWeight: 500,
                fontSize: 11,
                textAlign: "center",
                verticalAlign: "middle",
                padding: "8px 3px",
                width: 28,
                color: "#5a1e00",
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
            }}
        >
            {text}
        </td>
    );
});


const AdminTableRow = memo(({
    circleData,
    cost,
    monthData,
    isFirst,
    totalRows,
}) => {
    return (
        <tr>
            {isFirst && (
                <SectionCell
                     text={`${circleData.circle} - ${circleData.customer}`}
                    rowSpan={totalRows}
                />
            )}

            <td
                style={{
                    ...styles.cell,
                    fontWeight: cost.isTotal ? 600 : 400,
                }}
            >
                {cost.label}
            </td>

            <td
                style={{
                    ...styles.cell,
                    textAlign: "center",
                    background: cost.isTotal
                        ? "#f0f0e8"
                        : "#cce8f7",
                    fontWeight: cost.isTotal ? 600 : 400,
                }}
            >
                {cost.value}
            </td>

            {MONTHS.map((month) => (
                <td
                    key={month}
                    style={{
                        ...styles.cell,
                        textAlign: "center",
                        background: getCellBackground(
                            monthData,
                            month,
                            cost
                        ),
                    }}
                >
                    <DisplayCell
                        value={getDisplayValue(
                            monthData,
                            month,
                            cost.id
                        )}
                    />
                </td>
            ))}
        </tr>
    );
});



const AdminTable = () => {

    const [analyticsData, setAnalyticsData] = useState([]);
    const [selectedCost, setSelectedCost] = useState("");
    const [filterCircle, setFilterCircle] = useState("");
    const [viewType, setViewType] = useState("table");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedCircles, setSelectedCircles] = useState([]);
    

    useEffect(() => {
        let mounted = true;

        const fetchData = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await axios.get( "https://commtoolapi.mcpspmis.com/admin-table/" );
                if (mounted) {
                    setAnalyticsData(Array.isArray(response.data) ? response.data : [] );
                }
            } catch (err) {
                console.error( "Admin table API error:", err );
                if (mounted) {
                    setError( "Unable to load admin report." );
                }
            } finally {
                if (mounted) { 
                    setLoading(false); 
                }
            }
        };

        fetchData();
        return () => {
            mounted = false;
        };
    }, []);

    const circleList = useMemo(() => {
        return [
            ...new Set(
                analyticsData
                    .map((item) => item.circle)
                    .filter(Boolean)
            ),
        ].sort();
    }, [analyticsData]);

    // useEffect(() => {
    //     setSelectedCircles(circleList);
    // }, [circleList]);


    const filteredData = useMemo(() => {
        if (!filterCircle) {
            return analyticsData;
        }

        return analyticsData.filter(
            (item) => item.circle === filterCircle
        );
    }, [ analyticsData, filterCircle, ]);

    const preparedData = useMemo(() => {
        return filteredData.map((circleData) => {
            const monthData = {};
            MONTHS.forEach((month) => {
                monthData[month] = calculateMonthData(
                    circleData.months,
                    month
                );
            });

            return {
                ...circleData,
                preparedMonths: monthData,
            };
        });
    }, [filteredData]);



    // new code

const CHART_COLORS = [
    "#2563EB", // Blue
    "#16A34A", // Green
    "#DC2626", // Red
    "#9333EA", // Purple
    "#EA580C", // Orange
    "#0891B2", // Cyan
    "#DB2777", // Pink
    "#65A30D", // Lime
    "#7C3AED", // Violet
    "#0F766E", // Teal
    "#CA8A04", // Yellow
    "#C026D3", // Magenta
    "#0284C7", // Sky Blue
    "#15803D", // Emerald
    "#B91C1C", // Dark Red
    "#6D28D9", // Indigo
    "#C2410C", // Dark Orange
    "#0369A1", // Deep Sky
    "#4D7C0F", // Olive
    "#A21CAF", // Fuchsia
    "#047857", // Green Teal
    "#BE123C", // Rose
    "#4338CA", // Deep Indigo
    "#92400E", // Brown
    "#1D4ED8", // Strong Blue
];


    const gpTrendData = useMemo(() => {

        const data = preparedData.filter((item) => selectedCircles.includes(item.circle) );

        return {
            labels: MONTHS,
            datasets: data.map((circleData, index) => {
                const color = CHART_COLORS[index % CHART_COLORS.length];
                return {
                    label: `${circleData.circle}-${circleData.customer}`,
                    customer: circleData.customer,
                    data: MONTHS.map((month) => {
                        const value = circleData.preparedMonths?.[month]?.percentages?.c7;
                        return value != null ? Math.round(value) : null;
                    }),
                    borderColor: color,
                    backgroundColor: color,
                    borderWidth: 3,
                    pointBackgroundColor: "#fff",
                    pointBorderColor: color,
                    pointBorderWidth: 3,
                    pointRadius: 5,
                    pointHoverRadius: 8,
                    tension: 0.4,
                    fill: false,
                };
            }),
        };

    }, [preparedData, selectedCircles]);
    
    


    const gpTrendOptions = {

        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: "index",
            intersect: false,
        },
        animation: {
            duration: 1000,
            easing: "easeOutQuart",
        },
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    usePointStyle: true,
                    pointStyle: "circle",
                    padding: 18,
                    font: {
                        size: 10,
                        weight: "600",
                    },
                },
            },
            datalabels: {
                display: true,
                font: {
                    size: 11,
                    weight: "bold",
                    color:"#000000"
                },
                anchor: "end",
                align: "top",
                offset: 2,
                clamp: true,
                clip: false,
            },
            tooltip: {
                backgroundColor: "rgba(15, 23, 42, 0.95)",
                titleColor: "#fff",
                bodyColor: "#fff",
                padding: 12,
                cornerRadius: 8,
                displayColors: true,
                callbacks: {
                    label: (context) => {
                        const value = context.raw;
                        const circle = context.dataset.label;
                        const customer = context.dataset.customer;
                        return `${circle} : ${ value != null ? value : "-" }%`;
                    },
                },
            },
        },

        scales: {
            y: {
                beginAtZero: false,
                grid: {
                    display:false,
                },
                ticks: {
                    callback: (value) => `${value}%`,
                    font: {
                        size: 12,
                        weight:"600"
                    },
                },
                title: {
                    display: true,
                    color:"#333",
                    text: "Gross Profit %",
                    font: {
                        weight: "600",
                        size:"14px"
                    },
                },
            },

            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    font: {
                        size: 12,
                        weight: "600",
                    },
                },
                title: {
                    display: true,
                    text: "Month",
                    color:"#333",
                    font: {
                        weight: "600",
                        size:"14px"
                    },
                },
            },
        },
    };


    const exportToExcel = useCallback(async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Admin Report");
        worksheet.views = [
            {
                state: "frozen",
                ySplit: 1,
            },
        ];
        const header = [ "Circle", "Category", "Allowed", ...MONTHS, ];
        const headerRow = worksheet.addRow(header);

        headerRow.eachCell((cell) => {
            cell.font = {
                bold: true,
                color: {
                    argb: "FFFFFFFF",
                },
            };
            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: {
                    argb: "1A5C2A",
                },
            };
            cell.alignment = {
                horizontal: "center",
                vertical: "middle",
            };
            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
            };
        });

        preparedData.forEach((circleData) => {

            const config = CATEGORY_CONFIG[ circleData.category ];

            if (!config) {
                return;
            }

            const costs = selectedCost ? config.costs.filter( (cost) => cost.id === selectedCost ) : config.costs;

            if (!costs.length) {
                return;
            }

            const startRow =
                worksheet.rowCount + 1;


            costs.forEach((cost) => {

                const row = [
                    circleData.circle,
                    cost.label,
                    cost.value,
                ];


                MONTHS.forEach((month) => {

                    const value =
                        circleData.preparedMonths[
                            month
                        ];

                    if (cost.id === "c1") {
                        row.push(
                            value?.c1?.toFixed(0) || ""
                        );
                    } else {
                        const percentage =
                            value?.percentages?.[
                                cost.id
                            ];

                        row.push(
                            percentage != null
                                ? `${percentage.toFixed(2)}%`
                                : ""
                        );
                    }
                });


                const excelRow =
                    worksheet.addRow(row);


                excelRow.eachCell((cell) => {

                    cell.border = {
                        top: { style: "thin" },
                        left: { style: "thin" },
                        bottom: { style: "thin" },
                        right: { style: "thin" },
                    };

                    cell.alignment = {
                        horizontal: "center",
                        vertical: "middle",
                    };
                });

                excelRow.getCell(3).fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: {
                        argb: cost.isTotal
                            ? "F0F0E8"
                            : "CCE8F7",
                    },
                };

                if (cost.id === "c1") {

                    for (
                        let i = 4;
                        i <= excelRow.cellCount;
                        i++
                    ) {
                        excelRow.getCell(i).fill = {
                            type: "pattern",
                            pattern: "solid",
                            fgColor: {
                                argb: "D8AC46",
                            },
                        };
                    }
                }

                else {

                    MONTHS.forEach(
                        (month, index) => {

                            const actual =
                                circleData
                                    .preparedMonths[
                                        month
                                    ]
                                    ?.percentages?.[
                                        cost.id
                                    ];

                            if (
                                actual == null
                            ) {
                                return;
                            }

                            const allowed =
                                parseFloat(
                                    cost.value
                                );

                            if (
                                Number.isNaN(
                                    allowed
                                )
                            ) {
                                return;
                            }

                            const isGreen =
                                cost.id === "c7"
                                    ? actual >= allowed
                                    : actual <= allowed;

                            excelRow
                                .getCell(index + 4)
                                .fill = {
                                    type: "pattern",
                                    pattern: "solid",
                                    fgColor: {
                                        argb:
                                            isGreen
                                                ? "94CA98"
                                                : "F52C2C",
                                    },
                                };
                        }
                    );
                }


                if (cost.isTotal) {
                    excelRow.font = {
                        bold: true,
                    };
                }
            });

            const endRow =
                worksheet.rowCount;

            if (endRow > startRow) {
                worksheet.mergeCells(
                    `A${startRow}:A${endRow}`
                );
            }


            const circleCell =
                worksheet.getCell(
                    `A${startRow}`
                );

            circleCell.alignment = {
                horizontal: "center",
                vertical: "middle",
            };

            circleCell.font = {
                bold: true,
            };

            circleCell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: {
                    argb: "F5CFC0",
                },
            };
        });



        worksheet.columns.forEach((column) => {
            column.width = 18;
        });

        const buffer = await workbook.xlsx.writeBuffer();

        saveAs( new Blob([buffer]), "Admin_Report.xlsx" );

    }, [ preparedData, selectedCost, ]);



    if (loading) {
        return (
            <div
                style={{
                    padding: 30,
                    textAlign: "center",
                }}
            >
                Loading admin report...
            </div>
        );
    }


    if (error) {
        return (
            <div
                style={{
                    padding: 30,
                    textAlign: "center",
                    color: "#b00020",
                }}
            >
                {error}
            </div>
        );
    }


    return (
        <div style={styles.container}>
            <div style={styles.toolbar}>
                <div style={styles.toolbarRight}>

                    {/* VIEW */}
                    <select
                        value={viewType}
                        onChange={(e) => setViewType( e.target.value ) }
                        style={styles.select}
                    >
                        <option value="table">
                            -- Table --
                        </option>

                        <option value="dashboard">
                            -- Dashboard --
                        </option>
                    </select>


                    
                    {viewType === "table" && (
                        <>
                        {/* CIRCLE */}
                            <select
                                value={filterCircle}
                                onChange={(e) =>
                                    setFilterCircle(
                                        e.target.value
                                    )
                                }
                                style={styles.select}
                            >
                                <option value=""> -- All Circles -- </option>

                                {circleList.map(
                                    (circle) => (
                                        <option key={circle} value={circle} > {circle} </option>
                                    )
                                )}
                            </select>


                            <select
                                value={selectedCost}
                                onChange={(e) =>
                                    setSelectedCost(
                                        e.target.value
                                    )
                                }
                                style={styles.select}
                            >
                                {CATEGORY_LIST.map(
                                    (item) => (
                                        <option
                                            key={item.id}
                                            value={item.id}
                                        >
                                            {item.label}
                                        </option>
                                    )
                                )}
                            </select>


                            <button
                                onClick={exportToExcel}
                                style={
                                    styles.exportButton
                                }
                            >
                                Export
                            </button>

                        </>
                        

                    )}
                    

                </div>

            </div>


            {viewType === "table" && (
                <div style={styles.tableWrapper} >
                    <table style={styles.table} >
                        <colgroup>
                            <col
                                style={{
                                    width: 28,
                                }}
                            />

                            <col
                                style={{
                                    width: "10%",
                                }}
                            />

                            <col
                                style={{
                                    width: "8%",
                                }}
                            />
                        </colgroup>

                        <thead>

                            <tr>

                                <th
                                    style={{
                                        ...styles.cell,
                                        background:
                                            CATEGORY_COLORS.A,
                                        color: "#fff",
                                        fontWeight: 600,
                                        textAlign:
                                            "center",
                                    }}
                                    colSpan={2}
                                >
                                    Category
                                </th>

                                <th
                                    style={{
                                        ...styles.cell,
                                        background:
                                            CATEGORY_COLORS.A,
                                        color: "#fff",
                                        fontWeight: 600,
                                        textAlign:
                                            "center",
                                    }}
                                >
                                    Allowed
                                </th>

                                {MONTHS.map(
                                    (month) => (
                                        <th
                                            key={month}
                                            style={{
                                                ...styles.cell,
                                                background:
                                                    CATEGORY_COLORS.A,
                                                color: "#fff",
                                                fontWeight: 600,
                                                textAlign:
                                                    "center",
                                            }}
                                        >
                                            {month}
                                        </th>
                                    )
                                )}

                            </tr>


                            <tr>

                                <th
                                    style={
                                        styles.emptyHeader
                                    }
                                />

                                <th
                                    style={
                                        styles.emptyHeader
                                    }
                                />

                                <th
                                    style={
                                        styles.emptyHeader
                                    }
                                />

                                {MONTHS.map(
                                    (month) => (
                                        <th
                                            key={month}
                                            style={
                                                styles.subHeader
                                            }
                                        >
                                            Actual
                                        </th>
                                    )
                                )}

                            </tr>

                        </thead>

                        <tbody>

                            {preparedData.map(
                                (circleData) => {

                                    const config =
                                        CATEGORY_CONFIG[
                                            circleData
                                                .category
                                        ];

                                    if (!config) {
                                        return null;
                                    }

                                    const costs =
                                        selectedCost
                                            ? config.costs.filter(
                                                (cost) =>
                                                    cost.id ===
                                                    selectedCost
                                            )
                                            : config.costs;

                                    return costs.map(
                                        (
                                            cost,
                                            index
                                        ) => (

                                            <AdminTableRow
                                                key={`${circleData.circle}-${circleData.customer}-${circleData.costCenter}-${cost.id}`}
                                                circleData={
                                                    circleData
                                                }
                                                cost={
                                                    cost
                                                }
                                                monthData={
                                                    circleData.preparedMonths
                                                }
                                                isFirst={
                                                    index ===
                                                    0
                                                }
                                                totalRows={
                                                    costs.length
                                                }
                                            />

                                        )
                                    );
                                }
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {viewType === "dashboard" && (
                <div
                    style={{
                        background: "#fff",
                        border: "1px solid #ddd",
                        borderRadius: 10,
                        padding: 16,
                    }}
                >

                    {/* Circle Filter */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginBottom: 16,
                            flexWrap: "wrap",
                        }}
                    >
                        <strong style={{ fontSize: 13 }}>
                            Circles:
                        </strong>

                        {circleList.map((circle) => {

                            const selected =
                                selectedCircles.includes(circle);

                            return (
                                <button
                                    key={circle}
                                    onClick={() => {
                                        setSelectedCircles((prev) =>
                                            selected
                                                ? prev.filter(
                                                    (item) =>
                                                        item !== circle
                                                )
                                                : [...prev, circle]
                                        );
                                    }}
                                    style={{
                                        padding: "5px 10px",
                                        borderRadius: 15,
                                        border: "1px solid #ccc",
                                        cursor: "pointer",

                                        background: selected
                                            ? "#223354"
                                            : "#f5f5f5",

                                        color: selected
                                            ? "#fff"
                                            : "#555",

                                        fontSize: 12,
                                    }}
                                >
                                    {circle}
                                </button>
                            );
                        })}

                        <button
                            onClick={() =>
                                setSelectedCircles(circleList)
                            }
                            style={{
                                padding: "5px 10px",
                                borderRadius: 15,
                                border: "1px solid #ccc",
                                cursor: "pointer",
                                fontSize: 12,
                            }}
                        >
                            All
                        </button>

                        <button
                            onClick={() =>
                                setSelectedCircles([])
                            }
                            style={{
                                padding: "5px 10px",
                                borderRadius: 15,
                                border: "1px solid #ccc",
                                cursor: "pointer",
                                fontSize: 12,
                            }}
                        >
                            Clear
                        </button>
                    </div>


                    {/* GP Trend */}
                    <div
                        style={{
                            height: 450,
                            background: "linear-gradient(135deg, #ffffff, #f8fafc)",
                            borderRadius: 14,
                            padding: "20px 20px 10px",
                            border: "1px solid #e5e7eb",
                            boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
                        }}
                    >
                        {selectedCircles.length > 0 ? (
                            <Line
                                data={gpTrendData}
                                options={gpTrendOptions}
                            />
                        ) : (
                            <div
                                style={{
                                    height: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#999",
                                }}
                            >
                                Select at least one circle
                            </div>
                        )}
                    </div>

                </div>
            )}

        </div>
    );
};

export default AdminTable;


// const AdminTable = () => {

//     const userID = (getDecreyptedData("userID") || "").toLowerCase().trim();
//     const START_YEAR = 2026;
//     const CURRENT_YEAR = new Date().getFullYear();
//     const YEARS = Array.from({ length: CURRENT_YEAR - START_YEAR + 1 }, (_, i) => String(START_YEAR + i));
//     const MONTHSLIST = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
//     const CURRENT_MONTH = `${MONTHSLIST[new Date().getMonth()]}-${String(CURRENT_YEAR).slice(-2)}`;
//     const CategoryLIST = [
//         { id: "", label: "All" },
//         { id: "c1", label: "Revenue" },
//         { id: "c2", label: "Resource Salary" },
//         { id: "c3", label: "Vendor cost" },
//         { id: "c4", label: "Expense" },
//         { id: "c5", label: "Fixed cost" },
//         { id: "c6", label: "Total Cost" },
//         { id: "c7", label: "Gross Profit" },
//     ];

//     const [MONTHS, setMONTHS] = useState(["Jan-26", "Feb-26", "Mar-26", "Apr-26", "May-26", "Jun-26", "Jul-26"]);

//     const [analyticsData, setAnalyticsData] = useState([]);
//     const [selectedCost, setSelectedCost] = useState("");
//     const [filterCircle, setFilterCircle] = useState("");
//     const [viewType, setViewType] = useState("table");

//     const CircleLIST = [...new Set(analyticsData.map(item => item.circle))];

//     const filteredData = analyticsData.filter(item => {

//         if (filterCircle && item.circle !== filterCircle)
//             return false;
//         return true;
//     });

//     useEffect(() => {
//         axios.get(`https://commtoolapi.mcpspmis.com/admin-table/`)
//             .then(res => {
//                 setAnalyticsData(res.data);
//             });
//     }, []);



//     const exportToExcel = async () => {
//         const workbook = new ExcelJS.Workbook();
//         const worksheet = workbook.addWorksheet("Admin Report");

//         worksheet.views = [{ state: "frozen", ySplit: 1 }];

//         // Header
//         const header = ["Circle", "Category", "Allowed", ...MONTHS];
//         const headerRow = worksheet.addRow(header);

//         headerRow.eachCell(cell => {
//             cell.font = {
//                 bold: true,
//                 color: { argb: "FFFFFFFF" }
//             };

//             cell.fill = {
//                 type: "pattern",
//                 pattern: "solid",
//                 fgColor: { argb: "1A5C2A" }
//             };

//             cell.alignment = {
//                 horizontal: "center",
//                 vertical: "middle"
//             };

//             cell.border = {
//                 top: { style: "thin" },
//                 left: { style: "thin" },
//                 bottom: { style: "thin" },
//                 right: { style: "thin" }
//             };
//         });

//         filteredData.forEach(circleData => {

//             const config = CATEGORY_CONFIG[circleData.category];
//             if (!config) return;

//             const monthData = circleData.months;

//             const costs = selectedCost
//                 ? config.costs.filter(c => c.id === selectedCost)
//                 : config.costs;

//             const startRow = worksheet.rowCount + 1;

//             costs.forEach(cost => {

//                 const row = [
//                     circleData.circle,
//                     cost.label,
//                     cost.value
//                 ];

//                 MONTHS.forEach(month => {

//                     row.push(
//                         cost.id === "c1"
//                             ? getCostVal(monthData, month, cost.id)
//                             : getCostPercent(monthData, month, cost.id)
//                     );

//                 });

//                 const excelRow = worksheet.addRow(row);

//                 excelRow.eachCell(cell => {

//                     cell.border = {
//                         top: { style: "thin" },
//                         left: { style: "thin" },
//                         bottom: { style: "thin" },
//                         right: { style: "thin" }
//                     };

//                     cell.alignment = {
//                         horizontal: "center",
//                         vertical: "middle"
//                     };

//                 });

//                 // Allowed column color
//                 excelRow.getCell(3).fill = {
//                     type: "pattern",
//                     pattern: "solid",
//                     fgColor: { argb: cost.isTotal ? "F0F0E8" : "CCE8F7" }
//                 };

//                 // Revenue row
//                 if (cost.id === "c1") {

//                     for (let i = 4; i <= excelRow.cellCount; i++) {

//                         excelRow.getCell(i).fill = {
//                             type: "pattern",
//                             pattern: "solid",
//                             fgColor: { argb: "D8AC46" }
//                         };

//                     }

//                 }

//                 // Percentage rows
//                 else {

//                     MONTHS.forEach((month, index) => {

//                         const percent = getCostPercent(monthData, month, cost.id);

//                         if (!percent) return;

//                         const actual = parseFloat(percent);
//                         const allowed = parseFloat(cost.value);

//                         const isGreen =
//                             cost.id === "c7"
//                                 ? actual >= allowed
//                                 : actual <= allowed;

//                         excelRow.getCell(index + 4).fill = {
//                             type: "pattern",
//                             pattern: "solid",
//                             fgColor: {
//                                 argb: isGreen ? "94CA98" : "F52C2C"
//                             }
//                         };

//                     });

//                 }

//                 if (cost.isTotal) {
//                     excelRow.font = { bold: true };
//                 }

//             });

//             // Merge Circle column
//             const endRow = worksheet.rowCount;

//             if (endRow > startRow) {
//                 worksheet.mergeCells(`A${startRow}:A${endRow}`);
//             }

//             const circleCell = worksheet.getCell(`A${startRow}`);

//             circleCell.alignment = {
//                 horizontal: "center",
//                 vertical: "middle"
//             };

//             circleCell.font = {
//                 bold: true
//             };

//             circleCell.fill = {
//                 type: "pattern",
//                 pattern: "solid",
//                 fgColor: { argb: "F5CFC0" }
//             };

//         });

//         worksheet.columns.forEach(col => {
//             col.width = 18;
//         });

//         const buffer = await workbook.xlsx.writeBuffer();

//         saveAs(
//             new Blob([buffer]),
//             "Admin_Report.xlsx"
//         );
//     };







//     // ── Styles ───────────────────────────────────────────────────
//     const CAT_COLOR = { A: "#1a5c2a", B: "#006E74", C: "#a85c00", D: "#8b1a1a" }["A"];
//     const bdr = "0.5px solid #000";
//     const cs = { border: bdr, padding: "4px 8px", fontSize: 12, background: "#fff", color: "#222", whiteSpace: "nowrap" };
//     const hc = { border: bdr, padding: "6px 8px", fontSize: 11, fontWeight: 600, textAlign: "center", background: CAT_COLOR, color: "#fff", whiteSpace: "nowrap" };
//     const sh = { border: bdr, padding: "4px 4px", fontSize: 10, fontWeight: 500, textAlign: "center", background: "#e6a817", color: "#4a2800", whiteSpace: "nowrap" };
//     const shSub = { border: bdr, padding: "3px 4px", fontSize: 10, textAlign: "center", background: "#f0ede0", color: "#555", whiteSpace: "nowrap" };
//     const emptyHeader = { border: "none", background: "#f0ede0", padding: 0 };

//     const DisplayCell = ({ value, align = "center", onClick = null }) => (
//         <span
//             onClick={onClick}
//             style={{
//                 display: "block",
//                 fontSize: onClick ? 14 : 12,
//                 textAlign: align,
//                 padding: "3px 5px",
//                 color: "#fff",
//                 cursor: onClick ? "pointer" : "default",
//                 fontWeight: onClick ? "600" : "400",
//             }}
//         >
//             {value !== "" && value != null ? value : <span style={{ color: "#ccc" }}></span>}
//         </span>
//     );



//     const sectionTd = (text, rowSpan, bg, color) => (
//         <td rowSpan={rowSpan} style={{ border: bdr, background: bg, fontWeight: 500, fontSize: 11, textAlign: "center", verticalAlign: "middle", padding: "8px 3px", width: 28, color }}>
//             {text}
//         </td>
//     );

//     const hasData = (month, monthData) => monthData?.[month] != null;

//     const getCostVal = (monthData, month, costId) => {
//         if (!hasData(month, monthData)) return null;
//         if (['c6', 'c7'].includes(costId)) {
//             const costs = monthData[month]?.costs || {};
//             if (costId === 'c6') return ((costs["c2"] || 0) + (costs["c3"] || 0) + (costs["c4"] || 0) + (costs["c5"] || 0)).toFixed(0);
//             if (costId === 'c7') return ((costs["c1"] || 0) - ((costs["c2"] || 0) + (costs["c3"] || 0) + (costs["c4"] || 0) + (costs["c5"] || 0))).toFixed(0);
//         }
//         return (monthData[month]?.costs?.[costId] ?? 0).toFixed(0);
//     };

//     const getCostPercent = (monthData, month, id) => {
//         if (id === "c1") return "";
//         const revenue = Number(getCostVal(monthData, month, "c1") || 0);
//         const value = Number(getCostVal(monthData, month, id) || 0);
//         if (!revenue) return "";
//         return ((value / revenue) * 100).toFixed(2) + "%";
//     };

//     const getCostCellStyle = (monthData, month, cost) => {
//         const percent = getCostPercent(monthData, month, cost.id);
//         if (!percent) return {};

//         const actual = parseFloat(percent);
//         const allowed = parseFloat(cost.value);

//         if (isNaN(actual) || isNaN(allowed)) return {};
//         if (cost.id === "c7") {
//             return actual < allowed
//                 ? { background: "#f52c2cbd" }
//                 : { background: "#94CA98" };
//         }
//         return actual > allowed
//             ? { background: "#f52c2cbd" }
//             : { background: "#94CA98" };
//     }



//     return (

//         <div style={{ fontFamily: "sans-serif", padding: "1.5rem 0 2rem" }}>
//             <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, padding: "8px 12px", background: "#f5f5f0", border: "0.5px solid #ddd", borderRadius: 8 }}>
//                 <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
//                     <select
//                         value={viewType}
//                         onChange={(e) => setViewType(e.target.value)}
//                         style={{
//                             padding: "6px 8px",
//                             fontSize: 13,
//                             borderRadius: 6,
//                             border: "1px solid #ccc",
//                             outline: "none",
//                         }}
//                     >
//                         <option value="table">-- Table --</option>
//                         <option value="dashboard">-- Dashboard --</option>
//                     </select>

//                     <select
//                         value={filterCircle}
//                         onChange={(e) => setFilterCircle(e.target.value)}
//                         style={{
//                             padding: "6px 8px",
//                             fontSize: 13,
//                             borderRadius: 6,
//                             border: "1px solid #ccc",
//                             outline: "none",
//                         }}
//                     >
//                         <option value="">-- All Circles --</option>
//                         {CircleLIST.map(circle => (
//                             <option key={circle} value={circle}>
//                                 {circle}
//                             </option>
//                         ))}
//                     </select>

//                     <select
//                         value={selectedCost}
//                         onChange={e => setSelectedCost(e.target.value)}
//                         style={{
//                             padding: "6px 8px",
//                             fontSize: 13,
//                             borderRadius: 6,
//                             border: "1px solid #ccc",
//                         }}
//                     >
//                         {CategoryLIST.map(item => (
//                             <option key={item.id} value={item.id}>{item.label}</option>
//                         ))}
//                     </select>

//                     <button
//                         onClick={exportToExcel}
//                         style={{
//                             padding: "6px 8px",
//                             fontSize: 13,
//                             borderRadius: 6,
//                             border: "1px solid #ccc",
//                             background: "#223354",
//                             color: "#fff",
//                         }}
//                     >
//                         Export
//                     </button>


//                 </div>
//             </div>
//                 <div style={{ border: bdr, borderRadius: 8, overflow: "hidden", width: "100%" }}>
//                     <table style={{ borderCollapse: "collapse", width: "100%" }}>

//                         <colgroup>
//                             <col style={{ width: 28 }} />
//                             <col style={{ width: "10%" }} />
//                             <col style={{ width: "8%" }} />
//                         </colgroup>

//                         <thead>
//                             <tr>
//                                 <th style={hc} colSpan={2}>Category</th>
//                                 <th style={hc}>Allowed</th>

//                                 {MONTHS.map(m => (
//                                     <th key={m} style={{ ...hc, background: CAT_COLOR }}>
//                                         {m}
//                                     </th>
//                                 ))}
//                             </tr>

//                             <tr>
//                                 <th style={emptyHeader}></th>
//                                 <th style={emptyHeader}></th>
//                                 <th style={emptyHeader}></th>

//                                 {MONTHS.map(m => (
//                                     <th key={m} style={shSub}>
//                                         Actual
//                                     </th>
//                                 ))}
//                             </tr>
//                         </thead>

//                         {filteredData.map(circleData => {


//                             const config = CATEGORY_CONFIG[circleData.category];
//                             if (!config) return null;
//                             const monthData = circleData.months;
//                             const costs = selectedCost ? config.costs.filter(c => c.id === selectedCost) : config.costs;

//                             return (
//                                 <tbody key={`${circleData.circle}-${circleData.customer}-${circleData.costCenter}`}>

//                                     {costs.map(cost => (
//                                         <tr key={cost.id}>
//                                             {cost === costs[0] &&
//                                                 sectionTd(
//                                                     // `${circleData.circle}-${circleData.customer.toUpperCase()}`,
//                                                     `${circleData.circle}`,
//                                                     costs.length,
//                                                     "#f5cfc0",
//                                                     "#5a1e00"
//                                                 )
//                                             }

//                                             <td
//                                                 style={{
//                                                     ...cs,
//                                                     fontWeight: cost.isTotal ? 600 : 400
//                                                 }}
//                                             >
//                                                 {cost.label}
//                                             </td>

//                                             <td
//                                                 style={{
//                                                     ...cs,
//                                                     textAlign: "center",
//                                                     background: cost.isTotal ? "#f0f0e8" : "#cce8f7",
//                                                     fontWeight: cost.isTotal ? 600 : 400
//                                                 }}
//                                             >
//                                                 {cost.value}
//                                             </td>

//                                             {MONTHS.map(month => (
//                                                 <td
//                                                     key={month}
//                                                     style={{
//                                                         ...cs,
//                                                         textAlign: "center",
//                                                         ...(cost.id === "c1"
//                                                             ? { background: "#d8ac46" }
//                                                             : getCostCellStyle(monthData, month, cost))
//                                                     }}
//                                                 >
//                                                     <DisplayCell
//                                                         value={
//                                                             cost.id === "c1"
//                                                                 ? getCostVal(monthData, month, cost.id)
//                                                                 : getCostPercent(monthData, month, cost.id)
//                                                         }
//                                                     />
//                                                 </td>
//                                             ))}
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             );

//                         })}

//                     </table>
//                 </div>

//         </div>
//     );
// }

// export default AdminTable