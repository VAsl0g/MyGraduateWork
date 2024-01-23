import React from 'react'
import { useState } from 'react'
import { Button, Card, Col, Container, ListGroupItem, Row } from 'react-bootstrap'

export const VideoPlaylistItem = ({video, setSelected}) => {

    const [selectedBool,setSelectedBool]=useState(false)

    const handleClick=()=>{
        setSelected(video.id,!selectedBool)
        setSelectedBool(!selectedBool)
    }

  
    return (

          <ListGroupItem action variant="light" style={{backgroundColor:selectedBool?'#d4cdcd':'', marginBottom:10}} onClick={()=>handleClick()}>
          <Row>
          <Col md={3}>
          <img style={{height:'100px',width:150}}  src={process.env.REACT_APP_API_PREVIEWS+video.previewFileName} />
          </Col>
          <Col md={9}>
          <h3>
            {video.title}
          </h3> 
          </Col>
        </Row>
        </ListGroupItem>
  
  )
}
