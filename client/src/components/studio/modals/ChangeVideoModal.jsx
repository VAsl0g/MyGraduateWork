import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import { Button, Form, Modal, Spinner } from 'react-bootstrap'
import { changeVideo, getVideoUser } from '../../../http/videoAPI'
import GenreStore from '../../../stores/GenreStore'
import UserStore from '../../../stores/UserStore'
import VideoStore from '../../../stores/VideoStore'
import SelectedGenresList from '../../SelectedGenresList'

const ChangeVideoModal = observer(({show,setShow,video}) => {

    const [title, setTitle] = useState(video.title)
    const [showSpinner, setShowSpinner] = useState(false)
    const [description, setDescription]=useState(video.description);
    
    useEffect(()=>{
        GenreStore.selectedGenre=video.genres.map(e=>e.id)
    },[])
    

    const change=()=>{
        console.log()
        setShowSpinner(true)
        changeVideo({title, description, id:video.id, genres:GenreStore.selectedGenre}).then(()=>{
            getVideoUser(UserStore.user.id).then((data)=>{
                VideoStore.videos=data
            }).finally(()=>{
                setShow(false)
                setShowSpinner(false)
                GenreStore.selectedGenre=[]
            })
        }
        )
    }

  return (
    <Modal  size="lg" show={show} onHide={()=>{setShow(false);GenreStore.selectedGenre=[]}}>
        <Modal.Header closeButton>
            Изменение информации о фильме {showSpinner?<Spinner animation="border" />:''}
        </Modal.Header>
        
        <Modal.Body>
            
            <Form>
                <Form.Group className="mb-3"    >
                    <Form.Label>Название</Form.Label>
                    <Form.Control value={title} type="text" onChange={(e)=>{setTitle(e.target.value)}} />
                </Form.Group>
            </Form>
            <Form>
                <Form.Group className="mb-3"    >
                    <Form.Label>Описание</Form.Label>
                    <Form.Control value={description} as="textarea" rows={10} onChange={(e)=>{setDescription(e.target.value)}} />
                </Form.Group>
            </Form>
            <SelectedGenresList genres={GenreStore.genres} floatLeft={true}/>
        </Modal.Body>
        <Modal.Footer>
        <Button variant="secondary" onClick={()=>{setShow(false);GenreStore.selectedGenre=[]}}>Отмена</Button>
        
        <Button variant='success' onClick={()=>change()}>Сохранить изменения</Button>
    </Modal.Footer>

    </Modal>
  )
}
)

export default ChangeVideoModal