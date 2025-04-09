# Usa uma imagem oficial do Node.js
FROM node:18

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante dos arquivos do projeto
COPY . .

# Porta exposta (se precisar acessar algo de fora, ex: dashboard)
EXPOSE 3000

# Comando que será executado ao iniciar o container
CMD ["npm", "start"]
