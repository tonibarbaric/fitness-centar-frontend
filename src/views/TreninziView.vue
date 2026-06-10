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
      </tbody>
    </v-table>

    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ isEdit ? 'Uredi Trening' : 'Novi Trening' }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="formaTrening.naziv" label="Naziv treninga"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea v-model="formaTrening.opis" label="Opis treninga" rows="2"></v-textarea>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="formaTrening.dan_u_tjednu"
                  :items="['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak', 'Subota', 'Nedjelja']"
                  label="Dan u tjednu"
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="formaTrening.kapacitet" type="number" label="Kapacitet"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formaTrening.vrijeme_pocetka"
                  label="Vrijeme početka"
                  placeholder="Npr. 18:00"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formaTrening.vrijeme_kraja"
                  label="Vrijeme kraja"
                  placeholder="Npr. 19:30"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="formaTrening.trener_id"
                  :items="sviTreneri"
                  :item-title="item => item.ime + ' ' + item.prezime"
                  item-value="id"
                  label="Dodijeli Trenera"
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="dialog = false">Odustani</v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="spremiTrening">Spremi</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const treninzi = ref([])
const sviTreneri = ref([])
const dialog = ref(false)
const isEdit = ref(false)
const formaTrening = ref({ id: null, naziv: '', opis: '', dan_u_tjednu: '', vrijeme_pocetka: '', vrijeme_kraja: '', kapacitet: 10, trener_id: null })

const dohvatiTreninzi = async () => {
  try {
    const res = await axios.get('http://127.0.0.1:5000/treninzi')
    treninzi.value = res.data
  } catch (e) {
    console.error(e)
  }
}

const dohvatiSveTrenereZaDropdown = async () => {
  try {
    const res = await axios.get('http://127.0.0.1:5000/treneri')
    sviTreneri.value = res.data
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
    dohvatiTreninzi()
  } catch (error) {
    console.error(error)
  }
}

const obrisiTrening = async (id) => {
  if (confirm("Jeste li sigurni da želite obrisati ovaj trening?")) {
    try {
      await axios.delete(`http://127.0.0.1:5000/treninzi/${id}`)
      dohvatiTreninzi()
    } catch (error) {
      console.error(error)
    }
  }
}

onMounted(() => {
  dohvatiTreninzi()
  dohvatiSveTrenereZaDropdown()
})
</script>