<template>
    <v-container>
      <v-row>
        <v-col cols="12" sm="6">
          <v-card>
            <v-card-title>Sacar Foto</v-card-title>
            <v-card-text>
              <video id="video" width="640" height="480" autoplay></video>
              <canvas id="canvas" width="640" height="480"></canvas>
            </v-card-text>
            <v-card-actions>
              <v-btn @click="takePhoto">Sacar Foto</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  export default {
    mounted() {
      this.initCamera();
    },
    methods: {
      async initCamera() {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          const video = document.getElementById('video');
          video.srcObject = stream;
        } catch (error) {
          console.error('Error al iniciar la cámara:', error);
        }
      },
      takePhoto() {
        const video = document.getElementById('video');
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        console.log('Foto tomada');
      }
    }
  }
  </script>
  