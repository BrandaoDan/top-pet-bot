const respostas = require('./respostas');

module.exports = {
    menu: (texto) => {
        if (['oi', 'olá', 'bom dia', 'boa tarde', 'boa noite'].includes(texto)) {
            return {
                texto: respostas.menu,
                proximaEtapa: 'menu'
            };
        } else if (texto === '1') {
            return { texto: '🐶 Qual o nome e raça do seu pet?', proximaEtapa: 'banho_petinfo' };
        } else if (texto === '2') {
            return { texto: '🛒 Que tipo de produto você procura?', proximaEtapa: 'produtos' };
        } else if (texto === '3') {
            return { texto: '🩺 Qual o nome e idade do seu pet? E quais sintomas ele apresenta?', proximaEtapa: 'consulta' };
        } else if (texto === '4') {
            return { texto: '📞 Um atendente será chamado. Aguarde um instante...', proximaEtapa: 'menu' };
        } else {
            return { texto: '❗ Opção inválida. Digite 1, 2, 3 ou 4.', proximaEtapa: 'menu' };
        }
    },

    banho_petinfo: (texto) => {
        return {
            texto: `🐾 Obrigado pelas informações! Envie agora um dia e horário disponíveis.`,
            proximaEtapa: 'banho_agendamento'
        };
    },

    banho_agendamento: (texto) => {
        return {
            texto: `✅ Agendamento anotado! Entraremos em contato para confirmar.`,
            proximaEtapa: 'menu'
        };
    },

    produtos: (texto) => {
        return {
            texto: `✨ Veja nosso catálogo: https://toppetsalvador.com.br/catalogo

Ou diga o nome do produto desejado.`,
            proximaEtapa: 'menu'
        };
    },

    consulta: (texto) => {
        return {
            texto: `📅 Obrigado! Vamos verificar os horários disponíveis e retornaremos com uma sugestão. Até já!`,
            proximaEtapa: 'menu'
        };
    }
};
