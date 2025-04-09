#!/bin/bash

echo "🔄 Atualizando sistema..."
sudo apt update && sudo apt upgrade -y

echo "🔧 Instalando Node.js, npm e git..."
sudo apt install -y nodejs npm git

echo "🌐 Verificando repositório..."
if [ ! -d "top-pet-bot" ]; then
  git clone https://github.com/seu-usuario/top-pet-bot.git
  cd top-pet-bot
else
  cd top-pet-bot
  echo "📂 Repositório já existente."
fi

echo "📦 Instalando dependências do projeto..."
npm install

echo "🚀 Instalando PM2 globalmente..."
sudo npm install pm2 -g

echo "🔁 Iniciando projeto com PM2..."
pm2 start npm --name "top-pet-bot" -- start

echo "💾 Salvando configuração do PM2..."
pm2 save

echo "🛠️ Configurando PM2 para iniciar com o sistema..."
pm2 startup systemd -u $USER --hp $HOME
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp $HOME

echo "✅ Instalação finalizada com sucesso!"
