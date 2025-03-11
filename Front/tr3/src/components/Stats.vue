<template>
    <v-container>
      <v-row>
        <v-col cols="12" sm="6">
          <v-card>
            <v-card-title>Estadísticas</v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Vida del Enemigo: {{ enemyLife }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Daño del Enemigo: {{ enemyDamage }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Velocidad del Enemigo: {{ enemySpeed }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  export default {
    props: {
      enemyLife: Number,
      enemyDamage: Number,
      enemySpeed: Number
    }
  }
  </script>
  