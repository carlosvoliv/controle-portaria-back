const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth'); // Verifique o token com o middleware

// Rota para listar usuários ativos
router.get('/active', verifyToken, async (req, res) => {
  try {
    // Encontrar usuários com o status 'ativo'
    const users = await User.find({ status: 'ativo' });
    
    // Retornar a lista de usuários
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuários ativos.', error });
  }
});

module.exports = router;
