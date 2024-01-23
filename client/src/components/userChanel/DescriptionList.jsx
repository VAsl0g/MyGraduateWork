import React from 'react'
import { useCallback } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Spinner } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { getUser } from '../../http/userAPI'

const DescriptionList = () => {
    const {id} = useParams()
    const [logout,setLogout] = useState(true)

    
    const [description,setDescription] = useState([])
    const getVideos=useCallback(()=>{
      getUser(id).then(data=>{
        setDescription(data.description)
      }).finally(()=>{
        setLogout(false)
      })
    },[])
    
    useEffect(()=>{
        getVideos()
    },[])
  

    if(logout) return <Spinner animation="border"/>
  return (
    <div style={{fontSize:20}}>{description}</div>
  )
}

export default DescriptionList