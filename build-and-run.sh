#!/bin/bash

# Nome do container e da imagem
IMAGE_NAME="top-pet-bot"
CONTAINER_NAME="top-pet-bot-container"

echo "⏳ Construindo a imagem Docker..."
docker build -t $IMAGE_NAME .

echo "🧼 Removendo container antigo (se existir)..."
docker rm -f $CONTAINER_NAME 2>/dev/null

echo "🚀 Iniciando novo container..."
docker run -d --name $CONTAINER_NAME $IMAGE_NAME

echo "✅ Bot iniciado com sucesso!"
