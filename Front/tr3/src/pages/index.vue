<template>
  <v-card class="mx-auto" max-width="800">
    <v-img
      src="/images/imagen.png"
      height="200px"
      class="white--text align-end"
      gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
    >
      <v-card-title class="text-h4">Abyss of the Damned</v-card-title>
    </v-img>

    <v-card-text class="text--primary">
      <h2 class="text-h5 mb-4">Bienvenido al Panel de Control</h2>
      
      <v-divider class="mb-4"></v-divider>

      <h3 class="text-h6 mb-2">La Historia de Abyss of the Damned</h3>
      
      <p class="mb-4">
        Sumérgete en las profundidades de una mente atormentada en Abyss of the Damned, 
        un juego que te llevará a los rincones más oscuros del subconsciente humano.
      </p>

      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-header>El Protagonista</v-expansion-panel-header>
          <v-expansion-panel-content>
            Controlas a un héroe atrapado en un laberinto de pesadillas, huyendo de sus propios 
            demonios internos. Cada paso te adentra más en el abismo de su mente perturbada.
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-header>El Mundo</v-expansion-panel-header>
          <v-expansion-panel-content>
            Cada nivel representa una capa más profunda del subconsciente, llena de:
            <ul>
              <li>Monstruos que simbolizan miedos y traumas</li>
              <li>Objetos que otorgan habilidades únicas</li>
              <li>Jefes que encarnan aspectos oscuros de la psique del protagonista</li>
            </ul>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-header>El Desafío</v-expansion-panel-header>
          <v-expansion-panel-content>
            A medida que desciendes, descubrirás fragmentos de la historia que revelan el origen 
            de esta pesadilla. ¿Podrás enfrentar la verdad que acecha en lo más profundo del abismo?
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>

      <v-alert
        class="mt-4"
        color="info"
        border="left"
        elevation="2"
        colored-border
        icon="mdi-information"
      >
        Prepárate para una experiencia intensa y perturbadora, donde cada decisión puede 
        llevarte más cerca de la salvación o de la locura eterna.
      </v-alert>
    </v-card-text>

    <v-card-actions>
      <v-btn color="primary" to="/procesos">
        Gestionar Procesos
      </v-btn>
      <v-btn color="secondary" to="/assets">
        Gestionar Assets
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'HomePage',
  layout: 'default' // Esto usará el layout por defecto
}
</script>
