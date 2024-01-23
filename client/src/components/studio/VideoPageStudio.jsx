import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import { Button, Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { getVideoUser } from '../../http/videoAPI'
import UserStore from '../../stores/UserStore'
import VideoStore from '../../stores/VideoStore'
import VideoList from '../video/VideoList'
import VideoItemStudio from './VideoItemStudio'

const VideoPageStudio = observer(() => {
    const navigate = useNavigate()
    useEffect(() => {
      VideoStore.loading=true
      getVideoUser(UserStore.user.id).then(data=>{
          VideoStore.videos=data
      }).finally(()=>{
        VideoStore.loading=false
      })
    }, [])
    

    if(VideoStore.loading) return <Spinner animation='border'/>
    
    if(VideoStore.videos.length==0)  return <h1>У вас нет фильмов <Button onClick={()=>{navigate('../../../uploader')}}>Загрузить фильм</Button></h1>

  return (
    <div>
        {VideoStore.videos.map((e)=>(
          <VideoItemStudio video={e}/>
        ))}
    </div>
  )
})

export default VideoPageStudio