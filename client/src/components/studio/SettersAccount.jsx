import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { changeUser, check } from '../../http/userAPI'
import UserStore from '../../stores/UserStore'
import * as Icon from 'react-bootstrap-icons';
const SettersAccount = observer(() => {

  const [login,setLogin]=useState(UserStore.user.login)
  const [description, setDescription]=useState(UserStore.user.description)
  const [urlImage, setUrlImage] = useState(process.env.REACT_APP_API_AVATARS+UserStore.user.avatar)
  const [fileImage, setFileImage] = useState({})
  const [changeImage,setChangeImage]=useState(false)

  const saveChange=()=>{
    const formData= new FormData()
    formData.append('login',login)
    formData.append('description',description)
    if(changeImage){}
    formData.append('avatar',fileImage)
    changeUser(formData).then((data)=>{
      check().then(data=>{
        UserStore.user=data
    })
      console.log(data)
    }
    )
  }

  const setDescriptionFn=(text)=>{
    if(!text)  setDescription(null)
    else setDescription(text)
  }


const setFile=(file)=>{
  let reader  = new FileReader();
  if(file.type.split('/')[0]==='image'){
    setFileImage(file)
    reader.onloadend = function () {
      setUrlImage(reader.result)
    } 
      reader.readAsDataURL(file);
      setChangeImage(true)
  }
  
}
  return (
    <div style={{width:800, fontSize:18,marginTop:50}}>
      
      <Row>
        <Col md={8} style={{display: 'flex', flexDirection:'flex-start',alignItems:'flex-start'}}>
        <Form  style={{marginTop:'auto', marginBottom:'auto'}}>
            <Form.Group style={{width:500}}>
              <Form.Label>Ваш логин</Form.Label>
              <Form.Control type="text" value={login} onChange={e=>{setLogin(e.target.value)}} />
            </Form.Group>
            <Form style={{marginTop:50}}>
            <Form.Group>
              <Form.Label>Дополнительная информация о вас</Form.Label>
              <Form.Control as='textarea' rows={6} value={description} onChange={(e)=>{setDescriptionFn(e.target.value)}}/>
            </Form.Group>
          </Form>
          </Form>
        </Col>
        <Col md={4}>
          <div >
            <img style={{width:200,height:180}} src={urlImage}/> 
            <label 
              style={{fontSize:18, background:'#05ecfc',  cursor: 'pointer', padding:'4px 8px',borderRadius:4}} 
              htmlFor='fileImageUser'>
                Измениь фотографию
            </label>
          </div>
          <input id='fileImageUser' className='fileImageUser'  accept="image/*" onChange={(e)=>{setFile(e.target.files[0])}} type='file' style={{display:'none'}}/>
        </Col>
      
      {/* <Form.Group  style={{marginTop:50}}>
        <Form.Label >Изменить фотографию канала</Form.Label>
        <Form.Control  type="file" onChange={(e)=>{setFile(e.target.files[0])}}/>
      </Form.Group> */}
      </Row>
      <Row>

      </Row>
      <Button 
        onClick={()=>{saveChange()}} 
        style={{marginTop:50}} 
        variant='success' 
        disabled={!
        (login!==UserStore.user.login||
        description!==UserStore.user.description
        ||changeImage)
      }>
          Сохранить изменение</Button>


    </div>
  )
}
)

export default SettersAccount