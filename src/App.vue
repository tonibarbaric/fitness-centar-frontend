<template>
  <v-app>
    <v-navigation-drawer expand-on-hover rail permanent color="grey-darken-4">
      <v-list nav>
        <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" to="/"></v-list-item>
        <v-list-item prepend-icon="mdi-dumbbell" title="Treneri" to="/treneri"></v-list-item>
        <v-list-item prepend-icon="mdi-account-group" title="Članovi" to="/clanovi"></v-list-item>
        <v-list-item prepend-icon="mdi-calendar-clock" title="Treninzi" to="/treninzi"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script setup>

</script>