import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getDecreyptedData } from '../../../utils/localstorage';
import AddMonthDataModal from "./AddMonthDataModal";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";



const USER_CONFIG = {
  'Vishal.Yadav@ust.com':{
    "circle":"BHJH",
    "category":"B",
    "customer":"Airtel",
    "costCenter":"MCT0353"
  },
  'Anurag.Singh@ust.com':{
    "circle":"UPE",
    "category":"A",
    "customer":"Airtel",
    "costCenter":"MCT0385"
  },
  'LingisettyVenkata.Kumar@ust.com':{                                   
    "circle":"APTL",
    "category":"A",
    "customer":"Airtel",
    "costCenter":"MCT0380"
  },
  'Anil.Sharma@ust.com':{                                   
    "circle":"HPHP",
    "category":"A",
    "customer":"Airtel",
    "costCenter":"MCT0384"
  },
  'Prateek.Saxena@ust.com':{                                   
    "circle":"DEL",
    "category":"B",
    "customer":"Airtel",
    "costCenter":"MCT0356"
  },
  'A.Hariharasudhan@ust.com':{                                   
    "circle":"TNCH",
    "category":"B",
    "customer":"Airtel",
    "costCenter":"MCT0381"
  },
  'Sushovan.Pal@ust.com':{                                   
    "circle":"KROB",
    "category":"B",
    "customer":"Airtel",
    "costCenter":"MCT0292"
  },
  'Gaurav.Ranjan@ust.com':{                                   
    "circle":"KTK",
    "category":"B",
    "customer":"Airtel",
    "costCenter":"MCT0376"
  },
  'Kundan.KumarSingh@ust.com':{                                   
    "circle":"BHJH",
    "category":"B",
    "customer":"Airtel",
    "costCenter":"MCT0353"
  },
  'Sanjay.Pandey2@ust.com':{                                   
    "circle":"UPW",
    "category":"B",
    "customer":"Airtel",
    "costCenter":"MCT0370"
  },
  'Rajkumar.Prajapati@ust.com':{                                   
    "circle":"MUM",
    "category":"C",
    "customer":"Airtel",
    "costCenter":"MCT0383"
  },
  'Giriraj.Soni@ust.com':{                                   
    "circle":"MPCG",
    "category":"C",
    "customer":"Airtel",
    "costCenter":"MCT0392"
  },
  'Sanjeev.Das@ust.com':{                                   
    "circle":"ORI",
    "category":"C",
    "customer":"Airtel",
    "costCenter":"MCT0354"
  },
  'Rakesh.Sarma@ust.com':{                                   
    "circle":"NESA",
    "category":"C",
    "customer":"Airtel",
    "costCenter":"MCT0408"
  },
  'Lalit.Kaul@ust.com':{                                   
    "circle":"J&K",
    "category":"C",
    "customer":"Airtel",
    "costCenter":"MCT0388"
  },
  'Manoj.Vishwakarma@ust.com':{                                   
    "circle":"RAJ",
    "category":"C",
    "customer":"Airtel",
    "costCenter":"MCT0361"
  },
  'Vikas.Ray@ust.com':{                                   
    "circle":"MH",
    "category":"C",
    "customer":"Airtel",
    "costCenter":"MCT0391"
  },
  'Varun.Sharma@ust.com':{                                   
    "circle":"UPE",
    "category":"B",
    "customer":"VI",
    "costCenter":"MCT0394"
  },
  'SanjayKumar.Singh@ust.com':{                                   
    "circle":"BH",
    "category":"C",
    "customer":"VI",
    "costCenter":"MCT0395"
  },
  'Saji.KanhirangadanGangadharan@ust.com':{                                   
    "circle":"KTK",
    "category":"C",
    "customer":"VI",
    "costCenter":"MCT0396"
  },
  'Rahul.Kumar6@ust.com':{                                   
    "circle":"DL",
    "category":"C",
    "customer":"VI",
    "costCenter":"MCT0409"
  },
  'Md.Rijwi@ust.com':{                                   
    "circle":"MUM",
    "category":"C",
    "customer":"VI",
    "costCenter":"MCT0414"
  },
}





const CATEGORY_CONFIG = {
    A: {
        label: "A", revenue: ">1 CR",
        costs: [
        { id:"c1", label:"Revenue", value:">1 Cr" },
        { id:"c2", label:"Resource Salary", value:"24%" },
        { id:"c3", label:"Vendor cost",     value:"30%" },
        { id:"c4", label:"Expense",          value:"3.00%" },
        { id:"c5", label:"Fixed cost",       value:"4.90%" },
        { id:"c6", label:"Total Cost", value:"61.90%"},
        { id:"c7", label:"Gross Profit", value:"38.10%", isTotal:true },
        ],
        resources: [
        {id:"r1",role:"CDH",qty:1,exp:"13 to 20"},
        {id:"r2",role:"PM",qty:5,exp:"8 to 12"},
        {id:"r3",role:"Coordinator",qty:5,exp:"6 to 9"},
        {id:"r4",role:"NPO Lead",qty:1,exp:"10 to 18"},
        {id:"r5",role:"Jr NPO",qty:1,exp:"6 to 12"},
        {id:"r6",role:"SCFT Coordinator",qty:2,exp:"4 to 6"},
        {id:"r7",role:"Ware House Manager",qty:1,exp:"10 to 20"},
        {id:"r8",role:"Warehouse Coordinator",qty:3,exp:"3 to 8"},
        {id:"r9",role:"SCM Lead",qty:1,exp:"6 to 10"},
        {id:"r10",role:"OHS Safety",qty:1,exp:"5 to 8"},
        {id:"r11",role:"EMF Coordinator",qty:1,exp:"3 to 7"},
        {id:"r12",role:"RF Survey Coordinator",qty:1,exp:"3 to 7"},
        {id:"r13",role:"PMIS Lead",qty:1,exp:"2 to 5"},
        {id:"r14",role:"MS2 Lead",qty:1,exp:"4 to 8"},
        {id:"r15",role:"Total back end Resources",qty:25,exp:""},
        ],
        otherResources: [
        {id:"or1",role:"Field engineer",qty:"",exp:""},
        {id:"or2",role:"Technician",qty:"",exp:""},
        ],
    },
    B: {
        label: "B", revenue: "50L to 1CR",
        costs: [
        { id:"c1", label:"Revenue", value:"50L to 1CR" },
        { id:"c2", label:"Resource Salary", value:"25%" },
        { id:"c3", label:"Vendor cost",     value:"32%" },
        { id:"c4", label:"Expense",          value:"3.30%" },
        { id:"c5", label:"Fixed cost",       value:"4.90%" },
        { id:"c6", label:"Total Cost", value:"65.20%"},
        { id:"c7", label:"Gross Profit", value:"34.80%", isTotal:true },
        ],
        resources: [
        {id:"r1",role:"CDH",qty:1,exp:"13 to 20"},
        {id:"r2",role:"PM",qty:4,exp:"8 to 12"},
        {id:"r3",role:"Coordinator",qty:4,exp:"6 to 9"},
        {id:"r4",role:"NPO Lead",qty:1,exp:"10 to 18"},
        {id:"r5",role:"Jr NPO",qty:1,exp:"6 to 12"},
        {id:"r6",role:"SCFT Coordinator",qty:2,exp:"4 to 6"},
        {id:"r7",role:"Ware House Manager",qty:1,exp:"10 to 20"},
        {id:"r8",role:"Warehouse Coordinator",qty:2,exp:"3 to 8"},
        {id:"r9",role:"SCM Lead",qty:1,exp:"6 to 10"},
        {id:"r10",role:"OHS Safety",qty:1,exp:"5 to 8"},
        {id:"r11",role:"EMF Coordinator",qty:1,exp:"3 to 7"},
        {id:"r12",role:"RF Survey Coordinator",qty:1,exp:"3 to 7"},
        {id:"r13",role:"PMIS Lead",qty:1,exp:"2 to 5"},
        {id:"r14",role:"MS2 Lead",qty:1,exp:"4 to 8"},
        {id:"r15",role:"Total back end Resources",qty:22,exp:""},
        ],
        otherResources: [
        {id:"or1",role:"Field engineer",qty:"",exp:""},
        {id:"or2",role:"Technician",qty:"",exp:""},
        ],
    },
    C: {
        label: "C", revenue: "<50L",
        costs: [
        { id:"c1", label:"Revenue", value:"<50L" },
        { id:"c2", label:"Resource Salary", value:"28%" },
        { id:"c3", label:"Vendor cost",     value:"33%" },
        { id:"c4", label:"Expense",          value:"3.50%" },
        { id:"c5", label:"Fixed cost",       value:"5.20%" },
        { id:"c6", label:"Total Cost", value:"69.70%"},
        { id:"c7", label:"Gross Profit", value:"30.30", isTotal:true },
        ],
        resources: [
        {id:"r1",role:"CDH",qty:1,exp:"10 to 15"},
        {id:"r2",role:"PM",qty:3,exp:"6 to 10"},
        {id:"r3",role:"Coordinator",qty:3,exp:"4 to 6"},
        {id:"r4",role:"NPO Lead",qty:1,exp:"8 to 14"},
        {id:"r5",role:"Jr NPO",qty:0,exp:""},
        {id:"r6",role:"SCFT Coordinator",qty:1,exp:"4 to 6"},
        {id:"r7",role:"Ware House Manager",qty:1,exp:"7 to 14"},
        {id:"r8",role:"Warehouse Coordinator",qty:2,exp:"3 to 8"},
        {id:"r9",role:"SCM Lead",qty:0,exp:""},
        {id:"r10",role:"OHS Safety",qty:0,exp:""},
        {id:"r11",role:"EMF Coordinator",qty:1,exp:"3 to 7"},
        {id:"r12",role:"RF Survey Coordinator",qty:1,exp:"3 to 7"},
        {id:"r13",role:"PMIS Lead",qty:1,exp:"2 to 5"},
        {id:"r14",role:"MS2 Lead",qty:1,exp:"4 to 8"},
        {id:"r15",role:"Total back end Resources",qty:16,exp:""},
        ],
        otherResources: [
        {id:"or1",role:"Field engineer",qty:"",exp:""},
        {id:"or2",role:"Technician",qty:"",exp:""},
        ],
    },
    D: {
        label: "D", revenue: "<10L",
        costs: [
          { id:"c1", label:"Revenue", value:"<10L" },
          { id:"c2", label:"Resource Salary", value:"38%" },
          { id:"c3", label:"Vendor cost",     value:"33%" },
          { id:"c4", label:"Expense",          value:"4.00%" },
          { id:"c5", label:"Fixed cost",       value:"6.20%" },
          { id:"c6", label:"Gross Profit", value:"81.20%"},
          { id:"c7", label:"Gross Profit", value:"18.8%",isTotal:true},
        ],
        resources: [
        {id:"r1",role:"CDH",qty:1,exp:"10 to 15"},
        {id:"r2",role:"PM",qty:1,exp:"8 to 10"},
        {id:"r3",role:"Coordinator",qty:1,exp:"4 to 6"},
        {id:"r4",role:"NPO Lead",qty:0,exp:"10 to 18"},
        {id:"r5",role:"Jr NPO",qty:0,exp:"6 to 12"},
        {id:"r6",role:"SCFT Coordinator",qty:0,exp:"4 to 6"},
        {id:"r7",role:"Ware House Manager",qty:1,exp:"10 to 20"},
        {id:"r8",role:"Warehouse Coordinator",qty:0,exp:"3 to 8"},
        {id:"r9",role:"SCM Lead",qty:0,exp:""},
        {id:"r10",role:"OHS Safety",qty:0,exp:""},
        {id:"r11",role:"EMF Coordinator",qty:0,exp:"3 to 7"},
        {id:"r12",role:"RF Survey Coordinator",qty:0,exp:"3 to 7"},
        {id:"r13",role:"PMIS Lead",qty:0,exp:"2 to 5"},
        {id:"r14",role:"MS2 Lead",qty:0,exp:"4 to 8"},
        {id:"r15",role:"Total back end Resources",qty:4,exp:""},
        ],
        otherResources: [
        {id:"or1",role:"Field engineer",qty:"",exp:""},
        {id:"or2",role:"Technician",qty:"",exp:""},
        ],
    },
};


const MonthWise = () => {

  const userID = (getDecreyptedData("userID") || "").toLowerCase().trim();
  const START_YEAR = 2026;
  const CURRENT_YEAR = new Date().getFullYear();
  const YEARS = Array.from({ length: CURRENT_YEAR - START_YEAR + 1 },(_, i) => String(START_YEAR + i));
  const MONTHSLIST = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const CURRENT_MONTH =`${MONTHSLIST[new Date().getMonth()]}-${String(CURRENT_YEAR).slice(-2)}`;

  const [filterYear, setFilterYear] = useState(String(CURRENT_YEAR));
  const [filterMonth, setFilterMonth] = useState(MONTHSLIST[new Date().getMonth()]);
  const userKey = Object.keys(USER_CONFIG).find( key => key.toLowerCase() === userID );
  const user = userKey ? USER_CONFIG[userKey] : null;
  const cat = user?.category;
  const config = cat ? CATEGORY_CONFIG[cat] : null;

  const EMPTY_MODEL_DATA = {
    year: "",
    month: "",
    resources: {},
    otherResources: {},
  };

  const [monthWiseData, setMonthWiseData] = useState({});
  const [apiLoading, setApiLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [MONTHS, setMONTHS] = useState([CURRENT_MONTH]);
  const [month, setMonth] = useState(CURRENT_MONTH);
  const [modelData, setModelData] = useState(EMPTY_MODEL_DATA);

  const [openMemberModal, setOpenMemberModal] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");

  const fetchDataForMonth = useCallback(async (selectedMonth) => {
    if (!selectedMonth || !user?.costCenter) {
      return;
    }

    setApiLoading(true);
    setApiError(null);

    const params = new URLSearchParams({
      month: selectedMonth,
      costCenter: user.costCenter,
    });

    try {
      const response = await fetch( `https://commtoolapi.mcpspmis.com/api/monthly-report/upsert/?${params.toString()}`);
      if (response.status === 404) {
        setMonthWiseData({});
        setModelData(EMPTY_MODEL_DATA);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      const resources = data.resources || {};
      const otherResources = data.other_resources || {};
      const costs = data.costs || {};

      setMonthWiseData({
        [data.month]: {
          costs,
          resources,
          other_resources: otherResources,
        },
      });

      setModelData({
        year: data.year || "",
        month: data.month?.split("-")[0] || "",
        resources,
        otherResources,
      });

    } 
    catch (error) {
      setApiError(error.message || "Something went wrong");
      setMonthWiseData({});
      setModelData(EMPTY_MODEL_DATA);
    } finally {
      setApiLoading(false);
    }
  }, [user?.costCenter]);


  useEffect(() => {
    fetchDataForMonth(month);
  }, [month, fetchDataForMonth])

    

  const hasData = useCallback( month => Boolean(monthWiseData?.[month]), [monthWiseData] );

  const getCostVal = useCallback( (month, costId) => {
      const monthData = monthWiseData?.[month];
      if (!monthData) return "";

      const costs = monthData.costs || {};

      if (costId === "c6") {
        return ( Number(costs.c2 || 0) + Number(costs.c3 || 0) + Number(costs.c4 || 0) + Number(costs.c5 || 0) ).toFixed(0);
      }

      if (costId === "c7") { 
        return ( Number(costs.c1 || 0) - ( Number(costs.c2 || 0) + Number(costs.c3 || 0) + Number(costs.c4 || 0) + Number(costs.c5 || 0) ) ).toFixed(0); 
      }

      const value = costs[costId];
      return typeof value === "number" ? value.toFixed(0) : value ? Number(value).toFixed(0) : "";
    }, [monthWiseData]
  );



  const getCostPercent = useCallback(
    (month, costId) => {
    if (costId === "c1") return "";

    const revenue = Number(getCostVal(month, "c1") || 0);
    const value = Number(getCostVal(month, costId) || 0);

    if (!revenue) return "";

    return `${((value / revenue) * 100).toFixed(2)}%`;
    }, [getCostVal]
  );

  const getCostAlert = (month, cost) => {
    if (cost.id === "c1") return null;

    const percent = getCostPercent(month, cost.id);
    if (!percent) return null; 

    const actual = parseFloat(percent);
    const allowed = parseFloat(cost.value);

    if (isNaN(actual) || isNaN(allowed)) return null;

    let message = "";
    let bgColor = ""

    if (cost.id === "c7") {
      if (actual < allowed) {
        message = "⚠ GP Below Target";
        bgColor = "#d32f2f";
      } else {
        message = "✔ GP Target Achieved";
        bgColor = "#2e7d32";
      }
    } else {
      if (actual > allowed) {
        message = "⚠ Cost Exceeded";
        bgColor = "#d32f2f";
      } else {
        message = "✔ Within Target";
        bgColor = "#2e7d32"; 
      }
    }

    return (
      <span
        style={{
          color: "#fff",
          background: bgColor,
          padding: "3px 8px",
          borderRadius: "4px",
          fontWeight: "bold",
          animation: "blink 1s infinite",
          display: "inline-block",
        }}
      >
        {message}
      </span>
    );
  };

  const EMPTY_CELL = {
    count: "",
    comment: "",
    action: "",
    members: [],
  };

  const getResCell = useCallback( (month, resId) => {
    return ( monthWiseData?.[month]?.resources?.[resId] || EMPTY_CELL );
    }, [monthWiseData]
  );

  const getothResCell = useCallback( (month, resId) => {
    return ( monthWiseData?.[month]?.other_resources?.[resId] || EMPTY_CELL );
    }, [monthWiseData]
  );


  const handleMemberClick = useCallback( (selectedMonth, role, type) => {
      const members =
        type === "resource"
          ? monthWiseData?.[selectedMonth]?.resources?.[role.id]?.members || []
          : monthWiseData?.[selectedMonth]?.other_resources?.[role.id]?.members || [];

      setSelectedRole(role.role);
      setSelectedMembers(members);
      setOpenMemberModal(true);
    },
    [monthWiseData]
  );

  function handleFilterClick() {
    if (!filterYear || !filterMonth) {
      alert("Please select both Year and Month");
      return;
    }
    const selectedMonth = `${filterMonth}-${String(filterYear).slice(-2)}`;
    setMONTHS([selectedMonth]);
    setMonth(selectedMonth);
  }

  const handleRefresh = () => {
    const currentMonth = MONTHSLIST[new Date().getMonth()];
    const currentMonthValue = `${currentMonth}-${String(CURRENT_YEAR).slice(-2)}`;

    setFilterYear(String(CURRENT_YEAR));
    setFilterMonth(currentMonth);

    setMONTHS([currentMonthValue]);
    setMonth(currentMonthValue);
  };


  const handleExport = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const data = monthWiseData?.[month];

      if (!data) {
        alert(`No data available for ${month}`);
        return;
      }

      const costSheet = workbook.addWorksheet("Cost");
      costSheet.columns = [
        { header: "Category", key: "category", width: 25 },
        { header: "Target / Exp", key: "target", width: 18 },
        { header: "Value", key: "value", width: 18 },
        { header: "%", key: "percent", width: 15 },
        { header: "Notes", key: "notes", width: 25 },
      ];

      costs.forEach((cost) => {
        costSheet.addRow({
          category: cost.label,
          target: cost.value,
          value: getCostVal(month, cost.id),
          percent: getCostPercent(month, cost.id),
          notes: "",
        });
      });

      costSheet.getRow(1).eachCell((cell) => {
        cell.font = {
          bold: true,
          color: { argb: "FFFFFF" },
        };

        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: {
            argb: CAT_COLOR.replace("#", ""),
          },
        };

        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
        };
      });

      const resourceSheet = workbook.addWorksheet("Resources");

      resourceSheet.columns = [
        { header: "Role", key: "role", width: 30 },
        { header: "UST ID", key: "ustId", width: 15 },
        { header: "Name", key: "name", width: 30 },
        { header: "Projects", key: "projects", width: 45 },
        { header: "Comment", key: "comment", width: 30 },
        { header: "Action", key: "action", width: 30 },
      ];

      resources.filter((role) => role.role !== "Total back end Resources").forEach((role) => {
        const resourceData = data.resources?.[role.id] || {};
        const members = resourceData.members || [];

        if (members.length === 0) {
          resourceSheet.addRow({
            role: role.role,
            ustId: "",
            name: "",
            projects: "",
            comment: resourceData.comment || "",
            action: resourceData.action || "",
          });
        } else {
          members.forEach((member) => {
            resourceSheet.addRow({
              role: role.role,
              ustId: member.ustId || "",
              name: member.name || "",
              projects: (member.projects || []).join(", "),
              comment: resourceData.comment || "",
              action: resourceData.action || "",
            });
          });
        }
      });

      const otherResourceSheet = workbook.addWorksheet("Other Resources");
      otherResourceSheet.columns = [
        { header: "Role", key: "role", width: 30 },
        { header: "UST ID", key: "ustId", width: 15 },
        { header: "Name", key: "name", width: 30 },
        { header: "Projects", key: "projects", width: 45 },
        { header: "Comment", key: "comment", width: 30 },
        { header: "Action", key: "action", width: 30 },
      ];

      otherResources.forEach((role) => {
        const resourceData =
          data.other_resources?.[role.id] || {};

        const members = resourceData.members || [];

        if (members.length === 0) {
          otherResourceSheet.addRow({
            role: role.role,
            ustId: "",
            name: "",
            projects: "",
            comment: resourceData.comment || "",
            action: resourceData.action || "",
          });
        } else {
          members.forEach((member) => {
            otherResourceSheet.addRow({
              role: role.role,
              ustId: member.ustId || "",
              name: member.name || "",
              projects: (member.projects || []).join(", "),
              comment: resourceData.comment || "",
              action: resourceData.action || "",
            });
          });
        }
      });

      [resourceSheet, otherResourceSheet].forEach((sheet) => {
        sheet.getRow(1).eachCell((cell) => {
          cell.font = {
            bold: true,
            color: { argb: "FFFFFF" },
          };

          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: {
              argb: CAT_COLOR.replace("#", ""),
            },
          };

          cell.alignment = {
            horizontal: "center",
            vertical: "middle",
          };
        });

        sheet.eachRow((row, rowNumber) => {
          if (rowNumber > 1) {
            row.eachCell((cell) => {
              cell.alignment = {
                vertical: "middle",
                wrapText: true,
              };

              cell.border = {
                top: { style: "thin", color: { argb: "DDDDDD" } },
                left: { style: "thin", color: { argb: "DDDDDD" } },
                bottom: { style: "thin", color: { argb: "DDDDDD" } },
                right: { style: "thin", color: { argb: "DDDDDD" } },
              };
            });
          }
        });

        sheet.views = [
          {
            state: "frozen",
            ySplit: 1,
          },
        ];

        sheet.autoFilter = {
          from: "A1",
          to: "F1",
        };
      });

      costSheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
          row.eachCell((cell) => {
            cell.alignment = {
              vertical: "middle",
              wrapText: true,
            };

            cell.border = {
              top: { style: "thin", color: { argb: "DDDDDD" } },
              left: { style: "thin", color: { argb: "DDDDDD" } },
              bottom: { style: "thin", color: { argb: "DDDDDD" } },
              right: { style: "thin", color: { argb: "DDDDDD" } },
            };
          });
        }
      });

      costSheet.views = [
        {
          state: "frozen",
          ySplit: 1,
        },
      ];


      const buffer = await workbook.xlsx.writeBuffer();

      saveAs(
        new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
        `${user.circle}_${user.costCenter}_${month}.xlsx`
      );

    } catch (error) {
      console.error("Export Error:", error);
      alert("Failed to export Excel");
    }
  };

  const CAT_COLOR = { A:"#1a5c2a", B:"#006E74", C:"#a85c00", D:"#8b1a1a" }[cat];
  const bdr   = "0.5px solid #c8c6be";
  const cs    = { border:bdr, padding:"4px 8px", fontSize:12, background:"#fff", color:"#222", whiteSpace:"nowrap" };
  const hc    = { border:bdr, padding:"6px 8px", fontSize:11, fontWeight:600, textAlign:"center", background:CAT_COLOR, color:"#fff", whiteSpace:"nowrap" };
  const sh    = { border:bdr, padding:"4px 4px", fontSize:10, fontWeight:500, textAlign:"center", background:"#e6a817", color:"#4a2800", whiteSpace:"nowrap" };
  const shSub = { border:bdr, padding:"3px 4px", fontSize:10, textAlign:"center", background:"#f0ede0", color:"#555", whiteSpace:"nowrap" };
  const emptyHeader = { border: "none",background: "#f0ede0",padding: 0};

  const DisplayCell = ({value,align = "center",onClick = null}) => (
    <span
      onClick={onClick}
      style={{
        display: "block",
        fontSize: onClick ? 14 : 12,
        textAlign: align,
        padding: "3px 5px",
        color: onClick ? "#e6a817":"#222",
        cursor: onClick ? "pointer" : "default",
        fontWeight: onClick ? "600" : "400",
      }}
    >
      {value !== "" && value != null ? value : <span style={{ color: "#ccc" }}></span>}
    </span>
  );

  const sectionTd = (text, rowSpan, bg, color) => (
    <td rowSpan={rowSpan} style={{ border:bdr, background:bg, fontWeight:500, fontSize:11, textAlign:"center", verticalAlign:"middle", writingMode:"vertical-rl", transform:"rotate(180deg)", padding:"8px 3px", width:28, color }}>
      {text}
    </td>
  );

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

    
  const resources = config.resources;
  const costs     = config.costs;
  const otherResources = config.otherResources;


  if (!user || !config) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "#c04040" }}>
        User configuration not found.
      </div>
    );
  }
    
  if (apiError) {
    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          color: "#c04040",
          fontSize: 14,
        }}
      >
        Failed to load: {apiError}
      </div>
    );
  }

  return (
  <>
    <div style={{ fontFamily:"sans-serif", padding:"1.5rem 0 2rem" }}>

      {/* Header bar */}
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12, padding:"8px 12px", background:"#f5f5f0", border:"0.5px solid #ddd", borderRadius:8 }}>
        <div style={{ borderRadius:6, background:CAT_COLOR, display:"inline-flex", alignItems:"center", padding: "6px 10px", justifyContent:"center", color:"#fff", fontWeight:700, fontSize:16 }}>Category - {cat} &nbsp; Circle - {user.circle}</div>
        <div style={{marginLeft:"auto",display: "flex", gap: 8 }}>
          <select
            value={filterYear}
            onChange={e => setFilterYear(e.target.value)}
            style={{
              padding: "6px 8px", fontSize: 13, borderRadius: 6,
              border: "1px solid #ccc", outline: "none",
            }}
          >
            <option value="">-- Year --</option>
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>

          <select
            value={filterMonth}
            onChange={e => setFilterMonth(e.target.value)}
            style={{
              padding: "6px 8px", fontSize: 13, borderRadius: 6,
              border: "1px solid #ccc", outline: "none",
            }}
          >
            <option value="">-- Month --</option>
            {MONTHSLIST.map(m => <option key={m} value={m}>{m}</option>)}
          </select>

          <button
            onClick={handleFilterClick}
            style={{
              padding: "6px 16px", fontSize: 13, fontWeight: 500,
              borderRadius: 6, border: "none", cursor: "pointer",
              background: CAT_COLOR, color: "#fff",
            }}
          >
            Filter
          </button>
          <button
            onClick={handleRefresh}
            style={{
              padding: "6px 16px", fontSize: 13, fontWeight: 500,
              borderRadius: 6, border: "none", cursor: "pointer",
              background: CAT_COLOR, color: "#fff",
            }}
          >
            Reset
          </button>
        </div>

        <div style={{ marginLeft:"auto", display:"flex", gap:6 }}>
          <AddMonthDataModal
            catColor={CAT_COLOR}
            costCenter = {user.costCenter}
            modelData = {modelData}
            onSubmit={async (payload) => {
              const res = await fetch('https://commtoolapi.mcpspmis.com/api/monthly-report/upsert/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  circle:  user.circle,
                  category: user.category,
                  customer: user.customer,
                  month:payload.month,
                  year:payload.year,
                  costCenter:user.costCenter,
                  resources: payload.resources,
                  other_resources:payload.otherResources
                })
              });
              if (res.ok) {
                await fetchDataForMonth(month);
              } else {
                alert("Failed to save data");
              }
            }}
          />
          {/* {Export} */}

          {/* <button
            onClick={handleExport}
            disabled={apiLoading || !monthWiseData?.[month]}
            style={{
              padding: "6px 16px",
              fontSize: 13,
              fontWeight: 500,
              borderRadius: 6,
              border: "none",
              cursor:
                apiLoading || !monthWiseData?.[month]
                  ? "not-allowed"
                  : "pointer",
              background:
                apiLoading || !monthWiseData?.[month]
                  ? "#aaa"
                  : CAT_COLOR,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            Export
          </button> */}

        </div>
      </div>

      {apiLoading ? (
        <div
          style={{
            minHeight: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 12,
            border: bdr,
            borderRadius: 8,
            background: "#fafafa",
          }}
        >
          <div
            style={{
              width: 35,
              height: 35,
              border: `4px solid #ddd`,
              borderTop: `4px solid ${CAT_COLOR}`,
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />

          <span
            style={{
              fontSize: 13,
              color: "#666",
            }}
          >
            Loading {month} data...
          </span>
        </div>
      ) : (
        <div style={{ border:bdr, borderRadius:8, overflow:"hidden", width:"100%" }}>
          <table style={{ borderCollapse:"collapse", width:"100%", tableLayout:"fixed" }}>
            <colgroup>
              <col style={{ width:28 }} />
              <col style={{ width:"18%" }} />
              <col style={{ width:"7%" }} />
              <col style={{ width:"9%" }} />
              {MONTHS.map(m => (
                <React.Fragment key={m}>
                  <col />
                  <col />
                  <col />
                </React.Fragment>
              ))}
            </colgroup>

            <thead>
              <tr>
                <th style={hc} colSpan={2}>Category</th>
                <th style={hc} colSpan={2}>Qty / Exp (yrs)</th>
                {MONTHS.map(m => (
                  <th key={m} style={{...hc,background: CAT_COLOR}} colSpan={3}>
                    {m} 
                  </th>
                ))}
              </tr>

              <tr>
                <th style={emptyHeader}></th>
                <th style={emptyHeader}></th>
                <th style={emptyHeader}></th>
                <th style={emptyHeader}></th>
                {MONTHS.map(m => (
                  <React.Fragment key={m}>
                    <th style={shSub}>Value</th>
                    <th style={shSub}>%</th>
                    <th style={shSub}>Notes</th> 
                  </React.Fragment>
                ))}
              </tr>


            </thead>

            <tbody>
              {/* ── Overall Cost ── */}
              <tr>
                {sectionTd("Overall cost", costs.length, "#f5cfc0", "#5a1e00")}
                <td style={cs}>{costs[0].label}</td>
                <td colSpan={2} style={{ ...cs, background:"#cce8f7", textAlign:"center" }}>{costs[0].value}</td>
                {MONTHS.map(m => (
                  <React.Fragment key={m}>
                    <td style={cs}>
                      <DisplayCell value={getCostVal(m, costs[0].id)} />
                    </td>

                    <td style={{ ...cs, textAlign: "center" }}>
                      <DisplayCell value={getCostPercent(m, costs[0].id)} />
                    </td>

                    <td style={cs}></td>
                  </React.Fragment>
                ))}
              </tr>
              {costs.slice(1).map(c => (
                <tr key={c.id}>
                  <td style={{ ...cs, fontWeight:c.isTotal?600:400 }}>{c.label}</td>
                  <td colSpan={2} style={{ ...cs, background:c.isTotal?"#f0f0e8":"transparent", textAlign:"center", fontWeight:c.isTotal?600:400 }}>{c.value}</td>
                  
                  {MONTHS.map(m => (
                    <React.Fragment key={m}>
                      <td style={cs}>
                        <DisplayCell value={getCostVal(m, c.id)} />
                      </td>

                      <td style={{ ...cs,textAlign:"center"}}>
                        <DisplayCell value={getCostPercent(m, c.id)} />
                      </td>

                      <td style={{...cs,textAlign:"center"}}>{getCostAlert(m, c)}</td>
                    </React.Fragment>
                  ))}
                </tr>
              ))}

              {/* ── Resource Management header ── */}
              <tr>
                {sectionTd("Resource Management", resources.length+2, "#d8d8d0", "#2c2c2a")}
                <th style={{ ...hc, textAlign:"left" }} colSpan={3}>Role</th>
                {MONTHS.map(m => (
                  <>
                    <th key={m+"r"} style={{ ...sh, background:"#e6a817",color:"#4a2800"}}>Resource Count</th>
                    <th key={m+"c"} style={{ ...sh, background:  "#e6a817",color:"#4a2800"}}>Comment</th>
                    <th key={m+"a"} style={{ ...sh, background:  "#e6a817",color:"#4a2800"}}>Action</th>
                  </>
                ))}
              </tr>
              <tr>
                <th style={shSub}>Role</th>
                <th style={shSub}>Qty</th>
                <th style={shSub}>Exp</th>
                {MONTHS.map(m => (
                  <>
                    <th key={m+"r2"} style={shSub}>Count</th>
                    <th key={m+"c2"} style={shSub}>Comment</th>
                    <th key={m+"a2"} style={shSub}>Action</th>
                  </>
                ))}
              </tr>

              {/* ── Resource rows ── */}
              {resources.map(r => {
                const highlight = r.role === "Total back end Resources" 
                return (
                  <tr key={r.id} style={{ background:"transparent" }}>
                    <td style={{ ...cs, color:"#222", fontWeight: highlight ? "bold" : "normal",fontSize: highlight ? 14 : 12 }}>{r.role}</td>
                    <td style={{ ...cs, textAlign:"center", color:"#222", fontWeight: highlight ? "bold" : "normal",fontSize: highlight ? 14 : 12 }}>{r.qty}</td>
                    <td style={{ ...cs, textAlign:"center", fontSize:11, color:"#222" }}>{r.exp}</td>
                    {MONTHS.map(m => {
                      if (highlight) return (
                        <>
                          <td key={m+"cnt"} style={{ ...cs, background:"#f0f0ee", textAlign:"center", color:"#ccc", fontSize:11 }}></td>
                          <td key={m+"cmt"} style={{ ...cs, background:"#f0f0ee", textAlign:"center", color:"#ccc", fontSize:11 }}></td>
                          <td key={m+"act"} style={{ ...cs, background:"#f0f0ee", textAlign:"center", color:"#ccc", fontSize:11 }}></td>
                        </>
                      );
                      const cell = getResCell(m, r.id);
                      return (
                        <>
                          <td key={m+"cnt"} style={cs}><DisplayCell value={cell?.count} onClick={Number(cell.count) > 0 ?() => handleMemberClick(m, r,"resource"): null}/></td>
                          <td key={m+"cmt"} style={cs}><DisplayCell value={cell?.comment} align="left" /></td>
                          <td key={m+"act"} style={cs}><DisplayCell value={cell?.action} align="left" /></td>
                        </>
                      );
                    })}
                  </tr>
                );
              })}

              {/* ── Other Resources header ── */}
              <tr>
                {sectionTd("Other Resources", otherResources.length+2, "#d8d8d0", "#2c2c2a")}
                <th style={{ ...hc, textAlign:"left" }} colSpan={3}>Role</th>
                {MONTHS.map(m => (
                  <>
                    <th key={m+"r"} style={{ ...sh, background:"#e6a817",color:"#4a2800"}}>Resource Count</th>
                    <th key={m+"c"} style={{ ...sh, background:  "#e6a817",color:"#4a2800"}}>Comment</th>
                    <th key={m+"a"} style={{ ...sh, background:  "#e6a817",color:"#4a2800"}}>Action</th>
                  </>
                ))}
              </tr>
              <tr>
                <th style={shSub}>Role</th>
                <th style={shSub}>Qty</th>
                <th style={shSub}>Exp</th>
                {MONTHS.map(m => (
                  <>
                    <th key={m+"r2"} style={shSub}>Count</th>
                    <th key={m+"c2"} style={shSub}>Comment</th>
                    <th key={m+"a2"} style={shSub}>Action</th>
                  </>
                ))}
              </tr>

              {/* ──Other Resource rows ── */}
              {otherResources.map(r => {
                const dim = r.qty === 0;
                return (
                  <tr key={r.id} style={{ background: dim ? "#f8f8f4" : "transparent" }}>
                    <td style={{ ...cs, color: dim?"#aaa":"#222" }}>{r.role}</td>
                    <td style={{ ...cs, textAlign:"center", color: dim?"#aaa":"#222" }}>{r.qty}</td>
                    <td style={{ ...cs, textAlign:"center", fontSize:11, color:"#777" }}>{r.exp}</td>
                    {MONTHS.map(m => {
                      const cell = getothResCell(m, r.id);
                      return (
                        <>
                          <td key={m+"cnt"} style={cs}><DisplayCell value={cell?.count} onClick={Number(cell.count) > 0 ? () => handleMemberClick(m, r,"other_resource"): null}/></td>
                          <td key={m+"cmt"} style={cs}><DisplayCell value={cell?.comment} align="left" /></td>
                          <td key={m+"act"} style={cs}><DisplayCell value={cell?.action} align="left" /></td>
                        </>
                      );
                    })}
                  </tr>
                );
              })}

            </tbody>
          </table>
        </div>
      )}
      
    </div>


    {openMemberModal && (
      <div
        // onClick={() => setOpenMemberModal(false)}
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
export default MonthWise