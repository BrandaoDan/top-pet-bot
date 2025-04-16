#!/bin/bash

echo "🚀 Atualizando sistema..."
sudo apt update && sudo apt upgrade -y

echo "🐳 Instalando Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

echo "👤 Adicionando usuário ao grupo docker..."
sudo usermod -aG docker $USER

echo "📦 Instalando Docker Compose..."
sudo apt install docker-compose -y

echo "📁 Clonando projeto..."
git clone https://github.com/seu-usuario/top-pet-bot.git /home/ubuntu/top-pet-bot
cd /home/ubuntu/top-pet-bot

echo "✅ Construindo e subindo container..."
docker compose up -d --build

echo "🔁 Ativando Docker no boot..."
sudo systemctl enable docker

echo "🎉 Pronto! Use 'docker logs -f nome_do_container' para ver o QR code do WhatsApp Web (se necessário)."
