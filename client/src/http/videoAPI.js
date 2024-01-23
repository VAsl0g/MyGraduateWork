import { $authHost, $host } from "./index";

export const uploadVideo= async(video, setProgress)=>{
    const {data} = await $authHost.post('api/video/upload',video, {
        onUploadProgress: progressEvent => {
            const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
            console.log('total', totalLength)
            if (totalLength) {
                setProgress(Math.round((progressEvent.loaded * 100) / totalLength))
            }
        }
    });
    return data
}

export const getVideoUser= async(id)=>{
    const {data} = await $host.get(`api/video/user/${id}`)
    return data
}


export const getVideos= async(genres,title,only_in_genre)=>{
    let httpQuery='?'
    if(title) httpQuery+='title='+title+'&'
    if(genres) httpQuery+='genres='+genres.map(e=>e)+'&'
    if(only_in_genre) httpQuery+='only_in_genre=true&'
    console.log(httpQuery)
    const {data} = await $host.get(`api/video`+httpQuery)
    return data
}

export const getVideosById= async(id,userId)=>{

    const {data} = await $host.get(`api/video/${id}${userId?`?userId=${userId}`:''}`)
    return data
}

export const delateVideo= async(id)=>{
    const {data} = await $authHost.delete(`api/video/${id}`)
    return data
}

export const changeVideo = async(dataVideo)=>{
    const {data} = await $authHost.put(`api/video`,dataVideo)
    return data
}
