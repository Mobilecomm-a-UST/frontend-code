import React, { useEffect } from 'react'

import Level1 from './LevalData/Level1'
import Thershold from './LevalData/Thershold';


const MailData = () => {
    const [text,setText] = React.useState('');


   

    useEffect(()=>{
        setText('Level1')
    },[])

  return (
    <div>
     {text &&  <Level1 heading={'Level 1'} API={'Zero_Count_Rna_Payload_Tool/data/level1/'} />} 
     {text &&  <Level1 heading={'Level 2'} API={'Zero_Count_Rna_Payload_Tool/data/level2/'} />} 
     {text &&  <Level1 heading={'Level 3'} API={'Zero_Count_Rna_Payload_Tool/data/level3/'} />} 
     {text &&  <Level1 heading={'Level 4'} API={'Zero_Count_Rna_Payload_Tool/data/level4/'} />} 
     {text && <Thershold heading={'Threshold Values'} API={'Zero_Count_Rna_Payload_Tool/data/thershold/'} />}


        
    </div>
  )
}

export default MailData