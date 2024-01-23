import React from 'react'
import { useCallback } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Col, Container, Row, Spinner } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { getVideoUser } from '../../http/videoAPI'
import SelectedGenresList from '../SelectedGenresList'
import VideoList from '../video/VideoList'

const UserVideosList = () => {

  const [videos,setVideos] = useState([])
  const [loading,setLoading] = useState(true)
    const {id} = useParams()

  const getVideos=useCallback(()=>{
    getVideoUser(id).then(data=>{
      setVideos(data)
    }).finally(()=>{
      setLoading(false)
    })
  },[id])
  
  useEffect(()=>{
    getVideos()
  },[getVideos])

  if(loading) return <Spinner animation='border'/>

  return (

      <Row>
              {videos?<VideoList videos={videos}/>:"У пользователя нет видео"}
      </Row>

   
  )
}

export default UserVideosList