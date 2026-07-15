import React, { useEffect, useRef, useState } from "react";

const START_YEAR = 2026;
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - START_YEAR + 1 },(_, i) => String(START_YEAR + i));
const COUNT_OPTIONS = Array.from({ length: 11 }, (_, i) => i); 

// const NAME_OPTIONS = [
//   { id: "e1", name: "Mohit Batra", ustId: "UST1001" },
//   { id: "e2", name: "Vishal Yadav",   ustId: "UST1002" },
//   { id: "e3", name: "Girraj Singh",  ustId: "UST1003" },
//   { id: "e4", name: "Prerna", ustId: "UST1004" },
//   { id: "e5", name: "Abhinav",   ustId: "UST1005" },
//   { id: "e6", name: "Abhishek",  ustId: "UST1006" },
  
// ];

const PROJECT_OPTIONS = [
  { id: "p1", name: "Relcoation" },
  { id: "p2", name: "NT/Upgrade" },
  { id: "p3", name: "Degrow" },
  { id: "p4", name: "MW" },
  { id: "p5", name: "UBR" },
  { id: "p6", name: "RF/LOS Survey" },
  { id: "p7", name: "IBS" },
  { id: "p8", name: "Dismanlling" },
  { id: "p9", name: "MW Dismantlling" },
  { id: "p10", name: "ULS" },
  { id: "p11", name: "5G Services" },
]

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const RESOURCE_ROLES = [
  { id:"r1",  role:"CDH" },
  { id:"r2",  role:"PM" },
  { id:"r3",  role:"Coordinator" },
  { id:"r4",  role:"NPO Lead" },
  { id:"r5",  role:"Jr NPO" },
  { id:"r6",  role:"SCFT Coordinator" },
  { id:"r7",  role:"Ware House Manager" },
  { id:"r8",  role:"Warehouse Coordinator" },
  { id:"r9",  role:"SCM Lead" },
  { id:"r10", role:"OHS Safety" },
  { id:"r11", role:"EMF Coordinator" },
  { id:"r12", role:"RF Survey Coordinator" },
  { id:"r13", role:"PMIS Lead" },
  { id:"r14", role:"MS2 Lead" },
];

const OTHER_RESOURCE_ROLES = [
  { id:"or1",  role:"Field engineer" },
  { id:"or2",  role:"Technician" },
];

function buildEmptyResources() {
  const obj = {};
  RESOURCE_ROLES.forEach(r => {obj[r.id] = {count: "", comment: "", action: "", members: []}});
  return obj;
}

function buildEmptyOtherResources() {
  const obj = {};
  OTHER_RESOURCE_ROLES.forEach(r => {obj[r.id] = {count: "", comment: "", action: "", members: []}});
  return obj;
}



function SearchableMultiSelect({ options, selected = [], onChange,catcolor,placeholder = "Select Project(s)" }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const safeSelected = Array.isArray(selected) ? selected : [];

  function toggleOption(id) {
    if (safeSelected.includes(id)) {
      onChange(safeSelected.filter(x => x !== id));
    } else {
      onChange([...safeSelected, id]);
    }
  }

  const filtered = options.filter(o =>
    o.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedLabels = options
    .filter(o => safeSelected.includes(o.id))
    .map(o => o.name)
    .join(", ");

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div
        onClick={() => setOpen(prev => !prev)}
        style={{
          padding: "4px 6px", fontSize: 12, cursor: "pointer",
          minHeight: 24, overflow: "hidden", textOverflow: "ellipsis",
          whiteSpace: "nowrap", color: selectedLabels ? "#333" : "#999",
          border: "1px solid #ccc", borderRadius: 6,
        }}
      >
        {selectedLabels || placeholder}
      </div>

      {open && (
        <div
          onMouseDown={e => e.stopPropagation()}
          style={{
            position: "absolute", top: "100%", left: 0, zIndex: 9999,
            background: "#fff", border: "1px solid #ccc", borderRadius: 6,
            width: "100%", maxHeight: 220, overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            display: "flex", flexDirection: "column",
          }}
        >
          <input
            type="text"
            autoFocus
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ border: "none", borderBottom: "1px solid #eee", padding: "6px 8px", fontSize: 12, outline: "none" }}
          />
          <div style={{ overflowY: "auto", maxHeight: 150 }}>
            {filtered.length === 0 && (
              <div style={{ padding: "6px 8px", fontSize: 12, color: "#999" }}>No match found</div>
            )}
            {filtered.map(o => (
              <label
                key={o.id}
                onMouseDown={e => e.stopPropagation()}
                onClick={() => toggleOption(o.id)}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 8px", fontSize: 12, cursor: "pointer" }}
              >
                <input type="checkbox" checked={safeSelected.includes(o.id)} readOnly />
                {o.name}
              </label>
            ))}
          </div>
          <div style={{ borderTop: "1px solid #eee", padding: "6px 8px", textAlign: "right" }}>
            <button
              onMouseDown={e => e.stopPropagation()}
              onClick={() => { setOpen(false); setSearch(""); }}
              style={{ border: "none", background:catcolor, color: "#fff", fontSize: 11, padding: "4px 10px", borderRadius: 4, cursor: "pointer" }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}



const AddMonthDataModal = ({ catColor,costCenter,onSubmit}) => {

  const [open, setOpen] = useState(false);
  const [year,      setYear]      = useState("");
  const [month,     setMonth]     = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors,    setFieldErrors]    = useState({});
  const [errors,    setErrors]    = useState({});
  const [otherErrors,    setOtherErrors]    = useState({});
  const [resources, setResources] = useState(buildEmptyResources());
  const [otherResources, setOtherResources] = useState(buildEmptyOtherResources());
  const [nameOptions, setNameOptions] = useState([]);

  useEffect(() => {
    if (!open) return;

    fetch(`https://commtoolapi.mcpspmis.com/employees/?project_code=${costCenter}`)
      .then(res => res.json())
      .then(data => {
        setNameOptions(data);
      })
      .catch(err => {
        console.error(err);
      });

  }, [open]);

  function updateResourceCount(roleId, value) {
    const count = parseInt(value) || 0;
    setResources(prev => {
      const existing = prev[roleId]?.members || [];
      let members = [...existing];

      if (count > members.length) {
        for (let i = members.length; i < count; i++) {
          members.push({ name: "", ustId: "", projects: [],id:"" });
        }
      } else {
        members = members.slice(0, count);
      }
      return { ...prev, [roleId]: { ...prev[roleId], count: value, members } };
    });
      setErrors(prev => ({
      ...prev,
      [roleId]: { ...prev[roleId], count: "" }
    }));
  }

  function updateOtherResourceCount(roleId, value) {
    const count = parseInt(value) || 0;
    setOtherResources(prev => {
      const existing = prev[roleId]?.members || [];
      let members = [...existing];

      if (count > members.length) {
        for (let i = members.length; i < count; i++) {
          members.push({ name: "", ustId: "", projects: [],id:"" });
        }
      } else {
        members = members.slice(0, count);
      }
      return { ...prev, [roleId]: { ...prev[roleId], count: value, members } };
    });
      setErrors(prev => ({
      ...prev,
      [roleId]: { ...prev[roleId], count: "" }
    }));
  }

  function updateResource(id, field, value) {
    setResources(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  }

  function updateOtherResource(id, field, value) {
    setOtherResources(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  }

  function updateResourceMember(roleId, index, field, value) {
    setResources(prev => {
      const members = [...prev[roleId].members];

      if (field === "name") {
        const emp = nameOptions.find(n => n.id === value);

        members[index] = {...members[index],name: emp ? emp.name : "",ustId: emp ? emp.ustId : "",id: emp?.id || "",};

      } else if (field === "projects") {
        const projectNames = PROJECT_OPTIONS.filter(p => value.includes(p.id)).map(p => p.name);
        members[index] = {...members[index],projects: value};

      } else {
        members[index] = {...members[index],[field]: value};
      }

      return {...prev,[roleId]: {...prev[roleId],members}};
    });

    setErrors(prev => {
      const roleErr = prev[roleId] || {};
      const memberErrs = [...(roleErr.members || [])];
      memberErrs[index] = { ...memberErrs[index], [field]: "" };

      return {...prev,[roleId]: {...roleErr,members: memberErrs}};
    });
  }





  function updateOtherResourceMember(roleId, index, field, value) {
    setOtherResources(prev => {
      const members = [...prev[roleId].members];

      if (field === "name") {
        const emp = nameOptions.find(n => n.id === value);

        members[index] = {...members[index],name: emp ? emp.name : "",ustId: emp ? emp.ustId : "",id:emp?.id || ""};

      } else if (field === "projects") {
        const projectNames = PROJECT_OPTIONS.filter(p => value.includes(p.id)).map(p => p.name);
        members[index] = {...members[index],projects:value};

      } else {
        members[index] = {...members[index],[field]: value};
      }

      return {...prev,[roleId]: {...prev[roleId],members}};
    });

    setErrors(prev => {
      const roleErr = prev[roleId] || {};
      const memberErrs = [...(roleErr.members || [])];
      memberErrs[index] = { ...memberErrs[index], [field]: "" };

      return {...prev,[roleId]: {...roleErr,members: memberErrs}};
    });
  }

  function SearchableSingleSelect({ options, value, onChange, placeholder = "-- Select Name --", hasError }) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const ref = useRef(null);

    useEffect(() => {
      function handleClickOutside(e) {
        if (ref.current && !ref.current.contains(e.target)) {
          setOpen(false);
          setSearch("");
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find(o => o.id === value);
    const filtered = options.filter(o =>
      o.name.toLowerCase().includes(search.toLowerCase())
    );

    function handleSelect(id) {
      onChange(id);
      setOpen(false);
      setSearch("");
    }

    return (
      <div ref={ref} style={{ position: "relative" }}>
        <div
          onClick={() => setOpen(prev => !prev)}
          style={{
            ...inp, padding: "4px 6px", fontSize: 12, cursor: "pointer",
            minHeight: 24, overflow: "hidden", textOverflow: "ellipsis",
            whiteSpace: "nowrap", color: selectedOption ? "#333" : "#999",
            borderColor: hasError ? "red" : undefined,
          }}
        >
          {selectedOption ? selectedOption.name : placeholder}
        </div>

        {open && (
          <div style={{
            position: "absolute", top: "100%", left: 0, zIndex: 9999,
            background: "#fff", border: "1px solid #ccc", borderRadius: 6,
            width: "100%", maxHeight: 200, overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            display: "flex", flexDirection: "column",
          }}>
            {/* Search input */}
            <input
              type="text"
              autoFocus
              placeholder="Search..."
              value={search}
              onClick={e => e.stopPropagation()}
              onChange={e => setSearch(e.target.value)}
              style={{
                border: "none", borderBottom: "1px solid #eee",
                padding: "6px 8px", fontSize: 12, outline: "none",
              }}
            />

            {/* Options list */}
            <div style={{ overflowY: "auto", maxHeight: 160 }}>
              {filtered.length === 0 && (
                <div style={{ padding: "6px 8px", fontSize: 12, color: "#999" }}>No match found</div>
              )}
              {filtered.map(o => (
                <div
                  key={o.id}
                  onClick={() => handleSelect(o.id)}
                  style={{
                    padding: "6px 8px", fontSize: 12, cursor: "pointer",
                    background: o.id === value ? "#eef2f7" : "#fff",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f5f5f5"}
                  onMouseLeave={e => e.currentTarget.style.background = o.id === value ? "#eef2f7" : "#fff"}
                >
                  {o.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }


  function validateResourceSection(resourcesObj, roles) {
    let newErrors = {};
    let isValid = true;

    roles.forEach(r => {
      const data = resourcesObj[r.id];
      let roleErr = { count: "", members: [] };

      if (data.count === "" || data.count === null || data.count === undefined) {
        roleErr.count = "Count is required";
        isValid = false;
      }

      const count = parseInt(data.count) || 0;
      if (count > 0) {
        data.members.forEach((m, i) => {
          let memberErr = { name: "", ustId: "", projects: "" };

          if (!m.name) {
            memberErr.name = "Name is required";
            isValid = false;
          }
          if (!m.ustId) {
            memberErr.ustId = "UST ID is required";
            isValid = false;
          }
          if (!m.projects || m.projects.length === 0) {
            memberErr.projects = "Select at least one project";
            isValid = false;
          }
          roleErr.members[i] = memberErr;
        });
      }

      newErrors[r.id] = roleErr;
    });

    return { newErrors, isValid };
  }





  function resetForm() {
    setYear("");
    setMonth("");
    setResources(buildEmptyResources());
    setOtherResources(buildEmptyOtherResources());
    setErrors({});
    setOtherErrors({});
    setFieldErrors({});
  }

  function closeModal() {
    resetForm();
    setOpen(false);
  }

  async function handleSubmit() {
    const { newErrors: resErrors, isValid: resValid } = validateResourceSection(resources, RESOURCE_ROLES);
    const { newErrors: otherErrors, isValid: otherValid } = validateResourceSection(otherResources, OTHER_RESOURCE_ROLES);

    setErrors(resErrors);
    setOtherErrors(otherErrors); 

    if(!year){
      setFieldErrors(p => ({...p, year:"Year is Required"}))
    }

    if(!month){
      setFieldErrors(p => ({...p, month:"Month is Required"}))
    }

    if (!resValid || !otherValid || !year || !month) {
      return;
    }

    const monthKey = `${month}-${year.slice(2)}`;

    const convertedResources = {};
    Object.keys(resources).forEach(key => {
      convertedResources[key] = {
        ...resources[key],
        members: resources[key].members.map(member => ({
          ...member,
          projects: PROJECT_OPTIONS.filter(p => member.projects.includes(p.id)).map(p => p.name)
        }))
      };
    });

    const convertedOtherResources = {};
    Object.keys(otherResources).forEach(key => {
      convertedOtherResources[key] = {
        ...otherResources[key],
        members: otherResources[key].members.map(member => ({
          ...member,
          projects: PROJECT_OPTIONS.filter(p => member.projects.includes(p.id)).map(p => p.name)
        }))
      };
    });

    const payload = {
      year: year,
      month:  monthKey, 
      resources:convertedResources,
      otherResources:convertedOtherResources,
    };
    if (onSubmit) await onSubmit(payload);
    setSubmitting(false);
    closeModal();
  }





  // ── Styles ─────────────────────────────────────────────────────────────────
  const inp = {
    border: "0.5px solid #ccc",
    borderRadius: 6,
    padding: "6px 10px",
    fontSize: 13,
    width: "100%",
    boxSizing: "border-box",
    outline: "none",
    background: "#fff",
    color: "#222",
  };

  const label = {
    display: "block",
    fontSize: 11,
    color: "#666",
    marginBottom: 4,
    fontWeight: 500,
  };

  const errStyle = { fontSize: 10, color: "#c04040", marginTop: 3 };

  const thStyle = {
    padding: "6px 8px",
    background: catColor,
    color: "#fff",
    fontSize: 11,
    fontWeight: 600,
    textAlign: "center",
    border: "0.5px solid rgba(255,255,255,0.2)",
  };

  const tdStyle = {
    padding: "5px 6px",
    border: "0.5px solid #e0e0e0",
    fontSize: 12,
    background: "#fff",
  };

    const lbl = {
    display: "block",
    fontSize: 11,
    color: "#666",
    marginBottom: 4,
    fontWeight: 500,
  };
 
  const errTxt = { fontSize: 10, color: "#c04040", marginTop: 3 };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          background: catColor,
          color: "#fff",
          border: "none",
          borderRadius: 6,
          padding: "6px 16px",
          fontSize: 13,
          fontWeight: 500,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Add
      </button>

      {open && (
        <div
          onClick={closeModal}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            // paddingTop: "5vh",
            padding: "2rem",
            overflowY: "auto",
           
          }}
        >
          {/* Modal box — click propagation rok */}
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: 12,
              width: "95%",
              maxWidth: 1200,
              height: "80vh",
              maxHeight: "85vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
              overflow: "hidden",
              flexShrink: 0
            }}
          >
            {/* Header */}
            <div style={{background: catColor,color: "#fff",padding: "14px 20px",display: "flex",alignItems: "center",justifyContent: "space-between",flexShrink: 0}}>
                <div style={{ fontSize: 11, opacity: 0.8, marginTop: 2 }}>Add Data</div>
                <button onClick={closeModal} style={{ background: "none", border: "none", color: "#fff", fontSize: 22, cursor: "pointer", lineHeight: 1 }}>×</button>
            </div>

            {/* Scrollable body */}
            <div style={{ overflowY: "auto", padding: "20px", flex: 1 }}>

              {/* ── Row 1: Year + Month ── */}
              <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                <div style={{ flex: 1 }}>
                  <label style={label}>Year <span style={{ color: "red" }}> *</span></label>
                  <select
                    value={year}
                    onChange={e => { setYear(e.target.value); setFieldErrors(p => ({...p, year: ""})); }}
                    style={inp}
                  >
                    <option value="">-- Select Year --</option>
                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                  {fieldErrors.year && <div style={errStyle}>{fieldErrors.year}</div>}
                </div>

                <div style={{ flex: 1 }}>
                  <label style={label}>Month<span style={{ color: "red" }}> *</span></label>
                  <select
                    value={month}
                    onChange={e => { setMonth(e.target.value); setFieldErrors(p => ({...p, month: ""})); }}
                    style={inp}
                  >
                    <option value="">-- Select Month --</option>
                    {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  {fieldErrors.month && <div style={errStyle}>{fieldErrors.month}</div>}
                </div>
              </div>

              {/* ── Resource Table ── */}
              <div style={{ fontSize: 12, fontWeight: 600, color: "#444", marginBottom: 8 }}>
                Resource Management
              </div>
              <div style={{ border: "0.5px solid #ddd", borderRadius: 8, overflow: "visible" }}>
                
                <table style={{ borderCollapse: "collapse", width: "100%" }}>
                  <thead>
                    <tr>
                      <th style={{ ...thStyle, textAlign: "left", width: "20%" }}>Resource</th>
                      <th style={{ ...thStyle, width: "10%" }}>Count</th>
                      <th style={{ ...thStyle, width: "35%" }}>Comment</th>
                      <th style={{ ...thStyle, width: "35%" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RESOURCE_ROLES.map((r, idx) => (
                      <React.Fragment key={r.id}>

                        {/* ── Original Row: Role | Count | Comment | Action ── */}
                        <tr style={{ background: idx % 2 === 0 ? "#fafafa" : "#fff" }}>
                          <td style={{ ...tdStyle, fontWeight: 500, color: "#333" }}>{r.role}</td>
                          <td style={{ ...tdStyle, padding: "3px 4px" }}>
                            <select
                              value={resources[r.id].count}
                              onChange={e => updateResourceCount(r.id, e.target.value)}
                              style={{
                                ...inp, padding: "4px 6px", fontSize: 12, textAlign: "center",
                                borderColor: errors[r.id]?.count ? "red" : undefined,
                              }}
                            >
                              <option value="">--</option>
                              {COUNT_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                            {errors[r.id]?.count && (<div style={errTxt}>{errors[r.id].count}</div>)}
                          </td>

                          <td style={{ ...tdStyle, padding: "3px 4px" }}>
                            <input
                              type="text"
                              value={resources[r.id].comment}
                              onChange={e => updateResource(r.id, "comment", e.target.value)}
                              style={{ ...inp, padding: "4px 6px", fontSize: 12 }}
                            />
                          </td>

                          <td style={{ ...tdStyle, padding: "3px 4px" }}>
                            <input
                              type="text"
                              value={resources[r.id].action}
                              onChange={e => updateResource(r.id, "action", e.target.value)}
                              style={{ ...inp, padding: "4px 6px", fontSize: 12 }}
                            />
                          </td>
                        </tr>

                        {/* ── Dynamic Sub-Row: Name / UST ID / Project (jitna count utni entries) ── */}
                        {resources[r.id].members.length > 0 && (
                          <tr>
                            <td colSpan={4} style={{ padding: "6px 10px 12px 24px", background: "#f5f8fc" }}>
                              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {resources[r.id].members.map((m, i) => {
                                  const mErr = errors[r.id]?.members?.[i] || {};
                                  return (
                                    <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                                      <span style={{ fontSize: 11, color: "#888", width: 18, marginTop: 6 }}>{i + 1}.</span>

                                      <div style={{ flex: 1 }}>
                                        <SearchableSingleSelect
                                          options={nameOptions}
                                          value={m.id}
                                          onChange={val => updateResourceMember(r.id, i, "name", val)}
                                          hasError={!!mErr.name}
                                        />
                                        {mErr.name && <div style={errTxt}>{mErr.name}</div>}
                                      </div>

                                      <div style={{ flex: 1 }}>
                                        <input
                                          type="text"
                                          placeholder="UST ID"
                                          value={m.ustId}
                                          readOnly
                                          style={{...inp, padding: "4px 6px", fontSize: 12, background: "#f0f0f0", borderColor: mErr.ustId ? "red" : undefined }}
                                        />
                                        {mErr.ustId && <div style={errTxt}>{mErr.ustId}</div>}
                                      </div>

                                      <div style={{ flex: 1 }}>
                                        <SearchableMultiSelect
                                          options={PROJECT_OPTIONS}
                                          selected={m.projects}
                                          onChange={vals => updateResourceMember(r.id, i, "projects", vals)}
                                          catcolor = {catColor}
                                        />
                                        {mErr.projects && <div style={errTxt}>{mErr.projects}</div>}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ── Other Resources ── */}
              <div style={{ fontSize: 12, fontWeight: 600, color: "#444", marginBottom: 8 }}>Other Resource</div>
              <div style={{ border: "0.5px solid #ddd", borderRadius: 8, overflow: "visible" }}>
                <table style={{ borderCollapse: "collapse", width: "100%" }}>
                  <thead>
                    <tr>
                      <th style={{ ...thStyle, textAlign: "left", width: "20%" }}>Resource</th>
                      <th style={{ ...thStyle, width: "10%" }}>Count</th>
                      <th style={{ ...thStyle, width: "35%" }}>Comment</th>
                      <th style={{ ...thStyle, width: "35%" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>

                     {OTHER_RESOURCE_ROLES.map((r, idx) => (
                      <React.Fragment key={r.id}>

                        {/* ── Original Row: Role | Count | Comment | Action ── */}
                        <tr style={{ background: idx % 2 === 0 ? "#fafafa" : "#fff" }}>
                          <td style={{ ...tdStyle, fontWeight: 500, color: "#333" }}>{r.role}</td>

                          <td style={{ ...tdStyle, padding: "3px 4px" }}>
                          <input
                            value={otherResources[r.id].count}
                            onChange={e => updateOtherResourceCount(r.id, e.target.value)}
                            type="number"
                            min={0}
                            style={{
                              ...inp,
                              padding: "4px 6px",
                              fontSize: 12,
                              textAlign: "center",
                              borderColor: otherErrors[r.id]?.count ? "red" : undefined,
                            }}
                          />
                          {otherErrors[r.id]?.count && (<div style={errTxt}>{otherErrors[r.id].count}</div>)}
                        </td>

                          <td style={{ ...tdStyle, padding: "3px 4px" }}>
                            <input
                              type="text"
                              value={otherResources[r.id].comment}
                              onChange={e => updateOtherResource(r.id, "comment", e.target.value)}
                              style={{ ...inp, padding: "4px 6px", fontSize: 12 }}
                            />
                          </td>

                          <td style={{ ...tdStyle, padding: "3px 4px" }}>
                            <input
                              type="text"
                              value={otherResources[r.id].action}
                              onChange={e => updateOtherResource(r.id, "action", e.target.value)}
                              style={{ ...inp, padding: "4px 6px", fontSize: 12 }}
                            />
                          </td>
                        </tr>

                        {/* ── Dynamic Sub-Row: Name / UST ID / Project (jitna count utni entries) ── */}
                        {otherResources[r.id].members.length > 0 && (
                          <tr>
                            <td colSpan={4} style={{ padding: "6px 10px 12px 24px", background: "#f5f8fc" }}>
                              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {otherResources[r.id].members.map((m, i) => {
                                  const mErr = errors[r.id]?.members?.[i] || {};
                                  return (
                                    <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                                      <span style={{ fontSize: 11, color: "#888", width: 18, marginTop: 6 }}>{i + 1}.</span>

                                      <div style={{ flex: 1 }}>
                                        <SearchableSingleSelect
                                          options={nameOptions}
                                          value={m.id}
                                          onChange={val => updateOtherResourceMember(r.id, i, "name", val)}
                                          hasError={!!mErr.name}
                                        />
                                        {mErr.name && <div style={errTxt}>{mErr.name}</div>}
                                      </div>

                                      <div style={{ flex: 1 }}>
                                        <input
                                          type="text"
                                          placeholder="UST ID"
                                          value={m.ustId}
                                          readOnly
                                          style={{...inp, padding: "4px 6px", fontSize: 12, background: "#f0f0f0", borderColor: mErr.ustId ? "red" : undefined }}
                                        />
                                        {mErr.ustId && <div style={errTxt}>{mErr.ustId}</div>}
                                      </div>

                                      <div style={{ flex: 1 }}>
                                        <SearchableMultiSelect
                                          options={PROJECT_OPTIONS}
                                          selected={m.projects}
                                          onChange={vals => updateOtherResourceMember(r.id, i, "projects", vals)}
                                          catcolor = {catColor}
                                        />
                                        {mErr.projects && <div style={errTxt}>{mErr.projects}</div>}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div style={{
              padding: "14px 20px",
              borderTop: "0.5px solid #eee",
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
              flexShrink: 0,
              background: "#fafafa",
            }}>
              <button
                onClick={closeModal}
                style={{
                  padding: "7px 20px", borderRadius: 6, border: "0.5px solid #ccc",
                  background: "#fff", fontSize: 13, cursor: "pointer", color: "#555",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                  padding: "7px 24px", borderRadius: 6, border: "none",
                  background: submitting ? "#aaa" : catColor,
                  color: "#fff", fontSize: 13, fontWeight: 500,
                  cursor: submitting ? "not-allowed" : "pointer",
                }}
              >
                {submitting ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddMonthDataModal;