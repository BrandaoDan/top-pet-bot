o fluxo 2 tem uma sintaxe diferente dos demais, deixe a sintaxe do fluxo 2 parecido com o 1.

const { DateTime } = require("luxon");
require('dotenv').config();
const { atualizarDados, dadosClientes } = require('./clientes');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const respostas = require('./respostas');

function foraDoHorario() {
    const agora = DateTime.now().setZone("America/Bahia");
    const dia = agora.weekday;
    const hora = agora.hour;
    const minutos = agora.minute;
    const horarioEmMinutos = hora * 60 + minutos;

    if (dia === 0) return true;
    if (dia === 6) return horarioEmMinutos < 480 || horarioEmMinutos > 840;
    return horarioEmMinutos < 480 || horarioEmMinutos > 1110;
}

function delayAleatorio(min = 1000, max = 3000) {
    const tempo = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise(resolve => setTimeout(resolve, tempo));
}

function getDatasValidas() {
    const hoje = DateTime.now().setZone("America/Bahia");
    const datas = [];
    let i = 1;
    while (datas.length < 5) {
        const data = hoje.plus({ days: i });
        if (data.weekday !== 7) {
            datas.push(data.toFormat("dd/LL/yyyy"));
        }
        i++;
    }
    return datas;
}

function validarDataManual(input) {
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!regex.test(input)) return false;

    const [dia, mes, ano] = input.split("/").map(Number);
    const data = DateTime.fromObject({ day: dia, month: mes, year: ano }, { zone: "America/Bahia" });

    if (!data.isValid) return false;
    if (data < DateTime.now().setZone("America/Bahia").startOf("day")) return false;
    if (data.weekday === 7) return false;

    return true;
}

function capitalizarNome(nome) {
    return nome
        .split(' ')
        .map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
        .join(' ');
}

async function handleMessage(message, client) {
    const texto = message.body.toLowerCase();
    const numero = message.from;
    const agora = DateTime.now().setZone("America/Bahia");
    let cliente = dadosClientes[numero] || {};

    if (cliente.etapa === 'pausado') {
        const inicioPausa = cliente.inicioPausa ? DateTime.fromISO(cliente.inicioPausa) : null;
        const tempoDecorrido = inicioPausa ? agora.diff(inicioPausa, 'hours').hours : null;

        if (tempoDecorrido !== null && tempoDecorrido >= 2) {
            atualizarDados(numero, { etapa: null, inicioPausa: null });
            await delayAleatorio();
            await client.sendMessage(numero, respostas.menu);
        } else {
            return;
        }
    }

    if (cliente.ultimaMensagem) {
        const ultimaMsg = DateTime.fromISO(cliente.ultimaMensagem);
        const minutosInativo = agora.diff(ultimaMsg, 'minutes').minutes;
        if (minutosInativo > 5) {
            delete dadosClientes[numero];
            await delayAleatorio();
            await client.sendMessage(numero, '⏳ Você ficou inativo por mais de 5 minutos. O atendimento será reiniciado. Por favor, escolha uma opção do menu.');
            await delayAleatorio();
            await client.sendMessage(numero, respostas.menu);
            return;
        }
    }

    atualizarDados(numero, { ultimaMensagem: agora.toISO() });
    cliente = dadosClientes[numero];

    if (cliente.estado === 'aguardando_nome') {
        cliente.nome = capitalizarNome(message.body.trim());
        await delayAleatorio();
        await client.sendMessage(numero, `Obrigado, ${cliente.nome}! 👋 Agora me diga como posso te ajudar hoje.`);
        await delayAleatorio();
        await client.sendMessage(numero, respostas.menu);
        cliente.estado = null;
        return;
    }

    if (!cliente.menuEnviado) {
        await delayAleatorio();
        await client.sendMessage(numero, '👋 Olá! Bem-vindo(a) à *Top Pet Salvador* 🐾');
        await delayAleatorio();
        await client.sendMessage(numero, '😊 Antes de continuarmos, posso saber seu nome? Assim nosso atendimento fica mais personalizado!');
        cliente.menuEnviado = true;
        cliente.estado = 'aguardando_nome';
        return;
    }

    if (!cliente.etapa && !['1', '2', '3', '4'].includes(texto)) {
        await delayAleatorio();
        await client.sendMessage(numero, '❌ Opção inválida. Por favor, selecione uma das opções abaixo:');
        await delayAleatorio();
        await client.sendMessage(numero, respostas.menu);
        return;
    }
    if ((texto === '1' || texto.includes('banho') || texto.includes('tosa')) && !cliente.produtoDesejado) {
        atualizarDados(numero, { produtoDesejado: 'Banho/Tosa' });
        await client.sendMessage(numero, respostas.askNamePet);
        return;
    }

    // Opção 2 - Produtos
    if (texto === '2') {
        atualizarDados(numero, { etapa: 'aguardando_tipo_produto', produtoDesejado: 'Produtos' });
        await delayAleatorio();
        await client.sendMessage(numero, '📦 Qual tipo de produto você está procurando? Ex: Ração, Petiscos, Brinquedos');
        return;
    }

    // Recebe o tipo de produto digitado livremente
    if (cliente.etapa === 'aguardando_tipo_produto') {
        atualizarDados(numero, { tipoProduto: texto, etapa: 'aguardando_tipo_pet' });
        await delayAleatorio();
        await client.sendMessage(numero, respostas.askTipePet); // Ex: "Esse produto é para cachorro ou gato?"
        return;
    }

    // Recebe o tipo de pet digitado livremente e finaliza
    if (cliente.etapa === 'aguardando_tipo_pet') {
        atualizarDados(numero, {
            tipoPet: texto,
            etapa: 'pausado',
            inicioPausa: agora.toISO()
        });
        await delayAleatorio();
        await client.sendMessage(numero,
            `✅ Completamos o seu pedido!\n` +
            `🛍️ Serviço: ${cliente.produtoDesejado}\n` +
            `📦 Produto: ${cliente.tipoProduto}\n` +
            `🐾 Tipo de pet: ${texto}\n\n` +
            `🧑‍💼 Um atendente entrará em contato para confirmar seu pedido.`
        );
        return;
    }



    if ((texto === '3' || texto.includes('consulta')) && !cliente.produtoDesejado) {
        atualizarDados(numero, { produtoDesejado: 'Consulta Veterinária' });
        await delayAleatorio();
        await client.sendMessage(numero, respostas.askNamePet);
        return;
    }

    if (cliente.produtoDesejado && !cliente.nomePet) {
        atualizarDados(numero, { nomePet: message.body });
        await delayAleatorio();
        await client.sendMessage(numero, respostas.askTipePet);
        return;
    }

    if (cliente.nomePet && !cliente.tipoPet) {
        atualizarDados(numero, { tipoPet: message.body });
        await delayAleatorio();
        await client.sendMessage(numero, respostas.askRacePet);
        return;
    }

    if (cliente.tipoPet && !cliente.racaPet) {
        atualizarDados(numero, { racaPet: message.body });

        const datasValidas = getDatasValidas();
        const opcoes = datasValidas.map((d, i) => `${i + 1}. 📅 ${d}`).join('\n') + `\n6. 🗓️ Outra data`;

        await delayAleatorio();
        await client.sendMessage(numero, `Agora me diga a data do agendamento.\n\nEscolha uma das opções abaixo:\n\n${opcoes}\n\nDigite o número da opção desejada.`);
        atualizarDados(numero, { etapa: 'aguardando_data' });
        return;
    }

    if (cliente.etapa === 'aguardando_data' && !cliente.dataAgendada) {
        const datasValidas = getDatasValidas();
        const opcao = message.body.trim();

        if (['1', '2', '3', '4', '5'].includes(opcao)) {
            const index = parseInt(opcao) - 1;
            const dataEscolhida = datasValidas[index];
            atualizarDados(numero, { dataAgendada: dataEscolhida, etapa: 'concluido' });
        } else if (opcao === '6') {
            await client.sendMessage(numero, 'Por favor, digite a data desejada no formato *dd/mm/aaaa*.');
            atualizarDados(numero, { etapa: 'digitando_data_manual' });
            return;
        } else {
            await client.sendMessage(numero, '⚠️ Opção inválida. Por favor, digite um número de 1 a 6.');
            return;
        }
        cliente = dadosClientes[numero];
    }

    if (cliente.etapa === 'digitando_data_manual' && !cliente.dataAgendada) {
        const dataManual = message.body.trim();
        if (!validarDataManual(dataManual)) {
            await client.sendMessage(numero, '⚠️ Data inválida. Certifique-se de usar o formato *dd/mm/aaaa*, e que a data não seja no passado ou domingo.');
            return;
        }

        atualizarDados(numero, { dataAgendada: dataManual, etapa: 'concluido' });
        cliente = dadosClientes[numero];
    }

    if (cliente.racaPet && cliente.dataAgendada && cliente.etapa === 'concluido') {
        await delayAleatorio();
        await client.sendMessage(numero,
            `✅ Agendamento solicitado com sucesso!\n` +
            `🐶 Nome: ${cliente.nomePet}\n` +
            `📦 Serviço: ${cliente.produtoDesejado}\n` +
            `📋 Tipo: ${cliente.tipoPet}\n` +
            `📍 Raça: ${cliente.racaPet}\n` +
            `📅 Data: ${cliente.dataAgendada}\n` +
            `🧑‍💼 Um atendente entrará em contato para confirmar.`
        );

        salvarAtendimento(numero);
        cliente.aguardandoAtendente = true;
        atualizarDados(numero, { etapa: 'pausado', inicioPausa: agora.toISO() });
        return;
    }

    if (texto && texto.trim() !== '') {
        await delayAleatorio();
        await client.sendMessage(numero, respostas.menu);
        return;
    }
}

function salvarAtendimento(numero) {
    const cliente = dadosClientes[numero];
    const agora = DateTime.now().setZone("America/Bahia");
    const nomeArquivo = path.join(__dirname, `../relatorios/${agora.toISODate()}.csv`);
    const cabecalho = 'Número,Pet,Serviço,Tipo,Raça,Data,Inatividade (min)\n';

    let inatividade = 0;
    if (cliente.ultimaMensagem) {
        const ultimaMsg = DateTime.fromISO(cliente.ultimaMensagem);
        inatividade = Math.round(agora.diff(ultimaMsg, 'minutes').minutes);
    }

    const linha = `${numero},${cliente.nomePet},${cliente.produtoDesejado},${cliente.tipoPet},${cliente.racaPet},${cliente.dataAgendada},${inatividade}\n`;

    if (!fs.existsSync(nomeArquivo)) {
        fs.writeFileSync(nomeArquivo, cabecalho);
    }

    fs.appendFileSync(nomeArquivo, linha);
}

module.exports = { handleMessage };
