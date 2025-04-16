module.exports = {
    menu: `
Digite a opção desejada:
1️⃣ - Banho e tosa
2️⃣ - Produtos (ração, petiscos, brinquedos)
3️⃣ - Consulta veterinária
4️⃣ - Falar com um atendente`,

    askNamePet: '🐶Qual o nome do seu Pet ?🐕',
    instagram: 'Enquanto isso que tal dar uma conferida no nosso instagram ?\n Aproveita e segue a gente lá @toppetsalvador\ninstagram.com/toppetsalvador/',
    askRacePet: '🐕Qual a raça ?🐶',
    askDate: '📅Para qual data deseja agendar o atendimento? (ex: 10/04/2025)',
    askProduct: 'Qual tipo de produto deseja ?💭',
    askTipePet: 'Ele é um cachorro, gato ou outro? 🐶🐱🐾',
    rtWaitAttendant: '🧑‍💼 Encaminharemos você para um atendente. Por favor, aguarde.',
    returnScheduling: '✅ Agendamento solicitado com sucesso!\n\n📌 Resumo:\n• Pet: ${cliente.nomePet}\n• Raça: ${cliente.racaPet}\n• Serviço: ${cliente.produtoDesejado}\n• Data: ${message.body}\n\nUm atendente entrará em contato para confirmar.'

};
