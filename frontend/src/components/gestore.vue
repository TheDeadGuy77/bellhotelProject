<script setup lang='ts'>
    import { ref } from 'vue'
    import { loggedUser } from '../states/loggedUser';
    import * as Vue from 'vue'

    const { inject } = Vue
    const $HOST = inject('HOST')
    const HOST = $HOST || 'http://localhost:8080'

    const nome = ref('Hotel1')
    const provincia = ref('Milano')
    const numeroStelle = ref('4')

    const numeroPostiLetto = ref('4')
    const IDhotel = ref('')
    //const IDprenotazioni:any = ref([])
    const IDhotels:any = ref([])
    let flagID = ref(false)
    
    async function inserisciHotel(){
        if(!nome.value || !provincia.value || !numeroStelle.value){
            alert('Nessun dato può essere omesso')
            return
        }

        let tmp = parseInt(numeroStelle.value)
        if(isNaN(tmp) || (tmp<1 || tmp>5)){
            alert('Il numero di stelle inserito deve essere compreso tra 1 e 5')
            return
        }

        try{
            const response = await fetch(HOST + '/api/inserisciHotel', {
                method: 'POST', headers: {'Content-Type': 'application/json' || ""},
                body: JSON.stringify({
                    nome: nome.value,
                    IDgestore: loggedUser.id,
                    provincia: provincia.value,
                    numeroStelle: parseInt(numeroStelle.value)
                }),
            })

            if(response.status !== 201){
                const message = JSON.parse(await response.text())
                alert(message.message)
                return
            }
            
            alert('Hotel inserito correttamente')
            nome.value = 'Hotel1'
            provincia.value = 'Milano'
            numeroStelle.value = '4'
            
        }catch (error){
            console.log(error)
        }
    }

    async function inserisciStanza(){
        if(!numeroPostiLetto.value){
            alert('Nessun dato può essere omesso')
            return
        }
        
        let tmp = parseInt(numeroPostiLetto.value)
        if(tmp <= 0){
            alert('Il numero di posti letto deve essere almeno 1')
            return
        }

        try{
            const response = await fetch(HOST + '/api/inserisciStanza', {
                method: 'POST', headers: {'Content-Type': 'application/json' || ""},
                body: JSON.stringify({
                    numeroPostiLetto: tmp,
                    IDutente: loggedUser.id,
                    IDhotel: IDhotel.value
                    
                }),
            })

            if(response.status !== 201){
                const message = JSON.parse(await response.text())
                alert(message.message)
                return
            }
            
            alert('Stanza inserita correttamente')
            numeroPostiLetto = '4'

        }catch (error){
            console.log(error)
        }
    }
    
    async function getIDs(){
        try{
            const response = await fetch(HOST + '/api/getIDs/' + loggedUser.id , {
                 method: 'GET', headers: {'Content-Type': 'application/json' || ""}
            })
            /*
            if(response.status !== 200){
                const message = JSON.parse(await response.text())
                alert(message.message)
                return
            }
            */
            IDhotels.value = (await response.json()).hotelsGestore

        }catch (error){
            console.log(error)
        }
        flagID = true
    }
    
</script>

<template>
    <div v-if="loggedUser.account==='gestore'">
        <h2 class="blue">Inserisci un nuovo hotel</h2>
        <form>
            <label>Nome hotel:<input name="nome" v-model="nome" /></label>
            <label>Provincia:<input name="provincia" v-model="provincia" /></label>
            <label>Numero di stelle:<input name="numeroStelle" v-model="numeroStelle" /></label>
            <button type="button" @click="inserisciHotel()">Inserisci hotel</button>
        </form>
    </div>

    <div v-if="loggedUser.account==='gestore'">
        <h2 class="blue">Ottieni ID degli hotel</h2>
        <button type="button" @click="getIDs()">Mostra</button>
        </br>
        <h3 v-if="flagID">Risultati:</h3>
        <ul>
            <li v-for="id in IDhotels">
                NOME: {{ id.nomeHotel }}   ID: {{ id._id }}
            </li>
        </ul>
    </div>
    
    <div v-if="loggedUser.account==='gestore'">
        <h2 class="blue">Inserisci una nuova stanza</h2>
        <form>
            <label>Numero di posti letto:<input name="numeroPostiLetto" v-model="numeroPostiLetto" /></label>
            <label>ID hotel:<input name="IDhotel" v-model="IDhotel" /></label>
            <button type="button" @click="inserisciStanza()">Inserisci stanza</button>
        </form>
    </div>
</template>

<style scoped>

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

</style>
