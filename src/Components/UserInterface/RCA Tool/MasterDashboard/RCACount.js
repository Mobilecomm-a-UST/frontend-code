import React , {useEffect,} from 'react'
import _ from 'lodash';

const CIRCLE = ['AP', 'BH', 'CH', 'DL', 'EH', 'HP', 'HR', 'KK', 'JH', 'JK', 'KO', 'MP', 'MU', 'OD', 'PB', 'RJ', 'TN', 'UE', 'UW', 'WB']

const RCACount = ({data}) => {

    useEffect(() => {
        if (data) {
            CIRCLE.map((item) => {
         
                let filterCircle = _.filter(data.Data, { circle: item , check_condition:'NOT OK',KPI :'MV_RRC_Setup_Success_Rate'});
                let rcaUnique = _.uniqBy(filterCircle, 'RCA')

                console.log('RAC DATA' , rcaUnique)
                // let filterCircleERAB = _.filter(data.Data, { circle: item , KPI :'MV_ERAB_Setup_Success_Rate'});

           
               
              
            })
        }
    }, [data])
  return (
    <div>RCACount</div>
  )
}

export default React.memo(RCACount)