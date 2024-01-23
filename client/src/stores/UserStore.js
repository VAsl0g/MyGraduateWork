import {makeAutoObservable} from "mobx"
class UserStore{
    showRegistrationForm=false
    showLoginForm=false


    isAuth=false

    user={
        login:null,
        id:null,
        avatar:null,
        role:null,
        playlists:{
            videos:{}
        },
        description:'',
        isActivated:null
    }


    constructor(){
        makeAutoObservable(this)
    }

    setShowLoginForm(bool){
        this.showLoginForm=bool
    }
    SetShowRegistrationForm(bool){
        this.showRegistrationForm=bool
    }
    
    setIsAuth(bool){
        this.isAuth = bool;
    }

    setUser(_user){
        this.user = _user;
    }

    isUser(id){
        if (this.user.id===id) return true
        return false
    }
}


export default new UserStore()