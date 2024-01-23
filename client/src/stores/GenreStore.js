import {makeAutoObservable} from "mobx"
class GenreStore{
    genres=[]
    selectedGenre=[]
    constructor(){
        makeAutoObservable(this)
    }
}


export default new GenreStore()