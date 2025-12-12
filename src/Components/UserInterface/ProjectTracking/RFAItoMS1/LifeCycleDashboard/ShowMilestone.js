import React from 'react';
import './Milestone.css'; // Add CSS file



// Your milestone list
const milestones = [
    { title: "Allocation", dateKey: "allocation_date" },
    { title: "RFAI", dateKey: "rfai_date" },
    { title: "RFAI Survey", dateKey: "rfai_survey_date" },
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
    { title: "MW PAT Offer", dateKey: "mw_pat_offer_date" },
    { title: "MW SAT Offer", dateKey: "mw_sat_offer_date" },
    { title: "Site ONAIR", dateKey: "site_onair_date" },
    { title: "I-Deploy ONAIR", dateKey: "i_deploy_onair_date" }
];

const ShowMilestone = (props) => {
    const {mileston,onMilestoneClick} = props;

    return (
        <>
            <ol className="timeline">
                {milestones.map((item, index) => (
                    <li className="timeline-item" key={index} onClick={() => onMilestoneClick(item.title)}>
                        <div className="timeline-circle" />
                        <div className="timeline-content">
                            <h4>{item.title}</h4>
                            <p>{mileston?.[0]?.[item.dateKey] || "—"}</p>
                        </div>
                    </li>
                ))}
            </ol>
        </>
    );
};

export default ShowMilestone;
