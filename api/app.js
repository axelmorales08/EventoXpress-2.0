// ===================== Importaciones =====================
const express = require('express');
const cors = require('cors');
const seedDatabase = require('./config/seeder')

// ===================== Configuración del servidor =====================
const app = express();
const PORT = 3000;
const { db } = require('./models');
// Middleware para parsear JSON
app.use(express.json());


// Middleware para CORS
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));


// ===================== Inicialización =====================
app.listen(PORT, async () => {
    try {
        // Siguiente paso a realizar NO DESCOMENTAR
        // Sincronizar base de datos
        await db.sync({ force: false });
        //await seedDatabase();
        console.log(`Servidor corriendo en el puerto ${PORT}.`);
    } catch (err) {
        console.error('Error al sincronizar la base de datos:', err);
    }
});
