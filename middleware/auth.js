// const jwt = require('jsonwebtoken');

// const authMiddleware = (requiredRole) => {
//     return (req, res, next) => {
//         const token = req.headers.authorization?.split(' ')[1];
//         if (!token) return res.status(401).json({ message: 'Token não fornecido.' });

//         try {
//             const decoded = jwt.verify(token, process.env.JWT_SECRET);
//             req.user = decoded;

//             // Verifica o papel do usuário
//             if (requiredRole && decoded.role !== requiredRole) {
//                 return res.status(403).json({ message: 'Permissão negada.' });
//             }

//             next();
//         } catch (err) {
//             res.status(401).json({ message: 'Token inválido.' });
//         }
//     };
// };

// module.exports = authMiddleware;

// const jwt = require('jsonwebtoken');

// const authMiddleware = (req, res, next) => {
//   const token = req.header('Authorization')?.replace('Bearer ', '');

//   if (!token) {
//     return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // Adiciona o usuário à requisição
//     next();
//   } catch (error) {
//     res.status(400).json({ message: 'Token inválido.' });
//   }
// };

// module.exports = authMiddleware;

const jwt = require('jsonwebtoken');

// Middleware para verificar o token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Token inválido.' });
  }
};

// Middleware para verificar o papel do usuário
const verifyRole = (requiredRole) => (req, res, next) => {
  if (req.user.role !== requiredRole) {
    return res.status(403).json({ message: 'Acesso negado. Permissão insuficiente.' });
  }
  next();
};

module.exports = { verifyToken, verifyRole };

