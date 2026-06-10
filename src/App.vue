<template>
  <v-app>
    <v-navigation-drawer expand-on-hover rail permanent color="grey-darken-4">
      <v-list nav>
        <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" @click="stranica = 'home'"></v-list-item>
        <v-list-item prepend-icon="mdi-dumbbell" title="Treneri" @click="stranica = 'treneri'"></v-list-item>
        <v-list-item prepend-icon="mdi-account-group" title="Članovi" @click="stranica = 'clanovi'"></v-list-item>
        <v-list-item prepend-icon="mdi-calendar-clock" title="Treninzi" @click="stranica = 'treninzi'"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <HomeView v-if="stranica === 'home'" />
      <TreneriView v-if="stranica === 'treneri'" />
      <ClanoviView v-if="stranica === 'clanovi'" />
      <TreninziView v-if="stranica === 'treninzi'" />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import HomeView from './views/HomeView.vue'
import TreneriView from './views/TreneriView.vue'
import ClanoviView from './views/ClanoviView.vue'
import TreninziView from './views/TreninziView.vue'

const stranica = ref('home')
</script>