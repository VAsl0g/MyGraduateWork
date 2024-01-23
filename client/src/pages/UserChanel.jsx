import React from "react";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import { NavLink, Outlet, Route, Routes, useLocation, useParams } from "react-router-dom";
import Nav from "react-bootstrap/Nav"
import VideoList from "../components/video/VideoList";
import { Button, Spinner } from "react-bootstrap";
import {useNavigate} from "react-router-dom"
import { useEffect } from "react";
import { useState } from "react";
import { getVideoUser } from "../http/videoAPI";
import { getUser } from "../http/userAPI";
import { observer } from "mobx-react-lite";
import UserStore from "../stores/UserStore";
import { useCallback } from "react";
import UserVideosList from "../components/userChanel/UserVideosList";
import Avatar from "../components/userChanel/Avatar";

const UserPage =  observer(() => {
    const [user,setUser]=useState({})
    const [loading,setLoading]=useState(true)
    const navigate = useNavigate()
    const location = useLocation().pathname.split('/').pop()
    const {id} = useParams()
    const styleLink={textDecoration: 'none',marginRight:10,color:'black'}

    useEffect( async()=>{
        await getUser(id).then((data)=>{
          setUser(data)
          console.log( location)
        }).finally(()=>{
          setLoading(false)
        })
    },[id])

    return(
      <div style={{padding:'1% 10% 1% 10%' }}>
        <Row>
          <div style={{display:'inline'}}>
            {/* <img height={200} width={'100%'} src="https://pbs.twimg.com/profile_banners/437181918/1397352537/1500x500" /> */}
            {loading?<Spinner animation="border"/>:<Avatar key={user.id} avatar={user.avatar} height={'150px'}  login={user.login} width={'150px'} hi fontSize={55} id={user.id} />}
            {UserStore.user.role==='ADMIN'?<Button style={{float:'right', marginTop:55}} variant="danger">Заблокировать</Button>:''}
            <Nav style={{ float:'right',fontSize:25,paddingTop:'55px'}}  defaultActiveKey="#first">
              <Nav.Item >
                <NavLink style={{...styleLink,borderBottom:(location==='films'||location==id)?'4px solid #808080':'' }} to="films">Фильмы</NavLink>
              </Nav.Item>
              <Nav.Item>
                <NavLink style={{...styleLink, borderBottom:location==='playlist'?'4px solid #808080':'' }} to="playlist">Плейлисты</NavLink>
              </Nav.Item>
              <Nav.Item >
                <NavLink style={{...styleLink, borderBottom:location==='about'?'4px solid #808080':'' }} to="about"> О себе</NavLink>
              </Nav.Item>
            </Nav>
          </div>
          </Row>
          <Row style={{marginTop:20}}>
              {/* <Routes>
                <Route path="videos" element={<VideoList/>}/> 
                <Route path="playlist" element={<div>Плейлист</div>}/> 
                <Route path="abaut" element={<div>О себе</div>}/>      
              </Routes> */}
              <div >
              <Outlet/>
              </div>
              

            
       
        </Row>
        
      </div>
    )
})

export default UserPage