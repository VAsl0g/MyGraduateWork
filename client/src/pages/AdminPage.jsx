import { observer } from 'mobx-react-lite'
import React from 'react'
import { useState } from 'react'
import { Spinner } from 'react-bootstrap'
import ComplaintList from '../components/complaint/ComplaintList'

const AdminPage=observer(()=>{

    return(
        <div>
            <ComplaintList/>
        </div>
    )
})

export default AdminPage