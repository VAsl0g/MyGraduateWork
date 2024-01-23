import { observer } from 'mobx-react-lite';
import React from 'react';
import { useState , useEffect} from 'react';
import { Button, ProgressBar } from 'react-bootstrap';
import Container from "react-bootstrap/esm/Container";
import Form from "react-bootstrap/Form"
import { useNavigate } from 'react-router-dom';
import {getGenres} from "../../http/genreAPI"
import { uploadVideo } from '../../http/videoAPI';
import GenreStore from '../../stores/GenreStore';
import UserStore from '../../stores/UserStore';
import SelectedGenresList from '../SelectedGenresList';

const UploadFormPage = observer(() => {

    const [title, setTitle] = useState('')
    const [description, setDescription]=useState('');
    const [videoFile, setVideoFile] = useState(null)
    const [imageFile, setImageFile] = useState(null)

    const navigate=useNavigate()


    const [progress,setProgress] = useState(0)

    const addVideo=()=>{
        setProgress(0)
        const formData= new FormData()
        formData.append('title',title)
        formData.append('description',description)
        formData.append('video', videoFile)
        formData.append('preview', imageFile)
        GenreStore.selectedGenre.forEach(e=>{
            formData.append('genres', e)
        })
        uploadVideo(formData,setProgress).then((data)=>{
            navigate('../films  ')
        })
        GenreStore.selectedGenre=[]
        
    }
    console.log(!!title)

    if(UserStore.user.isActivated===false) return <h3>Подтвердите свою электронную почту, для получения возможности сохранения фильма </h3>

    return(
        <Container>
            
            <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control value={title} onChange={(e)=>setTitle(e.target.value)} type="email" placeholder="Название фильма" />
                </Form.Group>

                <Form.Group className="mb-9">
                    <Form.Control value={description} onChange={(e)=>setDescription(e.target.value)} as="textarea"  rows={7} placeholder="Описание к фильму" />
                </Form.Group>

                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Превью фильма</Form.Label>
                    <Form.Control
                        onChange={(e)=>setImageFile(e.target.files[0])}
                        type="file" accept='image/*'
                    />
                </Form.Group> 

                <Form.Group controlId="formFile" className="mb-3">  
                    <Form.Label> Видеофайл</Form.Label>
                    <Form.Control
                        onChange={(e)=>setVideoFile(e.target.files[0])}
                        type="file"accept='video/mp4'
                    />
                </Form.Group>

                    <SelectedGenresList genres={GenreStore.genres} floatLeft={true}/>
                            <Button 
                                style={{margin:'20px 0px 20px 350px'}} onClick={()=>addVideo()}  
                                variant="success"
                                disabled={
                                    !(title&&
                                    description&&videoFile&&imageFile)}
                                >
                                Сохранить фильм
                            </Button>
                    <ProgressBar now={[progress]} label={`${progress}%`} />
            </Form>
    </Container>
    )
})
 
 export default UploadFormPage