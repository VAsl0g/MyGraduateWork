import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import VideoList from "./components/video/VideoList";
import HomePage from "./pages/HomePage";
import LoginForm from "./pages/LoginForm";
import RegistrationForm from "./pages/RegistrationForm";
import UserChanel from "./pages/UserChanel";
import VideoPage from "./pages/VideoPage";
import { observer } from "mobx-react-lite" 
import { check } from "./http/userAPI";
import StudioPage from "./pages/StudioPage";
import UserStore from "./stores/UserStore";
import AdminPage from "./pages/AdminPage";
import { getGenres } from "./http/genreAPI";
import GenreStore from "./stores/GenreStore";
import UserVideosList from "./components/userChanel/UserVideosList";
import DescriptionList from "./components/userChanel/DescriptionList";
import PlaylistsUser from "./components/userChanel/PlaylistsUser";
import { Alert, Spinner } from "react-bootstrap";
import UploadFormPage from "./components/video/UploadFormPage";
import PlaylistPage from "./components/studio/PlaylistPage";
import VideoPageStudio from "./components/studio/VideoPageStudio";
import SettersAccount from "./components/studio/SettersAccount";
import LoginModal from "./components/auth/LoginModal";
import RegistrationModal from "./components/auth/RegistrationModal";

const App=observer(()=> {

  const [loading,setLoading]=useState(false)
  const [errorServer,setErrorServer]=useState(false)
  useEffect(() => {
    getGenres().then(data=>{
      GenreStore.genres=data
  })
    check().then(data=>{
        UserStore.user=data
        UserStore.isAuth=true
    }).catch(()=>{
    }).finally(()=>{
        setLoading(true)
      })
  }, []);


  
  if(!loading) return(
    <Spinner animation="border"/>
  )
  return (
    <BrowserRouter>

      <RegistrationModal show={UserStore.showRegistrationForm}/>
      <LoginModal show={UserStore.showLoginForm} />
      <Routes>
        <Route path='/' element={<NavBar/>}>
          
          <Route path='login' element={<LoginForm/>} />
          <Route path='registration' element={<RegistrationForm/>}/>
          <Route path='user/:id/*' element={<UserChanel/>}>
              <Route path='' element={<UserVideosList/>}/> 
              <Route path="films"  element={<UserVideosList />}/> 
              <Route path="playlist" element={<PlaylistsUser/>}/> 
              <Route path="about" element={<DescriptionList/>}/>
          </Route>
          <Route path='film/:id' element={<VideoPage/>}/>
          <Route path='upload' element={<UploadFormPage/>}/>
          <Route path='' element={<HomePage/>}/>
          <Route path='*' element={<div>страницы нет</div>}/>
          <Route path='error' element={<div>страницы нет</div>}/>
          <Route path='admin' element={<AdminPage/>}/>
        </Route>
          <Route path='studio' element={<StudioPage/>}>
            <Route path='uploader' element={<UploadFormPage/>}/>
            <Route path='' element={<VideoPageStudio/>}/>
            <Route path='films' element={<VideoPageStudio/>}/>
            <Route path='playlists' element={<PlaylistPage/>}/>
            <Route path='settings' element={<SettersAccount/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
})

export default App;
