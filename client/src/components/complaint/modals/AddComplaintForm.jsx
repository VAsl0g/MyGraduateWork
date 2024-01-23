import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import { useRef } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { addComplaint, getComplaintTypes } from '../../../http/complaintApi'
import UserStore from '../../../stores/UserStore'

const AddComplaintForm=observer(({show, setShow ,videoId})=>{

    const [complaints,setComplaints]=useState([])
    const [selectedComplaints,setSelectedComplaints]=useState()
    const [message,setMessage]=useState('')
    const pushComplaint= async()=>{
        addComplaint({message:message,videoId,userId:UserStore.user.id,typeComplaintId:selectedComplaints})
       
        setShow(false)
    }
    useEffect(()=>{
        getComplaintTypes().then((data)=>{
            setSelectedComplaints(data[0].id)
            setComplaints(data)
        })
    },[])

    return(
        <Modal  size="lg" show={show} onHide={()=>setShow(false)}>
                <Modal.Header closeButton>
                    Жалоба на видео 
                </Modal.Header>
                
                <Modal.Body>
                    <Form>
                         <Form.Select value={selectedComplaints}  onChange={(e)=>{setSelectedComplaints(e.target.value)}} aria-label="Default select example">
                                {complaints.map((e)=>(
                                    <option value={e.id}>{e.name}</option>
                                ))}
                            </Form.Select>
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
                    
                    <Button variant="primary" onClick={()=>pushComplaint()}>Отправить</Button>
                </Modal.Footer>
        </Modal>
    )
})

export default AddComplaintForm