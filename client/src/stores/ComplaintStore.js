import {makeAutoObservable} from "mobx"
class ComplaintStore{
    complaint=[]

    loading=true
    constructor(){
        makeAutoObservable(this)
    }


}


export default new ComplaintStore()