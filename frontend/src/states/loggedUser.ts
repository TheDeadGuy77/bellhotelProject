import { reactive } from "vue";

const loggedUser = reactive({
    id: undefined,
    account: undefined,
    email: undefined,
})

function setLoggedUser(data:any){
    loggedUser.id = data.id
    loggedUser.account = data.account
    loggedUser.email = data.email
}

function clearLoggedUser(){
    loggedUser.id = undefined
    loggedUser.email = undefined
    loggedUser.account = undefined
}

export { loggedUser, setLoggedUser, clearLoggedUser}
