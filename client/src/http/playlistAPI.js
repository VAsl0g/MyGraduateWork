import { $authHost, $host } from "./index";

export const getPlayListByUserId = async (id) =>{
    const {data} = await $host.get('/api/playlist/user/'+id)
    return data
}


export const createPlaylist= async(playlist)=>{
    const {data} = await $authHost.post('/api/playlist',playlist)
    return data
}


export const getNotVideoInPlaylist= async(id)=>{
    const {data} = await $host.get('/api/playlist/not/'+id)
    return data
}

export const addVideoInPlaylist= async(playlistId,videoIds)=>{
    const {data} = await $authHost.post('/api/playlist/video',{playlistId,videoIds})
    return data
}

export const dropVideoPlaylist= async(playlistId,videoId)=>{
    const {data} = await $authHost.delete(`/api/playlist/${playlistId}/video/${videoId}`)
    return data
}

export const delatePlaylist= async(playlistId)=>{
    const {data} = await $authHost.delete(`/api/playlist/${playlistId}`)
    return data
}