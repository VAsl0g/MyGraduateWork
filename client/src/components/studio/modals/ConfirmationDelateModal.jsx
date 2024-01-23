import { observer } from 'mobx-react-lite'
import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import { delateVideo, getVideoUser } from '../../../http/videoAPI'
import UserStore from '../../../stores/UserStore'
import VideoStore from '../../../stores/VideoStore'

const ConfirmationDelateModal = observer(({show,setShow,id}) => {
    const delate=()=>{
        //VideoStore.loading=true
        delateVideo(id).then(()=>{
            getVideoUser(UserStore.user.id).then((data)=>{
                console.log(data)
                VideoStore.videos=data
            }).finally(()=>{
               // VideoStore.loading=false
               setShow(false)
            })
        })
    }

  return (
    <Modal   show={show} onHide={()=>setShow(false)}>
    <Modal.Body>
    Вы действительно хотите удалить виде? Восстановить его будет невозможно
    </Modal.Body>
    <Modal.Footer>
        <Button variant="secondary" onClick={()=>setShow(false)}>Отмена</Button>
        
        <Button variant="danger" onClick={()=>delate()}>Удалить</Button>
    </Modal.Footer>
</Modal>
  )
}
)
export default ConfirmationDelateModal