const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { handleMessage } = require('./src/bot');
const { DateTime } = require("luxon");


//const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth(),
    webVersionCache: {
        type: 'remote',
        remotePath: 'https://raw.githubusercontent.com/wwebjs/wa-version/main/html/2.2407.3.html'
    },
    puppeteer: {
        headless: true,
        args: ['--no-sandbox']
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
    const hora = DateTime.now().setZone('America/Bahia').toFormat('HH:mm:ss');
    console.log(`⏰ [${hora}] Gerando e enviando relatório automático...`);
    try {
        const path = await gerarCaminhoRelatorioHoje();
        await enviarRelatorioPorEmail(path);
        console.log('✅ Relatório enviado automaticamente!');
    } catch (error) {
        console.error('❌ Erro no envio automático:', error);
    }
}, {
    timezone: 'America/Bahia'
});
