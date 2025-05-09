# Use a imagem oficial do Node.js como base
FROM node:16-slim

# Define o diretório de trabalho no contêiner
WORKDIR /app

# Copie o arquivo package.json e o package-lock.json para dentro do contêiner
COPY package*.json ./

# Instale as dependências do projeto
RUN npm install --force

# Copie todos os arquivos do projeto para dentro do contêiner
COPY . .

# Construa a aplicação React para produção
RUN npm run build

# Instale o servidor web que irá servir a aplicação
RUN npm install -g serve

# Defina a porta que será exposta
EXPOSE 3001

# Inicie a aplicação utilizando o serve
CMD ["serve", "-s", "build", "-l", "3001"]
