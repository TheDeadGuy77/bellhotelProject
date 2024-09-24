<script setup lang='ts'>
    import { loggedUser, setLoggedUser, clearLoggedUser } from '../states/loggedUser'
    import { ref } from 'vue'
    import * as Vue from 'vue'

    const { inject } = Vue
    const $HOST = inject('HOST')
    const HOST = $HOST || 'http://localhost:8080'
    const IDprenotazioni:any = ref([])
    let flagP = ref(false)

    async function conferma(){
        let risp = confirm("Eliminare l'account dalla piattaforma?")
        if(risp){
            try{
                const response = await fetch(HOST + '/api/eliminaAccount', {
                    method: 'DELETE', headers: {'Content-Type': 'application/json' || ""},
                    body: JSON.stringify({
                        IDutente: loggedUser.id || ""   
                    }),
                })

                if(response.status !== 204){
                    const message = JSON.parse(await response.text())
                    alert(message.message)
                    return
                }

                alert("Account eliminato")
                clearLoggedUser()
            } catch (errore){
                console.log(errore)
            }
        }
    }

    async function getID(){
        try{
            const response = await fetch(HOST + '/api/getIDs/' + loggedUser.id , {
                 method: 'GET', headers: {'Content-Type': 'application/json' || ""}
            })
            IDprenotazioni.value = (await response.json()).prenotazioniUtente
            

            

        }catch (error){
            console.log(error)
        }
        flagP = true
    }

</script>

<template>
    <h2 class="blue">Impostazioni</h2>
    <h2>Elimina Account</h2>
    <br/>
    <label>Elimina Account<button @click="conferma()">Elimina</button></label>
    </br>
    <div v-if="loggedUser.account==='cliente'">
        <h2 class="blue">Ottieni ID delle prenotazioni</h2>
        <button type="button" @click="getID()">Mostra</button>
        </br>
        <h3 v-if="flagID">Risultati:</h3>
        <ul>
            <li v-for="id in IDprenotazioni">
                ID: {{ id._id }}
            </li>
        </ul>
    </div>
</template>

<style>
label{
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    text-align: right;
    width: 400px;
    line-height: 25px;
    margin-bottom: 10px;
}

button{
    height: 20px;
    flex: 0 0 200px;
    margin-left: 10px;
}
</style>
