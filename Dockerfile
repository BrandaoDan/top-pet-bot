# Usa imagem oficial do Node.js compatível com seu projeto
FROM node:22
FROM ghcr.io/puppeteer/puppeteer:latest

USER root

# Define diretório de trabalho
WORKDIR /usr/src/app

# Copia os arquivos de dependência e instala
COPY package*.json ./
RUN npm install

# Copia o restante dos arquivos do projeto
COPY . .

# Ajusta o Puppeteer para usar o Chrome já instalado
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome

# Instala o Google Chrome (necessário para o puppeteer-core)
RUN apt-get update && apt-get install -y wget gnupg ca-certificates && \
    wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list' && \
    apt-get update && apt-get install -y google-chrome-stable --no-install-recommends && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Expõe a porta (caso use Express ou similar)
EXPOSE 3000

RUN mkdir -p /usr/src/app/.wwebjs_auth/session && \
    chown -R pptruser:pptruser /usr/src/app


USER pptruser
# Comando de inicialização
CMD ["npm", "start"]
