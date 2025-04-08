# 🤖 Bot de Atendimento WhatsApp – Top Pet Salvador

Este é um bot automatizado para WhatsApp, desenvolvido com `whatsapp-web.js`, que permite realizar atendimentos automáticos, agendar serviços e enviar relatórios diários por e-mail.

---

## 📦 Funcionalidades

- Mensagem de boas-vindas com menu interativo
- Agendamento de banho/tosa e consultas veterinárias
- Respostas automáticas fora do horário de atendimento
- Resumo de atendimento com geração de planilha `.csv`
- Envio automático de relatório diário por e-mail
- Suporte a múltiplos atendimentos simultâneos

---

## ⚙️ Tecnologias utilizadas

- Node.js
- [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js)
- Puppeteer
- Nodemailer
- Dotenv
- File System (fs)
- PM2 (gerenciador de processos)

---

## 📁 Estrutura de Pastas

```
top-pet-bot/
├── src/
│   ├── bot.js
│   ├── clientes.js
│   └── index.js
├── relatorios/
├── .env
└── package.json
```

---

## 📦 Instalação

1. Clone o repositório:

```bash
git clone https://github.com/BrandaoDan/top-pet-bot.git
cd top-pet-bot
npm install
```

---

## 🔐 Configuração do `.env`

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```
EMAIL_USER=seuemail@gmail.com
EMAIL_PASS=sua_senha
EMAIL_DESTINO=email@destino.com
```

### Recomendado:
- Se estiver usando Gmail, ative a verificação em duas etapas e gere uma **senha de aplicativo**:  
  https://myaccount.google.com/apppasswords
- O campo `EMAIL_DESTINO` pode conter múltiplos e-mails separados por vírgula.

---

## 🚀 Como iniciar o bot

Execute o seguinte comando:

```bash
npm start
```

Será aberta uma aba no navegador para escanear o QR Code com o WhatsApp.

---

## ▶️ Rodando automaticamente com PM2

Para manter o bot rodando mesmo após reiniciar o servidor:

```bash
sudo npm install -g pm2
pm2 start src/index.js --name top-pet-bot
pm2 startup
```

Copie o comando que o `pm2 startup` gerar e cole no terminal. Depois salve o estado:

```bash
pm2 save
```

Para verificar se está rodando:

```bash
pm2 status
```

---

## ⏰ Horário de atendimento

- Segunda a sexta: 08h às 18h30  
- Sábado: 08h às 14h

Fora desses horários, o bot envia uma resposta automática.

---

## 📊 Relatórios

- Os atendimentos são salvos em `.csv` na pasta `relatorios/`
- Diariamente, um e-mail com o relatório do dia é enviado automaticamente

**Exemplo de envio manual (para testes):**

Dentro do código, existe uma função chamada `enviarRelatorioPorEmail(pathArquivo)`.
Você pode chamá-la manualmente no `index.js` para testar:

```js
const { enviarRelatorioPorEmail } = require('./relatorio');
enviarRelatorioPorEmail('./relatorios/relatorio_hoje.csv');
```

---

## 🛡️ Segurança

- O arquivo `.env` é ignorado pelo Git (está no `.gitignore`)
- Recomenda-se usar senhas de aplicativo (App Passwords) para contas do Gmail

---

## ✨ Contribuições

Contribuições são bem-vindas!  
Faça um fork, implemente melhorias e envie um Pull Request. 💙

---

## 📬 Contato

Desenvolvido por **Daniel Brandão Souza** 🚀  
[LinkedIn](https://www.linkedin.com/in/daniel-brand%C3%A3o-souza-dev/) | [GitHub](https://github.com/BrandaoDan)
