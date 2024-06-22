// server.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/saudeexpress', { useNewUrlParser: true, useUnifiedTopology: true });

// Modelos de Dados
const Triagem = mongoose.model('Triagem', new mongoose.Schema({
  sintomas: [String],
  sinaisVitais: {
    temperatura: Number,
    pressao: String,
    oxigenacao: Number,
  },
  encaminhamento: String,
  tempoEspera: Number,
}));

// Endpoints
app.post('/triagem', async (req, res) => {
  const { sintomas, sinaisVitais } = req.body;

  // Lógica de Triagem Simples
  let encaminhamento = 'Consulta Ambulatorial';
  let tempoEspera = 30; // minutos

  if (sintomas.includes('falta de ar') || sinaisVitais.temperatura > 38) {
    encaminhamento = 'Emergência';
    tempoEspera = 10;
  }

  const triagem = new Triagem({ sintomas, sinaisVitais, encaminhamento, tempoEspera });
  await triagem.save();

  res.send({ encaminhamento, tempoEspera });
});

app.get('/medicos/escala', (req, res) => {
  // Dados simulados de médicos
  const medicos = [
    { nome: 'Dr. João', presente: true },
    { nome: 'Dra. Maria', presente: false },
  ];
  res.send(medicos);
});

app.get('/paciente/historico', async (req, res) => {
  const { cpf } = req.query;
  const historico = await Triagem.find({ cpf });
  res.send(historico);
});

app.listen(3000, () => console.log('API rodando na porta 3000'));
