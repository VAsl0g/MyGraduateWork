import React, { useRef } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"
import Button from "react-bootstrap/Button"
import Container from "react-bootstrap/Container"
import { observer } from "mobx-react-lite" 

import Form from "react-bootstrap/Form"
import {Alert, Dropdown, FormControl, Row, Spinner} from "react-bootstrap"
import UserStore from "../stores/UserStore";
import VideoStore from "../stores/VideoStore";
import { getVideos } from "../http/videoAPI";
import GenreStore from "../stores/GenreStore";
import { useState } from "react";
import { BoxArrowInRight, BoxArrowRight, CameraReels, Film, Gear, PersonVideo } from "react-bootstrap-icons";

const NavBar = observer(() => {

    const [loading,setLoading] = useState(false)
    const [showAlert, setShowAlert] = useState(true)
    const out=()=>{
        UserStore.user={}
        UserStore.isAuth=false
        localStorage.removeItem('token')
    }
    const timer=useRef(null)

    const search=(test)=>{
        setLoading(true)
        VideoStore.searchTitle=test
        if(timer.current){
            clearTimeout(timer.current)
        }

        timer.current=setTimeout(()=>{

        
            getVideos(GenreStore.selectedGenre,VideoStore.searchTitle).then((data)=>{
            VideoStore.videos=data
        }).finally(()=>{
            setLoading(false)
        })
        },1000)
    }
    let navigate = useNavigate();

    return(
        <div>
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Nav className="me-auto">
                        <NavLink to="/" style={{color: "white",textDecoration:'none'}}>
                            <Navbar.Brand style={{fontSize:30}}> <Film fontSize={40} style={{paddingBottom:11}}/>  <b>Author's cinema</b></Navbar.Brand>
                        </NavLink>                 
                    </Nav>
                    {loading?<Spinner animation="border" variant="light"/>:''}
                    <Form className="d-flex" style={{width:'400px',marginRight:'auto    '}}>
                        <FormControl
                        type="search"
                        placeholder="Поиск фильма"
                        className="me-2"
                        aria-label="Search"
                        value={VideoStore.searchTitle}
                        onChange={(e)=>{search(e.target.value) }}
                        />
                       
                    </Form>
                    {UserStore.user.role==='ADMIN'?<Button variant="warning" onClick={()=>navigate('admin')}>Жалобы</Button>:UserStore.user.role}
                    {UserStore.isAuth ? 
                    <div style={{paddingLeft:10}}>
                        <Dropdown style={{float:'left'}}>
                            <Dropdown.Toggle variant="dark" bsPrefix="p-0" align="end" id="dropdown-menu-align-end" >
                                <img height={'50'} width={'50px'} style={{float:'left'}} src={process.env.REACT_APP_API_URL+`/avatars/${UserStore.user.avatar}`}/>
                                <h4 
                            // onClick={()=>{navigate('../../../user/'+UserStore.user.id)}} 
                            className="text-truncate"
                            style={{color:'white', paddingLeft:'5px',paddingTop:10}}>
                                {UserStore.user.login}
                        </h4>
                            </Dropdown.Toggle>
                            <Dropdown.Menu variant="dark" align="end" id="dropdown-menu-align-end">
                                <Dropdown.Item onClick={()=>navigate("../../user/"+UserStore.user.id)}> <PersonVideo fontSize={25}/> Мой канал</Dropdown.Item>
                                <Dropdown.Item onClick={()=>navigate('/studio')}><CameraReels fontSize={21} style={{marginBottom:10}}/> Студия</Dropdown.Item>
                                <Dropdown.Divider/>
                                <Dropdown.Item onClick={()=>navigate('../../../studio/settings')}><Gear fontSize={20}/> Настроика</Dropdown.Item>
                                <Dropdown.Item onClick={()=>out()}><BoxArrowRight fontSize={20}/> Выйти</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>

                        </div>
                    :
                    <Button onClick={()=>{UserStore.setShowLoginForm(true)}}>Авторизация</Button>
                        // <Button ><Link to="/login" style={{color:"white"}}>Авторизация</Link></Button>
                    }

                    
                </Container>
            </Navbar>
            
            <Row>
            {(UserStore.user.isActivated===false)?
            <Alert show={showAlert} variant={'danger'} onClose={() => setShowAlert(false)} dismissible>
                 Вы не подтвердили свою электронную почту. Некоторые функции не доступны.
            </Alert>:''}
            </Row>
            <Outlet/>
        </div>
    )
})

export default NavBar