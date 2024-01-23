import React from "react";
import { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/esm/Container";
import Form from "react-bootstrap/Form"
import { Link } from "react-router-dom";
import { registration } from "../http/userAPI";
import { observer } from "mobx-react-lite" 
import {useNavigate} from 'react-router-dom'
import UserStore from "../stores/UserStore";

const RegistrationForm = observer(() => {
    let navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [login, setLogin] = useState('');

    const signIn = async () =>{
        try {
            const response = await registration(email,login,password)
            UserStore.user=response
            UserStore.isAuth=true
            navigate("/")
        } catch (error) {
            alert(error.message)
        }
    }

    return(
        <Container
            className="d-flex align-items-center"
            style={{heigth: window.innerHeight -54}}>
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
        </Container>
    )
})

export default RegistrationForm