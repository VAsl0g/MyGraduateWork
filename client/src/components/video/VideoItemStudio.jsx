import React from 'react'
import { Badge, Card, Col, Container, Row } from 'react-bootstrap'

const VideoItemStudio = ({video}) => {

  return (
    <Container>
        <Card>
            <Row>
                <Col md={2}>
                    <img style={{maxHeight:'100px'}}  src={process.env.REACT_APP_API_PREVIEWS+video.previewFileName} />
                </Col>
                <Col md={8}>
                    <h3>
                        {video.title}
                    </h3> 
                    {video.genres.map(e=>(
                        <h5 key={e.id} style={{float:'left', padding:'3px 4px'}}><Badge bg="secondary">{e.name}</Badge></h5>
                    ))}
                </Col>
                <Col md={1}>
                    <h5>
                        {video.views}
                    </h5> 
                    <h5>
                        {video.likes}
                    </h5> 
                    <h5>
                        {video.dislikes}
                    </h5> 
                </Col>
                <Col md={1}>
                </Col>
            </Row>
        </Card>
    </Container>
  )
}

export default VideoItemStudio