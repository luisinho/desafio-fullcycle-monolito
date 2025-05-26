# Dockerfile
FROM node:20

# Instala sqlite3 CLI
RUN apt-get update && apt-get install -y sqlite3

# Cria usuário não-root
RUN useradd -ms /bin/bash appfcuser

# Cria diretório da aplicação
WORKDIR /usr/src/app

# Copia arquivos e instala dependências
COPY package*.json ./
RUN npm install

# Copia o restante do projeto
COPY . .

# Altera permissões dos arquivos para o novo usuário
RUN chown -R appfcuser:appfcuser /usr/src/app

# Muda para o usuário não-root
USER appfcuser

# Porta que a app expõe
EXPOSE 3000

# Comando padrão (pode ser sobrescrito no docker-compose)
CMD ["npm", "run", "dev"]