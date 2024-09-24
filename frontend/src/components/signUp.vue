<script setup lang='ts'>
    import { ref } from 'vue'
    import { loggedUser, setLoggedUser, clearLoggedUser } from '../states/loggedUser'
    import * as Vue from 'vue'
    const { inject } = Vue
    const $HOST = inject('HOST')
    const HOST = $HOST || 'https://localhost:8080'

    const email = ref('prova@gmail.com')
    const password = ref('Abcdef1!') 
    const conferma = ref('Abcdef1!')
    const tipoAccount = ref('cliente')
    const emit = defineEmits(['login', 'logout'])

    async function signup(){
        if(!validateEmail(email.value)){
            alert('La email deve contenere una stringa non vuota in formato email')
            return
        }
        if(!validatePassword(password.value)){
            alert('La password deve avere una lunghezza minima di 8 caratteri, e deve contenere almeno un carattere maiuscolo, uno minuscolo, un carattere speciale e un numero')
            return
        }
        if(password.value !== conferma.value){
            alert('I valori inseriti nei campi password e conferma password devono coincidere')
            return
        }

        try{
            const response = await fetch(HOST + '/api/signUp', {
                method: 'POST', headers: {'Content-type': 'application/json'},
                body: JSON.stringify({
                    email: email.value,
                    password: password.value,
                    tipoAccount: tipoAccount.value
                }),
            })
            //console.log(HOST + '/api/signUp')

            if(response.status !== 201){
                const message = JSON.parse(await response.text())
                alert(message.message)
                return
            }

            const data = await response.json()
            setLoggedUser({id: data._id, account: data.tipoAccount, email: data.email})
            emit('login', loggedUser)
            return
        
        } catch (error){
            console.log(error);
        }

    }
    function logout(){
        clearLoggedUser()
        emit('logout')
    }

    function validateEmail(text: string){
        var r = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return r.test(text)
    }

    function validatePassword(text: string){
        var r = /^((?=.*[a-z])(?=.*[A-Z])(?=.*[%&#!@\*\^]).{8,})$/;
        return r.test(text)
    }

</script>

<template>
    <div v-if="!loggedUser.id">
        <h1 class="blue">Sign Up</h1>
        <form>
            <label>Email: <input name="email" v-model="email"></label>
            <label>Password: <input name="password" v-model="password"></label>
            <label>Conferma Password: <input name="conf" v-model="conferma"></label>
            <label>Tipologia Account:
                <select name="tipoAccount" v-model="tipoAccount">
                    <option value="cliente">Cliente</option>
                    <option value="gestore">Gestore</option>
                </select>
            </label>
            

            <button type="button" @click="signup()">Registrati</button>
        </form>
    </div>
    <div v-else>
        <h2>Benvenuto {{ loggedUser.email }}</h2>
        <button type="button" @click="logout()">Logout</button>
    </div>
</template>


<style scoped>

form{
    text-align: center
}

label{
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    text-align: right;
    width: 400px;
    line-height: 25px;
    margin-bottom: 10px;
}

input, select{
    height: 20px;
    flex: 0 0 200px;
    margin-left: 10px;
}

select{
    width: 400px;
    text-align-last: center;
}

h1{
    font-weight: 500;
    font-size: 2.5rem;
    top: -10px;
}

h3{
    font-size: 1.1rem;
}

.module h1{
    text-align: center;
}

</style>

