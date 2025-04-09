#!/bin/bash

echo "🚀 Atualizando repositório Git..."
git pull origin main || { echo "❌ Falha ao atualizar repositório."; exit 1; }

echo "🐳 Rebuildando imagem Docker..."
docker build -t top-pet-bot .

echo "🔄 Parando container antigo (se existir)..."
docker stop top-pet-bot-container 2>/dev/null
docker rm top-pet-bot-container 2>/dev/null

echo "🚀 Subindo container atualizado..."
docker run -d \
  --name top-pet-bot-container \
  --restart always \
  -v $(pwd)/session:/app/session \
  -v $(pwd)/.env:/app/.env \
  top-pet-bot

echo "✅ Bot atualizado e rodando!"
