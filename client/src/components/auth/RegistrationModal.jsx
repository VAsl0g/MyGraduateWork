import { observer } from 'mobx-react-lite';
import React, { useState } from 'react'
import { Alert, Button, Form, Modal } from 'react-bootstrap'
import { registration } from '../../http/userAPI';
import UserStore from '../../stores/UserStore';

const RegistrationModal = observer(({show}) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [login, setLogin] = useState('');
    const [error, setError] = useState('');

    const signIn = async () =>{
        const response = await registration(email,login,password)
        if(!response.message){
        UserStore.user=response
        UserStore.isAuth=true
        UserStore.SetShowRegistrationForm(false)
        } else {
            setError(response.message)
        }
    }


  return (
    <Modal   show={show} onHide={()=>{UserStore.SetShowRegistrationForm(false)}}>
    <Modal.Header closeButton>
      <Modal.Title>Регистрация</Modal.Title>
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
                    <Form.Control value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="Введите email" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Логин</Form.Label>
                    <Form.Control value={login} onChange={e=>setLogin(e.target.value)}  placeholder="Введите логин" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Пароль</Form.Label>
                    <Form.Control value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Пароль" />
                </Form.Group>

                
                <Button  onClick={signIn} variant="primary">
                    Зарегистрироватся
                </Button>
            </Form>
        </Modal.Body>
</Modal>
  )
})

export default RegistrationModal