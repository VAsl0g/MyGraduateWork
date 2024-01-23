import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { Badge } from 'react-bootstrap'
import { getVideos } from '../http/videoAPI'
import GenreStore from '../stores/GenreStore'
import VideoStore from '../stores/VideoStore'

const GenreSelectItem = observer(({genre,setLoading, searchVideo,floatLeft}) => {

    const [selected,setSelected]=useState(!!GenreStore.selectedGenre.find(id=>(id===genre.id)))

    useEffect(()=>{
      setSelected(!!GenreStore.selectedGenre.find(id=>(id===genre.id)))
    },[GenreStore.selectedGenre])
    
    const handleClick=()=>{
        if(setLoading && searchVideo) setLoading(true)
      
        console.log(!!GenreStore.selectedGenre.find(id=>(id===genre.id)==0))
        const selectItem = !selected
        setSelected(selectItem)
        if(selectItem){
            GenreStore.selectedGenre=[...GenreStore.selectedGenre,genre.id]
        }
        else{
           GenreStore.selectedGenre=GenreStore.selectedGenre.filter(selectedId=>selectedId!==genre.id)
        }
        if(searchVideo)getVideos(GenreStore.selectedGenre,VideoStore.searchTitle).then((data)=>{
                    VideoStore.videos=data
            }).finally(()=>{
                if(setLoading)setLoading(false)
            })
        // console.log(  ...GenreStore.selectedGenre)
        // setSelected(video.id,!selectedBool)
        // setSelectedBool(!selectedBool)
    }

  return (
    <h5 style={{float:floatLeft?'left':'none', padding:'3px 4px'}}><Badge bg={selected?'success':"light"}  text={selected?'':"dark"} onClick={()=>{handleClick()}} >{genre.name}</Badge></h5>
  )
})



export default GenreSelectItem