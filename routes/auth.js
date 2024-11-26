const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const { verifyToken } = require("../middleware/auth");

const router = express.Router();

// Rota para login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Procurar usuário no banco de dados
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Usuário não encontrado." });

    // Adicionar logs para inspecionar a senha enviada e a armazenada
    console.log("Senha enviada:", password);
    console.log("Senha armazenada:", user.password);

    // Comparar a senha enviada com o hash armazenado
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Senha enviada:", password);
    console.log("Hash armazenado:", user.password);
    console.log("Resultado da comparação:", isMatch);
    if (!isMatch) return res.status(401).json({ message: "Senha incorreta." });

    // Gerar o token JWT
    const token = jwt.sign(
      { id: user._id, name: user.name, role: user.role, status: user.status },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, role: user.role });
  } catch (error) {
    console.error("Erro no login:", error.message); // Adicione um log para erros também
    res.status(500).json({ message: "Erro no servidor." });
  }
});

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  // Validação básica
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios." });
  }

  try {
    // Verificar se o usuário já existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Usuário já registrado." });
    }

    // Criação do novo usuário
    const newUser = new User({
      name,
      email,
      password, // O middleware `pre('save')` no modelo cuidará do hash
      role: "porteiro", // Padrão para novos usuários
      status: "pendente", // Padrão para novos usuários
    });

    await newUser.save();
    res.status(201).json({ message: "Usuário registrado com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro no servidor." });
  }
});

// Rota para listar usuários pendentes
// router.get("/pending", async (req, res) => {
//   try {
//     const users = await User.find({ status: "pendente" });
//     res.status(200).json(users);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Erro ao buscar usuários pendentes.", error });
//   }
// });

// Rota para atualizar o status do usuário
router.patch("/status/:id", async (req, res) => {
  const { id } = req.params;
  const { status, role } = req.body; // status: 'aprovado' ou 'rejeitado'

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { status, role },
      { new: true } // Retorna o documento atualizado
    );

    if (!user)
      return res.status(404).json({ message: "Usuário não encontrado." });

    res.status(200).json({ message: "Usuário atualizado com sucesso.", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao atualizar status do usuário.", error });
  }
});

router.get("/pending", verifyToken, async (req, res) => {
  try {
    const users = await User.find({ status: "pendente" });
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao buscar usuários pendentes.", error });
  }
});

module.exports = router;
