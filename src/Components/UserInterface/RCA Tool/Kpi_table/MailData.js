import React, { useEffect } from 'react'

import Level1 from './LevalData/Level1'


const MailData = () => {
    const [text,setText] = React.useState('');


   

    useEffect(()=>{
        setText('Level1')
    },[])

  return (
    <div>
     {text &&  <Level1 heading={'Level 1'} API={'data/level1/'} />} 


        
    </div>
  )
}

export default MailData