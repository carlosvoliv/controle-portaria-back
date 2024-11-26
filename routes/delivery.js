const express = require('express');
const router = express.Router();
const Delivery = require('../models/Delivery');
const { verifyToken, verifyRole } = require('../middleware/auth');

// Adicionar nova entrega
router.post('/', verifyToken, async (req, res) => {
  const { name, company, quantity, document } = req.body;
  const userName = req.user.name;

  try {
    const newDelivery = new Delivery({
      time: new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
      name,
      company,
      quantity,
      document,
      userName,
    });

    await newDelivery.save();
    res.status(201).json(newDelivery);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao registrar entrega.' });
  }
});

// Listar entregas
router.get('/', verifyToken, async (req, res) => {
  try {
    const deliveries = await Delivery.find().sort({ date: -1 });
    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar entregas.' });
  }
});

module.exports = router;
