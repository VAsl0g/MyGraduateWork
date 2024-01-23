import { $authHost } from "./index"



export const getComplaints = async () =>{
    const {data}= await $authHost.get('/api/complaint')
    return data
}

export const delateVideoComplaint = async (complaint) =>{
    const {data}= await $authHost.put('/api/complaint/video',complaint)
    return data
}

export const addComplaint = async (complaint)=>{
    const {data} = await $authHost.post('/api/complaint',complaint)
    return data
}

export const getComplaintTypes = async ()=>{
    const {data} = await $authHost.get('/api/complaint/types')
    return data
}

export const rejectVideoComplaint = async (complaint) =>{
    const {data}= await $authHost.put('/api/complaint/reject',complaint)
    return data
}



