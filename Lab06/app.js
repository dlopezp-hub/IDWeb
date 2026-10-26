const express = require('express');
const logger = require('./src/middlewares/logger');
const errorHandler = require('./src/middlewares/errorHandler');
const cursoRoutes = require('./src/routes/cursoRoutes');

const app = express();

// Middlewares globales
app.use(express.json()); 
app.use(logger);         // Logger de auditoría

// Rutas de la API
app.use('/api/cursos', cursoRoutes);

// Middleware global de errores (debe ir al final)
app.use(errorHandler);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});