import React from 'react'
import { useNavigate } from 'react-router-dom'

const Avatar = ({avatar,login,width,id,fontSize,height}) => {
    const navigate= useNavigate()
    
    if (!avatar){
        return(
            <div onClick={()=>{navigate('../../../user/'+id)}} style={{display:'inline',fontSize:fontSize, cursor:'pointer'}}> 
                <img width={width} src={process.env.REACT_APP_API_AVATARS+`default.png`} />  {login}
            </div>
        )
    }
  return (
     <p onClick={()=>{navigate('../../../user/'+id)}} style={{display:'inline',fontSize:fontSize, cursor:'pointer'}} >
        <img style={{display:'inline'}} width={width} height={height} src={process.env.REACT_APP_API_AVATARS+avatar} />  {login}
    </p>
  )
}

export default Avatar