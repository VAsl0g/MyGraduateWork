import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import { Button, Spinner } from 'react-bootstrap'
import { PlusSquare } from 'react-bootstrap-icons'
import { getPlayListByUserId } from '../../http/playlistAPI'
import PlaylistStore from '../../stores/PlaylistStore'
import UserStore from '../../stores/UserStore'
import PlaylistCreateForm from '../playlist/modals/PlaylistCreateForm'
import PlaylistList from '../playlist/PlaylistList'
const PlaylistPage = observer(() => {

  const [createModal,setCreateModal]=useState(false)
  const [ colorPlus, setColorPlus ] = useState(null);
  const updatePlus = e => setColorPlus(e.type === 'mouseover' ? 'green' : null);

  useEffect(()=>{
    getPlayListByUserId(UserStore.user.id).then((data)=>{
      PlaylistStore.playlist=data
    }).finally(()=>{
    })
  },[])

  if(PlaylistStore.loading) return <Spinner animation='border'/>

  return (
    <div>
      <PlusSquare 
        // style={{margin:'0px 45% 20px 45%'}}
        fontSize={70}
        color={colorPlus}  
        onMouseOver={(e)=>updatePlus(e)} 
        onMouseLeave={(e)=>updatePlus(e)}
        onClick={()=>setCreateModal(true)}
        />
       {/* <Button style={{margin:'0px 35% 20px 35%'}} variant="success" onClick={()=>setCreateModal(true)}>Создать новый плейлист плейлист</Button> */}
       <PlaylistList playlists={PlaylistStore.playlist} isStudio={true}/>
       <PlaylistCreateForm show={createModal} setShow={setCreateModal}/>
    </div>
    
  )
}
)
export default PlaylistPage