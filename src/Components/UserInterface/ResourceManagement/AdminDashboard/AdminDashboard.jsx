

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";

import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
);

const MONTHS = [
    "Jan-26",
    "Feb-26",
    "Mar-26",
    "Apr-26",
    "May-26",
    "Jun-26",
    "Jul-26",
    "Aug-26",
    "Sep-26",
    "Oct-26",
    "Nov-26",
    "Dec-26",
];

export default function Analytics() {

    const [month, setMonth] = useState("Jun-26");

    const [loading, setLoading] = useState(false);

    const [records, setRecords] = useState([]);

    useEffect(() => {

        loadData();

    }, [month]);

    async function loadData() {

        try {

            setLoading(true);

            const res = await axios.get(
                `https://commtoolapi.mcpspmis.com/graph-report/?month=${month}`
            );

            setRecords(res.data);

        }

        catch (err) {

            console.log(err);

        }

        finally {

            setLoading(false);

        }

    }

    const tableData = useMemo(() => {

        return records.map(item => {

            const revenue = Number(item.costs?.c1 || 0);

            const resource = Number(item.costs?.c2 || 0);

            const vendor = Number(item.costs?.c3 || 0);

            const expense = Number(item.costs?.c4 || 0);

            const fixed = Number(item.costs?.c5 || 0);

            const totalCost =
                resource +
                vendor +
                expense +
                fixed;

            const gp =
                revenue -
                totalCost;

            const gpPercent =
                revenue === 0
                    ? 0
                    : (gp / revenue) * 100;

            return {

                circle: item.circle,

                customer: item.customer,

                costCenter: item.costCenter,

                revenue,

                resource,

                vendor,

                expense,

                fixed,

                totalCost,

                gp,

                gpPercent,

            };

        });

    }, [records]);



    const totalRevenue =
        tableData.reduce(
            (a, b) => a + b.revenue,
            0
        );

    const totalCost =
        tableData.reduce(
            (a, b) => a + b.totalCost,
            0
        );

    const totalGP =
        tableData.reduce(
            (a, b) => a + b.gp,
            0
        );

    const totalGPPercent =
        totalRevenue === 0
            ? 0
            : (totalGP / totalRevenue) * 100;



    function formatAmount(value) {

        return Number(value || 0).toLocaleString("en-IN", {

            maximumFractionDigits: 0,

        });

    }



    function getStatus(percent) {

        if (percent >= 35)

            return {

                text: "Excellent",

                bg: "#d4edda",

                color: "#155724",

            };

        if (percent >= 30)

            return {

                text: "Good",

                bg: "#d1ecf1",

                color: "#0c5460",

            };

        if (percent >= 10)

            return {

                text: "Average",

                bg: "#fff3cd",

                color: "#856404",

            };

        return {

            text: "Critical",

            bg: "#f8d7da",

            color: "#721c24",

        };

    }



    const topCircle =
        [...tableData]
            .sort((a, b) => b.gpPercent - a.gpPercent)[0];



    const lowestCircle =
        [...tableData]
            .sort((a, b) => a.gpPercent - b.gpPercent)[0];


    const labels = tableData.map(x => x.circle);

const revenueChart = {

    labels,

    datasets: [

        {

            label: "Revenue",

            data: tableData.map(x => x.revenue),

            backgroundColor: "#42a5f5"

        },

        {

            label: "Total Cost",

            data: tableData.map(x => x.totalCost),

            backgroundColor: "#ef5350"

        }

    ]

};



const gpChart = {

    labels,

    datasets: [

        {

            label: "GP %",

            data: tableData.map(x => x.gpPercent),

            backgroundColor: "#43a047"

        }

    ]

};



const rankingChart = {

    labels: [...tableData]

        .sort((a,b)=>b.revenue-a.revenue)

        .map(x=>x.circle),

    datasets:[

        {

            label:"Revenue",

            data:[...tableData]

                .sort((a,b)=>b.revenue-a.revenue)

                .map(x=>x.revenue),

            backgroundColor:"#1976d2"

        }

    ]

};



const costDistribution={

labels:[

"Resource Salary",

"Vendor",

"Expense",

"Fixed"

],

datasets:[

{

data:[

tableData.reduce((a,b)=>a+b.resource,0),

tableData.reduce((a,b)=>a+b.vendor,0),

tableData.reduce((a,b)=>a+b.expense,0),

tableData.reduce((a,b)=>a+b.fixed,0),

],

backgroundColor:[

"#42a5f5",

"#66bb6a",

"#ffa726",

"#ab47bc"

]

}

]

};


    const th={
        padding:12,
        fontSize:13,
        borderBottom:"1px solid #ddd",
        textAlign:"center"
        };

    const td={
        padding:12,
        fontSize:13,
        textAlign:"center",
        borderBottom:"1px solid #eee"
    };

    const tfoot={
        padding:12,
        fontSize:13,
        textAlign:"center"
    };

    const barOptions={

responsive:true,

plugins:{

legend:{position:"top"}

}

};



const gpOptions={

responsive:true,

plugins:{

legend:{display:false}

},

scales:{

y:{

beginAtZero:true,

max:100

}

}

};



const doughnutOptions={

responsive:true,

plugins:{

legend:{

position:"bottom"

}

}

};



const rankingOptions={

responsive:true,

indexAxis:"y",

plugins:{

legend:{

display:false

}

}

};


const revenueShareChart = {

labels:tableData.map(x=>x.circle),

datasets:[

{

data:tableData.map(x=>x.revenue),

backgroundColor:[

"#42A5F5",
"#66BB6A",
"#FFA726",
"#EF5350",
"#AB47BC",
"#26C6DA",
"#7E57C2",
"#FF7043",
"#9CCC65",
"#EC407A",
"#29B6F6",
"#8D6E63"

]

}

]

};

const stackedChart={

labels:tableData.map(x=>x.circle),

datasets:[

{

label:"Salary",

data:tableData.map(x=>x.resource),

backgroundColor:"#42A5F5"

},

{

label:"Vendor",

data:tableData.map(x=>x.vendor),

backgroundColor:"#EF5350"

},

{

label:"Expense",

data:tableData.map(x=>x.expense),

backgroundColor:"#FFA726"

},

{

label:"Fixed",

data:tableData.map(x=>x.fixed),

backgroundColor:"#66BB6A"

}

]

};

const stackedOptions={

responsive:true,

plugins:{

legend:{position:"top"}

},

scales:{

x:{stacked:true},

y:{stacked:true}

}

};

const topRevenue=[...tableData]

.sort((a,b)=>b.revenue-a.revenue)

.slice(0,5);

// ================= Executive Summary =================

const highestRevenue = [...tableData].sort((a, b) => b.revenue - a.revenue)[0];

const highestGP = [...tableData].sort((a, b) => b.gpPercent - a.gpPercent)[0];

const lowestGP = [...tableData].sort((a, b) => a.gpPercent - b.gpPercent)[0];

const highestExpense = [...tableData].sort((a, b) => b.expense - a.expense)[0];

const alertCircles = tableData.filter(x => x.gpPercent < 20);

const healthyCircles = tableData.filter(x => x.gpPercent >= 30);

const totalVendor =
    tableData.reduce((a, b) => a + b.vendor, 0);

const totalSalary =
    tableData.reduce((a, b) => a + b.resource, 0);

const vendorPercent =
    ((totalVendor / totalCost) * 100).toFixed(1);

const salaryPercent =
    ((totalSalary / totalCost) * 100).toFixed(1);

return (

<div
style={{
padding:25,
background:"#f4f7fb",
minHeight:"100vh"
}}
>

<div
style={{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
marginBottom:25
}}
>

<div>

<h2
style={{
margin:0,
color:"#17406d"
}}
>
Analytics Dashboard
</h2>

<div
style={{
fontSize:13,
color:"#777"
}}
>
Circle Performance Analytics
</div>

</div>

<select

value={month}

onChange={(e)=>setMonth(e.target.value)}

style={{
padding:"8px 14px",
borderRadius:8,
border:"1px solid #ddd",
fontSize:13
}}

>

{

MONTHS.map(m=>

<option
key={m}
value={m}
>

{m}

</option>

)

}

</select>

</div>

{

loading ?

<div
style={{
padding:80,
textAlign:"center",
fontSize:20
}}
>

Loading...

</div>

:

<>
    {/* ================= KPI Cards ================= */}

    <div
        style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 20,
            marginBottom: 30,
        }}
    >

        <div
            style={{
                background: "#fff",
                borderRadius: 12,
                padding: 20,
                boxShadow: "0 2px 8px rgba(0,0,0,.08)",
            }}
        >
            <div style={{ color: "#777", fontSize: 13 }}>
                Total Revenue
            </div>

            <div
                style={{
                    fontSize: 28,
                    fontWeight: 700,
                    color: "#1976d2",
                    marginTop: 8,
                }}
            >
                ₹ {formatAmount(totalRevenue)}
            </div>
        </div>

        <div
            style={{
                background: "#fff",
                borderRadius: 12,
                padding: 20,
                boxShadow: "0 2px 8px rgba(0,0,0,.08)",
            }}
        >
            <div style={{ color: "#777", fontSize: 13 }}>
                Total Cost
            </div>

            <div
                style={{
                    fontSize: 28,
                    fontWeight: 700,
                    color: "#ef5350",
                    marginTop: 8,
                }}
            >
                ₹ {formatAmount(totalCost)}
            </div>
        </div>

        <div
            style={{
                background: "#fff",
                borderRadius: 12,
                padding: 20,
                boxShadow: "0 2px 8px rgba(0,0,0,.08)",
            }}
        >
            <div style={{ color: "#777", fontSize: 13 }}>
                Gross Profit
            </div>

            <div
                style={{
                    fontSize: 28,
                    fontWeight: 700,
                    color: "#43a047",
                    marginTop: 8,
                }}
            >
                ₹ {formatAmount(totalGP)}
            </div>
        </div>

        <div
            style={{
                background: getStatus(totalGPPercent).bg,
                borderRadius: 12,
                padding: 20,
                boxShadow: "0 2px 8px rgba(0,0,0,.08)",
            }}
        >
            <div style={{ color: "#777", fontSize: 13 }}>
                GP %
            </div>

            <div
                style={{
                    fontSize: 28,
                    fontWeight: 700,
                    color: getStatus(totalGPPercent).color,
                    marginTop: 8,
                }}
            >
                {totalGPPercent.toFixed(2)}%
            </div>

            <div
                style={{
                    marginTop: 10,
                    display: "inline-block",
                    padding: "4px 10px",
                    borderRadius: 20,
                    background: getStatus(totalGPPercent).color,
                    color: "#fff",
                    fontSize: 12,
                }}
            >
                {getStatus(totalGPPercent).text}
            </div>

        </div>

    </div>





    {/* ================= Table ================= */}

    <div
        style={{
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(0,0,0,.08)",
            overflow: "hidden",
            marginBottom: 30,
        }}
    >

        <div
            style={{
                padding: 18,
                fontWeight: 700,
                fontSize: 18,
                background: "#17406d",
                color: "#fff",
            }}
        >
            Circle Performance
        </div>

        <table
            style={{
                width: "100%",
                borderCollapse: "collapse",
            }}
        >

            <thead>

                <tr
                    style={{
                        background: "#edf3fa",
                    }}
                >

                    <th style={th}>Circle</th>

                    <th style={th}>Revenue</th>

                    <th style={th}>Total Cost</th>

                    <th style={th}>Gross Profit</th>

                    <th style={th}>GP %</th>

                    <th style={th}>Status</th>

                </tr>

            </thead>

            <tbody>

                {

                    tableData.map((row,index)=>(

                        <tr
                            key={index}
                            style={{
                                background:index%2===0?"#fff":"#fafafa"
                            }}
                        >

                            <td style={td}>
                                {row.circle}
                            </td>

                            <td style={td}>
                                ₹ {formatAmount(row.revenue)}
                            </td>

                            <td style={td}>
                                ₹ {formatAmount(row.totalCost)}
                            </td>

                            <td style={td}>
                                ₹ {formatAmount(row.gp)}
                            </td>

                            <td
                                style={{
                                    ...td,
                                    fontWeight:700,
                                    color:
                                    row.gpPercent>=30
                                    ?"#2e7d32"
                                    :"#d32f2f"
                                }}
                            >

                                {row.gpPercent.toFixed(2)}%

                            </td>

                            <td style={td}>

                                <span
                                    style={{
                                        padding:"5px 12px",
                                        borderRadius:20,
                                        background:getStatus(row.gpPercent).bg,
                                        color:getStatus(row.gpPercent).color,
                                        fontWeight:600,
                                        fontSize:12
                                    }}
                                >

                                    {

                                        getStatus(row.gpPercent).text

                                    }

                                </span>

                            </td>

                        </tr>

                    ))

                }

            </tbody>

            <tfoot>

                <tr
                    style={{
                        background:"#17406d",
                        color:"#fff",
                        fontWeight:700
                    }}
                >

                    <td style={tfoot}>

                        Total

                    </td>

                    <td style={tfoot}>

                        ₹ {formatAmount(totalRevenue)}

                    </td>

                    <td style={tfoot}>

                        ₹ {formatAmount(totalCost)}

                    </td>

                    <td style={tfoot}>

                        ₹ {formatAmount(totalGP)}

                    </td>

                    <td style={tfoot}>

                        {totalGPPercent.toFixed(2)}%

                    </td>

                    <td style={tfoot}>
                        -
                    </td>

                </tr>

            </tfoot>

        </table>

    </div>

    

    {/* ===================== Charts ===================== */}

    <div
        style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 25,
            marginBottom: 30,
        }}
    >

        {/* Revenue vs Cost */}

        <div
            style={{
                background: "#fff",
                borderRadius: 12,
                padding: 20,
                boxShadow: "0 2px 8px rgba(0,0,0,.08)"
            }}
        >

            <h3
                style={{
                    marginTop: 0,
                    marginBottom: 20,
                    color: "#17406d"
                }}
            >
                Revenue vs Total Cost
            </h3>

            <Bar
                data={revenueChart}
                options={barOptions}
            />

        </div>



        {/* Cost Distribution */}

        <div
            style={{
                background: "#fff",
                borderRadius: 12,
                padding: 20,
                boxShadow: "0 2px 8px rgba(0,0,0,.08)"
            }}
        >

            <h3
                style={{
                    marginTop: 0,
                    marginBottom: 20,
                    color: "#17406d"
                }}
            >
                Cost Distribution
            </h3>

            <Doughnut
                data={costDistribution}
                options={doughnutOptions}
            />

        </div>

    </div>




    <div
        style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 25,
            marginBottom: 30,
        }}
    >

        {/* GP % */}

        <div
            style={{
                background: "#fff",
                borderRadius: 12,
                padding: 20,
                boxShadow: "0 2px 8px rgba(0,0,0,.08)"
            }}
        >

            <h3
                style={{
                    marginTop: 0,
                    marginBottom: 20,
                    color: "#17406d"
                }}
            >
                GP % by Circle
            </h3>

            <Bar
                data={gpChart}
                options={gpOptions}
            />

        </div>




        {/* Revenue Ranking */}

        <div
            style={{
                background: "#fff",
                borderRadius: 12,
                padding: 20,
                boxShadow: "0 2px 8px rgba(0,0,0,.08)"
            }}
        >

            <h3
                style={{
                    marginTop: 0,
                    marginBottom: 20,
                    color: "#17406d"
                }}
            >
                Revenue Ranking
            </h3>

            <Bar
                data={rankingChart}
                options={rankingOptions}
            />

        </div>

    </div>



    {/* ================= Executive Summary ================= */}

<div
    style={{
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
        gap: 20,
        marginBottom: 30
    }}
>

    <SummaryCard
        title="Highest Revenue"
        value={highestRevenue?.circle}
        amount={"₹ " + formatAmount(highestRevenue?.revenue)}
        color="#1976d2"
    />

    <SummaryCard
        title="Highest GP %"
        value={highestGP?.circle}
        amount={highestGP?.gpPercent.toFixed(2) + "%"}
        color="#2e7d32"
    />

    <SummaryCard
        title="Lowest GP %"
        value={lowestGP?.circle}
        amount={lowestGP?.gpPercent.toFixed(2) + "%"}
        color="#d32f2f"
    />

    <SummaryCard
        title="Highest Expense"
        value={highestExpense?.circle}
        amount={"₹ " + formatAmount(highestExpense?.expense)}
        color="#ff9800"
    />

</div>

<div
    style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 20,
        marginBottom: 30
    }}
>

    {/* Alert */}

    <div
        style={{
            background: "#fff3f3",
            borderLeft: "6px solid #d32f2f",
            borderRadius: 10,
            padding: 20
        }}
    >

        <h3
            style={{
                marginTop: 0,
                color: "#d32f2f"
            }}
        >
            ⚠ Attention Required
        </h3>

        {

            alertCircles.length === 0 ?

                <div>All circles are healthy.</div>

                :

                alertCircles.map(c => (

                    <div
                        key={`${c.customer}-${c.circle}`}
                        style={{
                            padding: "6px 0"
                        }}
                    >

                        <b>{c.customer} - {c.circle}</b>

                        {" - GP "}

                        {c.gpPercent.toFixed(2)}%

                    </div>

                ))

        }

    </div>



    {/* Healthy */}

    <div
        style={{
            background: "#edf9ef",
            borderLeft: "6px solid #43a047",
            borderRadius: 10,
            padding: 20
        }}
    >

        <h3
            style={{
                marginTop: 0,
                color: "#2e7d32"
            }}
        >
            ✔ Healthy Circles
        </h3>

        {

            healthyCircles.map(c => (

                <div
                    key={`${c.customer}-${c.circle}`}
                    style={{
                        padding: "6px 0"
                    }}
                >

                    <b>{c.customer} - {c.circle}</b>

                    {" - GP "}

                    {c.gpPercent.toFixed(2)}%

                </div>

            ))

        }

    </div>

</div>


<div
    style={{
        background: "#fff",
        borderRadius: 12,
        padding: 25,
        boxShadow: "0 2px 8px rgba(0,0,0,.08)",
        marginBottom: 30
    }}
>

    <h3
        style={{
            marginTop: 0,
            color: "#17406d"
        }}
    >
        📊 AI Insights
    </h3>

    <ul
        style={{
            lineHeight: 2
        }}
    >

        <li>

            Highest Revenue generated by

            <b> {highestRevenue?.circle}</b>

        </li>

        <li>

            Highest GP achieved by

            <b> {highestGP?.circle}</b>

        </li>

        <li>

            Lowest GP found in

            <b> {lowestGP?.circle}</b>

        </li>

        <li>

            Vendor Cost contributes

            <b> {vendorPercent}%</b>

            of Total Cost.

        </li>

        <li>

            Resource Salary contributes

            <b> {salaryPercent}%</b>

            of Total Cost.

        </li>

        <li>

            Overall GP is

            <b> {totalGPPercent.toFixed(2)}%</b>

        </li>

    </ul>

</div>


{/* Part-5  */}

<div
    style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 20,
        marginBottom: 30,
    }}
>

    <div
        style={{
            background: "#fff",
            padding: 20,
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(0,0,0,.08)"
        }}
    >

        <h3 style={{marginTop:0,color:"#17406d"}}>
            Revenue Share by Circle
        </h3>

        <Doughnut
            data={revenueShareChart}
            options={doughnutOptions}
        />

    </div>

    <div
    style={{
        background:"#fff",
        padding:20,
        borderRadius:12,
        boxShadow:"0 2px 8px rgba(0,0,0,.08)"
    }}
>

<h3 style={{marginTop:0,color:"#17406d"}}>
Cost Breakdown
</h3>

<Bar

data={stackedChart}

options={stackedOptions}

/>

</div>

</div>

<div
style={{
background:"#fff",
padding:20,
borderRadius:12,
boxShadow:"0 2px 8px rgba(0,0,0,.08)",
marginBottom:30
}}
>

<h3
style={{
marginTop:0,
color:"#17406d"
}}
>

🏆 Top Revenue Circles

</h3>

<table
style={{
width:"100%",
borderCollapse:"collapse"
}}
>

<thead>

<tr>

<th style={th}>Rank</th>

<th style={th}>Circle</th>

<th style={th}>Revenue</th>

</tr>

</thead>

<tbody>

{

topRevenue.map((x,index)=>(

<tr key={index}>

<td style={td}>
#{index+1}
</td>

<td style={td}>
{x.circle}
</td>

<td style={td}>
₹ {formatAmount(x.revenue)}
</td>

</tr>

))

}

</tbody>

</table>

</div>

{/* <div
style={{
background:"#f8fbff",
padding:25,
borderRadius:12,
borderLeft:"6px solid #1976d2",
marginBottom:30
}}
>

<h3
style={{
marginTop:0,
color:"#17406d"
}}
>

🎯 Management Recommendations

</h3>

<ul style={{lineHeight:2}}>

{

alertCircles.map(x=>

<li key={x.circle}>

Increase profitability in

<b> {x.circle}</b>

by reducing Vendor Cost or increasing Revenue.

</li>

)

}

<li>

Maintain performance of

<b>{highestRevenue?.circle || "-"}</b>

as benchmark.

</li>

<li>

Review Fixed Cost allocation across circles.

</li>

<li>

Monitor Vendor Cost every month.

</li>

</ul>

</div> */}




</>

}



</div>

);


function SummaryCard({
    title,
    value,
    amount,
    color
}) {

    return (

        <div
            style={{
                background: "#fff",
                borderRadius: 12,
                padding: 20,
                boxShadow: "0 2px 8px rgba(0,0,0,.08)"
            }}
        >

            <div
                style={{
                    color: "#777",
                    fontSize: 13
                }}
            >
                {title}
            </div>

            <div
                style={{
                    fontSize: 24,
                    fontWeight: 700,
                    marginTop: 12,
                    color
                }}
            >
                {value}
            </div>

            <div
                style={{
                    marginTop: 8,
                    fontSize: 16,
                    fontWeight: 600
                }}
            >
                {amount}
            </div>

        </div>

    );

}

}
