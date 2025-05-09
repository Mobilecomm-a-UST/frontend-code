import React, { useCallback, useState } from 'react'
import { Button } from '@mui/material'
import { useGet } from '../../../Hooks/GetApis'
import { useLoadingDialog } from '../../../Hooks/LoadingDialog';


const FileDownload = () => {
    const { makeGetRequest } = useGet()
    const { loading, action } = useLoadingDialog();
    const [data, setData] = useState(false)

    const fetchData = async () => {
        console.log('fetch data check')
        action(true)
        let responce = await makeGetRequest('RCA_TOOL/main_process/')
        if (responce) {
            action(false)
            console.log('responce', responce)
        }
    }

    return (<>
        <div>
            <Button variant='outlined' onClick={fetchData}>Genetate RCA</Button>
        </div>
        {loading}
    </>

    )
}

export default FileDownload