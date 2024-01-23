import {makeAutoObservable} from "mobx"
class PlaylistStore{
    playlist=[]
    
    loading=true

    constructor(){
        makeAutoObservable(this)
    }


    setVideos(data){
        this.videos=data
    }
}
export default new PlaylistStore()