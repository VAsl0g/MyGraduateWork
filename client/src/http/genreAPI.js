import axios from "axios";
import { $authHost, $host } from "./index";

export const getGenres = async()=>{
    const {data} = await $host.get('/api/genre')
    return data
}