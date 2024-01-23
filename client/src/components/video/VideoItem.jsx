import { observer } from 'mobx-react-lite';
import React from 'react';
import Col from 'react-bootstrap/esm/Col';
import Card from 'react-bootstrap/Card'
import Image from 'react-bootstrap/Image'
import {NavLink, useNavigate} from "react-router-dom"
import { Badge, Button, Container, ListGroup, ListGroupItem, Row, Stack } from 'react-bootstrap';
import GenreSelectItem from '../GenreSelectItem';
import Avatar from '../userChanel/Avatar';

const VideoItem = ({video,md})=>{
    const navigate= useNavigate()
    const viewRusWord=()=>{
        const num = video.views%10
        if(num==1) return ' просмотр'
        if(num>1&&num<5) return ' просмотра'
        return ' просмотров'
    }
    return(
            
                <ListGroupItem action variant="light" style={{cursor:'pointer', marginBottom:10}}>
                    <div>
                   
                    <Row>
                    {/* style={{ maxWidth:'250px' ,maxHeight:'250px'}} */}
                        <Col md={3} onClick={()=>navigate('/film/'+video.id)}>
                            <img style={{ width:'100%', height:'200px'}} src={process.env.REACT_APP_API_PREVIEWS+video.previewFileName} onClick={()=>{navigate('/film/'+video.id)}}/>
                        </Col>
                        <Col md ={9}  style={{color:'black'}}>
                            <Row>
                                <Col  md={10} >
                                    <Stack onClick={()=>navigate('/film/'+video.id)}>
                                    {/* className={" text-truncate"} */}
                                        <p className='text-truncate'> Название: <b style={{fontSize:25}}>{video.title}</b></p>
                                        <div>
                                        
                                            {video.genres?
                                                <div>
                                                    <p style={{float:'left'}}>Жанры: </p>
                                                    <p style={{fontSize:20}}>
                                                        { video.genres.map(e=>(
                                                            <Badge key={e.id} style={{float:'left', marginLeft:'3px'}} bg="secondary">{e.name}</Badge>
                                                            ))}
                                                    </p>
                                                </div>
                                                :
                                                ""
                                            }
                                        </div>
                                        
                                 
                                        
                                    </Stack >
                                    <p>Автор: <Avatar key={video.user.id} id={video.user.id} width={'40px'} height={'40px'} avatar={video.user.avatar} login={video.user.login}/>
                                           
                                        </p>
                                </Col >
                                <Col md={2} onClick={()=>navigate('/video/'+video.id)}>
                                        {video.views + viewRusWord()} 
                                </Col>
                            </Row >
                            <Row onClick={()=>navigate('/film/'+video.id)}>
                                <div style={{height: 50, overflow:'hidden',display:'inline'}}>
                                   Описание: <b>{video.description?video.description:'автор не оставил описание'}</b>...
                                </div>
                            </Row>
                        </Col>
                      
                        <Row>
                        
                        </Row>
                    </Row>
                   
                    </div>
                </ListGroupItem>
    )

} 

export default VideoItem