import { Title } from 'chart.js'
import React from 'react'
import TrendIcon from '@rsuite/icons/Trend';
import PeopleBranchIcon from '@rsuite/icons/PeopleBranch';
import DetailIcon from '@rsuite/icons/Detail';
import CellTowerIcon from '@mui/icons-material/CellTower';
import FunnelStepsIcon from '@rsuite/icons/FunnelSteps';
import PcIcon from '@rsuite/icons/Pc';
import WavePointIcon from '@rsuite/icons/WavePoint';
import DocPassIcon from '@rsuite/icons/DocPass';
import MoreIcon from '@rsuite/icons/More';
import CalendarIcon from '@rsuite/icons/Calendar';
import PageIcon from '@rsuite/icons/Page';
import ThreeColumnsIcon from '@rsuite/icons/ThreeColumns';
import OperatePeopleIcon from '@rsuite/icons/OperatePeople';
import RelatedMapIcon from '@rsuite/icons/RelatedMap';
import CombinationIcon from '@rsuite/icons/Combination';
import TimeIcon from '@rsuite/icons/Time';
import SingleSourceIcon from '@rsuite/icons/SingleSource';
import BlockIcon from '@rsuite/icons/Block';
import TreeIcon from '@rsuite/icons/Tree';

const ToolData = [
    {
        id: 0,
        name: 'TREND',
        title: 'This is a trend tool',
        icons: TrendIcon,
        link: '/trends',
    },
    {
        id: 1,
        name: 'DPR',
        title: 'This is a DPR tool',
        icons: DetailIcon,
        link: ''
    },
    {
        id: 2,
        name: 'VENDOR',
        title: 'This is a Vendor tool',
        icons: PeopleBranchIcon,
        link: '/tools/vendor'
    },
    {
        id: 3,
        name: 'PHYSICAL AT',
        title: 'This is a PHYSICAL AT tool',
        icons: CellTowerIcon,
        link: '/tools/physical_at'
    },
    {
        id: 4,
        name: 'SOFT AT',
        title: 'This is a SOFT AT tool',
        icons: PcIcon,
        link: '/tools/soft_at'
    },

    {
        id: 5,
        name: 'SOFT AT Tracking',
        title: 'This is a SOFT AT tool',
        icons: PcIcon,
        link: '/tools/soft_at_rejection'
    },

    {
        id: 6,
        name: 'PERFORMANCE AT',
        title: 'This is a PERFORMANCE AT tool',
        icons: WavePointIcon,
        link: '/tools/performance_at'
    },
    {
        id: 7,
        name: 'WPR',
        title: 'This is a WPR tool',
        icons: FunnelStepsIcon,
        link:'/tools/wpr'
    },
    {
        id: 8,
        name: 'MDP',
        title: 'This is a MDP tool',
        icons: CalendarIcon,
        link: '/tools/mdp'
    },
    {
        id: 9,
        name: 'Inventory',
        title: 'This is a Inventory tool',
        icons: ThreeColumnsIcon,
        link: '/tools/inventory'
    },
    {
        id: 10,
        name: 'Mcom Scripting',
        title: 'This is a Mcom Scripting tool',
        icons: PageIcon,
        link: '/tools/mcom-scripting'
    },

    {
        id: 11,
        name: 'AUDIT',
        title: 'This is a AUDIT tool',
        icons: DocPassIcon,
        link: '/tools/audit'
    },
    {
        id: 12,
        name: 'IX Tracker',
        title: 'This is a IX Tracker Tool',
        icons: DocPassIcon,
        link: '/tools/Integration'
    },

    {
        id: 14,
        name: 'FILE MERGE',
        title: 'This is a file merge tool<',
        icons: SingleSourceIcon,
        link: '/tools/file_merge'
    },
    {
        id: 15,
        name: 'SCHEDULER',
        title: 'This is a SCHEDULER tool',
        icons: TimeIcon,
        link: '/tools/schedular'
    },
    {
        id: 18,
        name: 'UBR Soft-At Tracker',
        title: '',
        icons: BlockIcon,
        link: '/tools/UBR_soft_at_Tracker'
    },
    {
        id: 19,
        name: 'Zero RNA Payload',
        title: 'This is a Zero RNA Payload',
        icons: CombinationIcon,
        link:  '/tools/zero_RNA_payload'

    },
    {
        id: 20,
        name: 'CATS Tracker',
        title: 'This is a CATS Tracker',
        icons: RelatedMapIcon,
        link:  '/tools/cats_tracker'

    },
    // {
    //     id: 21,
    //     name: 'Circle Inputs',
    //     title: 'This is a Circle Inputs',
    //     icons: OperatePeopleIcon,
    //     link:  '/tools/circle_inputs'
    // },
    {
        id: 22,
        name: 'RCA Tool',
        title: 'This is a RCA Tool',
        icons: TreeIcon,
        link:  '/tools/rca'
    }



]



export default ToolData