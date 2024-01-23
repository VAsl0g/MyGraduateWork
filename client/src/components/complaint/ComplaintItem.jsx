import React, { useState } from 'react'
import { Button, Card, Col, Container, ListGroup, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import Avatar from '../userChanel/Avatar'
import DelateVideo from './modals/DelateVideo'

const ComplaintItem=({complaint})=>{
    const [showDelateModal,setShowDelateModal]=useState(false)
    const [showRejectModal,setShowRejectModal]=useState(false)
    const navigate = useNavigate()
        console.log(complaint)
    return(

            <Card>
                <Row>
                <Col md="2">
                    <img style={{width:'100%',maxHeight:150}} src={process.env.REACT_APP_API_PREVIEWS+complaint.video.previewFileName} onClick={()=>{navigate('/film/'+complaint.video.id)}}/>
                </Col>
                <Col md="7">
                    <p>Название видео: <b style={{fontSize:'150%'}}>{complaint.video.title}</b></p>
                    <p>Автор жалобы: 
                    <Avatar  avatar={complaint.user.avatar} login={complaint.user.login} width={'50px'} height={'50px'} fontSize={20} id={complaint.user.id} /><br/>
                        </p>
                    <p> Причина в жалобы: {complaint.typeComplaint.name}</p>
                    <p>Сообщение в жалобе: {complaint.message}</p>
                </Col>
                <Col md="3">
                    <Button  variant="warning" style={{marginRight:10}} onClick={()=>{setShowRejectModal(true)}} >Отклонить жалобу</Button>
                    <Button variant="danger"   onClick={()=>{setShowDelateModal(true)}}>Удалить фильм</Button>
                </Col>

                </Row>
                {showDelateModal?<DelateVideo complaintId={complaint.id} setShow={setShowDelateModal} reject={false} show={showDelateModal}/>:''}
                {showRejectModal?<DelateVideo complaintId={complaint.id} setShow={setShowRejectModal} reject={true} show={showRejectModal}/>:''}
            </Card>
            
    )
}

export default ComplaintItem