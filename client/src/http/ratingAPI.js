import { $authHost, $host } from "./index";

export const rateVideo = async (videoId,like) =>{
    const {data} = await $authHost.post('/api/rating',{videoId,like})    
    return data
}

