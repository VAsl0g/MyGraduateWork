import { observer } from 'mobx-react-lite'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { Badge, Card, Form, Spinner } from 'react-bootstrap'
import { getGenres } from '../http/genreAPI'
import GenreStore from '../stores/GenreStore'
import  GenreSelectItem  from './GenreSelectItem'

const SelectedGenresList = observer(({setVideos, genres , searchVideo,floatLeft}) => { 
  const [loading,setLoading] = useState(false)

  return (
    <Card>  
      <Card.Header> Выбор жанров  {loading?<Spinner animation="border"/>:''} </Card.Header>
      <Card.Body>
        {genres.map((e)=>(
          <GenreSelectItem  searchVideo={searchVideo} key={e.id} genre={e} floatLeft={floatLeft} setLoading={setLoading}/>
        ))}
      </Card.Body>
    </Card>
  )
})

export default SelectedGenresList