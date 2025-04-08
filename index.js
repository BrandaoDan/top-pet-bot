const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { handleMessage } = require('./src/bot');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});





client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ Cliente está pronto!');
});

client.on('message', async (message) => {
    if (message.fromMe) return;
    await handleMessage(message, client);
});

client.initialize();
const cron = require('node-cron');
const { gerarRelatorioDoDia, enviarRelatorioPorEmail } = require('./src/relatorio');

// Agendar envio automático todos os dias às 23h59
cron.schedule('59 23 * * *', async () => {
    console.log('⏰ Gerando e enviando relatório automático...');
    try {
        const path = await gerarCaminhoRelatorioHoje();
        await enviarRelatorioPorEmail(path);
        console.log('✅ Relatório enviado automaticamente!');
    } catch (error) {
        console.error('❌ Erro no envio automático:', error);
    }
});
