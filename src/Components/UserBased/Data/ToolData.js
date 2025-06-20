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
import CalendarIcon from '@rsuite/icons/Calendar';
import PageIcon from '@rsuite/icons/Page';
import ThreeColumnsIcon from '@rsuite/icons/ThreeColumns';
import RelatedMapIcon from '@rsuite/icons/RelatedMap';
import CombinationIcon from '@rsuite/icons/Combination';
import TimeIcon from '@rsuite/icons/Time';
import SingleSourceIcon from '@rsuite/icons/SingleSource';
import BlockIcon from '@rsuite/icons/Block';
import TreeIcon from '@rsuite/icons/Tree';
import ParagraphIcon from '@rsuite/icons/Paragraph';
import NoticeIcon from '@rsuite/icons/Notice';
import ModelIcon from '@rsuite/icons/Model';
import CharacterLockIcon from '@rsuite/icons/CharacterLock';

import { groupBy } from 'lodash';

// const userType =  ['admin','quality','central','soft_at','circle']

const ToolData = [
    {
        id: 0,
        name: 'TREND',
        title: 'This is a trend tool',
        icons: TrendIcon,
        link: '/trends',
        groupBy:['quality','admin','quality-s']
    },
    // {
    //     id: 1,
    //     name: 'DPR',
    //     title: 'This is a DPR tool',
    //     icons: DetailIcon,
    //     link: '/tools/dpr',
    //     groupBy:['central','admin']
    // },
    // {
    //     id: 2,
    //     name: 'VENDOR',
    //     title: 'This is a Vendor tool',
    //     icons: PeopleBranchIcon,
    //     link: '/tools/vendor',
    //     groupBy:['central','admin']
    // },
    // {
    //     id: 3,
    //     name: 'PHYSICAL AT',
    //     title: 'This is a PHYSICAL AT tool',
    //     icons: CellTowerIcon,
    //     link: '/tools/physical_at',
    //     groupBy:['central','admin']

    // },
    {
        id: 4,
        name: 'SOFT AT',
        title: 'This is a SOFT AT tool',
        icons: PcIcon,
        link: '/tools/soft_at',
        groupBy:['soft_at_team','admin']
    },

    {
        id: 5,
        name: 'SOFT AT Tracking',
        title: 'This is a SOFT AT tool',
        icons: PcIcon,
        link: '/tools/soft_at_rejection',
        groupBy:['soft_at_team','admin']
    },

    // {
    //     id: 6,
    //     name: 'PERFORMANCE AT',
    //     title: 'This is a PERFORMANCE AT tool',
    //     icons: WavePointIcon,
    //     link: '/tools/performance_at',
    //     groupBy:['quality','admin','quality-s']
    // },
    // {
    //     id: 7,
    //     name: 'WPR',
    //     title: 'This is a WPR tool',
    //     icons: FunnelStepsIcon,
    //     link:'/tools/wpr',
    //     groupBy:['quality','admin','quality-s']
    // },
    {
        id: 8,
        name: 'MDP',
        title: 'This is a MDP tool',
        icons: CalendarIcon,
        link: '/tools/mdp',
        groupBy:['central','circle','admin']
    },
    // {
    //     id: 9,
    //     name: 'INVENTORY',
    //     title: 'This is a Inventory tool',
    //     icons: ThreeColumnsIcon,
    //     link: '/tools/inventory',
    //     groupBy:['central','circle','admin']
    // },
    {
        id: 10,
        name: 'Mcom Scripting',
        title: 'This is a Mcom Scripting tool',
        icons: PageIcon,
        link: '/tools/mcom-scripting',
        groupBy:['central','circle','admin']
    },

    {
        id: 11,
        name: 'AUDIT',
        title: 'This is a AUDIT tool',
        icons: DocPassIcon,
        link: '/tools/audit',
        groupBy:['quality','admin','quality-s']

    },
    {
        id: 12,
        name: 'IX Tracker',
        title: 'This is a IX Tracker Tool',
        icons: DocPassIcon,
        link: '/tools/Integration',
        groupBy:['soft_at_team','admin','IX']

    },

    {
        id: 14,
        name: 'FILE MERGE',
        title: 'This is a file merge tool<',
        icons: SingleSourceIcon,
        link: '/tools/file_merge',
        groupBy:['admin','quality','quality-s']
    },
    {
        id: 15,
        name: 'SCHEDULER',
        title: 'This is a SCHEDULER tool',
        icons: TimeIcon,
        link: '/tools/schedular',
        groupBy:['admin']
    },
    // {
    //     id: 18,
    //     name: 'UBR Soft-At Tracker',
    //     title: '',
    //     icons: BlockIcon,
    //     link: '/tools/UBR_soft_at_Tracker',
    //     groupBy:['admin']
    // },
    // {
    //     id: 19,
    //     name: 'Zero RNA Payload',
    //     title: 'This is a Zero RNA Payload',
    //     icons: CombinationIcon,
    //     link:  '/tools/zero_RNA_payload',
    //     groupBy:['admin']

    // },
    {
        id: 20,
        name: 'CATS Tracker',
        title: 'This is a CATS Tracker',
        icons: RelatedMapIcon,
        link:  '/tools/cats_tracker',
        groupBy:['quality','admin','quality-s']

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
        name: 'RCA Genie',
        title: 'This is a RCA Tool',
        icons: TreeIcon,
        link:  '/tools/rca',
        groupBy:['quality','admin','quality-s']
    },
    {
        id: 23,
        name: 'IX Tracker',
        title: 'This is a IX Tracker Tool',
        icons: DocPassIcon,
        link: '/tools/IX_Tracker',
        groupBy:['quality','IX_reader','quality-s']

    }
    ,
    {
        id: 24,
        name: 'Mcom Physical AT',
        title: 'This is a IX Tracker Tool',
        icons: CellTowerIcon,
        link: '/tools/mcom_physical_at',
        groupBy:['soft_at_team', 'admin']

    },{
        id: 25,
        name: 'NOM Scriptor',
        title: 'This is a IX Tracker Tool',
        icons: ParagraphIcon,
        link: '/tools/nomenclature_scriptor',
        groupBy:['soft_at_team', 'admin']

    },
    ,{
        id: 26,
        name: 'DSA',
        title: 'This is a DMA Tool',
        icons: NoticeIcon,
        link: '/tools/dma',
        groupBy:['soft_at_team', 'admin']
    }
    ,{
        id: 27,
        name: 'MNIT',
        title: 'This is a MNI Tool',
        icons: ModelIcon,
        link: '/tools/mobile_network_integration',
        groupBy:['admin']
    } ,{
        id: 27,
        name: 'LKF Status',
        title: 'This is a LKF Status Tool',
        icons: CharacterLockIcon,
        link: '/tools/lkf_status',
        groupBy:['admin']
    }




]



export default ToolData