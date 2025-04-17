const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { handleMessage } = require('./src/bot');
const { DateTime } = require("luxon");
const cron = require('node-cron');
const { gerarCaminhoRelatorioHoje,enviarRelatorioPorEmail } = require('./src/relatorio');


let ultimaGeracaoQR = DateTime.now().minus({ minutes: 2 }); 

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
    const agora = DateTime.now();

    if (agora.diff(ultimaGeracaoQR, 'seconds').seconds < 60) {
        console.log('⌛ Aguardando 1 minuto antes de gerar novo QR...');
        return;
    }

    ultimaGeracaoQR = agora;
    console.log('📱 Novo QR gerado. Escaneie com o WhatsApp:');
    console.log('```');       
    qrcode.generate(qr, { small: true });
    console.log('```');       
});


client.on('ready', () => {
    console.log('✅ Cliente está pronto!');
});

client.on('message', async (message) => {
    if (message.fromMe) return;
    await handleMessage(message, client);
});

client.initialize();


cron.schedule('55 23 * * *', async () => {
    const hora = DateTime.now().setZone('America/Bahia').toFormat('HH:mm:ss');
    console.log(`⏰ [${hora}] Gerando e enviando relatório automático...`);
    try {
        const path = await gerarCaminhoRelatorioHoje(); // ⚠️ Verifique se essa função está no seu arquivo de relatório
        await enviarRelatorioPorEmail(path);
        console.log('✅ Relatório enviado automaticamente!');
    } catch (error) {
        console.error('❌ Erro no envio automático:', error);
    }
}, {
    timezone: 'America/Bahia'
});
