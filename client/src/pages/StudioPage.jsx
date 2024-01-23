import { observer } from 'mobx-react-lite';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { Alert, Button, Card, Col, Container, Dropdown, ListGroup, Nav, Navbar, Row, Tab, Tabs } from 'react-bootstrap';
import { BoxArrowRight, CameraReelsFill, CollectionPlay, Film, Gear, PersonVideo, Upload } from 'react-bootstrap-icons';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import PlaylistCreateForm from '../components/playlist/modals/PlaylistCreateForm';
import PlaylistList from '../components/playlist/PlaylistList';
import VideoItemStudio from '../components/video/VideoItemStudio';
import VideoList from '../components/video/VideoList';
import { getPlayListByUserId } from '../http/playlistAPI';
import { check } from '../http/userAPI';
import {  getVideoUser } from '../http/videoAPI';
import PlaylistStore from '../stores/PlaylistStore';
import UserStore from '../stores/UserStore';
import VideoStore from '../stores/VideoStore';

const StudioPage = observer(()=>{
    const [videos,setVideos]=useState({})
    const [loadingVideo,setLoadingVideo]=useState(true)
    const [playlists,setPlaylists]=useState({})
    const [loadingPlaylist,setLoadingPlaylist]=useState(true)

    const [createModal,setCreateModal]=useState(false)
    //const [updateModal,setPlaylists]=useState({})

    const location = useLocation().pathname.split('/').pop()

    const navigate = useNavigate()
    const pages=[
        {
            path:'films',
            title:'Фильмы',
            icon:<Film fontSize={25}/>
        },
        {
            path:'playlists',
            title:'Плейлисты',
            icon:<CollectionPlay fontSize={25}/>
        },
        {
            path:'uploader',
            title:'Загрузка фильма',
            icon:<Upload fontSize={25}/>
        },
        {
            path:'settings',
            title:'Настройки аккаунта',
            icon:<Gear fontSize={25}/>
        }]
    const out=()=>{
        UserStore.user={}
        UserStore.isAuth=false
        localStorage.removeItem('token')
        
    }
    
    useEffect(async()=>{
        if(!UserStore.isAuth)  UserStore.setShowLoginForm(true) //navigate('/')
        else{
            getVideoUser(UserStore.user.id).then((data)=>{
                VideoStore.videos=data
            }).finally(()=>{
                VideoStore.loading=false
            })
    
            getPlayListByUserId(UserStore.user.id).then((data)=>{
                PlaylistStore.playlist=data
            }).finally(()=>{
                PlaylistStore.loading=false
            })
        }

    },[UserStore.isAuth])
    console.log(PlaylistStore.playlist)
    if(!UserStore.isAuth) return<></>
    return (
            <div>
                            <Navbar bg="dark" variant="dark">
                <Container>
                    <Nav className="me-auto">
                        <NavLink to="/" style={{color: "white",textDecoration:'none'}}>
                            <Navbar.Brand style={{fontSize:30}}><CameraReelsFill fontSize={40} style={{paddingBottom:11}}/> Студия Author's cinema</Navbar.Brand>
                        </NavLink>                 
                    </Nav>
                   
                    {UserStore.user.role==='ADMIN'?<Button variant='warning' onClick={()=>navigate('../../../admin')}>Жалобы</Button>:UserStore.user.role}
                    {UserStore.isAuth ? 
                    <div style={{paddingLeft:10}}>
                        <Dropdown style={{float:'left'}}>
                            <Dropdown.Toggle variant="dark" bsPrefix="p-0" align="end" id="dropdown-menu-align-end" >
                                <img style={{float:'left',width:50,height:50}} src={process.env.REACT_APP_API_URL+`/avatars/${UserStore.user.avatar}`}/>
                                <h4 
                                    className="text-truncate"
                                    style={{color:'white', paddingLeft:'5px',paddingTop:10}}>
                                        {UserStore.user.login}
                                </h4>
                            </Dropdown.Toggle>
                            <Dropdown.Menu variant="dark" align="end" id="dropdown-menu-align-end">
                                
                                <Dropdown.Item onClick={()=>navigate("/user/"+UserStore.user.id)}><PersonVideo fontSize={25}/> Мой канал</Dropdown.Item>
                                <Dropdown.Item onClick={()=>navigate('/')}><Film fontSize={23}/> Главная страница</Dropdown.Item>
                                <Dropdown.Divider/>
                                <Dropdown.Item onClick={()=>out()}><BoxArrowRight fontSize={20}/> Выйти</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    :
                        <Button ><Link to="/login" style={{color:"white"}}>Авторизация</Link></Button>
                    }

                    
                </Container>
            </Navbar>

                <Row >
                    <Col md="2" style={{width:'', minHeight:'100vh'}}>
                        <ListGroup variant='flush' style={{fontSize:17, fontWeight:'bolder'}}>
                            {pages.map(e=>(
                                <ListGroup.Item onClick={()=>{navigate(e.path)}} className='border-0' action  style={{color:'black'}} variant={(location===e.path||(location==='studio' && e.path ==='films' ))?'secondary':'light'}>{e.icon} {e.title}</ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Col>
                    <Col md="10">
                        <div style={{margin:'20px 40px' }}>
                        {(UserStore.user.isActivated===false)?
            <Alert  variant={'danger'}>
                 Вы не подтвердили свою электронную почту. Вы не сможете сохранить фильм.
            </Alert>:''}
                            <Outlet/>
                        </div>

                    </Col>
                </Row>
            </div>

    )
})

export default StudioPage




// <Row>
// <Tabs  fill variant="pills" >
//     <Tab eventKey="videos" title="Видео">
//     <Button onClick={()=>{navigate('../upload')}}>Загрузить видео</Button>
//         {/* {loadingVideo?"загрузка":<VideoList videos={videos} md={3} isStudio={true}/>} */}
//         {VideoStore.loading?
//             "загрузка"
//             :
//             <div>
                
//             {VideoStore.videos.map(e=>(
//                 <VideoItemStudio key={e.id} video={e}/>
//             ))}
//             </div>
//         }
//     </Tab>
//     <Tab eventKey="playlist" title="Плейлисты">
//     <Button onClick={()=>setCreateModal(true)}>Создать плейлист</Button>
//         {PlaylistStore.loading?"загрузка":<div>
//                 <div>
//                     <PlaylistList isStudio={true} playlists={PlaylistStore.playlist}/>
//                 </div>
//             </div>}
//     </Tab>
// </Tabs>
// </Row>
// <PlaylistCreateForm show={createModal} setShow={setCreateModal}/>