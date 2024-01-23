import axios from "axios";
import { $authHost, $host } from "./index";


export const getCommentsVideo= async(id)=>{
    const {data} = await $host.get('api/comment/'+id)
    return data
}


export const AddComment = async(comment)=>{
    const {data} = await  $authHost.post('/api/comment',comment)
    return data
}

export const delateComment = async(id)=>{
    const {data} = await  $authHost.delete('/api/comment/'+id)
    return data
}