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

    <v-row class="mt-4">
      <v-col cols="12" sm="6" md="4">
        <v-select
          v-model="odabranaSpecijalnost"
          :items="specijalnosti"
          item-title="naziv"
          item-value="id"
          label="Filtriraj po specijalnosti"
          clearable
          prepend-inner-icon="mdi-filter"
          variant="outlined"
          density="comfortable"
          @update:model-value="page = 1" 
        ></v-select>
        </v-col>
    </v-row>

    <v-table class="elevation-1 mt-2">
      <thead>
        <tr>
          <th class="text-left">Ime</th>
          <th class="text-left">Prezime</th>
          <th class="text-left">Specijalnost</th>
          <th class="text-center">Akcije</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="trener in paginiraniTreneri" :key="trener.id">
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
            </v-btn>
            <v-btn icon variant="text" color="error" @click="obrisiTrenera(trener.id)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </td>
        </tr>
        <tr v-if="paginiraniTreneri.length === 0">
          <td colspan="4" class="text-center text-grey py-4">Nema trenera za prikaz.</td>
        </tr>
      </tbody>
    </v-table>

    <v-row justify="center" class="mt-4" v-if="ukupnoStranica > 1">
      <v-col cols="12" md="8" class="d-flex justify-center">
        <v-pagination v-model="page" :length="ukupnoStranica" color="primary"></v-pagination>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ isEdit ? 'Uredi Trenera' : 'Novi Trener' }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12"><v-text-field v-model="formaTrener.ime" label="Ime"></v-text-field></v-col>
              <v-col cols="12"><v-text-field v-model="formaTrener.prezime" label="Prezime"></v-text-field></v-col>
              <v-col cols="12">
                <v-select
                  v-model="formaTrener.specijalnost_id"
                  :items="specijalnosti"
                  item-title="naziv"
                  item-value="id"
                  label="Specijalnost"
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="dialog = false">Odustani</v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="spremiTrenera">Spremi</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const treneri = ref([])
const specijalnosti = ref([])
const dialog = ref(false)
const isEdit = ref(false)
const formaTrener = ref({ id: null, ime: '', prezime: '', specijalnost_id: null })
const odabranaSpecijalnost = ref(null)

const page = ref(1)
const stavkiPoStranici = ref(5)

const filtriraniTreneri = computed(() => {
  if (!odabranaSpecijalnost.value) return treneri.value
  return treneri.value.filter(t => t.specijalnost && t.specijalnost.id === odabranaSpecijalnost.value)
})

const ukupnoStranica = computed(() => Math.ceil(filtriraniTreneri.value.length / stavkiPoStranici.value))

const paginiraniTreneri = computed(() => {
  const start = (page.value - 1) * stavkiPoStranici.value
  const end = start + stavkiPoStranici.value
  return filtriraniTreneri.value.slice(start, end)
})

const dohvatiTrenere = async () => {
  try {
    const res = await axios.get('http://127.0.0.1:5000/treneri')
    treneri.value = res.data
  } catch (error) { console.error(error) }
}

const dohvatiSpecijalnosti = async () => {
  try {
    const res = await axios.get('http://127.0.0.1:5000/specijalnosti')
    specijalnosti.value = res.data
  } catch (e) { console.error(e) }
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
  } catch (error) { console.error(error) }
}

const obrisiTrenera = async (id) => {
  if (confirm("Jeste li sigurni da želite izbrisati ovog trenera?")) {
    try {
      await axios.delete(`http://127.0.0.1:5000/treneri/${id}`)
      dohvatiTrenere()
      if (paginiraniTreneri.value.length === 1 && page.value > 1) page.value--
    } catch (error) { console.error(error) }
  }
}

onMounted(() => {
  dohvatiTrenere()
  dohvatiSpecijalnosti()
})
</script>