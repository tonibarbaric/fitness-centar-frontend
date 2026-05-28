<template>
  <v-container>
    <v-row>
      <v-col class="d-flex justify-space-between align-center">
        <h1 class="text-h4">Popis Članova</h1>
        <v-btn color="blue" prepend-icon="mdi-account-plus" @click="dialog = true">
          Novi Član
        </v-btn>
      </v-col>
    </v-row>

    <v-table class="elevation-1 mt-5">
      <thead>
        <tr>
          <th>Ime</th>
          <th>Prezime</th>
          <th>Email</th>
          <th class="text-center">Akcije</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="clan in clanovi" :key="clan.id">
          <td>{{ clan.ime }}</td>
          <td>{{ clan.prezime }}</td>
          <td>{{ clan.email }}</td>
          <td class="text-center">
            <v-btn icon="mdi-delete" variant="text" color="error" @click="obrisiClana(clan.id)"></v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card class="pa-4">
        <v-card-title>Dodaj novog člana</v-card-title>
        <v-card-text>
          <v-text-field v-model="noviClan.ime" label="Ime" variant="outlined"></v-text-field>
          <v-text-field v-model="noviClan.prezime" label="Prezime" variant="outlined"></v-text-field>
          <v-text-field v-model="noviClan.email" label="Email" variant="outlined"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="dialog = false">Odustani</v-btn>
          <v-btn color="blue" @click="spremiClana">Spremi</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const clanovi = ref([])
const dialog = ref(false)
const noviClan = ref({ ime: '', prezime: '', email: '' })

const dohvatiClanove = async () => {
  const res = await axios.get('http://127.0.0.1:5000/clanovi')
  clanovi.value = res.data
}

const spremiClana = async () => {
  await axios.post('http://127.0.0.1:5000/clanovi', noviClan.value)
  noviClan.value = { ime: '', prezime: '', email: '' }
  dialog.value = false
  dohvatiClanove()
}

const obrisiClana = async (id) => {
  if (confirm('Obrisati člana?')) {
    await axios.delete(`http://127.0.0.1:5000/clanovi/${id}`)
    dohvatiClanove()
  }
}

onMounted(dohvatiClanove)
</script>