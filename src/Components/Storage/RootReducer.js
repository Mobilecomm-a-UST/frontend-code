import { act } from "@testing-library/react"


const initialState={
    datetime:{},
    mapastatus:{},
    dprreport:{},
    prepostreport:{},
    linkpage:{},
    makekpitrend:{},
    ageingSiteList:{},
}

export default function RootReducer(state=initialState,actions)
{
    switch(actions.type)
    {
        case 'ADD_DATES':
            state.datetime=actions.payload
            return({datetime:state.datetime})

        case 'MAPA_STATUS':
            state.mapastatus=actions.payload
            return({mapastatus:state.mapastatus})

        case 'DPR_REPORT':
            state.dprreport=actions.payload
            return({dprreport:state.dprreport})

        case 'PRE_POST_REPORT':
            state.prepostreport=actions.payload
            return({prepostreport:state.prepostreport})

        case 'LINK_PAGES':
            state.linkpage=actions.payload
            return({linkpage:state.linkpage})

        case 'MAKE_KPI':
            state.makekpitrend=actions.payload
            return({makekpitrend:state.makekpitrend})
            
        case 'SITE_LIST':
            state.ageingsitelist=actions.payload
            return({ageingsitelist:state.ageingsitelist})

        default:
            return state
    }
}