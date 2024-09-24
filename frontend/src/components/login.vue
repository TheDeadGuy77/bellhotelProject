<script setup lang='ts'>
    import { ref } from 'vue'
    import { loggedUser, setLoggedUser, clearLoggedUser } from '../states/loggedUser';
    import * as Vue from 'vue'

    const { inject } = Vue
    const $HOST = inject('HOST')
    const HOST = $HOST || 'http://localhost:8080'

    const email = ref('prova@gmail.com')
    const password = ref('Abcdef1!')
    const emit = defineEmits(['login', 'logout'])

    async function login(){
        try{
            const response = await fetch(HOST + '/api/login', {
                method: 'POST', headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    email: email.value,
                    password: password.value
                }),
            })

            if(response.status !== 200){
                const message = JSON.parse(await response.text())
                alert(message.message)
                return
            }

            const data = await response.json()
            setLoggedUser({id: data._id, account: data.tipoAccount, email: data.email})
            emit('login', loggedUser)
        } catch(error){
            console.log(error)
        }
    }

    function logout(){
        clearLoggedUser()
        emit('logout')
    }
</script>

<template>
    <div class='module'>
        <div v-if="!loggedUser.id">
            <h1 class='blue'>Login</h1>
            <form>
                <label>Email:<input name="email" v-model="email" /></label>
                <label>Password:<input name="password" v-model="password" /></label>
                <button type="button" @click="login()">Accedi</button>
            </form>
        </div>
        <div v-else>
            <h2>Benvenuto {{ loggedUser.email }}</h2>
            <button type="button" @click="logout()">Logout</button>
        </div>
    </div>
</template>

<style scoped>

form{
    text-align: center;
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

input{
    height: 20px;
    flex: 0 0 200px;
    margin-left: 10px;
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
