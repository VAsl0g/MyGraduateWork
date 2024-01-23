import { observer } from 'mobx-react-lite';
import React, { useState } from 'react'
import { Alert, Button, Form, Modal } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../../http/userAPI';
import UserStore from '../../stores/UserStore';

const LoginModal = observer(({show}) => {

  let navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');


  const Login = async () => {
        const response = await login(email,password)
        if(!response.message){
        UserStore.user=response
        UserStore.isAuth=true
        UserStore.setShowLoginForm(false)
        }else{
            setError(response.message)
        }


  }
  return (
      <>
    <Modal   show={show} onHide={()=>UserStore.setShowLoginForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Авторизация</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {error?
            <Alert style={{padding:3}} variant='danger'>
                {error}
            </Alert>
            :""}
            <Form>
                
              <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label>email</Form.Label>
                      <Form.Control value={email} onChange={e=>setEmail(e.target.value)} type="email" autoFocus placeholder="Введите email" />
                      
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicPassword">
                      <Form.Label>Пароль</Form.Label>
                      <Form.Control value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Пароль" />
                  </Form.Group>
                  <Button  onClick={Login} variant="primary">
                      Войти
                  </Button>
                  <br/>
                  <br/>
                  Нет акаунта?<p onClick={()=>{
                      UserStore.setShowLoginForm(false)
                      UserStore.SetShowRegistrationForm(true);
                  }} style={{color:'blue', display:'inline',cursor:'pointer'}}> Зарегистрируйся!</p>
            </Form>
            </Modal.Body>
    </Modal>
    </>
  )
})

export default LoginModal