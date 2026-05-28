<template>
  <v-container mt-5>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-5 text-center">Teretana PowerGym</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="4">
        <v-card color="red" theme="dark">
          <v-card-text class="text-center">
            <div class="text-h6">Treneri</div>
            <div class="text-h2 font-weight-bold">{{ stats.treneri }}</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card color="white" theme="dark">
          <v-card-text class="text-center">
            <div class="text-h6">Članovi</div>
            <div class="text-h2 font-weight-bold">{{ stats.clanovi }}</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card color="blue" theme="dark">
          <v-card-text class="text-center">
            <div class="text-h6">Aktivni Treninzi</div>
            <div class="text-h2 font-weight-bold">{{ stats.treninzi }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const stats = ref({
  treneri: 0,
  clanovi: 0,
  treninzi: 0
})

const dohvatiPodatke = async () => {
  try {
    const resT = await axios.get('http://127.0.0.1:5000/treneri')
    const resC = await axios.get('http://127.0.0.1:5000/clanovi')
    const resTr = await axios.get('http://127.0.0.1:5000/treninzi')
    
    stats.value.treneri = resT.data.length
    stats.value.clanovi = resC.data.length
    stats.value.treninzi = resTr.data.length
  } catch (err) {
    console.error("Greška pri spajanju na Flask:", err)
  }
}

onMounted(dohvatiPodatke)
</script>