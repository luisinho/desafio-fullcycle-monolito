# Dockerfile
FROM node:20

# Instala sqlite3 CLI
RUN apt-get update && apt-get install -y sqlite3

# Cria diretório da aplicação
WORKDIR /usr/src/app

# Copia arquivos e instala dependências
COPY package*.json ./
RUN npm install

# Copia o restante do projeto
COPY . .

# Porta que a app expõe
EXPOSE 3000

# Comando padrão (pode ser sobrescrito no docker-compose)
CMD ["npm", "run", "dev"]