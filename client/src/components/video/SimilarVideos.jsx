import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Col, Row, Spinner, Stack } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { getVideos } from '../../http/videoAPI'
import Avatar from '../userChanel/Avatar'

const SimilarVideos = ({genreIds,videoId}) => {

    const [videos,setVideos]=useState([])
    const [loading,setLoading]=useState(true)
    const navigate=useNavigate()
    //const httpVideo='http://localhost:5000/previews/'+video.previewFileName+'.'+video.previewType

    useEffect(()=>{
        getVideos(genreIds,'',true).then((data)=>{
            setVideos(data.filter(video=>video.id!=videoId))
        }).finally(()=>{
            setLoading(false)
        })
    },[genreIds])

    if(loading) return <Spinner animation="border"/>
    return (
        <div>
            {videos.map((e)=>(
                <Row key={e.id} style={{marginBottom:20}}>
                    <Col md={5}>
                        <img style={{width:'100%', height:'80px'}}  src={process.env.REACT_APP_API_PREVIEWS+e.previewFileName} onClick={()=>{navigate('/film/'+e.id)}}/>
                    </Col>
                    <Col md={7}>

                            <h6 className='text-truncate'>{e.title}</h6>
                                <Avatar avatar={e.user.avatar} login={e.user.login} width={'25px'} id={e.user.id}/><br/>
                                <small>{e.views} просмотров</small>

                                
                    </Col>
                </Row>
            ))}
        </div>
    )
}

export default SimilarVideos