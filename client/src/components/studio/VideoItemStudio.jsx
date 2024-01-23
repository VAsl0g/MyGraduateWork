import React, { useState } from 'react'
import { Badge, Button, Card, Col, Row, Stack } from 'react-bootstrap'
import { PencilSquare, Trash3Fill } from 'react-bootstrap-icons'
import { useNavigate } from 'react-router-dom'
import ChangeVideoModal from './modals/ChangeVideoModal'
import ConfirmationDelateModal from './modals/ConfirmationDelateModal'

const VideoItemStudio = ({video}) => {
    const [showDelateModal, setShowDelateModal] = useState(false)
    const [showChangeVideoModal, setShowChangeVideoModal] = useState(false)
    const [ colorTrash, setColorTrash ] = useState(null);
    const [ colorPencil, setColorPencil ] = useState(null);

    //const updateTrash = e => setColorTrash(e.type === 'mouseover' ? e.currentTarget.id : null);
    const updateTrash = e => setColorTrash(e.type === 'mouseover' ? 'red' : null);
    const updatePencil = e => setColorPencil(e.type === 'mouseover' ? '#07dbf7' : null);

    const navigate=useNavigate()

  return (
    <Card style={{cursor:'pointer', marginBottom:10,marginRight:40}}>
    <Card.Body>
   
    <Row>
    {/* style={{ maxWidth:'250px' ,maxHeight:'250px'}} */}
        <Col md={2} onClick={()=>navigate('/film/'+video.id)}>
            <img style={{ width:'100%',maxHeight:'150px'}} src={process.env.REACT_APP_API_PREVIEWS+video.previewFileName} onClick={()=>{navigate('/film/'+video.id)}}/>
        </Col>
        <Col md ={9}>
            <Row>
                <Col  md={10} >
                    <Stack  onClick={()=>navigate('/film/'+video.id)}>
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
                </Col >
                <Col md={2} onClick={()=>navigate('/film/'+video.id)}>
                        {video.views} просмотров
                </Col>
            </Row >
            <Row onClick={()=>navigate('/video/'+video.id)}>
                <div style={{height: 50, overflow:'hidden',display:'inline'}}>
                   Описание: <b>{video.description?video.description:'автор не оставил описание'}</b>...
                </div>
            </Row>
        </Col>
        <Col md={1}>
            <Trash3Fill 
                fontSize={40}
                onClick={()=>setShowDelateModal(true)} 
                color={colorTrash}  
                onMouseOver={(e)=>updateTrash(e)} 
                onMouseLeave={(e)=>updateTrash(e)}
            />
            <PencilSquare 
                fontSize={40} 
                style={{marginTop:20}}
                onClick={()=>{setShowChangeVideoModal(true)}}
                color={colorPencil}  
                onMouseOver={(e)=>updatePencil(e)} 
                onMouseLeave={(e)=>updatePencil(e)}
                />
        </Col>
    </Row>
    </Card.Body>
    {showDelateModal?<ConfirmationDelateModal show={showDelateModal} setShow={setShowDelateModal} id={video.id} />:""}
    {showChangeVideoModal?<ChangeVideoModal show={showChangeVideoModal} setShow={setShowChangeVideoModal} video={video}/>:""}
</Card>
  )
}

export default VideoItemStudio