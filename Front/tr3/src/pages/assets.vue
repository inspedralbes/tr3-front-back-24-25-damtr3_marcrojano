<template>
    <div>
      <h1>Gestión de Assets</h1>
      <AssetUploader />
      <v-btn class="mt-4" color="secondary" to="/procesos">
        Volver a Gestión de Procesos
      </v-btn>
    </div>
  </template>
  
  <script>
  import AssetUploader from '@/components/AssetUploader.vue'
  
  export default {
    name: 'AssetsPage',
    components: {
      AssetUploader
    }
  }
  </script>
  