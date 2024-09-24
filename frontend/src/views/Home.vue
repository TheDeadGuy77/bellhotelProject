<script setup lang="ts">
    import Ricerca from "../components/ricerca.vue"
    import Gestore from "../components/gestore.vue"
    import Impostazioni from "../components/eliminaAccount.vue"
    import { loggedUser } from "../states/loggedUser";
</script>

<template>
    <div id="comp" v-if="loggedUser.id">
        <Ricerca />
        <br/>
        <Gestore />
        <br/>
        <Impostazioni />
        <br/>
    </div>
</template>

<style>
    #comp{
        margin-left: 3em;
    }
</style>
