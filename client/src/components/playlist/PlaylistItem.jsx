import { observer } from 'mobx-react-lite'
import React from 'react'
import { useState } from 'react'
import { Accordion, Button, Card, CardGroup, Col, Container, ListGroupItem, Offcanvas, Row } from 'react-bootstrap'
import { List, PlusCircle, Trash3Fill, XSquare } from 'react-bootstrap-icons'
import { useNavigate } from 'react-router-dom'
import { delatePlaylist, dropVideoPlaylist, getPlayListByUserId } from '../../http/playlistAPI'
import PlaylistStore from '../../stores/PlaylistStore'
import UserStore from '../../stores/UserStore'
import AddVideoInPlaylistFormModal from './modals/AddVideoInPlaylistFormModal'

const PlaylistItem=observer(({playlist,id,isStudio})=>{
    
    const [showAddVideoInPlaylist,setShowAddVideoInPlaylist]=useState(false)
    const [ colorX, setColorX] = useState(null);
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const [ colorPlus, setColorPlus ] = useState('#999');
    const [ colorTrash, setColorTrash ] = useState('#999');
    const [dark,setDark]= useState(false);
    const updatePlus = e => setColorTrash(e.type === 'mouseover' ? 'green' : '#999');
    const updateTrash = e => setColorPlus(e.type === 'mouseover' ? 'green' : '#999');
    const updateX = e => setColorX(e.type === 'mouseover' ? e.currentTarget.id : null);
    const navigate=useNavigate()

    const dropVideo=(videoId)=>{
        dropVideoPlaylist(playlist.id,videoId).then(()=>{
            getPlayListByUserId(UserStore.user.id).then((data)=>{
                PlaylistStore.playlist=data
                setColorX(null)
                }
            )
        }
        )
    }

    const delate=()=>{
        delatePlaylist(playlist.id).then(()=>{
            getPlayListByUserId(UserStore.user.id).then((data)=>{
                PlaylistStore.playlist=data
                PlaylistStore.playlist=PlaylistStore.playlist.filter(e=>e.id!==playlist.id)
                }
            )
        })
    }
return(
<>  
    <Card 
        style={{display:'inline-block',width:220, margin:'10px 10px' }} 
        className={"text-white"}
        onClick={()=>{setShowOffcanvas(true)}}
        onMouseOver={()=>setDark(true)} 
        onMouseLeave={()=>setDark(false)}
        >
            <Card.Img style={{filter:dark?'brightness(40%)':null}} height={200} src={process.env.REACT_APP_API_URL +'/playlists/'+playlist.imageFileName}  alt="Card image"/>
            {dark?<Card.ImgOverlay>
                <h4>{playlist.title}</h4>
            </Card.ImgOverlay>
            :null}
    </Card>
    {showOffcanvas?
        <Offcanvas style={{width:600}} show={showOffcanvas} onHide={()=>setShowOffcanvas(false)} placement={'end'}>
            <Offcanvas.Header>

                    
                      
                <h1>{playlist.title}         
                    
                </h1> 
                {isStudio? <Trash3Fill 
                    style={{float:'right'}}
                    variant='danger' 
                    fontSize={30}
                    onClick={()=>{delate()}}
                    color={colorTrash}  
                    onMouseOver={()=>setColorTrash('red')} 
                    onMouseLeave={()=>setColorTrash('#999')}
                    />:null}
     
               
            </Offcanvas.Header>
{/* {isStudio?<Button onClick={()=>setShowAddVideoInPlaylist(true)}>Добавить фильм</Button>:''} */}
{isStudio?
    <div>
        <PlusCircle
            style={{marginLeft:'45%',cursor:'pointer'}}
            fontSize={50}
            onClick={()=>setShowAddVideoInPlaylist(true)}
            color={colorPlus}  
            onMouseOver={()=>setColorPlus('green')} 
            onMouseLeave={()=>setColorPlus('#999')}
            />

            
            </div>:''}
            <div style={{overflow: 'auto'}}>
                    {playlist.videos.length?<div>
         {playlist.videos.map(e=>(
                 <ListGroupItem action key={e.id} style={{marginTop:10}}>
                     <Row>
                         <Col md={3} style={{cursor:'pointer'}} onClick={()=>{navigate('../../../film/'+e.id)}}>
                             <img style={{height:'120px', width:'110%'}}  src={process.env.REACT_APP_API_PREVIEWS+e.previewFileName} />
                         </Col>
                         <Col md={7} style={{cursor:'pointer'}} onClick={()=>{navigate('../../../film/'+e.id)}}>
                             <h4>
                                 {e.title}
                             </h4> 
                         </Col>
                         <Col md={2}>
                             {/* {isStudio?<Button variant='danger' onClick={()=>dropVideo(e.id)}>Убрать</Button> :''} */}
                             {isStudio?<XSquare
                                        key={e.id}
                                        id={e.id}
                                         onClick={()=>dropVideo(e.id)}
                                         fontSize={40}
                                         style={{cursor:'pointer'}}
                                         color={colorX== e.id ? 'red' : '#999'}  
                                         onMouseOver={(e)=>updateX(e)} 
                                         onMouseLeave={(e)=>updateX(e)}
                                         />:''}
                         </Col>
                     </Row>
                 </ListGroupItem>
                
         ))} </div>:<h4 style={{marginLeft:'35%'}}>Плейлист пуст</h4>}
            </div>
        
    </Offcanvas>
    :
        ''
    }
             {showAddVideoInPlaylist?<AddVideoInPlaylistFormModal playlistId={playlist.id} show={showAddVideoInPlaylist} setShow={setShowAddVideoInPlaylist} />:""}
    
  </>
    
)
})

export default PlaylistItem


// <Accordion.Item eventKey={id} style={{width:1100,float: 'left'}}>
//         {/* {PlaylistsStore.getVideos().map((e)=>(
//             <div>{e.title}</div>
//         ))} */}
//         <Accordion.Header>
//             <Row>
//                 <Col md={3}>
//                     <img width={'100%'} style={{maxHeight:500}}  src={process.env.REACT_APP_API_URL +'/playlists/'+playlist.imageFileName} />
//                 </Col>
//                 <Col md={7}>
//                     <h3 style={{}}>{playlist.title}</h3>
//                 </Col>
//                 <Col>
//                 {isStudio?
//                     <Button style={{marginTop:50}} variant='danger'  onClick={()=>{delate()}}>Удалить</Button> 
//                     :
//                     ''
//     }
//                 </Col>
//             </Row>
//         </Accordion.Header>
//     <Accordion.Body>
//         {/* {isStudio?<Button onClick={()=>setShowAddVideoInPlaylist(true)}>Добавить фильм</Button>:''} */}
//         {isStudio?<Button onClick={()=>setShowAddVideoInPlaylist(true)}>Добавить фильм</Button>:''}
//         {playlist.videos.map(e=>(
//             <Container key={e.id}>
//                 <Card>
//                     <Row>
//                         <Col md={2} style={{cursor:'pointer'}} onClick={()=>{navigate('../../../film/'+e.id)}}>
//                             <img style={{height:'140px', width:'170px'}}  src={process.env.REACT_APP_API_PREVIEWS+e.previewFileName} />
//                         </Col>
//                         <Col md={9} style={{cursor:'pointer'}} onClick={()=>{navigate('../../../film/'+e.id)}}>
//                             <h3>
//                                 {e.title}
//                             </h3> 
//                         </Col>
//                         <Col md={1}>
//                             {/* {isStudio?<Button variant='danger' onClick={()=>dropVideo(e.id)}>Убрать</Button> :''} */}
//                             {isStudio?<XSquare 
//                                         onClick={()=>dropVideo(e.id)}
//                                         fontSize={50}
//                                         color={colorX}  
//                                         onMouseOver={(e)=>updateX(e)} 
//                                         onMouseLeave={(e)=>updateX(e)}
//                                         />:''}
//                         </Col>
//                     </Row>
//                 </Card>
//             </Container>
//         ))}
//     </Accordion.Body> 
//             {showAddVideoInPlaylist?<AddVideoInPlaylistFormModal playlistId={playlist.id} show={showAddVideoInPlaylist} setShow={setShowAddVideoInPlaylist} />:""}
//     </Accordion.Item>