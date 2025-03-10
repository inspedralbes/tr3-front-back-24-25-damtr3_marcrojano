<template>
    <div>
      <h1>Gestión de Procesos</h1>
      <ProcessManager />
      <v-btn class="mt-4" color="primary" to="/assets">
        Ir a Gestión de Assets
      </v-btn>
    </div>
  </template>
  
  <script>
  import ProcessManager from '@/components/ProcessManager.vue'
  
  export default {
    name: 'ProcesosPage',
    components: {
      ProcessManager
    }
  }
  </script>
  