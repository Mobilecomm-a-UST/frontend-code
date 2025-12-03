import React from 'react';
import './Milestone.css'; // Add CSS file

const tempData = {
    allocation_date: "07-Nov-25",
    rfai_date: "07-Nov-25",
    rfai_survey_date: "08-Nov-25",
    mo_punch_date: "13-Nov-25",
    material_dispatch_date: "14-Nov-25",
    material_delivered_date: "15-Nov-25",
    installation_end_date: "16-Nov-25",
    integration_date: "25-Nov-25",
    emf_submission_date: "25-Nov-25",
    alarm_rectification_done_date: "26-Nov-25",
    scft_i_deploy_offered_date: "25-Nov-25",
    ran_pat_offer_date: "25-Nov-25",
    ran_sat_offer_date: "25-Nov-25",
    mw_pat_offer_date: "",
    mw_sat_offer_date: "",
    site_onair_date: "25-Nov-25",
    i_deploy_onair_date: "25-Nov-25"
};

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
    const {mileston} = props;
    console.log('show mileston', mileston)
    return (
        <>
            <ol className="timeline">
                {milestones.map((item, index) => (
                    <li className="timeline-item" key={index}>
                        <div className="timeline-circle" />
                        <div className="timeline-content">
                            <h4>{item.title}</h4>
                            <p>{tempData[item.dateKey] || "—"}</p>
                        </div>
                    </li>
                ))}
            </ol>
        </>
    );
};

export default ShowMilestone;
