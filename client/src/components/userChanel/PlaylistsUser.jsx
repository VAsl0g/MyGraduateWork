import { observer } from 'mobx-react-lite'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { Spinner } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { getPlayListByUserId } from '../../http/playlistAPI'
import PlaylistList from '../playlist/PlaylistList'

const PlaylistsUser = observer(({isStudio}) => {

  const [playlists,setPlaylists]=useState([])
  const [loading,setLoading]=useState(false)
  const {id} = useParams()

  useEffect(()=>{
    getPlayListByUserId(id).then((data)=>{
      setPlaylists(data)
  }).finally(()=>{
    setLoading(true)
  })  
  },[id])

  if(!loading) return <Spinner animation='border'/>
  return (
    <div><PlaylistList playlists={playlists} isStudio={false}/></div>
  )
})

export default PlaylistsUser