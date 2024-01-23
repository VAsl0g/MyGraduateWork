import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import { Button, Form, ListGroup, Modal } from 'react-bootstrap'
import { addVideoInPlaylist, getNotVideoInPlaylist, getPlayListByUserId } from '../../../http/playlistAPI'
import PlaylistStore from '../../../stores/PlaylistStore'
import UserStore from '../../../stores/UserStore'
import { VideoPlaylistItem } from '../VideoPlaylistItem'

const AddVideoInPlaylistFormModal = observer(({show,setShow,playlistId})=>{
    const [loading,setLoading] = useState(true)
    const [videos,setVideos] = useState([])
    const [selectedVideos,setSelectedVideos] = useState([])
    
    useEffect(()=>{
        getNotVideoInPlaylist(playlistId).then((data)=>{
            setVideos(data)
        }).finally(()=>{
            setLoading(false)
        })
    },[])

    const selected=(id,bool)=>{
        if(bool){
            setSelectedVideos([...selectedVideos,id])
        }
        else{
            setSelectedVideos(selectedVideos.filter(selectedId=>selectedId!==id))   
        }
    }

    const addVideoPlaylist=()=>{
        // PlaylistStore.loading=true
        addVideoInPlaylist(playlistId,selectedVideos).then(()=>{
            getPlayListByUserId(UserStore.user.id).then((data)=>{
               PlaylistStore.playlist=data
            }).finally(()=>{
                setShow(false)
            })
        })
    }

    return(
         <Modal size="lg" show={show} onHide={()=>setShow(false)}>
             <Modal.Header closeButton>
                    <Button variant="outline-success" onClick={e=>addVideoPlaylist()} disabled={(selectedVideos.length===0)?true:false}>Добавить выбранные фильмы в плейлист</Button>
                </Modal.Header>
               
                <Modal.Body>
                    {loading?"Звгрузка":videos.length===0?'В этом плейлисте уже находятся все ваши видео':videos.map((e=>(
                        <VideoPlaylistItem key={e.id} setSelected={selected} video={e}/>
                    )))}
                        
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={()=>setShow(false)}>Отмена</Button>
                    
                    {/* <Button variant="primary" onClick={()=>create()}>Создать</Button> */}
                </Modal.Footer>
        </Modal>
    )
})

export default AddVideoInPlaylistFormModal