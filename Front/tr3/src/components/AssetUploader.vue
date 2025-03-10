<template>
    <v-card>
      <v-card-title>Cargador de Assets</v-card-title>
      <v-card-text>
        <v-file-input
          v-model="file"
          label="Selecciona un archivo"
          prepend-icon="mdi-file"
          @change="handleFileChange"
        ></v-file-input>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="uploadAsset" :disabled="!file">
          Cargar Asset
        </v-btn>
      </v-card-actions>
    </v-card>
  </template>
  
  <script>
  export default {
    name: 'AssetUploader',
    data() {
      return {
        file: null
      }
    },
    methods: {
      handleFileChange(file) {
        this.file = file
      },
      uploadAsset() {
        // Aquí iría la lógica para subir el asset
        console.log('Subiendo asset:', this.file)
      }
    }
  }
  </script>
  