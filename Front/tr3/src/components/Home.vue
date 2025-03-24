<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
    <div class="w-full max-w-2xl bg-white p-16 rounded-3xl shadow-2xl text-center">
      <div class="space-y-6">
        <div class="w-24 h-24 bg-blue-600 text-white rounded-full flex items-center justify-center text-5xl mx-auto mb-6 shadow-lg">
          👋
        </div>
        
        <h1 class="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
          Bienvenido
        </h1>
        
        <p class="text-3xl font-semibold text-gray-700 leading-relaxed px-8">
          Estás en el Panel de Administración
        </p>
      </div>
    </div>
  </div>
</template>

  <script>
  export default {
    name: 'Home'
  }
  </script>

<style scoped>
.admin-dashboard {
  font-family: 'Arial', sans-serif;
  background-color: #f4f6f9;
  min-height: 100vh;
}
</style>