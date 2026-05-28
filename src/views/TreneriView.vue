<template>
  <v-container>
    <v-row>
      <v-col class="d-flex justify-space-between align-center">
        <h1 class="text-h4">Popis Trenera</h1>
        <v-btn color="primary" prepend-icon="mdi-plus" @click="otvoriDijalog">
          Dodaj Trenera
        </v-btn>
      </v-col>
    </v-row>

    <v-table class="elevation-1 mt-5">
      <thead>
        <tr>
          <th class="text-left">Ime</th>
          <th class="text-left">Prezime</th>
          <th class="text-left">Specijalnost</th>
          <th class="text-center">Akcije</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="trener in treneri" :key="trener.id">
          <td>{{ trener.ime }}</td>
          <td>{{ trener.prezime }}</td>
          <td>
            <v-chip size="small" color="secondary">
              {{ trener.specijalnost ? trener.specijalnost.naziv : 'Opći trener' }}
            </v-chip>
          </td>
          <td class="text-center">
            <v-btn icon="mdi-delete" variant="text" color="error" @click="obrisiTrenera(trener.id)"></v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card class="pa-4">
        <v-card-title>Novi Trener</v-card-title>
        <v-card-text>
          <v-text-field v-model="noviTrener.ime" label="Ime" variant="outlined"></v-text-field>
          <v-text-field v-model="noviTrener.prezime" label="Prezime" variant="outlined"></v-text-field>
          
          <v-select
            v-model="noviTrener.specijalnost_id"
            :items="specijalnosti"
            item-title="naziv"
            item-value="id"
            label="Odaberi specijalnost"
            variant="outlined"
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="dialog = false">Odustani</v-btn>
          <v-btn color="primary" @click="spremiTrenera">Spremi</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const treneri = ref([])
const specijalnosti = ref([])
const dialog = ref(false)
const noviTrener = ref({ ime: '', prezime: '', specijalnost_id: null })

const dohvatiPodatke = async () => {
  try {
    const resT = await axios.get('http://127.0.0.1:5000/treneri')
    treneri.value = resT.data

    const resS = await axios.get('http://127.0.0.1:5000/specijalnosti')
    specijalnosti.value = resS.data
  } catch (error) {
    console.error("Greška:", error)
  }
}

const otvoriDijalog = () => {
  noviTrener.value = { ime: '', prezime: '', specijalnost_id: null }
  dialog.value = true
}

const spremiTrenera = async () => {
  try {
    await axios.post('http://127.0.0.1:5000/treneri', noviTrener.value)
    dialog.value = false
    dohvatiPodatke() 
  } catch (error) {
    alert("Greška pri spremanju!")
  }
}

const obrisiTrenera = async (id) => {
  if (confirm('Jeste li sigurni?')) {
    await axios.delete(`http://127.0.0.1:5000/treneri/${id}`)
    dohvatiPodatke()
  }
}

onMounted(dohvatiPodatke)
</script>