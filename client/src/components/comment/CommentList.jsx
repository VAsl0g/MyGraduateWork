import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { useRef } from 'react'
import { Button, Form, Row, Stack } from 'react-bootstrap'
import { AddComment } from '../../http/commentApi'
import UserStore from '../../stores/UserStore'
import CommentItem from './CommentItem'

const CommentList = observer(({comments, videoId,setComments}) => {

  const [comment,setComment] = useState('')
  const handleSubmit= async ()=>{
    AddComment({  videoId:videoId, text: comment})
     setComments([  { user:UserStore.user, id:comments[0]?.id+1, text: comment},...comments])
  }

  return (
    <div >
     {UserStore.isAuth?
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Control value={comment} onChange={(e)=>setComment(e.target.value)} as="textarea" rows={3} />
        <Button  variant="success" onClick={(e)=>handleSubmit()} disabled={comment?false:true}>Оставить комментарий</Button>
      </Form.Group>
  :
      ''
     }
        
        <Stack>
            {comments.map(e=>(
                <CommentItem key={e.id} login={e.user.login} id={e.user.id} srcImage={!e.user.avatar?process.env.REACT_APP_API_AVATARS+"default.png":process.env.REACT_APP_API_AVATARS+e.user.avatar} comment={e}/>
            ))}
        </Stack>
    </div>
  )
})

export default CommentList