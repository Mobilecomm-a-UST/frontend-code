import React, { useState } from 'react';
import './Milestone.css'; // Add CSS file
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';



// Your milestone list
const milestones = [
    { title: "Allocation", dateKey: "allocation_date" },
    { title: "RFAI", dateKey: "rfai_date" },
    { title: "RFAI Survey", dateKey: "rfai_survey_date" },
    { title: "NWRFAI To WRFAI", dateKey: "nwrfai_to_wrfai_date" },
    { title: "MO Punch", dateKey: "mo_punch_date" },
    { title: "Material Dispatch", dateKey: "material_dispatch_date" },
    { title: "Material Delivered", dateKey: "material_delivered_date" },
    { title: "Installation End", dateKey: "installation_end_date" },
    { title: "Integration", dateKey: "integration_date" },
    { title: "EMF Submission", dateKey: "emf_submission_date" },
    { title: "Alarm Rectification Done", dateKey: "alarm_rectification_done_date" },
    { title: "SCFT I-Deploy Offered", dateKey: "scft_i_deploy_offered_date" },
    { title: "RAN PAT Offer", dateKey: "ran_pat_offer_date" },
    { title: "RAN SAT Offer", dateKey: "ran_sat_offer_date" },
    // { title: "MW PAT Offer", dateKey: "mw_pat_offer_date" },
    // { title: "MW SAT Offer", dateKey: "mw_sat_offer_date" },
    { title: "Site ONAIR", dateKey: "site_onair_date" },
    { title: "I-Deploy ONAIR", dateKey: "i_deploy_onair_date" }
];

const ShowMilestone = (props) => {
    const { mileston, onMilestoneClick, issueCount ,getMilestone} = props;
    const [activeMilestone, setActiveMilestone] = useState(null);

    console.log('issue count in show milestone', issueCount);


    const handleClick = (item) => {
        // setActiveMilestone(item.title);
        onMilestoneClick(item.title);
    };

    return (
        <>
            <ol className="timeline">
                {milestones?.map((item, index) => (
                    <li
                        key={index}
                        className={`timeline-item ${getMilestone === item.title ? "active" : ""}`}
                        onClick={() => handleClick(item)}>
                        <div className="timeline-circle" />
                        <div className="timeline-content" >
                            <h4>{item.title}</h4>
                            {/* <p style={{display:'flex',alignContent:'center'}}>
                                {mileston?.[0]?.[item.dateKey] || "—"} <FiberManualRecordIcon size='small' color='error'/>{issueCount?.[item.title]?.open || 0} <FiberManualRecordIcon size='small' color='success'/>{issueCount?.[item.title]?.close || 0}</p> */}
                            <div className="milestone-meta">
                                <span className="milestone-date">
                                    {mileston?.[0]?.[item.dateKey] || "—"}
                                </span>

                                <span className="milestone-issues">
                                    <span className="issue open" title='Open Issues'>
                                        <FiberManualRecordIcon fontSize="small" />
                                        {issueCount?.[item.title]?.open || 0}
                                    </span>

                                    <span className="issue close" title='Closed Issues'>
                                        <FiberManualRecordIcon fontSize="small" />
                                        {issueCount?.[item.title]?.closed || 0}
                                    </span>
                                </span>
                            </div>
                        </div>
                    </li>
                ))}
            </ol>
        </>
    );
};

export default React.memo(ShowMilestone);
