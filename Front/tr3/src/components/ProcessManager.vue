<template>
    <v-card>
      <v-card-title>Gestor de Procesos</v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item v-for="(process, index) in processes" :key="index">
            <v-list-item-content>
              <v-list-item-title>{{ process.name }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn @click="toggleProcess(index)" :color="process.active ? 'error' : 'success'">
                {{ process.active ? 'Detener' : 'Iniciar' }}
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </template>
  
  <script>
  export default {
    name: 'ProcessManager',
    data() {
      return {
        processes: [
          { name: 'Proceso 1', active: false },
          { name: 'Proceso 2', active: true },
          { name: 'Proceso 3', active: false },
        ]
      }
    },
    methods: {
      toggleProcess(index) {
        this.processes[index].active = !this.processes[index].active
      }
    }
  }
  </script>
  