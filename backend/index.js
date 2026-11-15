const express = require('express');
const cors = require('cors');

// 1. Creamos la aplicación (como abrir el restaurante)
const app = express();
const PORT = 3000; // El puerto donde vivirá nuestro backend

// 2. Permisos de seguridad
app.use(cors()); // Permite que nuestro React (puerto 5173) se comunique con este backend
app.use(express.json()); // Permite recibir datos en formato JSON (texto estructurado)

// 3. Una ruta de prueba (El mesero de bienvenida)
app.get('/api/estado', (req, res) => {
  res.json({ 
    mensaje: "¡El servidor de DUAS+ está vivo y funcionando!", 
    estado: "ok" 
  });
});

// 4. Encendemos el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor de DUAS+ escuchando en http://localhost:${PORT}`);
});