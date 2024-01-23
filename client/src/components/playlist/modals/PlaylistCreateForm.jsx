import { observer } from 'mobx-react-lite'
import React from 'react'
import { useRef } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { addComplaint } from '../../../http/complaintApi'
import { createPlaylist, getPlayListByUserId } from '../../../http/playlistAPI'
import PlaylistStore from '../../../stores/PlaylistStore'
import UserStore from '../../../stores/UserStore'

const PlaylistCreateForm=observer(({show, setShow})=>{

    const title=useRef()
    const image=useRef()

    const create= async()=>{
        const formData= new FormData()
        formData.append('title',title.current.value)
        formData.append('image', image.current.files[0])
        // userGenres.forEach(e=>{
        //     formData.append('genres', e)
        // })
        createPlaylist(formData).then(()=>{
            getPlayListByUserId(UserStore.user.id).then((data)=>{
                PlaylistStore.playlist=data
              }).finally(()=>{
              })
        })
        setShow(false)
    }

    return(
        <Modal  size="lg" show={show} onHide={()=>setShow(false)}>
                <Modal.Header closeButton>
                    Cоздание плейлиста
                </Modal.Header>
                
                <Modal.Body>
                    
                    <Form>
                        <Form.Group
                            className="mb-3"
                        >
                            <Form.Label>Название</Form.Label>
                            <Form.Control ref={title} type="text"  />
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                        >
                            <Form.Label>Изображение плейлиста</Form.Label>
                            <Form.Control ref={image} type="file" accept='image/*'/>
                        </Form.Group>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={()=>setShow(false)}>Отмена</Button>
                    
                    <Button variant="primary" onClick={()=>create()}>Создать</Button>
                </Modal.Footer>
        </Modal>
    )
})

export default PlaylistCreateForm