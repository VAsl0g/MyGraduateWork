import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { Button, Col, Container, Row, Stack, Toast } from 'react-bootstrap';
import Card from 'react-bootstrap/Card'
import { NavLink } from 'react-router-dom';
import { delateComment } from '../../http/commentApi';
import UserStore from '../../stores/UserStore';

const CommentItem = observer(({srcImage,login,date,comment,id})=>{
    
    const [delComment,setDelComment]=useState(false)
    const delate=()=>{

        delateComment(comment.id).then((data)=>{
            console.log(data)
            setDelComment(true)
        }).catch((data)=>{
            console.log(data)
        })
    }
    if(delComment) return''
    return(
            <Row style={{padding:'2%'}}>
                <Col  md="1">
                        <img src={srcImage} style={{width:'70px', height:'70px'}}/>
                </Col>
                <Col md="11">
                    <Row>
                        <Col md={  UserStore.user?.role==='ADMIN'?10:12}>
                            <Stack style={{paddingLeft:10}}>
                                <NavLink style={{textDecoration:'none', color:'black'}} to={'/user/'+id}> <h4 >{login}</h4></NavLink>
                                <p>
                                    {comment.text}
                                </p>
                            </Stack>
                        </Col>
                        {UserStore.user.role==='ADMIN'?
                        <Col>
                            <Button onClick={()=>{delate()}} variant='danger'>Удалить</Button>
                        </Col>
                        :
                        ''}
                      
                    </Row>
                </Col>
            </Row>
    )
    
}
)
export default CommentItem