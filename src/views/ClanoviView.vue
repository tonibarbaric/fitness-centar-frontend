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
            <v-btn icon variant="text" color="warning" class="mr-2" @click="otvoriUredi(clan)">
              <v-icon>mdi-pencil</v-icon>
              <v-tooltip activator="parent" location="top">Uredi</v-tooltip>
            </v-btn>

            <v-btn icon variant="text" color="error" @click="obrisiClana(clan.id)">
              <v-icon>mdi-delete</v-icon>
              <v-tooltip activator="parent" location="top">Izbrisi</v-tooltip>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>

    <div class="d-flex justify-center mt-4">
      <v-pagination
        v-model="trenutnaStranica"
        :length="ukupnoStranica"
        :total-visible="5"
        @update:model-value="dohvatiClanove"
        color="blue"
      ></v-pagination>
    </div>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card class="pa-4">
        <v-card-title>{{ isEdit ? 'Uredi Člana' : 'Dodaj novog člana' }}</v-card-title>
        <v-card-text>
          <v-text-field v-model="formaClan.ime" label="Ime" variant="outlined"></v-text-field>
          <v-text-field v-model="formaClan.prezime" label="Prezime" variant="outlined"></v-text-field>
          <v-text-field v-model="formaClan.email" label="Email" variant="outlined"></v-text-field>
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
const isEdit = ref(false)
const formaClan = ref({ id: null, ime: '', prezime: '', email: '' })

const trenutnaStranica = ref(1)
const ukupnoStranica = ref(1)
const poStranici = 5

const dohvatiClanove = async () => {
  try {
    const res = await axios.get(`http://127.0.0.1:5000/clanovi?page=${trenutnaStranica.value}&per_page=${poStranici}`)
    
    clanovi.value = res.data.podaci
    ukupnoStranica.value = res.data.ukupno_stranica
    trenutnaStranica.value = res.data.trenutna_stranica
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
    alert("Greška pri spremanju člana!")
  }
}

const obrisiClana = async (id) => {
  if (confirm('Obrisati člana?')) {
    await axios.delete(`http://127.0.0.1:5000/clanovi/${id}`)
    dohvatiClanove()
  }
}

onMounted(dohvatiClanove)
</script>