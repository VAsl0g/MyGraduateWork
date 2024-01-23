import React from "react";
import Container from "react-bootstrap/esm/Container";
import VideoList from "../components/video/VideoList";
import Card from "react-bootstrap/Card"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { useEffect } from "react";
import { useState } from "react";
import { getVideos } from "../http/videoAPI";
import { getGenres } from "../http/genreAPI";
import  SelectedGenresList  from "../components/SelectedGenresList";
import VideoStore from "../stores/VideoStore";
import { observer } from "mobx-react-lite";
import { Spinner } from "react-bootstrap";
import GenreStore from "../stores/GenreStore";

const HomePage = observer(() => {
        const [videos,setVideos]=useState([])
        const [genre,setGenre]=useState([])
        const [loading,setLoading]=useState(true)
        useEffect(()=>{
                getVideos().then((data)=>{
                        VideoStore.setVideos(data)
                        console.log(VideoStore.videos)
                }).finally(()=>{
                        setLoading(false)
                })
              
        },[])
        
        if(loading) return <Spinner animation="border"/>
        return(
                        <Row style={{padding:40}}>
                                <Col md={2}>
                                        <SelectedGenresList genres={GenreStore.genres} searchVideo={true}/>
                                </Col>
                                <Col   md={10}>
                                        {VideoStore.videos?
                                        <VideoList videos={VideoStore.videos} md={3} setVideos={setVideos}/>
                                        :
                                        <h1>Видео не найденно</h1>}
                                </Col>
                        </Row>
   )
})
export default HomePage



        // <Card>
        //         <Card.Body>
        //                 <VideoList videos={videos}/>
        //         </Card.Body>
                
        // </Card>