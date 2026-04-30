import React,{Suspense, useEffect, useState, lazy} from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Loader from '../../Skeleton/Loader'

const TrendState = lazy(() => import("./TrendState"));
const Trend = lazy(() => import("./TMCH/Trend"));
const RJTrend = lazy(() => import("./RJ/RJTrend"));
const APTrend = lazy(() => import("./AP/APTrend"));
const BRTrend = lazy(() => import("./BR/BRTrend"));
const HRTrend = lazy(() => import("./HR/HRTrend"));
const ORTrend = lazy(() => import("./OR/ORTrend"));
const WBKOL_Trend = lazy(() => import("./WB_KOL/WBKOL_Trend"));
const PBTrend = lazy(() => import("./PB/PBTrend"));
const MPTrend = lazy(() => import("./MP/MPTrend"));
const DLTrend = lazy(() => import("./DL/DLTrend"));
const JKTrend = lazy(() => import("./JK/JKTrend"));
const KTKTrend = lazy(() => import("./KTK/KTKTrend"));
const UPWTrend = lazy(() => import("./UPW/UPWTrend"));
const MUMTrend = lazy(() => import("./MUM/MUMTrend"));
const UPETrend = lazy(() => import("./UPE/UPETrend"));



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
            <Suspense fallback ={<Loader/>}>
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
            </Suspense>
            </div>
        </>
    )
}

export default Trends;
