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
        <tr v-for="trening in paginiraniTreninzi" :key="trening.id">
          <td><strong>{{ trening.naziv }}</strong><br><small class="text-grey">{{ trening.opis }}</small></td>
          <td>
            <v-icon size="small" class="mr-1" color="success">mdi-calendar-clock</v-icon>
            <strong>{{ trening.dan_u_tjednu }}</strong>
            <br>
            <small class="text-green-lighten-1 font-weight-bold">
              {{ trening.vrijeme_pocetka }} - {{ trening.vrijeme_kraja }}
            </small>
          </td>
          <td>{{ trening.kapacitet }} mjesta</td>
          <td>{{ trening.trener ? trening.trener.ime + ' ' + trening.trener.prezime : 'Nema trenera' }}</td>
          <td class="text-center">
            <v-btn icon variant="text" color="warning" class="mr-2" @click="otvoriUredi(trening)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon variant="text" color="error" @click="obrisiTrening(trening.id)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </td>
        </tr>
        <tr v-if="paginiraniTreninzi.length === 0">
          <td colspan="5" class="text-center text-grey py-4">Nema treninga za prikaz.</td>
        </tr>
      </tbody>
    </v-table>

    <v-row justify="center" class="mt-4" v-if="ukupnoStranica > 1">
      <v-col cols="12" md="8" class="d-flex justify-center">
        <v-pagination v-model="page" :length="ukupnoStranica" color="success"></v-pagination>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ isEdit ? 'Uredi Trening' : 'Novi Trening' }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6"><v-text-field v-model="formaTrening.naziv" label="Naziv Treninga"></v-text-field></v-col>
              <v-col cols="12" sm="6">
                <v-select v-model="formaTrening.dan_u_tjednu" :items="daniUTjednu" label="Dan u tjednu"></v-select>
              </v-col>
              <v-col cols="12"><v-textarea v-model="formaTrening.opis" label="Opis" rows="2"></v-textarea></v-col>
              <v-col cols="6" sm="3"><v-text-field v-model="formaTrening.vrijeme_pocetka" label="Od (npr. 18:00)"></v-text-field></v-col>
              <v-col cols="6" sm="3"><v-text-field v-model="formaTrening.vrijeme_kraja" label="Do (npr. 19:30)"></v-text-field></v-col>
              <v-col cols="12" sm="6"><v-text-field v-model="formaTrening.kapacitet" type="number" label="Kapacitet (Max osoba)"></v-text-field></v-col>
              <v-col cols="12">
                <v-select
                  v-model="formaTrening.trener_id"
                  :items="sviTreneri"
                  item-title="ime"
                  item-value="id"
                  label="Dodijeli Trenera"
                >
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props" :title="item.raw.ime + ' ' + item.raw.prezime"></v-list-item>
                  </template>
                  <template v-slot:selection="{ item }">
                    {{ item.raw.ime }} {{ item.raw.prezime }}
                  </template>
                </v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="dialog = false">Odustani</v-btn>
          <v-btn color="success" variant="text" @click="spremiTrening">Spremi</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const treninzi = ref([])
const sviTreneri = ref([])
const dialog = ref(false)
const isEdit = ref(false)
const daniUTjednu = ['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak', 'Subota', 'Nedjelja']

const formaTrening = ref({
  id: null, naziv: '', opis: '', dan_u_tjednu: '', 
  vrijeme_pocetka: '', vrijeme_kraja: '', kapacitet: 10, trener_id: null
})

const page = ref(1)
const stavkiPoStranici = ref(5)

const ukupnoStranica = computed(() => Math.ceil(treninzi.value.length / stavkiPoStranici.value))

const paginiraniTreninzi = computed(() => {
  const start = (page.value - 1) * stavkiPoStranici.value
  const end = start + stavkiPoStranici.value
  return treninzi.value.slice(start, end)
})

const dohvatiTreninge = async () => {
  try {
    const res = await axios.get('http://127.0.0.1:5000/treninzi')
    treninzi.value = res.data
  } catch (e) { console.error(e) }
}

const dohvatiSveTrenereZaDropdown = async () => {
  try {
    const res = await axios.get('http://127.0.0.1:5000/treneri')
    sviTreneri.value = res.data
  } catch (e) { console.error(e) }
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
    trener_id: trening.trener ? trening.trener.id : null,
    vrijeme_pocetka: trening.vrijeme_pocetka || '',
    vrijeme_kraja: trening.vrijeme_kraja || ''
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
    dohvatiTreninge()
  } catch (error) { console.error(error) }
}

const obrisiTrening = async (id) => {
  if (confirm("Jeste li sigurni da želite izbrisati ovaj trening?")) {
    try {
      await axios.delete(`http://127.0.0.1:5000/treninzi/${id}`)
      dohvatiTreninge()
      if (paginiraniTreninzi.value.length === 1 && page.value > 1) page.value--
    } catch (e) { console.error(e) }
  }
}

onMounted(() => {
  dohvatiTreninge()
  dohvatiSveTrenereZaDropdown()
})
</script>