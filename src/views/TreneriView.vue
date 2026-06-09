<template>
  <v-container>
    <v-row>
      <v-col class="d-flex justify-space-between align-center">
        <h1 class="text-h4">Popis Trenera</h1>
        <v-btn color="primary" prepend-icon="mdi-plus" @click="otvoriDodaj">
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
            <v-btn icon variant="text" color="warning" class="mr-2" @click="otvoriUredi(trener)">
              <v-icon>mdi-pencil</v-icon>
              <v-tooltip activator="parent" location="top">Uredi</v-tooltip>
            </v-btn>

            <v-btn icon variant="text" color="error" @click="obrisiTrenera(trener.id)">
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
        @update:model-value="dohvatiTrenere"
        color="primary"
      ></v-pagination>
    </div>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card class="pa-4">
        <v-card-title>{{ isEdit ? 'Uredi Trenera' : 'Novi Trener' }}</v-card-title>
        <v-card-text>
          <v-text-field v-model="formaTrener.ime" label="Ime" variant="outlined"></v-text-field>
          <v-text-field v-model="formaTrener.prezime" label="Prezime" variant="outlined"></v-text-field>
          
          <v-select
            v-model="formaTrener.specijalnost_id"
            :items="specijalnosti"
            item-title="naziv"
            item-value="id"
            label="Odaberi specijalnost"
            variant="outlined"
            clearable
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
const isEdit = ref(false)
const formaTrener = ref({ id: null, ime: '', prezime: '', specijalnost_id: null })

// Stanja za paginaciju
const trenutnaStranica = ref(1)
const ukupnoStranica = ref(1)
const poStranici = 5

const dohvatiTrenere = async () => {
  try {
    const res = await axios.get(`http://127.0.0.1:5000/treneri?page=${trenutnaStranica.value}&per_page=${poStranici}`)
    treneri.value = res.data.podaci
    ukupnoStranica.value = res.data.ukupno_stranica
    trenutnaStranica.value = res.data.trenutna_stranica
  } catch (error) {
    console.error("Greška pri dohvaćanju trenera:", error)
  }
}

const dohvatiSpecijalnosti = async () => {
  try {
    const res = await axios.get('http://127.0.0.1:5000/specijalnosti')
    specijalnosti.value = res.data
  } catch (e) {
    console.error(e)
  }
}

const otvoriDodaj = () => {
  isEdit.value = false
  formaTrener.value = { id: null, ime: '', prezime: '', specijalnost_id: null }
  dialog.value = true
}

const otvoriUredi = (trener) => {
  isEdit.value = true
  formaTrener.value = {
    id: trener.id,
    ime: trener.ime,
    prezime: trener.prezime,
    specijalnost_id: trener.specijalnost ? trener.specijalnost.id : null
  }
  dialog.value = true
}

const spremiTrenera = async () => {
  try {
    if (isEdit.value) {
      await axios.put(`http://127.0.0.1:5000/treneri/${formaTrener.value.id}`, formaTrener.value)
    } else {
      await axios.post('http://127.0.0.1:5000/treneri', formaTrener.value)
    }
    dialog.value = false
    dohvatiTrenere() 
  } catch (error) {
    alert("Greška pri spremanju!")
  }
}

const obrisiTrenera = async (id) => {
  if (confirm('Jeste li sigurni?')) {
    await axios.delete(`http://127.0.0.1:5000/treneri/${id}`)
    dohvatiTrenere()
  }
}

onMounted(() => {
  dohvatiTrenere()
  dohvatiSpecijalnosti()
})
</script>