// src/bot.js
const { DateTime } = require("luxon");


require('dotenv').config();
const { atualizarDados, dadosClientes } = require('./clientes');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

function foraDoHorario() {
    const agora = DateTime.now().setZone("America/Bahia");

    const dia = agora.getDay(); // 0 = domingo, 6 = sábado
    const hora = agora.getHours();
    const minutos = agora.getMinutes();
    const horarioEmMinutos = hora * 60 + minutos;

    if (dia === 0) return true; // domingo fechado
    if (dia === 6) return horarioEmMinutos < 480 || horarioEmMinutos > 840; // sábado: 08:00 - 14:00
    return horarioEmMinutos < 480 || horarioEmMinutos > 1110; // semana: 08:00 - 18:30
}

async function handleMessage(message, client) {
    const texto = message.body.toLowerCase();
    const numero = message.from;

    if (foraDoHorario()) {
        await client.sendMessage(numero, '⏰ Olá! Nosso horário de atendimento é de segunda a sexta, das 08h às 18h30, e aos sábados, das 08h às 14h. Retornaremos assim que possível.');
        return;
    }

    if (texto === 'oi' || texto === 'olá') {
        await client.sendMessage(numero, 'Olá! 👋 Bem-vindo à *Top Pet Salvador*! Digite uma palavra-chave ou:\n1️⃣ Agendar banho/tosa\n2️⃣ Falar com atendente\n3️⃣ Consulta veterinária');
        return;
    }

    if (texto === '1' || texto.includes('banho') || texto.includes('tosa')) {
        atualizarDados(numero, { produtoDesejado: 'Banho/Tosa' });
        await client.sendMessage(numero, '🐶 Qual o nome do seu pet?');
        return;
    }

    if (texto === '2') {
        await client.sendMessage(numero, '🧑‍💼 Encaminharemos você para um atendente. Por favor, aguarde.');
        return;
    }

    if (texto === '3' || texto.includes('consulta')) {
        atualizarDados(numero, { produtoDesejado: 'Consulta Veterinária' });
        await client.sendMessage(numero, '🐕 Qual o nome do seu pet?');
        return;
    }

    const cliente = dadosClientes[numero];

    if (cliente && !cliente.nomePet) {
        atualizarDados(numero, { nomePet: message.body });
        await client.sendMessage(numero, '📅 Para qual data deseja agendar o atendimento? (ex: 10/04/2025)');
        return;
    }

    if (cliente && cliente.nomePet && !cliente.dataAgendada) {
        atualizarDados(numero, { dataAgendada: message.body });
        await client.sendMessage(numero, `✅ Agendamento solicitado com sucesso!\n\n📌 Resumo:\n• Pet: ${cliente.nomePet}\n• Serviço: ${cliente.produtoDesejado}\n• Data: ${message.body}\n\nUm atendente entrará em contato para confirmar.`);
        salvarAtendimento(numero);
        return;
    }
}

function salvarAtendimento(numero) {
    const cliente = dadosClientes[numero];
    const hoje = DateTime.now().setZone("America/Bahia");
;
    const nomeArquivo = path.join(__dirname, `../relatorios/${hoje.toISOString().slice(0, 10)}.csv`);
    const cabecalho = 'Número,Pet,Serviço,Data\n';
    const linha = `${numero},${cliente.nomePet},${cliente.produtoDesejado},${cliente.dataAgendada}\n`;

    if (!fs.existsSync(path.dirname(nomeArquivo))) {
        fs.mkdirSync(path.dirname(nomeArquivo));
    }

    if (!fs.existsSync(nomeArquivo)) {
        fs.writeFileSync(nomeArquivo, cabecalho);
    }
    fs.appendFileSync(nomeArquivo, linha);
}

// Enviar e-mail diariamente com os relatórios
async function enviarRelatorioPorEmail() {
    const hoje = DateTime.now().setZone("America/Bahia").toISOString().slice(0, 10);
    const caminho = path.join(__dirname, `../relatorios/${hoje}.csv`);
    if (!fs.existsSync(caminho)) return;

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    let info = await transporter.sendMail({
        from: `Top Pet <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_DESTINO,
        subject: `Relatório de Atendimentos - ${hoje}`,
        text: 'Segue anexo o relatório de atendimentos do dia.',
        attachments: [
            {
                filename: `${hoje}.csv`,
                path: caminho
            }
        ]
    });

    console.log('📧 E-mail enviado:', info.messageId);
}

module.exports = {
    handleMessage,
    enviarRelatorioPorEmail
};
