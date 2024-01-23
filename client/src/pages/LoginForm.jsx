import React from "react";
import { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/esm/Container";
import Form from "react-bootstrap/Form"
import { Link } from "react-router-dom";
import { login } from "../http/userAPI";
import { observer } from "mobx-react-lite" 
import {useNavigate} from 'react-router-dom'
import UserStore from "../stores/UserStore";

const LoginForm = observer(() => {
    let navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');



    const Login = async () => {
        try {
            const response = await login(email,password)
            UserStore.user=response
            UserStore.isAuth=true
            navigate("/")
        } catch (error) {
            alert(error.message)
        }

    }
    return(
        <Container style={{width:400}}>
            <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>email</Form.Label>
                    <Form.Control value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="Введите email" />
                    
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
                Нет акаунта?<Link to="/registration">Зарегистрируйся!</Link>
            </Form>
        </Container>
    )
})

export default LoginForm