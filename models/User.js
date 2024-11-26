const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'porteiro' }, // 'admin', 'supervisor', ou 'porteiro'
    status: { type: String, default: 'pendente' }, // 'pendente', 'ativo', ou 'inativo'
}, { timestamps: true });

// Hash da senha antes de salvar
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    console.log('Senha criptografada:', this.password);
    next();
});

module.exports = mongoose.model('User', UserSchema);
