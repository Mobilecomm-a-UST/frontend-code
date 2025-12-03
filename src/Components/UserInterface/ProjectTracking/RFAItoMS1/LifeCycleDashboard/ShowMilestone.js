import React from 'react'
import { Steps } from 'rsuite';
import '../../../../../App.css'


const tempData = {
    "Unique ID": "1",
    "circle": "UPE",
    "site_tagging": "Project Console",
    "old_toco_name": "TVIL",
    "old_site_id": "LUK396",
    "new_site_id": "LKO361",
    "new_toco_name": "Indus",
    "sr_number": "R/NN-889140",
    "ran_oem": "Nokia",
    "media_type": "MW",
    "mw_oem": "",
    "relocation_method": "MBB",
    "relocation_type": "Only 4G",
    "old_site_band": "",
    "new_site_band": "G900_L900_L1800_L2300",
    "rfai_date": "07-Nov-25",
    "allocation_date": "07-Nov-25",
    "rfai_survey_date": "08-Nov-25",
    "mo_punch_date": "13-Nov-25",
    "material_dispatch_date": "14-Nov-25",
    "material_delivered_date": "15-Nov-25",
    "installation_start_date": "15-Nov-25",
    "installation_end_date": "16-Nov-25",
    "integration_date": "25-Nov-25",
    "emf_submission_date": "25-Nov-25",
    "ran_lkf_status": "",
    "alarm_status": "OK",
    "alarm_rectification_done_date": "26-Nov-25",
    "scft_done_date": "",
    "scft_i_deploy_offered_date": "25-Nov-25",
    "ran_pat_offer_date": "25-Nov-25",
    "ran_sat_offer_date": "25-Nov-25",
    "mw_plan_id": "",
    "mw_pat_offer_date": "",
    "rsl_value_status": "",
    "enm_status": "",
    "mw_lkf": "",
    "mw_sat_offer_date": "",
    "mw_ms1_mids_date": "",
    "site_onair_date": "25-Nov-25",
    "i_deploy_onair_date": "25-Nov-25",
    "current_status": "On Air Done",
    "detailed_remarks": "",
    "history": "",
    "rfai_rejected_date": "",
    "re_rfai_date": "",
    "pri_start_date": "",
    "pri_close_date": "",
    "pri_history": "S1: 01-Nov-25, C1: 02-Nov-25; S2: 05-Nov-25, C2: 10-Nov-25; S3: 12-Nov-25, C3: 20-Nov-25; S4: 01-Nov-25, C4: 21-Nov-25",
    "pri_count": "4.0",
    "pri_issue_ageing": "20.0",
    "issue": "",
    "issue_start_date": "",
    "issue_close_date": "",
    "issue_history": "fiber: S: 05-Nov-25, C: 10-Dec-25; MW: S: 25-Nov-25, C: 31-Dec-25",
    "other_issue_ageing": "56.0",
    "total_issue_ageing": "60.0",
    "clear_rfai_to_ms1_ageing": "",
    "rfai_to_ms1_ageing": "",
    "ran_pat_accepted_date": "",
    "ran_sat_accepted_date": "",
    "mw_pat_accepted_date": "",
    "mw_sat_accepted_date": "",
    "scft_accepted_date": "",
    "kpi_at_offer_date": "",
    "kpi_at_accepted_date": "",
    "four_g_ms2_date": "",
    "five_g_ms2_date": "",
    "final_ms2_date": "",
    "last_updated_date": "02-Dec-25 10:18:10",
    "last_updated_by": "girraj.singh@mcpsinc.in"
}
const ShowMilestone = () => {
    const [current, setCurrent] = React.useState(10);
    return (
        <>
            <Steps vertical >
                <Steps.Item
                    title="Allocation"
                    description={tempData.allocation_date}
                // icon={<FaShoppingCart size={26} />}
                />
                <Steps.Item
                    title="RFAI"
                    description={tempData.rfai_date}
                // icon={<FaTruck size={26} />}
                />
                <Steps.Item
                    title="RFAI Survey"
                    description={tempData.rfai_survey_date}
                />
                <Steps.Item
                    title="MO Punch"
                    description={tempData.mo_punch_date}
                // icon={<FaCheckCircle size={26} />}
                />
                <Steps.Item
                    title="Material Dispatch"
                    description={tempData.material_dispatch_date}
                // icon={<FaCheckCircle size={26} />}
                />
                <Steps.Item
                    title="Material Delivered"
                    description={tempData.material_delivered_date}
                // icon={<FaCheckCircle size={26} />}
                />
                <Steps.Item
                    title="Installation End"
                    description={tempData.installation_end_date}
                // icon={<FaCheckCircle size={26} />}
                />
                <Steps.Item
                    title="Integration"
                    description={tempData.integration_date}
                // icon={<FaCheckCircle size={26} />}
                />
                <Steps.Item
                    title="EMF Submission"
                    description={tempData.emf_submission_date}
                // icon={<FaCheckCircle size={26} />}
                />
                <Steps.Item
                    title="Alarm Rectification Done"
                    description={tempData.alarm_rectification_done_date}
                // icon={<FaCheckCircle size={26} />}
                />
                <Steps.Item
                    title="SCFT I-Deploy Offered"
                    description={tempData.scft_i_deploy_offered_date}
                // icon={<FaCheckCircle size={26} />}
                />
                <Steps.Item
                    title="RAN PAT Offer"
                    description={tempData.ran_pat_offer_date}
                // icon={<FaCheckCircle size={26} />}
                />
                <Steps.Item
                    title="RAN SAT Offer"
                    description={tempData.ran_sat_offer_date}
                // icon={<FaCheckCircle size={26} />}
                />
                <Steps.Item
                    title="MW PAT Offer"
                    description={tempData.mw_pat_offer_date}
                // icon={<FaCheckCircle size={26} />}
                />
                <Steps.Item
                    title="MW SAT Offer"
                    description={tempData.mw_sat_offer_date}
                // icon={<FaCheckCircle size={26} />}
                />
                <Steps.Item
                    title="Site ONAIR"
                    description={tempData.site_onair_date}
                // icon={<FaCheckCircle size={26} />}
                />
                <Steps.Item
                    title="I-Deploy ONAIR"
                    description={tempData.i_deploy_onair_date}
                // icon={<FaCheckCircle size={26} />}
                />
            </Steps>

            <ol>
                <dt>milestone
                    <li>Date</li>
                </dt> <dt>milestone
                    <li>Date</li>
                </dt> <dt>milestone
                    <li>Date</li>
                </dt> <dt>milestone
                    <li>Date</li>
                </dt> <dt>milestone
                    <li>Date</li>
                </dt> <dt>milestone
                    <li>Date</li>
                </dt> <dt>milestone
                    <li>Date</li>
                </dt>
            </ol>
        </>
    )
}

export default ShowMilestone