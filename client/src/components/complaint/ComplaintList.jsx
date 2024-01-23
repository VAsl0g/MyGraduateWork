import { observer } from 'mobx-react-lite'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { ListGroup, Spinner } from 'react-bootstrap'
import { getComplaints } from '../../http/complaintApi'
import ComplaintStore from '../../stores/ComplaintStore'
import UserStore from '../../stores/UserStore'
import ComplaintItem from './ComplaintItem'

const ComplaintList = observer(()=>{


    const [complaints,setComplaint]=useState([])


    useEffect(()=>{
        getComplaints().then((data)=>{
            ComplaintStore.complaint=data
        }).finally(()=>{
            ComplaintStore.loading=false
        })
    },[])

    if ( ComplaintStore.loading)return(<Spinner animation='border'/>)

    return(
        <div style={{margin:'20px 100px'}}>
            {ComplaintStore.complaint.length?ComplaintStore.complaint.map(e=>(
                <ComplaintItem key={e.id} complaint={e}/>
            )):<h2>Жалоб нет</h2>}
        </div>
    )
})

export default ComplaintList