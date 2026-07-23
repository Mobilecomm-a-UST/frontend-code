import React, { useState, useEffect } from 'react';
import { getDecreyptedData } from '../../../utils/localstorage';
import axios from 'axios';
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";



const ResourceTable = () => {

    const START_YEAR = 2026;
    const CURRENT_YEAR = new Date().getFullYear();
    const YEARS = Array.from({ length: CURRENT_YEAR - START_YEAR + 1 },(_, i) => String(START_YEAR + i));
    const MONTHSLIST = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const CURRENT_MONTH =`${MONTHSLIST[new Date().getMonth()]}-${String(CURRENT_YEAR).slice(-2)}`;

    const [MONTHS,setMONTHS] = useState(["Jan-26","Feb-26","Mar-26","Apr-26","May-26","Jun-26","Jul-26"]);

    const [analyticsData, setAnalyticsData] = useState([]);
    const [selectedCost, setSelectedCost] = useState("");
    const [filterCircle, setFilterCircle] = useState("");
    const [openMemberModal, setOpenMemberModal] = useState(false);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [selectedRole, setSelectedRole] = useState("");


    const Table_Header = [
        { label: "Customer", key: "customer" },
        { label: "Circle", key: "circle" },
        { label: "CDH", parent: "resources", key: "r1" },
        { label: "PM", parent: "resources", key: "r2" },
        { label: "Coordinator", parent: "resources", key: "r3" },
        { label: "NPO Lead", parent: "resources", key: "r4" },
        { label: "Jr NPO", parent: "resources", key: "r5" },
        { label: "SCFT Coordinator", parent: "resources", key: "r6" },
        { label: "Ware House Manager", parent: "resources", key: "r7" },
        { label: "Warehouse Coordinator", parent: "resources", key: "r8" },
        { label: "SCM Lead", parent: "resources", key: "r9" },
        { label: "OHS Safety", parent: "resources", key: "r10" },
        { label: "EMF Coordinator", parent: "resources", key: "r11" },
        { label: "RF Survey Coordinator", parent: "resources", key: "r12" },
        { label: "PMIS Lead", parent: "resources", key: "r13" },
        { label: "MS2 Lead", parent: "resources", key: "r14" },
        { label: "Field engineer", parent: "other_resources", key: "or1" },
        { label: "Technician", parent: "other_resources", key: "or2" },
    ];

    const CAT_COLOR = { A:"#1a5c2a", B:"#006E74", C:"#a85c00", D:"#8b1a1a" }["B"];




    const handleMemberClick = (customer,circle,col) => {
        let members = [];
        const data = analyticsData.find(item => item.circle === circle && item.customer === customer);
        if (col.parent === "resources"){
        members = data?.resources?.[col.key]?.members || [];
        }
        else {
        members = data?.other_resources?.[col.key]?.members || [];
        }
        
        setSelectedRole(`${customer}-${circle}-${col.label}`);
        setSelectedMembers(members);
        setOpenMemberModal(true);
    };

    const thStyle = {
        padding: "10px 12px",
        background: CAT_COLOR,
        color: "#fff",
        border: "1px solid #ddd",
        textAlign: "left",
        fontSize: 13,
        fontWeight: 600,
    };

    const tdStyle = {
        padding: "10px 12px",
        border: "1px solid #e5e5e5",
        fontSize: 13,
        color: "#333",
    };

    const CircleLIST = [];



    useEffect(() => {
        axios.get(`https://commtoolapi.mcpspmis.com/resource-table/?month=Jul-26`)
            .then(res => {
                setAnalyticsData(res.data);
            });
    }, []);



    const exportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Analytics Report");

        const headers = Table_Header.map((col) => col.label);
        worksheet.addRow(headers);

        const headerRow = worksheet.getRow(1);
        headerRow.height = 24;

        headerRow.eachCell((cell) => {
            cell.font = {
            bold: true,
            color: { argb: "FFFFFFFF" },
            size: 11,
            };

            cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: CAT_COLOR.replace("#", "") },
            };

            cell.alignment = {
            vertical: "middle",
            horizontal: "center",
            wrapText: true,
            };

            cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
            };
        });


        analyticsData.forEach((row) => {
            const excelRow = Table_Header.map((col) => {
            if (col.key === "circle") return row.circle;
            if (col.key === "customer") return row.customer;

            return row[col.parent]?.[col.key]?.count ?? 0;
            });

            worksheet.addRow(excelRow);
        });


        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return;

            row.eachCell((cell) => {
            cell.alignment = {
                vertical: "middle",
                horizontal: "center",
            };

            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
            };
            });
        });


        worksheet.columns.forEach((column) => {
            let maxLength = 15;

            column.eachCell?.({ includeEmpty: true }, (cell) => {
            const len = cell.value ? cell.value.toString().length : 0;
            if (len > maxLength) maxLength = len;
            });

            column.width = maxLength + 3;
        });

        worksheet.views = [
            {
            state: "frozen",
            ySplit: 1,
            },
        ];


        const buffer = await workbook.xlsx.writeBuffer();

        saveAs(new Blob([buffer], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}),`Analytics_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
    };







    const bdr   = "1px solid #000";
    const hc    = { border:bdr, padding:"6px 8px", fontSize:11, fontWeight:600, textAlign:"center", background:CAT_COLOR, color:"#fff",  };


    const DisplayCell = ({value,align = "center",onClick = null}) => (
    <span
        onClick={onClick}
        style={{
        display: "block",
        fontSize: onClick ? 14 : 12,
        textAlign: align,
        padding: "3px 5px",
        color: "#f17a0a",
        cursor: onClick ? "pointer" : "default",
        fontWeight: onClick ? "600" : "400",
        }}
    >
        {value !== "" && value != null ? value : <span style={{ color: "#ccc" }}></span>}
    </span>
    );




    return (
    <>
        <div style={{ fontFamily:"sans-serif", padding:"1.5rem 0 2rem" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12, padding:"8px 12px", background:"#f5f5f0", border:"0.5px solid #ddd", borderRadius:8 }}>
            <div style={{marginLeft:"auto",display: "flex", gap: 8 }}>
            {/* <select
                value={filterCircle}
                onChange={(e) => setFilterCircle(e.target.value)}
                style={{
                    padding: "6px 8px",
                    fontSize: 13,
                    borderRadius: 6,
                    border: "1px solid #ccc",
                    outline: "none",
                }}
            >
                <option value="">-- All Circles --</option>
                {CircleLIST.map(circle => (
                    <option key={circle} value={circle}>
                        {circle}
                    </option>
                ))}
            </select>

            <select
                value={selectedCost}
                onChange={e => setSelectedCost(e.target.value)}
                style={{
                    padding: "6px 8px",
                    fontSize: 13,
                    borderRadius: 6,
                    border: "1px solid #ccc",
                }}
            >
                <option key={""} value={""}>--Select--</option>
            </select> */}

            <button
                onClick={exportToExcel}
                style={{
                    padding: "6px 8px",
                    fontSize: 13,
                    borderRadius: 6,
                    border: "1px solid #ccc",
                    background:"#223354",
                    color: "#fff",
                }}
            >
                Export
            </button>


            </div>
        </div>

        {/* Table */}
        <div style={{ border: bdr, borderRadius: 8, width: "100%",overflowX: "auto"}}>
            <table style={{ borderCollapse:"collapse",borderSpacing: 0,tableLayout: "auto",width: "100%" }}>

            <thead>
                <tr>
                {Table_Header.map(m => (
                    <th key={m.label} style={{ ...hc, background: CAT_COLOR }}>
                    {m.label}
                    </th>
                ))}
                </tr>
            </thead>

            <tbody>
                {analyticsData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                    {Table_Header.map((col) => {
                        let value = "";
                        if (col.key === "circle") {
                            value = row.circle;
                        }
                        else if (col.key === "customer"){
                            value = row.customer;
                        }
                        else {
                            value = row[col.parent]?.[col.key]?.count ?? "0";
                        }

                        return (
                            <td
                                key={col.label}
                                style={{
                                    border: bdr,
                                    padding: "8px",
                                    textAlign: "center",
                                    color:"#2f3070"
                                }}
                            >
                                {col.key === "circle" || col.key === "customer" ? (
                                    value
                                ) : (
                                    <DisplayCell
                                        value={value}
                                        onClick={() =>
                                            handleMemberClick(row.customer, row.circle, col)
                                        }
                                    />
                                )}
                            </td>
                        );
                    })}
                    </tr>
                ))}
            </tbody>
            </table>
        </div>
        </div>

        {openMemberModal && (
        <div
            onClick={() => setOpenMemberModal(false)}
            style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.45)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            }}
        >
            <div
            onClick={(e) => e.stopPropagation()}
            style={{
                width: "900px",
                maxWidth: "95%",
                maxHeight: "80vh",
                background: "#fff",
                borderRadius: 12,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                boxShadow: "0 8px 30px rgba(0,0,0,.25)",
            }}
            >
            {/* Header */}
            <div
                style={{
                background: CAT_COLOR,
                color: "#fff",
                padding: "14px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexShrink: 0,
                }}
            >
                <div>
                <div style={{ fontSize: 18, fontWeight: 600 }}>
                    {selectedRole}
                </div>

                <div style={{ fontSize: 12, opacity: 0.8 }}>
                    Total Members : {selectedMembers.length}
                </div>
                </div>

                <button
                onClick={() => setOpenMemberModal(false)}
                style={{
                    border: "none",
                    background: "transparent",
                    color: "#fff",
                    fontSize: 26,
                    cursor: "pointer",
                }}
                >
                ×
                </button>
            </div>

            {/* Body */}
            <div
                style={{
                flex: 1,
                overflowY: "auto",
                padding: 20,
                }}
            >
                <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                }}
                >
                <thead
                    style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 2,
                    background: CAT_COLOR,
                    }}
                >
                    <tr>
                    <th style={thStyle}>#</th>
                    <th style={thStyle}>Name</th>
                    <th style={thStyle}>UST ID</th>
                    <th style={thStyle}>Projects</th>
                    </tr>
                </thead>

                <tbody>
                    {selectedMembers.length === 0 ? (
                    <tr>
                        <td
                        colSpan={4}
                        style={{
                            padding: 30,
                            textAlign: "center",
                            color: "#888",
                        }}
                        >
                        No Members Found
                        </td>
                    </tr>
                    ) : (
                    selectedMembers.map((m, i) => (
                        <tr
                        key={i}
                        style={{
                            background: i % 2 === 0 ? "#fafafa" : "#fff",
                        }}
                        >
                        <td style={tdStyle}>{i + 1}</td>
                        <td style={tdStyle}>{m.name}</td>
                        <td style={tdStyle}>{m.ustId}</td>
                        <td style={tdStyle}>{m.projects.join(", ")}</td>
                        </tr>
                    ))
                    )}
                </tbody>
                </table>
            </div>

            {/* Footer */}
            <div
                style={{
                padding: "14px 20px",
                borderTop: "1px solid #eee",
                display: "flex",
                justifyContent: "flex-end",
                background: "#fafafa",
                flexShrink: 0,
                }}
            >
                <button
                onClick={() => setOpenMemberModal(false)}
                style={{
                    padding: "8px 22px",
                    border: "none",
                    borderRadius: 6,
                    background: CAT_COLOR,
                    color: "#fff",
                    cursor: "pointer",
                    fontWeight: 500,
                }}
                >
                Close
                </button>
            </div>
            </div>
        </div>
        )}


    </>
    ); 
}

export default ResourceTable