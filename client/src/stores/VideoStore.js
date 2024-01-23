import {makeAutoObservable} from "mobx"
class VideoStore{
    videos=[]
    searchTitle=null
    loading=true
    constructor(){
        makeAutoObservable(this)
    }


    setVideos(data){
        this.videos=data
    }
}


export default new VideoStore()