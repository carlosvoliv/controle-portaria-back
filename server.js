const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const userRoutes = require('./routes/users'); // Importar as rotas de usuários

const app = express();

const authRoutes = require('./routes/auth');
const deliveriesRoute = require('./routes/delivery'); // Importe a rota de entregas

// Middlewares
app.use(express.json());
app.use(cors());

// Usar rotas
app.use('/api/auth', authRoutes);
app.use('/api/deliveries', deliveriesRoute); // Configure a rota de entregas

// Rotas básicas (serão atualizadas nas próximas etapas)
app.get('/', (req, res) => {
    res.send('API rodando...');
});

app.use('/api/users', userRoutes);
// Conexão com o MongoDB
mongoose.connect(process.env.MONGO_URI)

.then(() => console.log('Conectado ao MongoDB'))
.catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

// Inicializando o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
