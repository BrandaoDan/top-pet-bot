const nodemailer = require('nodemailer');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Função para montar o caminho do relatório com a data de hoje
function gerarCaminhoRelatorioHoje() {
  const hoje = new Date();
  const yyyy = hoje.getFullYear();
  const mm = String(hoje.getMonth() + 1).padStart(2, '0');
  const dd = String(hoje.getDate()).padStart(2, '0');
  const nomeArquivo = `${yyyy}-${mm}-${dd}.csv`;
  return path.join(__dirname, '..', 'relatorios', nomeArquivo);
}

async function enviarRelatorioPorEmail(caminhoRelatorio = gerarCaminhoRelatorioHoje()) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_DESTINO,
    subject: 'Relatório Diário de Atendimentos - Top Pet',
    text: 'Segue em anexo o relatório de atendimentos do dia.',
    attachments: [
      {
        filename: path.basename(caminhoRelatorio),
        path: caminhoRelatorio
      }
    ]
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Relatório enviado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao enviar e-mail:', error);
  }
}

module.exports = {
  gerarCaminhoRelatorioHoje,
  enviarRelatorioPorEmail };
