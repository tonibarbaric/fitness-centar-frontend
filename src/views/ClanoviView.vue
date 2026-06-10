<template>
  <v-container>
    <v-row>
      <v-col class="d-flex justify-space-between align-center">
        <h1 class="text-h4">Popis Članova</h1>
        <v-btn color="blue" prepend-icon="mdi-account-plus" @click="otvoriDodaj">
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
            <v-btn icon variant="text" color="warning" class="mr-2" 3click="otvoriUredi(clan)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon variant="text" color="error" @click="obrisiClana(clan.id)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ isEdit ? 'Uredi Člana' : 'Novi Član' }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="formaClan.ime" label="Ime"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="formaClan.prezime" label="Prezime"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="formaClan.email" label="Email"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="dialog = false">Odustani</v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="spremiClana">Spremi</v-btn>
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
const isEdit = ref(false)
const formaClan = ref({ id: null, ime: '', prezime: '', email: '' })

const dohvatiClanove = async () => {
  try {
    const res = await axios.get('http://127.0.0.1:5000/clanovi')
    clanovi.value = res.data
  } catch (error) {
    console.error("Greška pri dohvaćanju članova:", error)
  }
}

const otvoriDodaj = () => {
  isEdit.value = false
  formaClan.value = { id: null, ime: '', prezime: '', email: '' }
  dialog.value = true
}

const otvoriUredi = (clan) => {
  isEdit.value = true
  formaClan.value = { ...clan }
  dialog.value = true
}

const spremiClana = async () => {
  try {
    if (isEdit.value) {
      await axios.put(`http://127.0.0.1:5000/clanovi/${formaClan.value.id}`, formaClan.value)
    } else {
      await axios.post('http://127.0.0.1:5000/clanovi', formaClan.value)
    }
    dialog.value = false
    dohvatiClanove()
  } catch (error) {
    console.error("Greška pri spremanju člana:", error)
  }
}

const obrisiClana = async (id) => {
  if (confirm("Jeste li sigurni da želite obrisati ovog člana?")) {
    try {
      await axios.delete(`http://127.0.0.1:5000/clanovi/${id}`)
      dohvatiClanove()
    } catch (error) {
      console.error("Greška pri brisanju člana:", error)
    }
  }
}

onMounted(dohvatiClanove)
</script>