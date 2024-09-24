
<script setup lang='ts'>
    import { ref, watch } from 'vue'
    import { loggedUser } from '../states/loggedUser'
    import { mods } from '../states/mods'
    import { setMods } from '../states/mods'
    import * as Vue from 'vue'

    const { inject } = Vue
    const $HOST = inject('HOST')
    const HOST = $HOST || 'http://localhost:8080'
    const ris:any = ref([])
    let risStanze:any = ref([])
    const numeroPersone = ref('4')
    const provincia = ref('Milano')
    const inizioSoggiorno = ref('2024-08-18')
    const fineSoggiorno = ref('2024-09-21')
    let flagRicerca = ref(false)
    let flagStanze = ref(false)
    let flagHotel = ref(false)
    let flagPrenota = ref(false)
    let IDStanzaCorrente = ref('')
    let IDHotelCorrente = ref('')
    const numP = parseInt(numeroPersone.value)
    
    const params = new URLSearchParams({
        provincia: provincia.value,
        numeroPersone: numP
    })
    
    const url = HOST + '/api/ricerca?' + params.toString()
    
    async function ricerca(){
        try{
            const response = await fetch(url, {
                method: 'GET', headers: { 'Content-Type': 'application/json' || ""},
            })
            ris.value = (await response.json()).hotels
        
        }catch(error){
            console.log(error)
        }
        flagRicerca = true
    }

    async function prenotazioneHotel(id: string){
        try{
            const response = await fetch(HOST + '/api/prenotazione', {
                method: 'POST', headers: {'Content-Type': 'application/json' || ""},
                body: JSON.stringify({
                    _id: id,
                    part: 'hotel',
                    IDutente: loggedUser.id
                }),
            })
            risStanze.value = (await response.json()).stanze
            if((risStanze.value).length > 0){
                setFlagHotel(false,id)
            }
        }catch(error){
            console.log(error)
        }
    }

      async function prenotazione(IDhotel: string, IDstanza: string) {
        let tmpNumPersone = parseInt(numeroPersone.value)
        if(!numeroPersone || !inizioSoggiorno || !fineSoggiorno){
            alert('Non si possono omettere dati')
            return
        }
        if(tmpNumPersone == 0){
            alert('Il numero di persone deve essere maggiore di 0')
            return
        }

        try {
          const res = await fetch(HOST + '/api/prenotazione',{
            method: 'POST', headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                numeroPersone: tmpNumPersone,
                IDutente: loggedUser.id,
                IDstanza: IDstanza,
                IDhotel: IDhotel,
                inizioSoggiorno: inizioSoggiorno.value,
                fineSoggiorno: fineSoggiorno.value,
                part:'stanza'
            }),
          })
          if(res.status !== 201){
            const msg = JSON.parse(await res.text())
            alert(msg.msg)
            return
          }
          alert('Prenotazione effettuata')
          numeroPersone = '4';
          inizioSoggiorno = '2024-08-18';
          fineSoggiorno = '2024-08-21';
          IDhotel = '66309965e135aebced256141';
          IDstanza = '66309a40e135aebced256142';

        } catch (error) {
            console.log(error);
        }
    }
    
    async function setFlag(flag: boolean,ID: string){
        if(flag){
            flagPrenota.value = false 
            IDStanzaCorrente.value = ''
        }
        else{
            flagPrenota.value = true
            IDStanzaCorrente.value = ID
        }
    }
    async function setFlagHotel(flag: boolean,ID: string){
        if(flag){
            flagHotel.value = false 
            IDHotelCorrente.value = ''
        }
        else{
            flagHotel.value = true
            IDHotelCorrente.value = ID
        }
    }
</script>


<template>
 <div v-if="loggedUser.account==='cliente'">
    <h2 class="blue">Ricerca</h2>
    <label>Provincia:<input name="provincia" v-model="provincia"></label>
    <label>Numero persone:<input name="numeroPersone" v-model="numeroPersone"></label>
    <button type="button" @click="ricerca()">Cerca</button>
    <br/>
    <h3 v-if="flagRicerca">Risultati:</h3>
    <ul>
            <li v-for="hotel in ris" :key=hotel._id>
                Nome: {{ hotel.hotel }} Stelle: {{ hotel.numeroStelle }} <button type="button" @click="prenotazioneHotel(hotel._id)">Prenota</button>
                 <div v-if="flagHotel && hotel._id===IDHotelCorrente">
                    <h3>Stanze disponibili:</h3>
                    </br>
                    <ul>
                        <li v-for="stanza in risStanze" :key=stanza._id>
                            Stanza: {{ stanza._id }} <button v-on:click="setFlag(false,stanza._id)"> Prenota stanza !</button>
                        <div v-if="flagPrenota && stanza._id===IDStanzaCorrente">
                            <h3 class="blue">Prenota</h3>
                            <form>
                                <label>Numero di persone:<input name="numeroPersone" v-model="numeroPersone" /></label>
                                <label>Inserisci la data di inizio soggiorno:<input name="inizioSoggiorno" v-model="inizioSoggiorno" /></label>
                                <label>Inserisci la data di fine soggiorno:<input name="fineSoggiorno" v-model="fineSoggiorno" /></label>
                                <button type="button" @click="prenotazione(hotel._id, stanza._id)">Prenota</button>
                                <button type="button" @click="setFlag(true,stanza._id)"> Indietro </button>
                            </form>
                        </div>
                        </li>
                    </ul>
                    <button type="button" @click="setFlagHotel(true,hotel._id)"> Indietro </button>
                  </div>
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

    input{
        height: 20px;
        flex: 0 0 200px;
        margin-left: 10px;
    }

</style>
