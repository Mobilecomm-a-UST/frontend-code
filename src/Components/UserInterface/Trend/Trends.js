import React,{useEffect, useState} from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TrendState from './TrendState'
import Trend from './TMCH/Trend'
import RJTrend from './RJ/RJTrend'
import APTrend from './AP/APTrend'
import BRTrend from './BR/BRTrend'
import HRTrend from './HR/HRTrend'
import ORTrend from './OR/ORTrend'
import WBKOL_Trend from './WB_KOL/WBKOL_Trend'
import PBTrend from './PB/PBTrend';
import MPTrend from './MP/MPTrend';
import DLTrend from './DL/DLTrend';
import JKTrend from './JK/JKTrend';
import KTKTrend from './KTK/KTKTrend';
import UPWTrend from './UPW/UPWTrend';
import MUMTrend from './MUM/MUMTrend';
import UPETrend from './UPE/UPETrend';


function Trends() {
    const [states, setStates] = useState(70)


 useEffect(()=>{
  document.title=`${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/',' | ').toUpperCase()}`
 },[])

    return (
        <>
        <head>
      <title>
      {window.location.pathname.slice(1).replaceAll('_',' ')}
      </title>
    </head>
            {/* <div style={{position:'static'}}><Home /></div> */}
          <div style={{marginTop:'60px'}}>
            <Routes>
                <Route element={<TrendState />} path="/*" />
                <Route element={<Trend />} path="/tn_ch/*" />
                <Route element={<RJTrend />} path="/rj/*" />
                <Route element={<APTrend />} path="/ap/*" />
                <Route element={<BRTrend />} path="/br/*" />
                <Route element={<HRTrend />} path="/hr/*" />
                <Route element={<ORTrend />} path="/or/*" />
                <Route element={<PBTrend/>} path="/pb/*" />
                <Route element={<WBKOL_Trend/>} path="/wb_kol/*"/>
                <Route element={<MPTrend/>} path="/mp/*"/>
                <Route element={<DLTrend/>} path="/dl/*"/>
                <Route element={<JKTrend/>} path="/jk/*"/>
                <Route element={<KTKTrend/>} path="/ktk/*"/>
                <Route element={<UPWTrend/>} path="/upw/*"/>
                <Route element={<MUMTrend/>} path="/mum/*"/>
                <Route element={<UPETrend/>} path="/upe/*"/>

            </Routes>
            </div>
        </>
    )
}

export default Trends;
