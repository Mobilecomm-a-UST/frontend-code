import React, { useState, useEffect } from 'react';
import { getDecreyptedData } from '../../../utils/localstorage';
import AddMonthDataModal from "./AddMonthDataModal";



const USER_CONFIG = {
  'Vishal.Yadav@ust.com':{
    "circle":"UPE",
    "category":"A",
    "customer":"Airtel",
    "costCenter":"MCT0385"
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
        { id:"c6", label:"Gross Profit", value:"30.30", isTotal:true },
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
          { id:"c6", label:"Gross Profit", value:"18.8%",isTotal:true},
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
  const user = Object.keys(USER_CONFIG).find(k => k.toLowerCase() === userID) ? USER_CONFIG[Object.keys(USER_CONFIG).find(k => k.toLowerCase() === userID)] : null;
  const cat = user.category;
  const config = CATEGORY_CONFIG[cat];

  const [monthWiseData,     setMonthWiseData]     = useState(null); 
  const [costMonthData, setCostMonthData] = useState(null); 
  const [apiLoading,    setApiLoading]    = useState(true);
  const [apiError,      setApiError]      = useState(null);
  const [MONTHS,setMONTHS] = useState([CURRENT_MONTH]);
  const[month,setMonth] = useState(CURRENT_MONTH);

  const [openMemberModal, setOpenMemberModal] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");

  const handleMemberClick = (month, role,type) => {
    let members = [];
    if (type === "resource"){
      members = monthWiseData?.[month]?.resources?.[role.id]?.members || [];
    }
    else {
      members = monthWiseData?.[month]?.other_resources?.[role.id]?.members || [];
    }
    
    setSelectedRole(role.role);
    setSelectedMembers(members);
    setOpenMemberModal(true);
  };



  const fetchDataForMonth = (selectedMonth) => {
    setApiLoading(true);
    setApiError(null);

    const params = new URLSearchParams({
      month: selectedMonth,
      costCenter: user.costCenter,
    });

    fetch(`https://commtoolapi.mcpspmis.com/api/monthly-report/upsert/?${params}`)
      .then(res => {
        if (res.status === 404) {
          setMonthWiseData(null);
          return null;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (data) {
          setMonthWiseData({
            [data.month]: {
              costs: data.costs || {},
              resources: data.resources || {},
              other_resources: data.other_resources || {},
            },
          });
        }
      })
      .catch(err => setApiError(err.message))
      .finally(() => setApiLoading(false));
  };

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
    setFilterYear(String(CURRENT_YEAR));
    setFilterMonth(MONTHSLIST[new Date().getMonth()])
    const selectedMonth = `${MONTHSLIST[new Date().getMonth()]}-${String(CURRENT_YEAR).slice(-2)}`;
    setMONTHS([selectedMonth]);
    setMonth(selectedMonth);
  };

    useEffect(() => {
      fetchDataForMonth(month);
    }, [month]);

    const hasData = (month) => monthWiseData?.[month] != null;
  
    const getCostVal = (month, costId) => {
      if (!hasData(month)) return null;
      if (['c6','c7'].includes(costId)) {
        const costs = monthWiseData[month]?.costs || {};
        if(costId === 'c6') return ((costs["c2"] || 0) +(costs["c3"] || 0) +(costs["c4"] || 0) +(costs["c5"] || 0)).toFixed(0);
        if(costId === 'c7') return ((costs["c1"] || 0) -((costs["c2"] || 0) +(costs["c3"] || 0) +(costs["c4"] || 0) +(costs["c5"] || 0))).toFixed(0);
      }
      const final_value = monthWiseData[month].costs?.[costId] ?? ""
      return final_value.toFixed(0);
    };

    const getCostPercent = (month, id) => {
      if (id === "c1") return "";
      const revenue = Number(getCostVal(month, "c1") || 0);
      const value = Number(getCostVal(month, id) || 0);
      if (!revenue) return "";
      return ((value / revenue) * 100).toFixed(2) + "%";
      
    };

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
  
    const getResCell = (month, resId) => {
      if (!hasData(month)) return null;
      return monthWiseData[month].resources?.[resId] ?? { count:"", comment:"", action:"" };
    };

    const getothResCell = (month, resId) => {
      if (!hasData(month)) return null;
      return monthWiseData[month].other_resources?.[resId] ?? { count:"", comment:"", action:"" };
    };


    // ── Styles ───────────────────────────────────────────────────
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
          // textDecoration: onClick ? "underline" : "none",
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
    
    if (apiError) return (
        <div style={{ padding:"2rem", textAlign:"center", color:"#c04040", fontSize:14 }}>
        Failed to load: {apiError}
        </div>
    );

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
                console.log("Payload to send:", payload);
                // const data = await res.json();
                // console.log(data.message); 
              }}
            />
          </div>
        </div>
  
        {/* Table */}
        <div style={{ border:bdr, borderRadius:8, overflow:"hidden", width:"100%" }}>
          <table style={{ borderCollapse:"collapse", width:"100%", tableLayout:"fixed" }}>
            <colgroup>
              <col style={{ width:28 }} />
              <col style={{ width:"18%" }} />
              <col style={{ width:"7%" }} />
              <col style={{ width:"9%" }} />
              {MONTHS.map(m => (
                <>
                  <col key={m+"cnt"} />
                  <col key={m+"cmt"} />
                  <col key={m+"act"} />
                </>
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
                          <td key={m+"cnt"} style={cs}><DisplayCell value={cell?.count} onClick={() => handleMemberClick(m, r,"resource")}/></td>
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
                          <td key={m+"cnt"} style={cs}><DisplayCell value={cell?.count} onClick={() => handleMemberClick(m, r,"other_resource")}/></td>
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

export default MonthWise






