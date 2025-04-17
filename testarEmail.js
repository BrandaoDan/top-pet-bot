const { enviarRelatorioPorEmail } = require('./src/relatorio');
const path = require('path');

const hoje = new Date().toISOString().split('T')[0];
const caminhoRelatorio = path.join(__dirname, 'relatorios', `${hoje}.csv`);

enviarRelatorioPorEmail(caminhoRelatorio)
  .then(() => console.log('✅ E-mail enviado com sucesso!'))
  .catch((erro) => console.error('❌ Erro ao enviar e-mail:', erro));
