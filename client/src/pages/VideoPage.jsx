import React, { useEffect, useRef } from "react"
import Col from "react-bootstrap/esm/Col"
import Container from "react-bootstrap/esm/Container"
import Row from "react-bootstrap/esm/Row"
import Accordion from "react-bootstrap/Accordion"
import Comment from "../components/comment/CommentItem"
import { useNavigate, useParams } from "react-router-dom"
import { getVideosById } from "../http/videoAPI"
import { useState } from "react"
import Form from "react-bootstrap/Form"
import { AddComment, getCommentsVideo } from "../http/commentApi"
import { Badge, Button, Card, Spinner, Stack } from "react-bootstrap"
import UserStore, {UserStore as User} from "../stores/UserStore"
import { useCallback } from "react"
import AddComplaintForm from "../components/complaint/modals/AddComplaintForm"
import CommentList from "../components/comment/CommentList"
import SimilarVideos from "../components/video/SimilarVideos"
import Avatar from '../components/userChanel/Avatar'
import { rateVideo } from "../http/ratingAPI"

const VideoPage = () => {
    const [videoComments,setVideoComments] = useState([])
    const [video, setVideo] = useState({}) 
    const [loadingVideo,setLoadingVideo]=useState(false)
    const [loadingComments,setLoadingComments]=useState(false)
    const [showComplaintModalForm,setShowComplaintModalForm]=useState(false)
    const [dislike,setDislike]=useState()
    const [like,setLike]=useState()
    const [similarVideos,setSimilarVideos] = useState([])
    const [rating,setRating] = useState()
    const {id} = useParams()

    const navigate=useNavigate()

    const rateLike=()=>{
        if(rating) {
            rateVideo(id,null)
            setLike(Number(like)-1)
            setRating(null)
        }
        if(rating===null) {
            rateVideo(id,true)
            setLike(Number(like+1))
            setRating(true)
        }
        if(rating===false) {
            rateVideo(id,true)
            setLike(Number(like)+1)
            setDislike(Number(dislike)-1)
            setRating(true)
        }
    }

    const rateDislike=()=>{
        if(rating) {
            rateVideo(id,false)
            setLike(Number(like)-1)
            setDislike(Number(dislike)+1)
            setRating(false)
        }
        if(rating===null) {
            rateVideo(id,false)
            setDislike(Number(like)+1)
            setRating(false)
        }
        if(rating===false) {
            rateVideo(id,null)
            setDislike(Number(dislike)-1)
            setRating(null)
        }
    }

    const getVideos=useCallback(()=>{
        getVideosById(id,UserStore.user.id).then(data=>{
            setVideo(data)
            setRating((data.userLike===true|| data.userLike===false)?data.userLike:null)
            setDislike(data.dislike?Number(data.dislike):0)
            setLike(data.like?Number(data.like):0)
        }).finally(()=>{
            setLoadingVideo(true)
        })
        getCommentsVideo(id).then(comments=>setVideoComments(comments)).finally(()=>setLoadingComments(true))
    },[id])

    useEffect(()=>{
        getVideos()
    },[getVideos])
    if (!loadingVideo) return <Spinner animation="border"/>
    return(
        
        <Container style={{paddingTop:'1%', paddingLeft:'3%', paddingRight:'3%'}} border="light">
            <Row>
                <Col md={12}>
                    <Row>
                        <div> 
                            <Row>
                                <Col md={4}>
                                    <img style={{ width:'400px', height:'300px'}} src={process.env.REACT_APP_API_PREVIEWS+video.previewFileName} onClick={()=>{navigate('/video/'+video.id)}}/>
                                </Col>
                                <Col md ={8}>
                                    <Row>
                                        <Col  md={12} >
                                            <div>
                                            {/* className={" text-truncate"} */}
                                                <p><b style={{fontSize:35}}>{video.title}</b></p>
                                                <div>
                                                    {video.genres?
                                                        <div>
                                                            <p style={{fontSize:20}}>
                                                                { video.genres.map(e=>(
                                                                    <Badge key={e.id} style={{marginRight:'5px'}} bg="secondary">{e.name}</Badge>
                                                                    ))}
                                                            </p>
                                                        </div>
                                                        :
                                                        ""
                                                    }
                                                </div>       
                                            <Avatar  avatar={video.user.avatar} login={video.user.login} width={'50px'} height={'50px'} fontSize={20} id={video.user.id} /><br/>

                                            {video.description?<p style={{paddingTop:15}}>{video.description}</p>:'автор не оставил описание'}
                                            </div >
                                        </Col >
                                    </Row >
                                </Col>       
                            </Row>
                        </div>
                    </Row>
                    <Row style={{marginTop:'60px'}}>
                        <Col md={9}>
                            <video src={process.env.REACT_APP_API_VIDEOS+video.videoFileName} style={{width:'100%'}} controls type={"video\""+video.videoFileName.split('.')[1]}/> 
                            <div style={{display:'inline'}}>
                                <small >{video.views} просмотров</small>
                                <Button style={{marginLeft:300}} onClick={()=>{rateLike()}} variant={rating?'success':'light'} disabled={UserStore.user.id?false:true}>{like} НРАВИТСЯ</Button>
                                <Button onClick={()=>{rateDislike()}} variant={rating===false?'danger':'light'} disabled={UserStore.user.id?false:true}>{dislike} НЕ НРАВИТСЯ</Button>
                                <Button  variant="warning" style={{float:'right'}} disabled={(UserStore.user.isActivated&&UserStore.isAuth)?false:true} onClick={()=>setShowComplaintModalForm(true)}>Пожаловатся</Button>
                            </div>
                            <div style={{marginTop:40}}>

                           
                            {loadingComments?
                                <CommentList comments={videoComments} videoId={id} setComments={setVideoComments}/>
                              :
                              'Загрузка'}
                            </div>
                        </Col>
                        <Col md={3}>
                            <h4>Похоже по жанру</h4>
                        <SimilarVideos genreIds={video.genres.map(e=>e.id)} videoId={id}/>
                        </Col>  
                    </Row>
                </Col>
       
            </Row>
            <AddComplaintForm show={showComplaintModalForm} setShow={setShowComplaintModalForm} videoId={id}/>
        </Container>
                

    )
}

export default VideoPage