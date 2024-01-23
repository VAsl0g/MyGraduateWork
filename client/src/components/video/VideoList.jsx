import { observer } from "mobx-react-lite"
import React from "react"
import { useContext } from "react"
import { Col, Container, Form, ListGroup, Stack } from "react-bootstrap"
import Row from "react-bootstrap/esm/Row"
import { Context } from "../../index"
import VideoItem from "./VideoItem"


const VideoList = ({videos, md})=>{
    if(videos.length===0) return <h1>Фильмы не найдены</h1>
    return(
        <Container>
        {videos.map(video=><VideoItem key={video.id} video={video}/>)}
        </Container>
    )}

export default VideoList