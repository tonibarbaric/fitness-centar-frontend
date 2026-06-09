<template>
  <v-container>
    <v-row>
      <v-col class="d-flex justify-space-between align-center">
        <h1 class="text-h4">Raspored Treninga</h1>
        <v-btn color="success" prepend-icon="mdi-plus" @click="otvoriDodaj">
          Novi Trening
        </v-btn>
      </v-col>
    </v-row>

    <v-table class="elevation-1 mt-5">
      <thead>
        <tr>
          <th>Naziv</th>
          <th>Vrijeme Održavanja</th>
          <th>Kapacitet</th>
          <th>Trener</th>
          <th class="text-center">Akcije</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="trening in treninzi" :key="trening.id">
          <td><strong>{{ trening.naziv }}</strong><br><small class="text-grey">{{ trening.opis }}</small></td>
          <td>
            <v-icon size="small" class="mr-1" color="success">mdi-calendar-clock</v-icon>
            <strong>{{ trening.dan_u_tjednu }}</strong>
            <br>
            <small class="text-green-lighten-1 font-weight-bold">
              {{ formatirajVrijeme(trening.vrijeme_pocetka) }} - {{ formatirajVrijeme(trening.vrijeme_kraja) }}
            </small>
          </td>
          <td>{{ trening.kapacitet }}</td>
          <td>{{ trening.trener_ime }}</td>
          <td class="text-center">
            <v-btn icon variant="text" color="warning" class="mr-2" @click="otvoriUredi(trening)">
              <v-icon>mdi-pencil</v-icon>
              <v-tooltip activator="parent" location="top">Uredi</v-tooltip>
            </v-btn>
            
            <v-btn icon variant="text" color="error" @click="obrisiTrening(trening.id)">
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
        @update:model-value="dohvatiTreninzi"
        color="success"
      ></v-pagination>
    </div>

    <v-dialog v-model="dialog" max-width="600px">
      <v-card class="pa-4">
        <v-card-title>{{ isEdit ? 'Uredi Trening' : 'Dodaj Trening' }}</v-card-title>
        <v-card-text>
          <v-text-field v-model="formaTrening.naziv" label="Naziv Treninga" variant="outlined"></v-text-field>
          <v-textarea v-model="formaTrening.opis" label="Opis" variant="outlined" rows="2"></v-textarea>
          <v-text-field v-model="formaTrening.dan_u_tjednu" label="Dan u tjednu" variant="outlined"></v-text-field>
          
          <v-row>
            <v-col cols="6">
              <v-text-field v-model="formaTrening.vrijeme_pocetka" label="Početak" type="datetime-local" variant="outlined"></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field v-model="formaTrening.vrijeme_kraja" label="Kraj" type="datetime-local" variant="outlined"></v-text-field>
            </v-col>
          </v-row>

          <v-text-field v-model.number="formaTrening.kapacitet" label="Kapacitet" type="number" variant="outlined"></v-text-field>
          
          <v-select
            v-model="formaTrening.trener_id"
            :items="sviTreneri"
            :item-title="t => `${t.ime} ${t.prezime}`"
            item-value="id"
            label="Dodijeli Trenera"
            variant="outlined"
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="dialog = false">Odustani</v-btn>
          <v-btn color="success" @click="spremiTrening">Spremi</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const treninzi = ref([])
const sviTreneri = ref([]) // Služi isključivo za v-select (pun popis trenera)
const dialog = ref(false)
const isEdit = ref(false)

const formaTrening = ref({
  id: null,
  naziv: '',
  opis: '',
  dan_u_tjednu: '',
  vrijeme_pocetka: '',
  vrijeme_kraja: '',
  kapacitet: 10,
  trener_id: null
})

const trenutnaStranica = ref(1)
const ukupnoStranica = ref(1)
const poStranici = 5

const formatirajVrijeme = (isoString) => {
  if (!isoString) return ''
  try {
    const datum = new Date(isoString)
    const sati = String(datum.getHours()).padStart(2, '0')
    const minute = String(datum.getMinutes()).padStart(2, '0')
    return `${sati}:${minute} h`
  } catch (e) {
    return isoString
  }
}

const dohvatiTreninzi = async () => {
  try {
    const res = await axios.get(`http://127.0.0.1:5000/treninzi?page=${trenutnaStranica.value}&per_page=${poStranici}`)
    treninzi.value = res.data.podaci
    ukupnoStranica.value = res.data.ukupno_stranica
    trenutnaStranica.value = res.data.trenutna_stranica
  } catch (e) {
    console.error(e)
  }
}

const dohvatiSveTrenereZaDropdown = async () => {
  try {
    const res = await axios.get('http://127.0.0.1:5000/treneri?page=1&per_page=100')
    sviTreneri.value = res.data.podaci
  } catch (e) {
    console.error(e)
  }
}

const otvoriDodaj = () => {
  isEdit.value = false
  formaTrening.value = { id: null, naziv: '', opis: '', dan_u_tjednu: '', vrijeme_pocetka: '', vrijeme_kraja: '', kapacitet: 10, trener_id: null }
  dialog.value = true
}

const otvoriUredi = (trening) => {
  isEdit.value = true
  formaTrening.value = { 
    ...trening,
    vrijeme_pocetka: trening.vrijeme_pocetka ? trening.vrijeme_pocetka.substring(0, 16) : '',
    vrijeme_kraja: trening.vrijeme_kraja ? trening.vrijeme_kraja.substring(0, 16) : ''
  }
  dialog.value = true
}

const spremiTrening = async () => {
  try {
    if (isEdit.value) {
      await axios.put(`http://127.0.0.1:5000/treninzi/${formaTrening.value.id}`, formaTrening.value)
    } else {
      await axios.post('http://127.0.0.1:5000/treninzi', formaTrening.value)
    }
    dialog.value = false
    dohvatiTreninzi()
  } catch (error) {
    alert("Greška prilikom slanja treninga!")
  }
}

const obrisiTrening = async (id) => {
  if (confirm('Želite li trajno izbrisati ovaj trening?')) {
    await axios.delete(`http://127.0.0.1:5000/treninzi/${id}`)
    dohvatiTreninzi()
  }
}


onMounted(() => {
  dohvatiTreninzi()
  dohvatiSveTrenereZaDropdown()
})
</script>