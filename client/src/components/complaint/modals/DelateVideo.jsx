import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { delateComplaint, delateVideoComplaint, getComplaints, rejectVideoComplaint } from '../../../http/complaintApi'
import ComplaintStore from '../../../stores/ComplaintStore'

const DelateVideo = observer(({complaintId,setShow,show,reject}) => {

    const [message,setMessage]=useState('')

    const delate=()=>{
        if(reject===true){
            rejectVideoComplaint({complaintId,message}).then(()=>{
            getComplaints().then((data)=>{
                ComplaintStore.complaint=data
            })
            setShow(false)
        })}
        
        else 
        delateVideoComplaint({complaintId,message}).then(()=>{
            getComplaints().then((data)=>{
                ComplaintStore.complaint=data
            })
            setShow(false)
        })
    }
    
  return (
     <Modal  size="lg" show={show} onHide={()=>setShow(false)}>
                
                <Modal.Body>
                    <Form>
                        <Form.Group
                            className="mb-3"
                        >
                            <Form.Label>Сообщение</Form.Label>
                            <Form.Control value={message}  onChange={(e)=>{setMessage(e.target.value)}} as="textarea" rows={10} />
                        </Form.Group>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={()=>setShow(false)}>Отмена</Button>
                    
                    <Button variant="primary" onClick={()=>{delate()}}>Отправить</Button>
                </Modal.Footer>
        </Modal>
  )
})

export default DelateVideo