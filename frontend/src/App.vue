<script lang="ts">
import { RouterView } from 'vue-router'
import { loggedUser } from './states/loggedUser'
import signUp from "./components/signUp.vue"
import login from "./components/login.vue"


export default {
    components: {
      login,
      signUp,
    },
    data() {
      return {
        currentModule: 'login',
        modules: ['login', 'signUp'],
        user: loggedUser
      }
    },
    methods: {
      enter() {
        this.$router.push('/home');
      },
      exit() {
        this.$router.push('/')
      }
    }
  }

</script>

<template>
  <header>
    <div class="wrapper">
      <span v-if="!user.id">Accesso al sito:
        <button
        v-for="module in modules"
        :key="module"
        :class="['tab-button', { active: currentModule === module }]"
        @click="currentModule = module"
        >
        {{ module }}
        </button>
      </span>
      <br/><br/>
      <component :is="currentModule" class="modules" @login="enter()" @logout="exit()"></component>
    </div>
  </header>

  
  <RouterView />
</template>

<style scoped>

.tab-button {
  margin: 0 1rem
}
</style>
